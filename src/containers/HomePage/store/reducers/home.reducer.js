import * as Actions from '../actions/home.action';

const initialState = {
  metricsFile: [],
};

const homeReducer = function (state = initialState, action) {
  switch (action.type) {
    case Actions.GET_JSON_FILE: {
      console.log("action.payload", action.payload);
      return {
        ...state,
        metricsFile: action.payload
      };
    }
    default: {
      return state;
    }
  }
};

export default homeReducer;
