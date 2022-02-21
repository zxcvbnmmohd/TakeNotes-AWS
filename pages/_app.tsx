import React from 'react'
import { AppProps } from 'next/app'
import Amplify from 'aws-amplify';
import config from '../aws-exports';

import '../styles/index.css'

Amplify.configure({
  ...config,
  ssr: true
})

function MyApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />
}

export default MyApp
