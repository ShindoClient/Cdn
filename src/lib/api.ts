/** Small helper for calling the Rust backend. */
export async function api<T>(path: string, init?: RequestInit): Promise<T> {
	const res = await fetch(`/api${path}`, init);
	if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
	return await res.json() as Promise<T>;
}
