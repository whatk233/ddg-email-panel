import { Html, Head, Main, NextScript, DocumentContext } from 'next/document'

export default function Document(props: DocumentContext) {
  return (
    <Html lang={props.locale}>
      <Head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon.png" />
        <meta name="theme-color" content="#fff" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
