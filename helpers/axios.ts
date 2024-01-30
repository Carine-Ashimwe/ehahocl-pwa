/* eslint-disable no-unused-vars */
import axios from 'axios';
import Router from 'next/router';
import { DevelopmentUrl, ProductionUrl } from './constants';
let ApiUrl = '';
let access_token = '';

if (typeof window != 'undefined') {
  access_token = localStorage.getItem('access_token') || '';
  if (window.location.origin.includes('localhost')) {
    // ApiUrl = DevelopmentUrl;
    // console.log(DevelopmentUrl)
    ApiUrl = ProductionUrl;
  } else {
    ApiUrl = ProductionUrl;
  }
}
const instance = axios.create({
  baseURL: ApiUrl,
  // headers: {
  //   Authorization: `Bearer ${access_token}`,
  // },
});

instance.interceptors.request.use(async (request: any) => {
  var access_token = '';
  if (typeof window !== 'undefined') {
    access_token = localStorage.getItem('access_token') || '';
    if (access_token) {
      request.headers.Authorization = `Bearer ${access_token}`;
    }
  }
  return request;
});

instance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status == 401) {
      localStorage.removeItem('user');
      localStorage.removeItem('access_token');
      localStorage.removeItem('active_shop');
      Router.push('/auth/login');
    }
    return;
  }
);

export default instance;
