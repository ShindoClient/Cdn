import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

interface SpotifyTokenResponse {
	access_token: string;
	token_type: string;
	scope: string;
	expires_in: number;
	refresh_token?: string;
}

export const GET = async ({ url }: RequestEvent) => {
	const code = url.searchParams.get('code');

	if (!code) {
		error(400, 'Missing code parameter');
	}

	const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret, SPOTIFY_REDIRECT_URI: redirectUri } = env;

	if (!clientId || !clientSecret || !redirectUri) {
		error(500, 'Spotify not configured');
	}

	try {
		const response = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`
			},
			body: new URLSearchParams({
				grant_type: 'authorization_code',
				code,
				redirect_uri: redirectUri
			}).toString()
		});

		const data: SpotifyTokenResponse = await response.json();

		return json({
			access_token: data.access_token,
			refresh_token: data.refresh_token,
			expires_in: data.expires_in
		});
	} catch (err) {
		console.error('[Spotify Token] Exchange failed:', err);
		error(400, 'Token exchange failed');
	}
};