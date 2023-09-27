import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '../session';

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
	const token = getSession(params.id);
	console.log(token);

	return new NextResponse(JSON.stringify(token));
}