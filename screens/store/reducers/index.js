import { combineReducers } from "redux";
import loadingReducer from "./counter";
import UserReducer from "./user";
import CompanyReducer from "./company";

const reducers = combineReducers({
  loading: loadingReducer,
  userReducer: UserReducer,
  companyReducer: CompanyReducer,
});

export const RootReducer = (state, action) => {
  //Reset Global state
  // if (action.type === '[Auth] LOGOUT_USER') {
  //   return reducers(undefined, action);
  // }

  return reducers(state, action);
};
