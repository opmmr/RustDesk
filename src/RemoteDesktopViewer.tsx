use actix_web::{web, App, HttpServer, HttpResponse, Responder, middleware::Logger};
use std::env;

async fn start_remote_session() -> impl Responder {
    HttpResponse::Ok().body("Remote session started")
}

async fn end_remote_session() -> impl Responder {
    HttpResponse::Ok().body("Remote session ended")
}

#[actix_web::main] 
async fn main() -> std::io::Result<()> {
    dotenv::dotenv().ok();
    let server_url = env::var("SERVER_URL").unwrap_or("127.0.0.1:8080".to_string());
    env_logger::init();

    HttpServer::new(|| {
        App::new()
            .wrap(Logger::new("%a \"%r\" %s %b %Dms"))
            .service(
                web::scope("/session")
                    .route("/start", web::get().to(start_remote_session))
                    .route("/end", web::get().to(end_remote_session)),
            )
    })
    .bind(&server_url)?
    .run()
    .await
}