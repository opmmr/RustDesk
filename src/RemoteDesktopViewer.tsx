use actix_web::{web, App, HttpServer, Responder, HttpResponse, middleware::Logger};
use std::env;

async fn start_remote_session() -> impl Responder {
    "Remote session started"
}

async fn end_remote_session() -> impl Responder {
    "Remote session ended"
}

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let server_url = env::var("SERVER_URL").unwrap_or_else(|_| "127.0.0.1:8080".to_string());

    std::env::set_var("RUST_LOG", "actix_web=info");
    env_logger::init();

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .route("/start", web::get().to(start_remote_session))
            .route("/end", web::get().to(end_remote_session))
    })
    .bind(&server_url)?
    .run()
    .await
}