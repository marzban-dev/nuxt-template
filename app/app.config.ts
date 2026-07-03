export default defineAppConfig({
    appApi: {
        // Api layer app config
    },
    appAuth: {
        // Auth layer app config.
        //
        // Every field is optional. With nothing set, the layer assumes a backend
        // that returns `{ access, refresh }` and accepts `{ refresh }` / `{ token }`
        // / `{ refresh_token }` bodies. To target a different backend, override only
        // the adapters you need — no need to touch the layer itself:
        //
        // extractTokens: (res) => ({
        //     token: res.data.accessToken,
        //     refreshToken: res.data.refreshToken,
        // }),
        // buildRefreshBody: (refreshToken) => ({ refreshToken }),
        // buildSignOutBody: (refreshToken) => ({ token: refreshToken }),
        // unauthorizedEvent: (error) => console.warn("Unauthorized", error),
    },
});
