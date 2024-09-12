<template>
  <div class="admin" v-loading="loading">
    <w-layout>
      <block2 title="用戶查詢">
        <div class="filter-row">
          <div class="filter-col">
            <label>帳號</label>
            <el-input v-model="search.account" placeholder="請輸入" />
          </div>
          <div class="filter-col">
            <label>姓名</label>
            <el-input v-model="search.name" placeholder="請輸入" />
          </div>
          <div class="filter-col">
            <label>手機</label>
            <el-input v-model="search.phone" placeholder="請輸入" />
          </div>
          <div class="filter-col">
            <label>信箱</label>
            <el-input v-model="search.email" placeholder="請輸入" />
          </div>
          <div class="filter-col">
            <label>Gateway</label>
            <el-input v-model="search.gatewayId" placeholder="請輸入" />
          </div>
        </div>
        <div class="filter-row action">
          <div class="filter-col">
            <div class="action">
              <el-button @click="clear" class="btn-cancel-color">
                <img :src="require('@/assets/img/pages/device/icon-clear.svg')">清空
              </el-button>
              <el-button @click="getSearch" class="btn-main-color">
                <img :src="require('@/assets/img/pages/device/icon-search.svg')">查詢
              </el-button>
            </div>
          </div>
        </div>
      </block2>
      <block2 title="資料列表" style="margin-top: 1rem;">
        <template #action>
          <a class="btn-add-member btn-main-color" @click="openAddMemberDialog">新增用戶</a>
        </template>
        <div class="ui-table">
          <el-table :data="userData" stripe>
            <el-table-column width="300" prop="userName" label="帳號" />
            <el-table-column prop="password" label="密碼" />
            <el-table-column width="100" label="姓名">
              <template slot-scope="scope">
                {{ scope.row.name || '-' }}
              </template>
            </el-table-column>
            <el-table-column width="175" label="手機">
              <template slot-scope="scope">
                {{ scope.row.userPhone || '-' }}
              </template>
            </el-table-column>
            <el-table-column width="300" label="信箱">
              <template slot-scope="scope">
                {{ scope.row.email || '-' }}
              </template>
            </el-table-column>
            <el-table-column label="Gateway">
              <template slot-scope="scope">
                {{ scope.row.gatewayId || '-' }}
              </template>
            </el-table-column>
            <el-table-column width="125" label="操作">
              <template slot-scope="scope">
                <div class="button-container">
                  <a v-if="scope.row.belongNtpc === 'ntpc3'" class="btn-edit" @click="openEditDialog(scope.row)">
                    <img :src="require('@/assets/img/pages/device/icon-edit.svg')">
                  </a>
                  <span v-else>-</span>
                </div>
              </template>
            </el-table-column>
          </el-table>
        </div>
        <el-pagination
          :page-size="size"
          :current-page.sync="page"
          layout="prev, pager, next, jumper"
          :pager-count="7"
          :total="Number(totalElements)"
          @current-change="currentPageChange"
        />
      </block2>
    </w-layout>
    <bind-device-dialog
      v-model="showBindDeviceDialog"
      :device-list="deviceList"
      :device-info="deviceInfo"
      :user-name="selectedUserName"
      show-gateway
    />
    <add-member v-model="showAddMemberDialog" :device-list="deviceList" />
  </div>
</template>
<script>
import WLayout from '@/components/Layout';
import backendApi from '@/assets/js/api/backendApi.js';
import BindDeviceDialog from '@/components/BindDevice';
import Block2 from '@/components/Pages/Index/block2';

export default {
  meta: {
    ntpcMode: true,
  },
  components: {
    WLayout,
    BindDeviceDialog,
    Block2,
  },
  data() {
    return {
      search: {
        name: '', // 模糊搜尋
        phone: '', // 模糊搜尋
        gatewayId: '', // 模糊搜尋
        email: '', // 模糊搜尋
        account: '', // 模糊搜尋
      },
      searching: {
        name: '',
        phone: '',
        gatewayId: '',
        email: '',
        account: '',
      },

      selectedUserName: '',

      loading: false,
      userData: [],
      totalElements: 10,
      page: 1,
      size: 10,
      showBindDeviceDialog: false,
      showAddMemberDialog: false,
      deviceList: [],
      deviceInfo: [],
    };
  },
  mounted() {
    const vm = this;
    vm.getManagerList();
  },
  methods: {
    openEditDialog(row) {
      const vm = this;

      vm.selectedUserName = row.userName;

      Promise.all([vm.getDeviceList(), vm.getManagerInfo(row)]).then((res) => {
        if (res.some((e) => !e)) return;
        vm.showBindDeviceDialog = true;
      });
    },
    async getDeviceList() {
      const vm = this;
      const res = await backendApi.getDeviceList();
      if (res.code === 200) {
        vm.deviceList = [...res.data];
      } else if (res.code === 4011) {
        return false;
      }
      return true;
    },
    async getManagerInfo({ userName, belongNtpc }) {
      const vm = this;
      const obj = {
        userId: userName,
        ntpc: belongNtpc,
      };
      const res = await backendApi.getManagerInfo(obj);
      if (res.code === 200) {
        vm.deviceInfo = [...res.data];
      } else if (res.code === 4011) {
        return false;
      } else {
        vm.deviceInfo = [];
      }
      return true;
    },
    currentPageChange(val) {
      const vm = this;
      vm.page = val;
      vm.getManagerList();
    },
    async getManagerList() {
      const vm = this;
      vm.loading = true;
      const obj = {
        page: vm.page,
        size: vm.size,
        ...vm.searching,
      };
      const res = await backendApi.getManagerList(obj);
      if (res.code === 200) {
        vm.userData = [...res.data.content];
        vm.totalElements = res.data.totalElements;
      }
      vm.loading = false;
    },
    getSearch() {
      const vm = this;
      vm.page = 1;
      vm.searching = { ...vm.search };
      vm.getManagerList();
    },
    clear() {
      const vm = this;
      if (Object.keys(vm.search).every((key) => !vm.search[key])) return;
      Object.keys(vm.search).forEach((key) => {
        vm.search[key] = '';
      });
      vm.reset();
      vm.getManagerList();
    },
    reset() {
      const vm = this;
      Object.keys(vm.searching).forEach((key) => {
        vm.searching[key] = '';
      });
      vm.page = 1;
    },
    openAddMemberDialog() {
      const vm = this;

      vm.getDeviceList();
      vm.showAddMemberDialog = true;
    },
  },
};
</script>

<style lang="scss" scoped>
.admin {
  height: 100%;
  font-family: Noto Sans CJK TC, sans-serif;
}

.filter-row {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  margin-bottom: 0.9375rem;

  .filter-col {
    display: flex;
    flex: 0 1 19%;
    flex-direction: column;
  }

  &.action {
    text-align: right;

    .filter-col {
      flex: 0 1 19%;
      align-items: initial;
      margin-left: auto;
    }
  }
}

.btn-add-member {
  color: #3d482f;
  font-weight: bold;
  font-size: 1.1rem;
  cursor: pointer;

  &::before {
    margin-right: 0.2rem;
    color: #ebd73d;
    font-size: 1.5rem;
    content: '+';
  }
}

.btn-edit {
  cursor: pointer;
}
</style>
