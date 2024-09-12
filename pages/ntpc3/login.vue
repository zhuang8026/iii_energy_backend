<template>
  <div class="login" v-loading.fullscreen.lock="loading">
    <div class="logo-container">
      <Logo />
    </div>
    <div class="login-bg">
      <div class="login-form">
        <h2 class="title">
          用戶設備綁定控制台
        </h2>
        <el-form
          ref="loginForm"
          :model="loginForm"
          :rules="rules"
          label-width="100px"
          class="demo-ruleForm"
          :before-close="closeEdit"
        >
          <el-form-item prop="account" margin-left="0">
            <el-input v-model="loginForm.account" placeholder="請輸入帳號" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              v-model="loginForm.password"
              placeholder="請輸入密碼"
              show-password
            />
          </el-form-item>
          <el-form-item>
            <el-button class="btn" @click="validateForm('loginForm')">
              登&ensp;入
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import backendApi from '@/assets/js/api/backendApi.js';
import { mapMutations } from 'vuex';

export default {
  meta: {
    ntpcMode: true,
  },
  data: () => ({
    loading: false,
    loginForm: {
      account: '',
      passsword: '',
    },
    rules: {
      account: [
        {
          required: true,
          message: '請輸入帳號',
          trigger: 'blur',
        },
      ],
      password: [
        {
          required: true,
          message: '請輸入密碼',
          trigger: 'blur',
        },
      ],
    },
    email: '',
    showDialog: false, // 忘記密碼彈窗
    forgetPasswordError: false,
  }),
  computed: {},
  methods: {
    ...mapMutations('user', ['SET_USER_DATA']),
    validateForm(formName) {
      const vm = this;
      vm.$refs[formName].validate((valid) => {
        if (valid) {
          vm.login();
        }
      });
    },
    async login() {
      const vm = this;
      const data = {
        userId: vm.loginForm.account,
        userPwd: vm.loginForm.password,
      };
      vm.loading = true;
      const res = await backendApi.managerLogin(data);
      if (res.code === 200) {
        vm.SET_USER_DATA(res.data);
        vm.$router.push('/ntpc3');
        vm.$message.success('登入成功');
      }
      vm.loading = false;
    },
    // 關問卷之前資料重置
    closeEdit(done) {
      const vm = this;
      vm.$refs.loginFormForm.resetFields();
      done();
    },
    validateEmail() {
      const vm = this;
      if (!vm.email) {
        vm.forgetPasswordError = true;
        return false;
      }
      vm.forgetPasswordError = false;

      return true;
    },
    closeResetPassword() {
      const vm = this;
      vm.email = '';
      vm.showDialog = false;
    },
    async resetPassword() {
      const vm = this;
      if (vm.validateEmail()) {
        vm.loading = true;
        const res = await backendApi.passwordForget(vm.email);
        if (res.code === 200) {
          vm.loading = false;
          vm.$message({
            message: '已發送信件，請於48小時內查看',
            type: 'success',
          });

          vm.showDialog = false;
        } else {
          vm.loading = false;
        }
      }
    },
  },
};
</script>
<style scoped lang="scss">
.login {
  padding-top: 7rem;

  .login-bg {
    position: relative;
    width: 33rem;
    margin: 0 auto;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 7px 7px 7px #00000029;
  }

  .login-form {
    width: 30rem;
    margin: 0 auto;
    padding: 2rem 0 0.5rem;
  }

  .title {
    margin-bottom: 2rem;
    color: #333;
    font-size: 1.625rem;
    text-align: center;
  }

  /* 表單 */
  /deep/ .el-form-item {
    display: flex;
    align-items: center;
  }

  /deep/ .el-form-item__label {
    flex-basis: 15%;
    padding: 0;
    color: #333;
    font-weight: bolder;
    font-size: 1.25rem;
    text-align: left;
  }

  /deep/ .el-form-item__label::before {
    display: none;
  }

  /deep/ .el-input {
    position: relative;
    width: 100%;
  }

  /deep/ .el-input__inner {
    height: 3.125rem;
    padding: 0 1.5rem;
    border: 1px solid #b5b5b5;
    font-size: 1rem;
    line-height: 3.125rem;
    letter-spacing: 0.1rem;
  }

  /deep/ .el-form-item__content {
    flex-basis: 100%;
    margin-left: 0 !important;
  }

  .mark {
    span {
      color: #333;
      font-size: 0.875rem;
      letter-spacing: 0.1rem;
    }
  }

  .btn {
    width: 100%;
    //padding: 1rem 0.75rem;
    border-color: $btn-main-color;
    color: #fff;
    font-size: 1.125rem;
    background-color: $btn-main-color;
    transition: 0.3s;

    &:hover {
      border-color: $btn-main-color-hover;
      background-color: $btn-main-color-hover;
    }
  }
}

.logo-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
}
</style>
