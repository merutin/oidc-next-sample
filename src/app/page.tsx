'use client'

import Image from 'next/image'
import { Card, CardBody, CardFooter, Stack, Heading, Text, Divider, ButtonGroup, Button, SimpleGrid } from '@chakra-ui/react'
import { verify } from 'src/auth/oauth4wabapi'

const targets = [
  {
    image: "/amplify2.webp",
    header: 'SPAでの認証',
    detail: 'ブラウザ側で認証までを実行して、JWTをブラウザ側で直接保存します',
    execute: verify,
  },
  {
    image: "/cookie-ssr.svg",
    header: 'SSRでの認証',
    detail: 'SSR側でsecretのやり取りを行い、CookieでJWTのやり取りをします',
    execute: () => location.href = '/api/auth',
  },
  {
    image: "/with-db.svg",
    header: 'SSRでの認証、sessionの保持',
    detail: 'SSR側でsecretのやり取りを行い、ブラウザにはsessionを返します。ブラウザでsessionとJWTを紐づけておき、利用します',
    execute: () => location.href = '/api/session/auth',
  },
]

export default function Main() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-8">
      <SimpleGrid spacing={4} templateColumns='repeat(auto-fill, 500px)' width={"100%"}>
      {targets.map((target, i) => (
        <Card maxW='lg' key={i}>
          <CardBody>
            <Image
              src={target.image}
              alt="code grant flow"
              width={500}
              height={500}
              priority
            />
            <Stack mt='6' spacing='3'>
              <Heading size='md'>{target.header}</Heading>
              <Text>{target.detail}</Text>
            </Stack>
          </CardBody>
          <Divider />
          <CardFooter>
            <ButtonGroup spacing='2'>
              <Button onClick={target.execute} variant='ghost' colorScheme='blue'>
                実行
              </Button>
            </ButtonGroup>
          </CardFooter>
        </Card>

      ))}

      </SimpleGrid>
    </main>
  )
}
