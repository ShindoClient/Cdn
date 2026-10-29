pub mod health;
pub mod spotify;

use axum::Router;
use axum::routing::get;


/// API routes (without the `/api` prefix, which is added in `lib.rs`).
pub fn router() -> Router {
    Router::new()
        .route("/health", get(health::health))
        .merge(spotify::router())
}
