import { Head, Html, Main, NextScript } from 'next/document'

function Document() {
  return (
    <Html className="h-full bg-gray-100">
      <Head>
        <>
          <link rel="icon" href="/favicon.ico" />
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
