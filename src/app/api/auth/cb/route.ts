import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getClient } from 'src/auth/openidClient';

export async function GET(req: NextRequest) {
	const client = await getClient('api/auth');
	const code_verifier = cookies().get('code_verifier')?.value ?? '';

	const url = new URL(req.url);
	const params = client.callbackParams(url.search);
	const tokenSet = await client.callback(`${url.origin}${url.pathname}`, params, { code_verifier });
	cookies().set('tokenSet', JSON.stringify(tokenSet));
	if (tokenSet.access_token) {
		const userInfo = await client.userinfo(tokenSet.access_token);
		cookies().set('userInfo', JSON.stringify(userInfo));
	}
	console.log('received and validated tokens %j', tokenSet);
	console.log('validated ID Token claims %j', tokenSet.claims());

	return NextResponse.redirect(`${url.origin}/auth/cb`, 302);
}