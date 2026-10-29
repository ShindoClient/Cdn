use axum::{Json, extract::Query};
use serde::{Deserialize, Serialize};

#[derive(Deserialize)]
pub struct HelloParams {
    name: Option<String>,
}

#[derive(Serialize)]
pub struct Hello {
    message: String,
}

/// GET /api/hello?name=Miki
pub async fn hello(Query(params): Query<HelloParams>) -> Json<Hello> {
    let name = params.name.unwrap_or_else(|| "world".to_string());
    Json(Hello {
        message: format!("Hello, {name}! (from Rust 🦀)"),
    })
}
