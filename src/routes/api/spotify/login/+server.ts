import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';

export const GET = async () => {
	const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_REDIRECT_URI: redirectUri } = env;

	if (!clientId || !redirectUri) {
		redirect(500, '/');
	}

	const params = new URLSearchParams({
		client_id: clientId,
		response_type: 'code',
		redirect_uri: redirectUri,
		scope: 'user-read-private user-read-email user-modify-playback-state user-read-playback-state',
		show_dialog: 'true'
	});

	redirect(302, `https://accounts.spotify.com/authorize?${params.toString()}`);
};