import axios from 'axios';

// 加入loading的動畫
axios.interceptors.request.use((request) => {
  window.$nuxt.$emit('loading', request.headers.Loading);
  return request;
}, (error) => Promise.reject(error));

axios.interceptors.response.use((response) => {
  const res = response.data;
  if (res.code !== 200) {
    if (res.code === 411
      || res.code === 412
      || res.code === 413
      || res.code === 414
      || res.code === 415
      || res.code === 416
      || res.code === 417
      || res.code === 418
      || res.code === 419
      || res.code === 420
      || res.code === 421
      || res.code === 4000
      || res.code === 4001
      || res.code === 4002
      || res.code === 4011
    ) {
      window.$nuxt.$store.commit('user/CLEAR_USER_DATA');
      if (window.$nuxt.$route.fullPath.includes('ntpc3')) {
        window.$nuxt.$router.push('/ntpc3/login');
      } else if (window.$nuxt.$route.name !== 'login') {
        window.$nuxt.$router.push('/login');
      }
    } else if (res.code === 5507 || res.code === 5510 || res.code === 5503) {
      window.$nuxt.$message({
        message: res.message,
        type: 'error',
      });
    }
  }

  window.$nuxt.$emit('loading', false);
  return response;
});


class Api {
  static SERVER = process.env.API_BASE;

  static TOKEN;

  static async callAxios(method, url, params, contentType, auth, responseType) {
    const headers = {};

    headers['Content-Type'] = contentType || 'application/x-www-form-urlencoded';

    if (auth) {
      const { token } = window.$nuxt.$store.state.user;

      headers.Authorization = `Bearer ${token}`;
    }
    const responseTypeText = responseType || 'json';

    try {
      const { status, data } = await axios({
        headers,
        method,
        url: this.SERVER + url,
        data: params,
        responseType: responseTypeText,
      });
      return new Promise((resolve, reject) => {
        if (status === 200) {
          resolve(data);
        } else {
          reject(new Error(''));
          this.$message.error(data.message);
        }
      });
    } catch (error) {
      return error;
    }
  }
}

export default Api;
