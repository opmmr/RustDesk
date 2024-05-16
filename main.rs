use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use actix_web::middleware::Logger;
use dotenv::dotenv;
use std::env;

async fn start_session(data: web::Json<SessionRequest>) -> impl Responder {
    HttpResponse::Ok().body("Session started")
}

async fn stop_session(session_id: web::Path<String>) -> impl Responder {
    HttpResponse::Ok().body(format!("Session {} stopped", session_id))
}

#[derive(serde::Deserialize)]
struct SessionRequest {
    user: String,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

    let server_url = env::var("SERVER_URL").unwrap_or_else(|_| "127.0.0.1:8080".to_string());

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::default())
            .route("/start_session", web::post().to(start_session))
            .route("/stop_session/{session_id}", web::delete().to(stop_session))
    })
    .bind(server_url)?
    .run()
    .await
}