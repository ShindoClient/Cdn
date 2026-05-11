import { json, error } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

interface SpotifyRefreshResponse {
	access_token: string;
	token_type: string;
	scope: string;
	expires_in: number;
	refresh_token?: string;
}

export const GET = async ({ url }: RequestEvent) => {
	const refreshToken = url.searchParams.get('refresh_token');

	if (!refreshToken) {
		error(400, 'Missing refresh_token parameter');
	}

	const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret } = env;

	if (!clientId || !clientSecret) {
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
				grant_type: 'refresh_token',
				refresh_token: refreshToken
			}).toString()
		});

		const data: SpotifyRefreshResponse = await response.json();

		return json({
			access_token: data.access_token,
			refresh_token: data.refresh_token ?? refreshToken,
			expires_in: data.expires_in
		});
	} catch (err) {
		console.error('[Spotify Refresh] Failed:', err);
		error(401, 'Failed to refresh Spotify token');
	}
};