serde = { version = "1.0", features = ["derive"] }
serde_json = "1.0"
```
```rust
use actix_web::{web, App, HttpServer, HttpResponse, Responder, middleware::Logger};
use std::env;
use serde_json::json; // Import serde_json

async fn start_remote_session() -> impl Responder {
    HttpResponse::Ok().body("Remote session started")
}

async fn end_remote_session() -> impl Responder {
    HttpResponse::Ok().body("Remote session ended")
}

async fn query_session_status() -> impl Responder {
    // A simple example, you might want to add logic here to check the real status.
    let status = json!({
        "session": "unknown",
        "status": "no active session",
    });
    HttpResponse::Ok()
        .content_type("application/json") // Ensure we're sending JSON back
        .body(status.to_string())
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let server_url = env::var("SERVER_URL").unwrap_or_else(|_| "127.0.0.1:8080".to_string());
    
    std::env::set_var("RUST_LOG", "actix_web=info"); // Set log level for actix_web
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info")); // Initialize logger

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::new("%a \"%r\" %s %b %Dms"))
            .service(
                web::scope("/session")
                    .route("/start", web::get().to(start_remote_session))
                    .route("/end", web::get().to(end_remote_session))
                    .route("/status", web::get().to(query_session_status)), // New endpoint for session status
            )
    })
    .bind(&server_url)?
    .run()
    .await
}