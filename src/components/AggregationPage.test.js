import React from 'react';
import ReactDOM from 'react-dom';
import AggregationPage from './AggregationPage';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<AggregationPage />, div);
  ReactDOM.unmountComponentAtNode(div);
});
