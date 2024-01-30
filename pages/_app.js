// _app.js

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Head from 'next/head';
import Router from 'next/router';
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';

import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../assets/css/nextjs-argon-dashboard.css';
import '../assets/plugins/nucleo/css/nucleo.css';
import '../styles/globals.css';

Router.events.on('routeChangeStart', (url) => {
  console.log(`Loading: ${url}`);
  // document.body.classList.add('body-page-transition');
  // ReactDOM.render(
  //   <PageChange path={url} />,
  //   document.getElementById('page-transition')
  // );
});
Router.events.on('routeChangeComplete', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
});
Router.events.on('routeChangeError', () => {
  ReactDOM.unmountComponentAtNode(document.getElementById('page-transition'));
  document.body.classList.remove('body-page-transition');
});
const queryClient = new QueryClient();

function MyApp({ Component, pageProps }) {
  const Layout = Component.layout || (({ children }) => <>{children}</>);

  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          ``;
          console.log('SW registered!');
          console.log(registration);
        })
        .catch((error) => {
          console.log('SW registration failed!');
          console.log(error);
        });
      // Request permission for push notifications
      Notification.requestPermission().then((permission) => {
        console.log('Notification permission:', permission);
        // Assuming you want to send a notification when the app loads
        sendNotification();
      });
    }
  }, []);

  const sendNotification = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const options = {
            body: 'Connecting farmers to buyers!!',
            icon: '/icon-192x192.png',
          };

          navigator.serviceWorker.ready.then((registration) => {
            registration.showNotification('Welcome to eHaho', options);
          });
        }
      });
    }
  };
  return (
    <QueryClientProvider client={queryClient}>
      <React.Fragment>
        <Head>
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1, shrink-to-fit=no"
          />
          <link rel="manifest" href="/manifest.webmanifest" />
          <title>
            eHaho - eCommerce platform connecting farmers to the buyers
          </title>
        </Head>
        {/* <button onClick={handleNotificationClick}>
          Click for Notification
        </button> */}
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </React.Fragment>
    </QueryClientProvider>
  );
}

export default MyApp;
