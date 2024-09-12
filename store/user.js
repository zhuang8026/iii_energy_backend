

const initialState = () => ({
  token: '',
  userId: '',
});

const state = () => (initialState());

const getters = {
  isLogin(state) {
    return !!state.token;
  },
};

const mutations = {
  SET_USER_DATA(state, { token, userId }) {
    state.token = '';
    state.token = token;
    state.userId = userId;
  },
  CLEAR_USER_DATA(state) {
    state.token = '';
    state.userId = '';
  },
};

const actions = {

};

export default {
  namespaced: true,
  state,
  getters,
  actions,
  mutations,
};
