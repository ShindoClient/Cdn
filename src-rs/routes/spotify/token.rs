use axum::{
    extract::Query,
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::Serialize;
use std::collections::HashMap;

use super::common::{env_config, spotify_client, SpotifyTokenResponse};

#[derive(Serialize)]
struct TokenSuccess {
    access_token: String,
    #[serde(skip_serializing_if = "Option::is_none")]
    refresh_token: Option<String>,
    expires_in: u64,
}

#[derive(Serialize)]
struct ErrorBody {
    error: &'static str,
}

pub(super) async fn handler(Query(query): Query<HashMap<String, String>>) -> Response {
    let Some(code) = query.get("code") else {
        return (
            StatusCode::BAD_REQUEST,
            Json(ErrorBody {
                error: "Missing code parameter",
            }),
        )
            .into_response();
    };

    let (Some(client_id), Some(client_secret), Some(redirect_uri)) = (
        env_config("SPOTIFY_CLIENT_ID"),
        env_config("SPOTIFY_CLIENT_SECRET"),
        env_config("SPOTIFY_REDIRECT_URI"),
    ) else {
        return (
            StatusCode::INTERNAL_SERVER_ERROR,
            Json(ErrorBody {
                error: "Spotify not configured",
            }),
        )
            .into_response();
    };

    let client = match spotify_client() {
        Ok(client) => client,
        Err(err) => {
            eprintln!("[Spotify Token] Failed to create HTTP client: {err}");
            return (
                StatusCode::BAD_REQUEST,
                Json(ErrorBody {
                    error: "Token exchange failed",
                }),
            )
                .into_response();
        }
    };

    let response = match client
        .post("https://accounts.spotify.com/api/token")
        .basic_auth(client_id, Some(client_secret))
        .form(&[
            ("grant_type", "authorization_code"),
            ("code", code.as_str()),
            ("redirect_uri", redirect_uri.as_str()),
        ])
        .send()
        .await
    {
        Ok(response) => response,
        Err(err) => {
            eprintln!("[Spotify Token] Exchange failed: {err}");
            return (
                StatusCode::BAD_REQUEST,
                Json(ErrorBody {
                    error: "Token exchange failed",
                }),
            )
                .into_response();
        }
    };

    let status = response.status();
    let data = match response.json::<SpotifyTokenResponse>().await {
        Ok(data) => data,
        Err(err) => {
            eprintln!("[Spotify Token] Invalid Spotify response: {err}");
            return (
                StatusCode::BAD_REQUEST,
                Json(ErrorBody {
                    error: "Token exchange failed",
                }),
            )
                .into_response();
        }
    };

    let Some(access_token) = data.access_token.filter(|_| status.is_success()) else {
        eprintln!(
            "[Spotify Token] Exchange failed: {}",
            data.error_description.as_deref().or(data.error.as_deref()).unwrap_or("unknown Spotify error")
        );
        return (
            StatusCode::BAD_REQUEST,
            Json(ErrorBody {
                error: "Token exchange failed",
            }),
        )
            .into_response();
    };

    (
        StatusCode::OK,
        Json(TokenSuccess {
            access_token,
            refresh_token: data.refresh_token,
            expires_in: data.expires_in.unwrap_or_default(),
        }),
    )
        .into_response()
}
