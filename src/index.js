import React from "react";
import ReactDOM from "react-dom";
import "./styles/index.css";
import App from '../src/containers/App'
import { Provider } from 'react-redux';
import * as serviceWorker from "./serviceWorker";
import 'bootstrap/dist/css/bootstrap.css';

import configureStore from './store/configureStore';

const initialState = {};
const store = configureStore(initialState);
const MOUNT_NODE = document.getElementById('app');

const render = () => {
    ReactDOM.render(
        <Provider store={store}>
            <App/>
        </Provider>,
        document.getElementById("root")
    );
};

// if (module.hot) {
//     // Hot reloadable React components and translation json files
//     // modules.hot.accept does not accept dynamic dependencies,
//     // have to be constants at compile-time
//     module.hot.accept(['containers/App/'], () => {
//         ReactDOM.unmountComponentAtNode(MOUNT_NODE);
//         render();
//     });
// }
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();

render();
