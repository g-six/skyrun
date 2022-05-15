import { Head, Html, Main, NextScript } from 'next/document'

function Document() {
  return (
    <Html className="h-full">
      <Head>
        <>
          <link rel="icon" href="/favicon.ico" />
          <script async src="https://unpkg.com/feather-icons" />
        </>
      </Head>
      <body className="h-full">
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
