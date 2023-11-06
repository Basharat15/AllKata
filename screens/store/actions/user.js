export const SET_USER = "SET_USER";

export const setUser = (payload) => {
  return (dispatch) =>
    dispatch({
      type: SET_USER,
      payload,
    });
};
