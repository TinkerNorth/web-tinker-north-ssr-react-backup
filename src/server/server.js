require('es6-promise').polyfill();
require('isomorphic-fetch');

import path from 'path'
import React from 'react'
import Express from 'express';
import { StaticRouter } from 'react-router';
import { InMemoryCache } from "apollo-cache-inmemory";
import { createHttpLink } from 'apollo-link-http';
import { ApolloProvider } from 'react-apollo';
import ApolloClient from 'apollo-client';
import { getDataFromTree } from "react-apollo"
import HomePage from '../views/HomePage';

const ReactDOMServer = require('react-dom/server');
const PORT = 8080

function Html({ content, state }) {
  return (
    <html>
      <head>
        <title>Tinker North</title>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        <meta name="theme-color" content="#000000" />
        
        <link rel="shortcut icon" href="/favicon.ico" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossOrigin="anonymous" />
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossOrigin="anonymous" />
        <link rel="manifest" href="/manifest.json" />

      </head>
      <body>
        <div id="root" dangerouslySetInnerHTML={{ __html: content }} />
        <script dangerouslySetInnerHTML={{
          __html: `window.__APOLLO_STATE__=${JSON.stringify(state).replace(/</g, '\\u003c')};`,
        }} />

        <script src="/static/js/bundle.js"></script><script src="/static/js/2.374d3c9c.chunk.js" /><script src="/static/js/main.54449d98.chunk.js" />
      </body>
    </html>
  );
}
const renderer = (req, res) => {
  const client = new ApolloClient({
    ssrMode: true,
    link: createHttpLink({
      uri: 'http://localhost:4000',
      credentials: 'same-origin',
      headers: {
        cookie: req.header('Cookie'),
      },
    }),
    cache: new InMemoryCache(),
  });

  const context = {};

  const App = (
    <ApolloProvider client={client}>
      <StaticRouter location={req.url} context={context}>
        <HomePage />
      </StaticRouter>
    </ApolloProvider>
  );

  getDataFromTree(App).then(() => {
    const content = ReactDOMServer.renderToString(App);
    const initialState = client.extract();
  
    const html = <Html content={content} state={initialState} />;
  
    res.status(200);
    res.send(`<!doctype html>\n${ReactDOMServer.renderToStaticMarkup(html)}`);
    res.end();
  });

};

const router = Express.Router()
router.use('(^/$|^/article/*)', renderer);
// router.use('^/static/js/*', Express.static(path.resolve(__dirname, '../../', 'build/static/js'), { maxAge: '30d' }));
router.use(Express.static(path.resolve(__dirname, '../../', 'build'), { maxAge: '30d' }));

const app = Express()
app.use(router);
app.listen(PORT, () => {
  console.log(`SSR running on port ${PORT}`)
})