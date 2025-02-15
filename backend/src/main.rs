use axum::{
    Router,
    routing::get,
    response::IntoResponse,
    http::{HeaderValue, Method},
};
use tower_http::{
    cors::CorsLayer,
    services::ServeDir,
};
use tracing_subscriber::fmt::format::FmtSpan;

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_span_events(FmtSpan::CLOSE)
        .init();

    // Configure CORS
    let cors = CorsLayer::new()
        .allow_origin("http://localhost:3000".parse::<HeaderValue>().unwrap())
        .allow_methods([Method::GET, Method::POST])
        .allow_headers(tower_http::cors::Any);

    // Build our application with routes
    let app = Router::new()
        .route("/api/health", get(health_check))
        .nest_service("/assets", ServeDir::new("assets"))
        .layer(cors);

    // Run it
    let listener = tokio::net::TcpListener::bind("127.0.0.1:8080")
        .await
        .unwrap();
    tracing::info!("listening on {}", listener.local_addr().unwrap());
    axum::serve(listener, app).await.unwrap();
}

async fn health_check() -> impl IntoResponse {
    "OK"
}
