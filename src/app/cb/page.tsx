'use client'

import { useEffect, useState } from 'react'
import { cb } from 'src/auth/oauth4wabapi';

export default function Home() {
  const [tokens, setTokens] = useState('');

  useEffect(() => {
    (async () => {
      const result = await cb();
      setTokens(JSON.stringify(result, null, 2));
    })();
  }, []);

  if (tokens == '') {
    return <></>;
  }

  return (
    <main>
      <pre>
        {tokens}
      </pre>
    </main>
  )
}
