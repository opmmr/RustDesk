use std::env;
use tokio::net::{TcpListener, TcpStream};
use anyhow::{Result, Context};
use serde::{Serialize, Deserialize};
use dotenv::dotenv;
use log::{error, info};

#[derive(Serialize, Deserialize)]
struct DesktopStream {
}

#[derive(Serialize, Deserialize)]
struct InputEvent {
}

struct Session {
}

impl Session {
    fn new() -> Self {
        Self {
        }
    }

    async fn process_stream(&self, socket: &TcpStream) -> Result<()> {
        Ok(())
    }
}

async fn start_remote_desktop_service(address: &str) -> Result<()> {
    let listener = TcpListener::bind(address)
    .await
    .context(format!("Failed to bind to address {}", address))?;

    info!("Remote Desktop Service listening on {}", address);

    loop {
        let (socket, _) = listener.accept().await.context("Failed to accept connection")?;

        tokio::spawn(async move {
            let session = Session::new();

            if let Err(e) = session.process_stream(&socket).await {
                error!("Error processing stream/input: {}", e);
            }
        });
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();
    env_logger::init();

    let address = env::var("REMOTE_DESKTOP_ADDRESS").unwrap_or_else(|_| "127.0.0.1:8080".into());

    if let Err(e) = start_remote_desktop_service(&address).await {
        error!("Failed to start remote desktop service: {}", e);
        return Err(e);
    }
    
    Ok(())
}