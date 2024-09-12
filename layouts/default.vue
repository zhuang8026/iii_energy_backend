<template>
  <div class="wrapper">
    <el-menu class="header" v-show="!loginPage">
      <Logo />
      <div v-if="!loginPage" class="right">
        <div class="logout" @click.prevent="logout">
          <img :src="require('@/assets/img/header/icon-logout.svg')" alt="" />
          <p>登出</p>
        </div>
      </div>
    </el-menu>

    <main class="content">
      <el-row class="content-row">
        <div class="main-content" :class="loginPage ? 'main-content__login' : ''">
          <nuxt />
        </div>
      </el-row>
    </main>

    <footer>
      <div class="footer-text">
        版權所有 © 2022 經濟部能源局 隱私權及資訊宣告
      </div>
    </footer>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import backendApi from '@/assets/js/api/backendApi.js';
import Logo from '@/components/Logo';

export default {
  components: {
    Logo,
  },
  computed: {
    loginPage() {
      return this.$route.fullPath.includes('/login');
    },
    ntpc3Mode() {
      return this.$route.fullPath.includes('ntpc3');
    },
  },
  methods: {
    ...mapMutations('user', ['CLEAR_USER_DATA']),
    async logout() {
      const vm = this;

      const res = vm.ntpc3Mode ? await backendApi.managerLogout() : await backendApi.logout();
      if (res.code === 200) {
        vm.CLEAR_USER_DATA();
        vm.$router.push(`${vm.ntpc3Mode ? '/ntpc3/login' : '/login'}`);
        vm.$message.success('登出成功');
      }
    },
  },
};
</script>

<style scoped lang="scss">
$sidebar-width: 10.5rem;

.wrapper {
  position: relative;
  display: flex;
  flex: 1 1 auto;
  flex-direction: column;
  max-width: 100%;
  min-height: 100vh;
  backface-visibility: hidden;

  .header {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: $header-height;
    padding: 0 120px 0 90px;
    background-color: #fff;

    &::before,
    &::after {
      content: none;
    }

    .logout {
      position: absolute;
      right: 4rem;
      display: flex;
      align-items: center;
      font-weight: bold;
      font-size: 1.25rem;
      cursor: pointer;
    }

    .right {
      display: flex;
      align-items: center;
      color: #333;
    }
  }

  footer {
    right: 0;
    bottom: 0;
    left: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: $footer-height;
    background-color: #e8ecd8;

    .footer-text {
      position: relative;
      display: flex;
      justify-content: center;
      color: #333;
      font-size: 1rem;
      letter-spacing: 1.6px;
    }
  }

  .v-application {
    font-family: 'Noto Sans TC', 'Roboto', sans-serif;
  }

  .content {
    position: relative;
    flex: 1 1 auto;
    max-width: 100%;
    min-height: 100%;

    .content-row {
      display: flex;
      flex-wrap: nowrap;
      min-height: calc(100vh - 200px);
      overflow: hidden;

      .main-content {
        width: 100%;
        background-color: #e8ecd8;

        div {
          &:first-child {
            min-height: calc(100vh - #{$header-height} - #{$footer-height});
          }
        }

        &__login {
          div {
            &:first-child {
              min-height: calc(100vh - #{$footer-height});
            }
          }
        }
      }
    }
  }

  .footer-text {
    position: relative;
    color: #fff;

    span:nth-child(1),
    span:nth-child(4) {
      font-size: 14px;
    }

    span:nth-child(2),
    span:nth-child(5) {
      margin: 0 10px;
      font-size: 20px;
    }

    .dot {
      margin-right: 10px;
      font-size: 20px;
    }
  }
}
</style>
