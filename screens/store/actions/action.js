export const APP_LOADER_ACTION_TYPES = {
  APP_LOADING: "APP_LOADING",
};

export const setAppLoading = (payload) => {
  return (dispatch) => {
    return dispatch({
      type: APP_LOADER_ACTION_TYPES.APP_LOADING,
      payload,
    });
  };
};
