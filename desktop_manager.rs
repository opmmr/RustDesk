use std::env; 
use tokio::net::{TcpListener, TcpStream};
use anyhow::Result;
use serde::{Serialize, Deserialize};
use dotenv::dotenv;

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
    let listener = TcpListener::bind(address).await?;

    println!("Remote Desktop Service listening on {}", address);

    loop {
        let (socket, _) = listener.accept().await?;

        tokio::spawn(async move {
            let session = Session::new();

            if let Err(e) = session.process_stream(&socket).await {
                eprintln!("Error processing stream/input: {}", e);
            }
        });
    }
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();

    let address = env::var("REMOTE_DESKTOP_ADDRESS").unwrap_or_else(|_| "127.0.0.1:8080".into());

    start_remote_desktop_service(&address).await?;
    Ok(())
}