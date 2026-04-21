// API: Spotify Callback - Exchange code for tokens, redirect to local server
interface SpotifyTokenResponse {
	access_token: string;
	token_type: string;
	scope: string;
	expires_in: number;
	refresh_token?: string;
}

export const GET = async ({ url }) => {
	const code = url.searchParams.get('code');
	const error = url.searchParams.get('error');

	if (error || !code) {
		const location = `http://127.0.0.1:8888/callback?error=${error ?? 'no_code'}`;
		return new Response(null, {
			status: 302,
			headers: { 'Location': location }
		});
	}

	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
	const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

	if (!clientId || !clientSecret || !redirectUri) {
		return new Response('Spotify not configured', { status: 500 });
	}

	try {
		const response = await fetch('https://accounts.spotify.com/api/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString('base64')}`
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
			const location = 'http://127.0.0.1:8888/callback?error=token_exchange_failed';
			return new Response(null, {
				status: 302,
				headers: { 'Location': location }
			});
		}

		const params = new URLSearchParams({
			access_token: data.access_token,
			refresh_token: data.refresh_token ?? '',
			expires_in: String(data.expires_in)
		});

		const location = `http://127.0.0.1:8888/callback?${params.toString()}`;
		return new Response(null, {
			status: 302,
			headers: { 'Location': location }
		});
	} catch (err) {
		console.error('[Spotify Callback] Token exchange failed:', err);
		const location = 'http://127.0.0.1:8888/callback?error=token_exchange_failed';
		return new Response(null, {
			status: 302,
			headers: { 'Location': location }
		});
	}
};