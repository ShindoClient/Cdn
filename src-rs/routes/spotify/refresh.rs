use axum::{
    extract::Query,
    http::StatusCode,
    response::{IntoResponse, Response},
    Json,
};
use serde::{Deserialize, Serialize};
use std::collections::HashMap;

use super::common::{env_config, spotify_client, SpotifyTokenResponse};

#[derive(Serialize)]
struct RefreshSuccess {
    access_token: String,
    refresh_token: String,
    expires_in: u64,
}

#[derive(Serialize)]
struct ErrorBody {
    error: &'static str,
}

pub(super) async fn handler(Query(query): Query<HashMap<String, String>>) -> Response {
    let Some(refresh_token) = query.get("refresh_token") else {
        return (
            StatusCode::BAD_REQUEST,
            Json(ErrorBody {
                error: "Missing refresh_token parameter",
            }),
        )
            .into_response();
    };

    let (Some(client_id), Some(client_secret)) = (
        env_config("SPOTIFY_CLIENT_ID"),
        env_config("SPOTIFY_CLIENT_SECRET"),
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
            eprintln!("[Spotify Refresh] Failed to create HTTP client: {err}");
            return (
                StatusCode::UNAUTHORIZED,
                Json(ErrorBody {
                    error: "Failed to refresh Spotify token",
                }),
            )
                .into_response();
        }
    };

    let response = match client
        .post("https://accounts.spotify.com/api/token")
        .basic_auth(client_id, Some(client_secret))
        .form(&[
            ("grant_type", "refresh_token"),
            ("refresh_token", refresh_token.as_str()),
        ])
        .send()
        .await
    {
        Ok(response) => response,
        Err(err) => {
            eprintln!("[Spotify Refresh] Failed: {err}");
            return (
                StatusCode::UNAUTHORIZED,
                Json(ErrorBody {
                    error: "Failed to refresh Spotify token",
                }),
            )
                .into_response();
        }
    };

    let status = response.status();
    let data = match response.json::<SpotifyTokenResponse>().await {
        Ok(data) => data,
        Err(err) => {
            eprintln!("[Spotify Refresh] Invalid Spotify response: {err}");
            return (
                StatusCode::UNAUTHORIZED,
                Json(ErrorBody {
                    error: "Failed to refresh Spotify token",
                }),
            )
                .into_response();
        }
    };

    let Some(access_token) = data.access_token.filter(|_| status.is_success()) else {
        eprintln!(
            "[Spotify Refresh] Refresh failed: {}",
            data.error_description.as_deref().or(data.error.as_deref()).unwrap_or("unknown Spotify error")
        );
        return (
            StatusCode::UNAUTHORIZED,
            Json(ErrorBody {
                error: "Failed to refresh Spotify token",
            }),
        )
            .into_response();
    };

    (
        StatusCode::OK,
        Json(RefreshSuccess {
            access_token,
            refresh_token: data.refresh_token.unwrap_or_else(|| refresh_token.clone()),
            expires_in: data.expires_in.unwrap_or_default(),
        }),
    )
        .into_response()
}
