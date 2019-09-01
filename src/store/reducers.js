import { combineReducers } from 'redux';
import homeReducer from '../containers/HomePage/store/reducers/home.reducer';

export default function createReducer() {
    const rootReducer = combineReducers({
        metricsReducer: homeReducer,
    });
    return rootReducer;
}
