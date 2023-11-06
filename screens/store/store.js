import { applyMiddleware, combineReducers, createStore, compose } from "redux";
import thunk from "redux-thunk";
import { RootReducer } from "./reducers/index";
export const store = createStore(RootReducer, compose(applyMiddleware(thunk)));
