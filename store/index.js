import createPersistedState from 'vuex-persistedstate';

const plugins = [
  createPersistedState({
    key: 'TAIPOWER-BACKEND',
    reducer(val) {
      return {
        user: val.user,
      };
    },
  }),
];

export default {
  plugins,
};
