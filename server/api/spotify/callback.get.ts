// server/api/spotify/callback.get.ts

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const code = query.code as string | undefined;
  const error = query.error as string | undefined;

  if (error || !code) {
    return sendRedirect(
      event,
      `http://127.0.0.1:8888/callback?error=${error ?? "no_code"}`,
    );
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  try {
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

    // Redireciona pro servidor local do client com os tokens no query string
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
