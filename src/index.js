import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import pTypes from 'prop-types';
import { Provider, connect } from 'react-redux';
import { applyMiddleware, compose, createStore } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { Branch, Leaf, BunchOf } from './Branch';

const PROFILE_SESSION_UPDATE = 'PROFILE_SESSION_UPDATE';
const AUTH_SUCCESS = 'AUTH_SUCCESS';
const AUTH_SERVER_COME = 'AUTH_SERVER_COME';
const AUTH_FAILURE = 'AUTH_FAILURE';
const PROFILE_UPDATED = 'PROFILE_UPDATED';

const Middleware = applyMiddleware();

const profileBranch = Branch({
    sessionKey: Branch(null, {
        [PROFILE_SESSION_UPDATE]: (state, {payload}) => payload.sessionKey
    }),

    user_name: null,
    user_id: null,

    isAuth: Leaf(false, {
        [Branch.multiply(
            AUTH_SUCCESS,
            AUTH_SERVER_COME
        )]: true,
        [AUTH_FAILURE]: false
    })
}, {
    [PROFILE_UPDATED]: (state, {payload}) => payload,

    [Branch.onChildrenChange]: (state, action) => ({
        isAuthorized: state.session
    })
}, pTypes.shape({
    sessionKey: pTypes.string,
    user_name: pTypes.string,
    user_id: pTypes.string,
    isAuth: pTypes.bool,
}));


const messageBranch = Branch({
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

const store = createStore(
    Branch({
        profile: profileBranch,
        message: messageBranch,
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