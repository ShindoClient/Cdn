// API: Spotify Login - Redirect to Spotify Authorization
import { redirect } from '@sveltejs/kit';

export const GET = async () => {
	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

	if (!clientId || !redirectUri) {
		return new Response('Spotify not configured', { status: 500 });
	}

	const params = new URLSearchParams({
		client_id: clientId,
		response_type: 'code',
		redirect_uri: redirectUri,
		scope: 'user-read-private user-read-email user-modify-playback-state user-read-playback-state',
		show_dialog: 'true'
	});

	const location = `https://accounts.spotify.com/authorize?${params.toString()}`;
	
	return new Response(null, {
		status: 302,
		headers: {
			'Location': location
		}
	});
};