import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { getClient } from 'src/auth/openidClient';
import { v4 as uuidv4 } from 'uuid';
import { setSession } from '../../session';

export async function GET(req: NextRequest) {
	const client = await getClient('api/session/auth');
	const code_verifier = cookies().get('code_verifier')?.value ?? '';

	const url = new URL(req.url);
	const params = client.callbackParams(url.search);
	const tokenSet = await client.callback(`${url.origin}${url.pathname}`, params, { code_verifier });

	const uuid = uuidv4();
	setSession(uuid, tokenSet);
	cookies().set("session", uuid);
	return NextResponse.redirect(`${url.origin}/session/auth/cb`, 302);
}