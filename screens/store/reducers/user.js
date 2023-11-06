import { SET_USER } from "../actions/user";

const INITIAL_STATE = {
  user: {},
};

const UserReducer = (state = INITIAL_STATE, actions) => {
  switch (actions.type) {
    case SET_USER:
      return {
        ...state,
        user: actions.payload,
      };

    default:
      return state;
  }
};

export default UserReducer;
