/*import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
*/
import React from 'react'
import App from './App.jsx'
import { createRoot } from 'react-dom/client';
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from '@apollo/client';


const graphqlLink = createHttpLink({
  uri: 'http://localhost:3000/graphql', 
  credentials: 'include', 
});
const client = new ApolloClient({
  link: graphqlLink,
  cache: new InMemoryCache(),
});

const container = document.getElementById('root');
const root = createRoot(container);

// root.render(<App tab="home" />)

root.render(
  <ApolloProvider client={client}>
    <App tab ="home"/>
  </ApolloProvider>
);
//import { render } from 'react-dom'

//render(<App/>, document.getElementById('root'));

/*
import React from 'react';
import ReactDOM from 'react-dom';
//import './globals.css';
import App from './App';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.querySelector('#root')
);

*/
