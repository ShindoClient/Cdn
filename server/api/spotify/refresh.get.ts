// server/api/spotify/refresh.get.ts

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const refreshToken = query.refresh_token as string | undefined;

  if (!refreshToken) {
    throw createError({
      statusCode: 400,
      statusMessage: "Missing refresh_token parameter",
    });
  }

  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const clientSecret = process.env.SPOTIFY_CLIENT_SECRET!;

  try {
    const response = await $fetch<SpotifyRefreshResponse>(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }).toString(),
      },
    );

    return {
      access_token: response.access_token,
      refresh_token: response.refresh_token ?? refreshToken,
      expires_in: response.expires_in,
    };
  } catch (err) {
    console.error("[Spotify Refresh] Failed:", err);
    throw createError({
      statusCode: 401,
      statusMessage: "Failed to refresh Spotify token",
    });
  }
});

interface SpotifyRefreshResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
  refresh_token?: string;
}
