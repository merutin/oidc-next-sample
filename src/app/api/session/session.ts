
// FIXME!!!!!
let sessions: { [key in string]: tokenSet } = {};

type tokenSet = {
	access_token?: string;
	token_type?: string;
	id_token?: string;
	refresh_token?: string;
	expires_in?: number;
	expires_at?: number;
	session_state?: string;
	scope?: string;
}

export const setSession = (uuid: string, tokenSet: tokenSet) => {
	sessions = {
		...sessions,
		[uuid]: tokenSet,
	};
}

export const getSession = (uuid: string) => {
	return sessions[uuid];
}