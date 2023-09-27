import { cookies } from 'next/headers';

export default function Main () {
	const tokenSet = cookies().get('tokenSet')?.value ?? '{}';
	const userInfo = cookies().get('userInfo')?.value ?? '{}';

	return (
		<main>
			<div>
				<pre>
					{JSON.stringify(JSON.parse(tokenSet), null, 2)}
				</pre>
			</div>
			<div>
				<pre>
					{JSON.stringify(JSON.parse(userInfo), null, 2)}
				</pre>
			</div>
		</main>
	)
}