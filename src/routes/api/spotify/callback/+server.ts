import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
import type { RequestEvent } from '@sveltejs/kit';

interface SpotifyTokenResponse {
	access_token: string;
	token_type: string;
	scope: string;
	expires_in: number;
	refresh_token?: string;
}

const LOCAL_CALLBACK = 'http://127.0.0.1:8888/callback';

export const GET = async ({ url }: RequestEvent) => {
	const code = url.searchParams.get('code');
	const err = url.searchParams.get('error');

	if (err || !code) {
		redirect(302, `${LOCAL_CALLBACK}?error=${err ?? 'no_code'}`);
	}

	const { SPOTIFY_CLIENT_ID: clientId, SPOTIFY_CLIENT_SECRET: clientSecret, SPOTIFY_REDIRECT_URI: redirectUri } = env;

	if (!clientId || !clientSecret || !redirectUri) {
		redirect(500, '/');
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

		if (!response.ok) {
			console.error('[Spotify Callback] Token exchange failed:', data);
			redirect(302, `${LOCAL_CALLBACK}?error=token_exchange_failed`);
		}

		const params = new URLSearchParams({
			access_token: data.access_token,
			refresh_token: data.refresh_token ?? '',
			expires_in: String(data.expires_in)
		});

		redirect(302, `${LOCAL_CALLBACK}?${params.toString()}`);
	} catch (err) {
		console.error('[Spotify Callback] Token exchange failed:', err);
		redirect(302, `${LOCAL_CALLBACK}?error=token_exchange_failed`);
	}
};