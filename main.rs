use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use actix_web::middleware::Logger;
use dotenv::dotenv;
use std::env;
use std::collections::HashMap;
use std::sync::Mutex;

async fn initiate_session(session_data: web::Json<SessionRequest>, active_sessions: web::Data<Mutex<HashMap<String, String>>>) -> impl Responder {
    let mut active_sessions = active_sessions.lock().unwrap();
    // Adding session to our "database"
    active_sessions.insert(session_data.id.clone(), session_data.user.clone());
    HttpResponse::Ok().body("Session initiated")
}

async fn terminate_session(session_id: web::Path<String>, active_sessions: web::Data<Mutex<HashMap<String, String>>>) -> impl Responder {
    let mut active_sessions = active_sessions.lock().unwrap();
    if active_sessions.remove(&session_id.into_inner()).is_some() {
        HttpResponse::Ok().body("Session terminated")
    } else {
        HttpResponse::NotFound().body("Session not found")
    }
}

// Function to check if a session is active
async fn check_session_status(session_id: web::Path<String>, active_sessions: web::Data<Mutex<HashMap<String, String>>>) -> impl Responder {
    let active_sessions = active_sessions.lock().unwrap();
    if active_sessions.contains_key(&session_id.into_inner()) {
        HttpResponse::Ok().body("Session is active")
    } else {
        HttpResponse::NotFound().body("Session not found")
    }
}

#[derive(serde::Deserialize, Clone)]
struct SessionRequest {
    id: String,
    user: String,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

    let server_address = env::var("SERVER_URL").unwrap_or_else(|_| "127.0.0.1:8080".to_string());

    let shared_session_store = web::Data::new(Mutex::new(HashMap::<String, String>::new()));

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(shared_session_store.clone()) // Add shared data to the app
            .route("/initiate_session", web::post().to(initiate_session))
            .route("/terminate_session/{session_id}", web::delete().to(terminate_session))
            .route("/check_session_status/{session_id}", web::get().to(check_session_status)) // New route for checking session status
    })
    .bind(server_address)?
    .run()
    .await
}