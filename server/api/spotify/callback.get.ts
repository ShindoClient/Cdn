// server/api/spotify/callback.get.ts

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string | undefined;
  const error = query.error as string | undefined;

  // Erro do lado do Spotify (usuário negou, etc.)
  if (error || !code) {
    return sendRedirect(
      event,
      `shindo://spotify/error?reason=${error ?? "no_code"}`,
    );
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!; // https://cdn.shindoclient.com/api/spotify/callback

  try {
    // Troca o code pelo access_token — o secret fica só aqui no servidor
    const response = await $fetch<SpotifyTokenResponse>(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          redirect_uri: redirectUri,
        }).toString(),
      },
    );

    // Redireciona pro deep link do client com os tokens
    // O client abre uma página local (localhost:8888) que captura esses parâmetros
    const params = new URLSearchParams({
      access_token: response.access_token,
      refresh_token: response.refresh_token ?? "",
      expires_in: String(response.expires_in),
    });

    return sendRedirect(
      event,
      `http://127.0.0.1:8888/callback?${params.toString()}`,
    );
  } catch (err) {
    console.error("[Spotify Callback] Token exchange failed:", err);
    return sendRedirect(
      event,
      `http://127.0.0.1:8888/callback?error=token_exchange_failed`,
    );
  }
});

interface SpotifyTokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}
