// ./routes/Layout.js
import { Route, Switch } from 'react-router';

import React from 'react';

import AggregationPage from '../components/AggregationPage';
import ArticlePage from '../components/ArticlePage';

const routes = [
  {
    path: '/',
    name: 'home',
    exact: true,
    component: AggregationPage,
  },
  {
    path: '/article/:entityId',
    name: 'article',
    exact: true,
    component: ArticlePage,
  },
  {
    path: '/another',
    name: 'article',
    exact: true,
    component: ArticlePage,
  }
];

const Layout = () =>
    <Switch>
      {routes.map(route => <Route key={route.name} {...route} />)}
    </Switch>;

export default Layout;