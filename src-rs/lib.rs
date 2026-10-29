//! Backend logic (shared between local dev and Vercel).
//!
//! To add a new route:
//!   1. create `src-rs/routes/my_route.rs` with the handler
//!   2. declare `pub mod my_route;` in `routes/mod.rs`
//!   3. register the route in `routes::router()`

pub mod routes;

use axum::Router;

/// Full application router. All routes live under `/api`.
pub fn router() -> Router {
    Router::new().nest("/api", routes::router())
}
