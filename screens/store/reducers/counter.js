import { APP_LOADER_ACTION_TYPES } from "../actions/action";

const initialState = {
  loading: false,
};

const loadingReducer = (state = initialState, action) => {
  switch (action.type) {
    case APP_LOADER_ACTION_TYPES.APP_LOADING:
      return {
        ...state,
        loading: action.payload,
      };
    default:
      return state;
  }
};

export default loadingReducer;
