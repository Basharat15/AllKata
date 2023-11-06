export const SET_COMPANY = "SET_COMPANY";

export const setCompany = (payload) => {
  return (dispatch) =>
    dispatch({
      type: SET_COMPANY,
      payload,
    });
};
