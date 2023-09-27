// 'use client'
import { cookies } from 'next/headers';

async function getData() {
	const session = cookies().get("session")?.value;
	if (!session) {
		return {};
	}

	const res = await fetch(`http://localhost:3000/api/session/${session}`);
	if (!res.ok) {
		// This will activate the closest `error.js` Error Boundary
		throw new Error('Failed to fetch data')
	}

	return res.json()
}

export default async function Page() {
 const data = await getData()

	return (
		<main>
			<pre>
				{JSON.stringify(data, null, 2)}
			</pre>
		</main>
	)
}