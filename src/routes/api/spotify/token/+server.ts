// API: Spotify Token - Exchange authorization code for access token
interface SpotifyTokenResponse {
	access_token: string;
	token_type: string;
	scope: string;
	expires_in: number;
	refresh_token?: string;
}

export const GET = async ({ url }) => {
	const code = url.searchParams.get('code');

	if (!code) {
		return new Response(JSON.stringify({ error: 'Missing code parameter' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}

	const clientId = process.env.SPOTIFY_CLIENT_ID;
	const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
	const redirectUri = process.env.SPOTIFY_REDIRECT_URI;

	if (!clientId || !clientSecret || !redirectUri) {
		return new Response(JSON.stringify({ error: 'Spotify not configured' }), {
			status: 500,
			headers: { 'Content-Type': 'application/json' }
		});
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

		return new Response(JSON.stringify({
			access_token: data.access_token,
			refresh_token: data.refresh_token,
			expires_in: data.expires_in
		}), {
			headers: { 'Content-Type': 'application/json' }
		});
	} catch (err) {
		console.error('[Spotify Token] Exchange failed:', err);
		return new Response(JSON.stringify({ error: 'Token exchange failed' }), {
			status: 400,
			headers: { 'Content-Type': 'application/json' }
		});
	}
};