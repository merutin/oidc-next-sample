import { Issuer } from 'openid-client';

export const getClient = async (path: string) => {
	const issuer = await Issuer.discover('http://localhost:8080/realms/sample');

	const client = new issuer.Client({
		client_id: 'react',
		client_secret: 'ruwM9u1LuUeWzM35h6FeCzjoERTv4Eze',
		redirect_uris: [`http://localhost:3000${path}/cb`],
		response_types: ['code'],
	});

	return client;
}