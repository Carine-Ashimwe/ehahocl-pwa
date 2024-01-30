import Document, { Head, Html, Main, NextScript } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="theme-color" content="#000000" />
          <link rel="shortcut icon" href="/img/brand/ehaho-favicon.ico" />
          <link
            rel="apple-touch-icon"
            sizes="76x76"
            href='/img/brand/ehaho-favicon.ico'
          />

          {/* Fonts and icons */}
          <link
            href="https://fonts.googleapis.com/css2?family=Open+Sans&display=optional"
            rel="stylesheet"
          />
        </Head>
        <body>
          <div id="page-transition"></div>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
