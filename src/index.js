import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider, connect } from 'react-redux';



// ----------------------------------------------------------------------------------

import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import Branch from './Branch';

const Middleware = applyMiddleware();

const store = createStore(
    Branch({
        message: Branch({
            name: 'world',
            age: Branch( 26,
                {
                    ['BIRTHDAY']: (state, {payload}) => (payload)
                })
        }, {
            ['NAME'] (state, {payload}) {
                return {
                    ...state,
                    ...payload
                }
            }
        })

    }),


    {},
    (window && window['__REDUX_DEVTOOLS_EXTENSION_COMPOSE__'])
        ? compose(Middleware, composeWithDevTools())
        : compose(Middleware)
);

// ----------------------------------------------------------------------------------
setTimeout(() => {
    store.dispatch({type: 'NAME', payload: {name: 'murad'}});
    setTimeout(() => {
        store.dispatch({type: 'BIRTHDAY', payload: 27})
    }, 2000);
}, 2000);
// ----------------------------------------------------------------------------------


class App extends Component {
    render () {
        return (<div className="container">hello {this.props.message.name}, age of {this.props.message.age}</div>)
    }
}

const AppConnected = connect(
    ({ message }) => ({ message })
)(App);


// ----------------------------------------------------------------------------------
ReactDOM.render(<Provider store={store}><AppConnected /></Provider>, document.getElementById('root'));