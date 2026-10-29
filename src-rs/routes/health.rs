use axum::Json;
use serde::Serialize;

#[derive(Serialize)]
pub struct Health {
    status: &'static str,
}

/// GET /api/health
pub async fn health() -> Json<Health> {
    Json(Health { status: "ok" })
}
