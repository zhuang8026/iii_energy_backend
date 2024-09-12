<template>
  <div class="home"  v-loading="loading">
    <div class="chart-info">
      <Block class="chart">
        <h2>用戶連線狀態</h2>
        <p>更新時間 {{connectionUpdateTime}}</p>
        <div id="connection-status" />
        <div class="label-container">
          <div class="label-item">
            <div>連線</div>
            <span>{{ threeDigit(connectionPieData.loginNumber) }}</span>
            <div>戶</div>
          </div>
          <div class="label-item">
            <div>離線</div>
            <span>{{ threeDigit(connectionPieData.logoutNumber) }}</span>
            <div>戶</div>
          </div>
        </div>
      </Block>

      <Block class="chart">
        <h2>用戶登入次數</h2>
        <p>更新時間 {{loginUpdateTime}}</p>
        <div id="login-num" />
        <div class="label-container">
          <div class="label-item">
            <div>本月</div>
            <span>{{ threeDigit(loginPieData.monthLoginNumber) }}</span>
            <div>次</div>
          </div>
          <div class="label-item">
            <div>昨日</div>
            <span>{{ threeDigit(loginPieData.yesterdayLoginNumber) }}</span>
            <div>次</div>
          </div>
        </div>
      </Block>

      <Block class="user-data">
        <h2>用戶列表</h2>
        <div class="action">
          <el-select
            placeholder="請選擇NTPC"
            v-model="userData.belongNtpc"
            @change="search()"
          >
            <el-option
              v-for="(ntpc, index) in ntpcList"
              :key="index"
              :label="ntpc.label"
              :value="ntpc.value"
            />
          </el-select>
          <el-input type="text" v-model="userData.searchContent" prefix-icon="el-icon-search" placeholder="請搜尋" @blur="search()" @clear="search()" clearable />
        </div>
        <el-table :data="userData.list" stripe>
          <el-table-column label="姓名" prop="name">
            <template slot-scope="scope">
              {{ scope.row.name || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="電子郵件" prop="userId" width="350">
            <template slot-scope="scope">
              {{ scope.row.userId || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="社區" prop="community">
            <template slot-scope="scope">
              {{ scope.row.community || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="行政區" prop="area">
            <template slot-scope="scope">
              {{ scope.row.area || '-' }}
            </template>
          </el-table-column>
          <el-table-column label="說明" prop="note">
            <template slot-scope="scope">
              {{ scope.row.note || '-' }}
            </template>
          </el-table-column>
        </el-table>
        <el-pagination
          :page-size="userData.size"
          :current-page.sync="userData.page"
          layout="prev, pager, next, jumper"
          :total="Number(userData.totalElements)"
          @current-change="handleUserDataPageChange"
        />
      </Block>
    </div>
    <el-dialog
      title="用戶斷線狀況表單"
      :visible.sync="userDisconnectionStatus"
      v-loading="loading"
      class="disconnection-status"
      :before-close="closeDialog"
    >
      <el-table :data="disconnectionData" style="width: 100%;">
        <el-table-column prop="userId" label="用戶ID" />
        <el-table-column prop="updatetime" label="GW上次回傳資料" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-pagination
        layout="prev, pager, next"
        :total="totalElements"
        :page-size="size"
        :current-page.sync="currentPage"
        @current-change="handleCurrentChange"
      >
      </el-pagination>
      <el-button @click="getDisconnectionExcel">下載</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import backendApi from '@/assets/js/api/backendApi.js';
import helper from '@/assets/js/util/helper';
import Block from '@/components/Pages/Index/block';
import { mapMutations } from 'vuex';

const echarts = require('echarts');

export default {
  components: {
    Block,
  },
  data() {
    return {
      loading: false,
      userDisconnectionStatus: false,
      // 斷線狀況表
      disconnectionData: [
      ],
      // 斷線狀況表頁數
      userData: {
        page: 1,
        size: 8,
        totalElements: 0,
        list: [],
        searchContent: '',
        belongNtpc: null,
      },
      totalPages: 1,
      totalElements: 0,
      currentPage: 1,
      size: 20,
      connectionChart: null,
      loginChart: null,
      loginPieData: {}, // 登入次數資料
      loginUpdateTime: '', // 登入次數更新時間
      connectionPieData: {}, // 連線狀態資料
      connectionUpdateTime: '', // 連線狀態更新時間
      ntpcList: [
        {
          label: '全部',
          value: null,
        },
        {
          label: 'NTPC0',
          value: 0,
        },
        {
          label: 'NTPC1',
          value: 1,
        },
        {
          label: 'NTPC2',
          value: 2,
        },
        {
          label: 'NTPC3',
          value: 3,
        },
      ],
    };
  },
  async mounted() {
    const vm = this;
    await Promise.all([vm.getLoginPieChartData(), vm.getConnectionPieChartData(), vm.getUserDataList()]);
  },
  methods: {
    ...mapMutations('user', ['CLEAR_USER_DATA']),
    threeDigit(val) {
      if (!val) return '000';
      const numArray = String(val).split('');
      if (numArray.length > 2) return val;
      if (numArray.length === 2) return `0${val}`;
      if (numArray.length === 1) return `00${val}`;
      return '000';
    },
    // 連線狀態圓餅圖
    connectionPie(id) {
      const vm = this;
      vm.connectionChart = echarts.init(document.getElementById(id));
      vm.connectionChart.setOption({
        color: ['#4FB233', '#D9DC8F'] /* 圓餅圖的颜色 */,
        series: [
          {
            type: 'pie', // 圓餅圖
            center: ['50%', '50%'], // 顯示位置
            radius: ['40%', '70%'],
            name: '',
            itemStyle: {
              borderRadius: 580,
              borderColor: '#fff',
              borderWidth: 10,
            },

            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            data: [
              {
                value: Object.keys(vm.connectionPieData).length ? vm.connectionPieData.loginNumber : '',
                name: '連線',
              },
              {
                value: Object.keys(vm.connectionPieData).length ? vm.connectionPieData.logoutNumber : '',
                name: '離線',
              },
            ],
          },
        ],
      });
      vm.connectionChart.on('click', vm.openDisconnectDialog);
    },
    // 登入次數圓餅圖
    loginPie(id) {
      const vm = this;
      vm.loginChart = echarts.init(document.getElementById(id));
      vm.loginChart.setOption({
        color: ['#4FB233', '#D9DC8F'] /* 圓餅圖的颜色 */,
        series: [
          {
            type: 'pie', // 圓餅圖
            center: ['50%', '50%'], // 顯示位置
            radius: ['40%', '70%'],
            name: '',
            itemStyle: {
              borderRadius: 580,
              borderColor: '#fff',
              borderWidth: 10,
            },

            avoidLabelOverlap: false,
            label: {
              show: false,
            },
            data: [
              {
                value: Object.keys(vm.loginPieData).length ? vm.loginPieData.monthLoginNumber : '',
                name: '本月',
              },
              {
                value: Object.keys(vm.loginPieData).length ? vm.loginPieData.yesterdayLoginNumber : '',
                name: '昨日',
              },
            ],
          },
        ],
      });
    },
    // 取得登入次數圓餅圖資料
    async getLoginPieChartData() {
      const vm = this;
      const res = await backendApi.getLoginPieChart();
      if (res.code === 200) {
        // console.log('GET PIE');
        vm.loginPieData = res.data;
        vm.loginUpdateTime = helper.transformTime(res.data.updateDate, 1);
      }
      vm.loginPie('login-num');
    },
    // 取得連線狀態圓餅圖資料
    async getConnectionPieChartData() {
      const vm = this;
      vm.loading = true;
      const res = await backendApi.getConnectionPieChart();
      if (res.code === 200) {
        // console.log('GET CONNECTION PIE');
        vm.connectionPieData = res.data;
        vm.connectionUpdateTime = helper.transformTime(res.data.updateDate, 1);
      }
      vm.connectionPie('connection-status');
      vm.loading = false;
    },

    openDisconnectDialog() {
      const vm = this;
      vm.userDisconnectionStatus = true;
      vm.getDisconnectionList(vm.currentPage);
    },

    // 取得斷線列表
    async getDisconnectionList(page) {
      const vm = this;
      vm.loading = true;
      const obj = {
        page,
        size: vm.size,
      };
      const res = await backendApi.getDisconnectionList(obj);
      if (res.code === 200) {
        // console.log('GET DisconnectionList');
        res.data.content.forEach((item) => {
          item.updatetime = helper.transformTime(item.updatetime, 1);
        });
        vm.disconnectionData = res.data.content;
        vm.totalElements = res.data.totalElements;
        vm.totalPages = res.data.totalPages;
      }
      vm.loading = false;
    },
    // 分頁切換
    handleCurrentChange(page) {
      const vm = this;
      vm.currentPage = page;
      vm.getDisconnectionList(vm.currentPage);
    },
    handleUserDataPageChange(page) {
      const vm = this;

      vm.userData.page = page;
      vm.getUserDataList();
    },
    closeDialog(done) {
      const vm = this;
      vm.currentPage = 1;
      done();
    },

    // 取得斷線列表Excel
    async getDisconnectionExcel() {
      const res = await backendApi.getDisconnectionExcel();
      if (res) {
        const a = document.createElement('a');
        const blob = new Blob([res], { type: 'application/excel' });
        a.href = window.URL.createObjectURL(blob);
        a.download = '用戶斷線狀況表.xlsx';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
      }
    },
    async getUserDataList() {
      const vm = this;

      const res = await backendApi.getUserDataList({
        page: vm.userData.page, size: vm.userData.size, searchContent: vm.userData.searchContent, belongNtpc: vm.userData.belongNtpc,
      });
      if (res.code === 200) {
        vm.userData.list = [...res.data.content];
        vm.userData.totalElements = res.data.totalElements;
      }
    },
    search() {
      const vm = this;

      vm.userData.page = 1;
      vm.getUserDataList();
    },
  },
};
</script>
<style lang="scss" scoped>
.home {
  position: relative;
  width: 80%;
  height: 100%;
  margin: 0 auto;
  padding: 2rem 0 0;

  /** 圖表區 */
  .chart-info {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;

    .chart {
      flex: calc(50% - 1rem);

      h2 {
        margin-top: 1.5rem;
        text-align: center;
      }

      #connection-status,
      #login-num {
        width: 11rem;
        height: 11rem;
        overflow: hidden;
      }

      p {
        color: #7a7a7a;
        font-size: 0.875rem;
        font-family: Noto Sans CJK TC, sans-serif;
        letter-spacing: 0.05rem;
      }
    }
  }

  .label {
    &-container {
      display: flex;
      gap: 4rem;
      margin-bottom: 2rem;
    }

    &-item {
      position: relative;
      display: flex;
      gap: 1rem;
      align-items: center;
      font-size: 1.5rem;

      span {
        font-weight: bold;
        font-size: 2rem;
      }

      &:first-child {
        span {
          color: #4fb233;
        }

        &::before {
          position: absolute;
          right: -2rem;
          width: 1px;
          height: 100%;
          background-color: #333;
          content: '';
        }
      }

      &:last-child {
        span {
          color: #d9dc8f;
        }
      }
    }
  }

  /** dialog */
  /deep/ .el-dialog {
    width: 40rem;

    .el-button:nth-child(1) {
      border-color: #ffd081;
      background-color: #ffd081;

      &:hover {
        border-color: #ffa103;
        background-color: #ffa103;
      }
    }
  }

  .user-data {
    position: relative;
    padding: 1rem;

    h2 {
      margin-top: 0.6rem;
      margin-bottom: 1rem;
    }

    .action {
      position: absolute;
      top: 1.5rem;
      right: 1rem;
      display: flex;
      gap: 1rem;

      /deep/ .el-select {
        width: 100%;
      }

      /deep/ input {
        height: 2rem;
        border-radius: 1.5rem;
        font-size: 0.8rem;
      }

      /deep/ .el-input__icon {
        color: $btn-main-color;
        line-height: 2rem;
      }
    }
  }

  /deep/ .disconnection-status {
    thead {
      .cell {
        color: #4fb233;
      }
    }

    .el-pagination {
      margin-top: 0.5rem;
      margin-right: 1rem;
      margin-bottom: 1.5rem;
    }
  }
}

@media screen and(max-width: 1500px) {
  .home {
    .container {
      padding: 5rem 0 9rem;
    }

    .chart-info {
      grid-template-rows: repeat(2, 19.55rem);
      grid-template-columns: repeat(1, 30rem);

      .chart {
        h2 {
          margin-top: 0.7rem;
        }
      }
    }
  }
}

@media screen and (max-width: 1200px) {
  .home {
    .chart-info {
      grid-template-columns: repeat(1, 25rem);
    }
  }
}
</style>
