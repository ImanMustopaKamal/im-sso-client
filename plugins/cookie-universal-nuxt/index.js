import Vue from 'vue';
import { setCookie } from 'cookie-universal-nuxt';

Vue.prototype.$setAuthToken = async function ({ idToken, accessToken, refreshToken, tokenExpired }) {
	await setCookie(this, "__IdToken", idToken, {
		expires: tokenExpired,
		path: "/",
		domain: "localhost",
		httpOnly: true,
		secure: true,
	});
	await setCookie(this, "__AccessToken", accessToken, {
		expires: tokenExpired,
		path: "/",
		domain: "localhost",
		httpOnly: true,
		secure: true,
	});
	await setCookie(this, "__RefreshToken", refreshToken, {
		expires: tokenExpired,
		path: "/",
		domain: "localhost",
		httpOnly: true,
		secure: true,
	});
};
