use axum::Router;
use axum::routing::get;

mod common;
mod callback;
mod refresh;
mod token;

/// Spotify OAuth routes.
///
/// Mount at the API root to expose `/callback`, `/refresh`, and `/token`,
/// or nest this router under a prefix such as `/spotify`.
pub fn router() -> Router {
    Router::new()
        .route("/callback", get(callback::handler))
        .route("/refresh", get(refresh::handler))
        .route("/token", get(token::handler))
}
