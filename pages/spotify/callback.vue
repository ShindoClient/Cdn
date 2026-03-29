<!-- pages/spotify/callback.vue -->

<template>
    <div class="callback-page">
        <div class="card">
            <div class="logo">
                <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"
                        fill="#1DB954"
                    />
                    <path
                        d="M16.5 16.5c-.2 0-.4-.06-.56-.18-1.98-1.2-4.48-1.48-7.42-.8-.28.06-.56-.1-.62-.38-.06-.28.1-.56.38-.62 3.22-.74 5.98-.42 8.2.94.24.14.32.46.18.7-.1.18-.28.28-.46.28l-.1.04z"
                        fill="white"
                    />
                    <path
                        d="M17.5 14c-.24 0-.48-.08-.66-.24-2.32-1.42-5.86-1.84-8.6-1-.32.1-.66-.08-.76-.4-.1-.32.08-.66.4-.76 3.14-.96 7.04-.5 9.7 1.16.28.18.38.54.2.84-.12.26-.38.4-.66.4h-.02v.02l-.1-.02z"
                        fill="white"
                    />
                    <path
                        d="M18.5 11.5c-.28 0-.54-.1-.74-.28C15 9.52 10.44 9.34 7.5 10.18c-.38.1-.78-.1-.88-.48-.1-.38.1-.78.48-.88 3.38-.96 8.42-.78 11.66 1.28.34.2.44.64.24.98-.14.26-.4.42-.68.42h.18z"
                        fill="white"
                    />
                </svg>
            </div>

            <template v-if="status === 'loading'">
                <div class="spinner" />
                <h1>Connecting to Spotify</h1>
                <p>Completing authentication, please wait...</p>
            </template>

            <template v-else-if="status === 'success'">
                <div class="icon success">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path
                            d="M5 13l4 4L19 7"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                        />
                    </svg>
                </div>
                <h1>Connected!</h1>
                <p>You can close this window and go back to Shindo Client.</p>
            </template>

            <template v-else-if="status === 'error'">
                <div class="icon error">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path
                            d="M6 18L18 6M6 6l12 12"
                            stroke="currentColor"
                            stroke-width="2.5"
                            stroke-linecap="round"
                        />
                    </svg>
                </div>
                <h1>Authentication Failed</h1>
                <p>{{ errorMessage }}</p>
                <p class="hint">
                    Close this window and try again in Shindo Client.
                </p>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
const route = useRoute();

type Status = "loading" | "success" | "error";
const status = ref<Status>("loading");
const errorMessage = ref("Something went wrong during authentication.");

onMounted(() => {
    const error = route.query.error as string | undefined;

    if (error) {
        status.value = "error";
        errorMessage.value =
            error === "access_denied"
                ? "You denied access to your Spotify account."
                : `Error: ${error}`;
        return;
    }

    // Se chegou aqui sem erro, o server/api/spotify/callback.get.ts já
    // fez o redirect pro localhost do client. Essa página é só o fallback visual.
    status.value = "success";
});
</script>

<style scoped>
.callback-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #0a0a0a;
    font-family: "Inter", sans-serif;
}

.card {
    background: #111;
    border: 1px solid #222;
    border-radius: 16px;
    padding: 48px 40px;
    text-align: center;
    max-width: 360px;
    width: 100%;
}

.logo svg {
    width: 48px;
    height: 48px;
    margin-bottom: 24px;
}

h1 {
    color: #fff;
    font-size: 20px;
    font-weight: 600;
    margin: 0 0 8px;
}

p {
    color: #888;
    font-size: 14px;
    margin: 0 0 4px;
    line-height: 1.6;
}

.hint {
    color: #555;
    font-size: 12px;
    margin-top: 12px;
}

.spinner {
    width: 40px;
    height: 40px;
    border: 3px solid #222;
    border-top-color: #1db954;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin: 0 auto 24px;
}

@keyframes spin {
    to {
        transform: rotate(360deg);
    }
}

.icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 24px;
}

.icon svg {
    width: 24px;
    height: 24px;
}

.icon.success {
    background: rgba(29, 185, 84, 0.15);
    color: #1db954;
}

.icon.error {
    background: rgba(255, 80, 80, 0.15);
    color: #ff5050;
}
</style>
