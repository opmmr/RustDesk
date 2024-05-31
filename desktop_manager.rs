use std::env; 
use tokio::net::TcpListener;
use anyhow::Result;
use serde::{Serialize, Deserialize};
use dotenv::dotenv;

#[derive(Serialize, Deserialize)]
struct DesktopStream {
}

#[derive(Serialize, Deserialize)]
struct Input&Event {
}

struct Session {
}

impl Session {
    fn new() -> Self {
        Self {
        }
    }
}

async fn start_remote_desktop_service(address: &str) -> Result<()> {
    let listener = TcpListener::bind(address).await?;

    println!("Remote Desktop Service listening on {}", address);

    loop {
        let (socket, _) = listener.accept().await?;

        tokio::spawn(async move {
            let _session = Session::new();

            if let Err(e) = process_stream_and_input(&socket).await {
                eprintln!("Error processing stream/input: {}", e);
            }
        });
    }
}

async fn process_stream_and_input(socket: &tokio::net::TcpStream) -> Result<()> {

    Ok(())
}

#[tokio::main]
async fn main() -> Result<()> {
    dotenv().ok();

    let address = env::var("REMOTE_DESKTOP_ADDRESS").unwrap_or_else(|_| "127.0.0.1:8080".into());

    start_remote_desktop_service(&address).await?;

    Ok(())
}