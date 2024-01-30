import axios from 'axios';
import Link from 'next/link';
import { useState } from 'react';

export default function Website() {
  const [url] = useState(axios.defaults.baseURL);

  const showNotification = () => {
    // Check if the Notification API is supported
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // Create and show the notification
          new Notification('Welcome back!', {
            body: 'You have successfully logged in.',
          });
        }
      });
    }
  };

  return <>
    <style jsx>{`
        #styleSelector {
          display: none !important;
        }
          .content {
            padding: 20px 15px;
            width: 100%;
            min-height: calc(100vh - 144.8px);
            background-color: rgba(0, 0, 0, 0.6) !important;
            z-index: 2000 !important;
          }
          .content2 {
            background-color: rgba(0, 0, 0, 0.8) !important;
          }
          .paragraph {
            font-size: 1em;
            font-weight: bold;
            font-family: "Roboto", sans-serif;
            color: white;
          }
        }

        .logo {
          margin-left: 0.6em;
          display: flex;
          align-items: center;
        }

        .footer {
          padding: 5px 100px;
          margin: 0;
          display: flex;
          flex-direction: row;
          align-items: center;
          justify-content: space-between;
          background-color: #ffffff;
          color: #5c5c5c !important;
          font-size: 12px;
          font-weight: bold;
        }

        /* 1440px wide screens */
        @media (min-width: 1441px) {
          .container {
            max-width: 1440px;
          }
        }

        /* 2560px wide screens */
        @media (min-width: 2561px) {
          .container {
            max-width: 2560px;
          }

          .content {
            padding: 40px 30px; 
          }

          .footer {
            padding: 10px 30px; 
          }

          .col-lg-8 {
            font-size: 1.5em; 
          }
        }

        /* Mobile Styles */
        @media (max-width: 767px) {
          .logo {
            margin: 1em 100;
            display: flex;
            justify-content: center; /* Center the logo on mobile */
          }

          header {
            height: auto;
          }

          .footer {
            flex-direction: column;
            text-align: center;
            padding: 15px;
            background-color: #f8f9fa;
          }

          .footer-location,
          .footer-contact {
            margin-top: 10px;
          }

          .footer-single-contact {
            margin-bottom: 8px;
          }
        }
      }
    `}</style>
    <div className="wrapper d-flex flex-column min-vh-100" style={{ backgroundImage: "url('/img/assets/banner-9.png')", backgroundRepeat: 'no-repeat', backgroundSize: 'cover', backgroundPosition: 'bottom' }}>
      <div className='content2'>
        <header className="text-white">
          <div className="container">
            <div className="row align-items-center">
              <div className="col-6">
                <div className="logo">
                  <img src="/img/brand/ehaho-logo.png" alt="E-Haho Rwanda" className="img-fluid" style={{ width: '5.5em' }} />
                </div>
              </div>
              <div className="col-6 text-right">
                <nav>
                  <ul className="list-unstyled mb-0">
                    <li className="mr-2">
                      <Link
                        href="/auth/login"
                        passHref
                        onClick={showNotification}
                        className="btn btn-success btn-rounded text-white"
                        style={{ fontFamily: 'Roboto, sans-serif', borderRadius: '20px', backgroundColor: '#28a745', textDecoration: 'none' }}
                        legacyBehavior>
                        Login
                      </Link>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          </div>
        </header>
      </div>

      <div className='content'>
        <div className="container flex-grow-1">
          <div className="row">
            <div className="col-lg-8 col-sm-12 text-white">
              <h1 className="display-5 mb-4" style={{ color: '#fff' }}>E-haho: Connecting Farmers to Buyers</h1>
              <p className="lead">
                E-haho is your direct link to quality produce! It's a platform designed for farmers to showcase their products and for buyers to access fresh produce directly from the source. Whether you're a farmer seeking a wider audience or a buyer in search of top-notch goods, E-haho has got you covered!
              </p>
              <p className="lead">
                Beyond listings, E-haho offers real-time local market prices, ensuring fair and transparent transactions. Plus, it supports agrodealers and vendors for hassle-free delivery services.
              </p>
              <p className="lead">
                E-haho is on a mission to revolutionize agricultural commerce, forging efficient connections between farmers and buyers through cutting-edge technology. Take your first step today and be part of the agricultural evolution!
              </p>
              <p className="lead mt-4">
                <Link
                  href="/auth/register"
                  passHref
                  className="btn btn-success btn-lg"
                  style={{ fontFamily: 'Roboto, sans-serif', backgroundColor: '#28a745' }}
                  legacyBehavior>
                  Get Started
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      <footer className="footer text-dark mt-auto">
        <div className="container">
          <div className="row">
            <div className="col-md-4">
              <span>&copy; {new Date().getFullYear()} Spiderbit All Rights Reserved</span>
            </div>
            <div className="col-md-4">
              <div className="footer-location">
                <span className="fa fa-map-marker footer-icon"></span>
                <span>
                  3rd Floor, Ikaze House,
                  <br />
                  Remera, KG 11 Ave, Kigali – Rwanda
                </span>
              </div>
            </div>
            <div className="col-md-4">
              <div className="footer-contact">
                <div className="footer-single-contact">
                  <span className="fa fa-phone footer-icon"></span> +250 786 506 040
                </div>
                <div className="footer-single-contact">
                  <span className="fa fa-envelope footer-icon"></span> info@ehaho.rw
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  </>;
}
