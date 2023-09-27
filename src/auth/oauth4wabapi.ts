import * as oauth from 'oauth4webapi';

const client: oauth.Client = {
	client_id: 'react',
	client_secret: 'ruwM9u1LuUeWzM35h6FeCzjoERTv4Eze',
	token_endpoint_auth_method: 'client_secret_basic',
};
const redirect_uri = 'http://localhost:3000/cb';
const sessionStorageKey = 'oauth_code_verifier';

let as_: oauth.AuthorizationServer;
const getAuthServer = async () => {
	if (as_) {
		return as_;
	}

	const issuer = new URL('http://localhost:8080/realms/sample');
	as_ = await oauth.discoveryRequest(issuer).then(res => oauth.processDiscoveryResponse(issuer, res));
	return as_;
}

export const verify = async () => {
	const as = await getAuthServer();
	console.log('Discovered issuer %s', as.issuer);


	const code_verifier = oauth.generateRandomCodeVerifier()
	sessionStorage.setItem(sessionStorageKey, code_verifier);
	console.log("code verifier %s", code_verifier);

	const code_challenge = await oauth.calculatePKCECodeChallenge(code_verifier)
	const code_challenge_method = 'S256'

	const authorizationUrl = new URL(as.authorization_endpoint!)
	authorizationUrl.searchParams.set('client_id', client.client_id)
	authorizationUrl.searchParams.set('code_challenge', code_challenge)
	authorizationUrl.searchParams.set('code_challenge_method', code_challenge_method)
	authorizationUrl.searchParams.set('redirect_uri', redirect_uri)
	authorizationUrl.searchParams.set('response_type', 'code')
	authorizationUrl.searchParams.set('scope', 'openid email')

	location.href = authorizationUrl.toString();
}

export const cb = async () => {
	// one eternity later, the user lands back on the redirect_uri
	const code_verifier = sessionStorage.getItem(sessionStorageKey) ?? '';
	console.log("code verifier %s", code_verifier);

	let sub: string
	let access_token: string
	{
		const currentUrl: URL = new URL(location.href);
		const as = await getAuthServer();
		const params = oauth.validateAuthResponse(as, client, currentUrl, oauth.expectNoState)
		if (oauth.isOAuth2Error(params)) {
			console.log('error', params)
			throw new Error() // Handle OAuth 2.0 redirect error
		}

		const response = await oauth.authorizationCodeGrantRequest(
			as,
			client,
			params,
			redirect_uri,
			code_verifier,
		)

		let challenges: oauth.WWWAuthenticateChallenge[] | undefined
		if ((challenges = oauth.parseWwwAuthenticateChallenges(response))) {
			for (const challenge of challenges) {
				console.log('challenge', challenge)
			}
			throw new Error() // Handle www-authenticate challenges as needed
		}

		const result = await oauth.processAuthorizationCodeOpenIDResponse(as, client, response)
		if (oauth.isOAuth2Error(result)) {
			console.log('error', result)
			throw new Error() // Handle OAuth 2.0 response body error
		}

		console.log('result', result)
			; ({ access_token } = result)
		const claims = oauth.getValidatedIdTokenClaims(result)
		console.log('ID Token Claims', claims)
			; ({ sub } = claims)

		return {
			result,
			claims,
		};
	}
}