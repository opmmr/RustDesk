use actix_web::{web, App, HttpServer, Responder, HttpResponse};
use actix_web::middleware::Logger;
use dotenv::dotenv;
use std::env;
use std::collections::HashMap;
use std::sync::Mutex;

async fn start_session(data: web::Json<SessionRequest>, sessions: web::Data<Mutex<HashMap<String, String>>>) -> impl Responder {
    let mut sessions = sessions.lock().unwrap();
    // Adding session to our "database"
    sessions.insert(data.id.clone(), data.user.clone());
    HttpResponse::Ok().body("Session started")
}

async fn stop_session(session_id: web::Path<String>, sessions: web::Data<Mutex<HashMap<String, String>>>) -> impl Responder {
    let mut sessions = sessions.lock().unwrap();
    if sessions.remove(&session_id.into_inner()).is_some() {
        HttpResponse::Ok().body(format!("Session stopped"))
    } else {
        HttpResponse::NotFound().body("Session not found")
    }
}

// New function to check the status of a session
async fn session_status(session_id: web::Path<String>, sessions: web::Data<Mutex<HashMap<String, String>>>) -> impl Responder {
    let sessions = sessions.lock().unwrap();
    if sessions.contains_key(&session_id.into_inner()) {
        HttpResponse::Ok().body("Session is active")
    } else {
        HttpResponse::NotFound().body("Session not found")
    }
}

#[derive(serde::Deserialize, Clone)]
struct SessionRequest {
    id: String,  // Assuming each session should have an ID for tracking
    user: String,
}

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    dotenv().ok();
    env_logger::init();

    let server_url = env::var("SERVER_URL").unwrap_or_else(|_| "127.0.0.1:8080".to_string());

    // Create a shared state for sessions
    let sessions_data = web::Data::new(Mutex::new(HashMap::<String, String>::new()));

    HttpServer::new(move || {
        App::new()
            .wrap(Logger::default())
            .app_data(sessions_data.clone()) // Add shared data to the app
            .route("/start_session", web::post().to(start_session))
            .route("/stop_session/{session_id}", web::delete().to(stop_session))
            .route("/session_status/{session_id}", web::get().to(session_status))  // New route for session status
    })
    .bind(server_url)?
    .run()
    .await
}