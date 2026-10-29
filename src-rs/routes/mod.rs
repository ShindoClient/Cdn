pub mod health;
pub mod hello;

use axum::{Router, routing::get};

/// API routes (without the `/api` prefix, which is added in `lib.rs`).
pub fn router() -> Router {
    Router::new()
        .route("/health", get(health::health))
        .route("/hello", get(hello::hello))
}
