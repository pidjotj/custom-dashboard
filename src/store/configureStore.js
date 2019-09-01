import thunk from 'redux-thunk';
import { createStore, applyMiddleware, compose } from 'redux';
import createReducer from './reducers';

export default function configureStore(initialState = {}) {
    const middlewares = [thunk];
    const enhancers = [applyMiddleware(...middlewares)];
    const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

    const store = createStore(createReducer(), initialState, composeEnhancers(...enhancers));

    store.asyncReducers = {};
    return store;
}


