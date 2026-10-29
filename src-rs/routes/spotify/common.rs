use serde::Deserialize;

#[derive(Debug, Deserialize)]
pub(super) struct SpotifyTokenResponse {
    pub access_token: Option<String>,
    pub token_type: Option<String>,
    pub scope: Option<String>,
    pub expires_in: Option<u64>,
    pub refresh_token: Option<String>,
    pub error: Option<String>,
    pub error_description: Option<String>,
}

pub(super) fn env_config(key: &str) -> Option<String> {
    std::env::var(key).ok().filter(|value| !value.trim().is_empty())
}

pub(super) fn spotify_client() -> Result<reqwest::Client, reqwest::Error> {
    reqwest::Client::builder().build()
}

pub(super) fn local_callback_url(params: &[(&str, &str)]) -> String {
    let mut serializer =
        url::form_urlencoded::Serializer::new("http://127.0.0.1:8888/callback?".to_owned());
    for (key, value) in params {
        serializer.append_pair(key, value);
    }
    serializer.finish()
}
