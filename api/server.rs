//! Backend entry point.
//!
//! - On Vercel (`VERCEL` is set): runs as a Vercel Function via `vercel_runtime`.
//! - Locally: starts a regular HTTP server on 127.0.0.1:3001 (Vite proxies /api to it).

use tower::ServiceBuilder;
use vercel_runtime::{Error, axum::VercelLayer};

#[tokio::main]
async fn main() -> Result<(), Error> {
    let router = app::router();

    if std::env::var_os("VERCEL").is_some() {
        let service = ServiceBuilder::new().layer(VercelLayer::new()).service(router);
        vercel_runtime::run(service).await
    } else {
        let port = std::env::var("API_PORT").unwrap_or_else(|_| "3001".into());
        let listener = tokio::net::TcpListener::bind(format!("127.0.0.1:{port}")).await?;
        println!("Local API running at http://127.0.0.1:{port}");
        axum::serve(listener, router).await?;
        Ok(())
    }
}
