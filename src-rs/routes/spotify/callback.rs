use axum::{
    extract::Query,
    http::StatusCode,
    response::{IntoResponse, Redirect, Response},
};
use std::collections::HashMap;

use super::common::{env_config, local_callback_url, spotify_client, SpotifyTokenResponse};

pub(super) async fn handler(Query(query): Query<HashMap<String, String>>) -> Response {
    let error = query.get("error").map(String::as_str);
    let code = query.get("code").map(String::as_str);

    if error.is_some() || code.is_none() {
        let error_value = error.unwrap_or("no_code");
        let location = local_callback_url(&[("error", error_value)]);
        return Redirect::temporary(&location).into_response();
    }

    let (Some(client_id), Some(client_secret), Some(redirect_uri)) = (
        env_config("SPOTIFY_CLIENT_ID"),
        env_config("SPOTIFY_CLIENT_SECRET"),
        env_config("SPOTIFY_REDIRECT_URI"),
    ) else {
        return (StatusCode::INTERNAL_SERVER_ERROR, "Spotify not configured").into_response();
    };

    let code = code.unwrap_or_default();
    let client = match spotify_client() {
        Ok(client) => client,
        Err(err) => {
            eprintln!("[Spotify Callback] Failed to create HTTP client: {err}");
            let location = local_callback_url(&[("error", "token_exchange_failed")]);
            return Redirect::temporary(&location).into_response();
        }
    };

    let response = client
        .post("https://accounts.spotify.com/api/token")
        .basic_auth(client_id, Some(client_secret))
        .form(&[
            ("grant_type", "authorization_code"),
            ("code", code),
            ("redirect_uri", redirect_uri.as_str()),
        ])
        .send()
        .await;

    let response = match response {
        Ok(response) => response,
        Err(err) => {
            eprintln!("[Spotify Callback] Token exchange failed: {err}");
            let location = local_callback_url(&[("error", "token_exchange_failed")]);
            return Redirect::temporary(&location).into_response();
        }
    };

    let status = response.status();
    let data = match response.json::<SpotifyTokenResponse>().await {
        Ok(data) => data,
        Err(err) => {
            eprintln!("[Spotify Callback] Invalid Spotify response: {err}");
            let location = local_callback_url(&[("error", "token_exchange_failed")]);
            return Redirect::temporary(&location).into_response();
        }
    };

    if !status.is_success() || data.access_token.is_none() {
        eprintln!(
            "[Spotify Callback] Token exchange failed: {}",
            data.error_description.as_deref().or(data.error.as_deref()).unwrap_or("unknown Spotify error")
        );
        let location = local_callback_url(&[("error", "token_exchange_failed")]);
        return Redirect::temporary(&location).into_response();
    }

    let access_token = data.access_token.unwrap_or_default();
    let refresh_token = data.refresh_token.unwrap_or_default();
    let expires_in = data.expires_in.unwrap_or_default().to_string();
    let location = local_callback_url(&[
        ("access_token", &access_token),
        ("refresh_token", &refresh_token),
        ("expires_in", &expires_in),
    ]);

    Redirect::temporary(&location).into_response()
}
