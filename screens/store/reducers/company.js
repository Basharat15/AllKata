import { SET_COMPANY } from "../actions/company";

const INITIAL_STATE = {
  company: "",
};

const CompanyReducer = (state = INITIAL_STATE, actions) => {
  switch (actions.type) {
    case SET_COMPANY:
      return {
        ...state,
        company: actions.payload,
      };

    default:
      return state;
  }
};

export default CompanyReducer;
