import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { generators } from 'openid-client';
import { getClient } from 'src/auth/openidClient';

export async function GET(req: NextRequest) {
	const reqUrl = new URL(req.url);
	console.log(reqUrl)
	const client = await getClient(reqUrl.pathname);

	const code_verifier = generators.codeVerifier();
	const code_challenge = generators.codeChallenge(code_verifier);

	const url = client.authorizationUrl({
		scope: 'openid email profile',
		response_type: "code",
		code_challenge,
		code_challenge_method: 'S256',
	});
	cookies().set('code_verifier', code_verifier);

	return NextResponse.redirect(url, 302);
}