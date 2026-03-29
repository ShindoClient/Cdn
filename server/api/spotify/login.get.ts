// server/api/spotify/login.get.ts
export default defineEventHandler(async (event) => {
  const clientId = process.env.SPOTIFY_CLIENT_ID!;
  const redirectUri = process.env.SPOTIFY_REDIRECT_URI!;

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    redirect_uri: redirectUri,
    scope:
      "user-read-private user-read-email user-modify-playback-state user-read-playback-state",
    show_dialog: "true",
  });

  return sendRedirect(
    event,
    `https://accounts.spotify.com/authorize?${params.toString()}`,
  );
});
