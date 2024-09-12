import Api from '@/assets/js/api/api.js';
import qs from 'qs';
import helper from '@/assets/js/util/helper';

class BackendApi extends Api {
  /**
   * 登入
   */
  static async login({
    userId, userPwd,
  }) {
    const data = qs.stringify({
      userId, userPwd,
    });

    const res = await this.callAxios('POST', '/backstage/login', data, undefined, false);
    return res;
  }

  /**
   * 管理者登入
   */
  static async managerLogin({
    userId, userPwd,
  }) {
    // const data = qs.stringify({
    //   userId, userPwd,
    // });

    const formData = new FormData();
    formData.set('userId', userId);
    formData.set('userPwd', userPwd);

    const res = await this.callAxios('POST', '/backstage/manager-login', formData, undefined, false);
    return res;
  }

  /**
   * 登出
   */
  static async logout() {
    const res = await this.callAxios('GET', '/backstage/logout', undefined, undefined, true);
    return res;
  }

  /**
   * 管理者登出
   */
  static async managerLogout() {
    const res = await this.callAxios('GET', '/backstage/manager/logout', undefined, undefined, true);
    return res;
  }

  /**
   * 取得版本資訊列表
   */
  static async getVersionInfo({ page = 1, size = 10 }) {
    const res = await this.callAxios('GET', `/backstage/version-info?page=${page}&size=${size}`, undefined, undefined, true);
    return res;
  }

  /*
   * 新增版本資訊
   */
  static async addVersionInfo({
    description,
  }) {
    const formdata = new FormData();
    formdata.set('description', description);


    const res = await this.callAxios('POST', '/backstage/version-info/add', formdata, 'multipart/form-data', true);
    return res;
  }

  /*
   * 修改版本資訊
   */
  static async editVersionInfo({
    description, date,
  }) {
    const formdata = new FormData();
    formdata.append('description', description);
    formdata.append('date', date);


    const res = await this.callAxios('PATCH', '/backstage/version-info/edit', formdata, 'multipart/form-data', true);
    return res;
  }

  /*
   * 移除版本資訊
   */
  static async deleteVersionInfo({
    date,
  }) {
    const formdata = new FormData();
    formdata.set('date', date);


    const res = await this.callAxios('DELETE', '/backstage/version-info/delete', formdata, 'multipart/form-data', true);
    return res;
  }

  /**
   * 取得許願池所有留言
   */
  static async getWishingPond({
    page, size, startDate, endDate,
  }) {
    let url = '';
    if (startDate && endDate) {
      url = `/backstage/wishing-pond?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`;
    } else {
      url = `/backstage/wishing-pond?page=${page}&size=${size}`;
    }
    const res = await this.callAxios('GET', url, undefined, undefined, true);
    return res;
  }

  /**
   * 取得所有熱門節電話題
   */
  static async getTopics({
    page, size, startDate, endDate,
  }) {
    let url = '';
    if (startDate && endDate) {
      url = `/backstage/topics?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`;
    } else {
      url = `/backstage/topics?page=${page}&size=${size}`;
    }
    const res = await this.callAxios('GET', url, undefined, undefined, true);
    return res;
  }

  /*
   * 新增節電話題
   */
  static async addTopics({
    topicTitle, lineGroup, status,
  }) {
    const formdata = new FormData();
    formdata.set('topicTitle', topicTitle);
    formdata.set('lineGroup', lineGroup);
    formdata.set('status', status);


    const res = await this.callAxios('POST', '/backstage/topics', formdata, 'multipart/form-data', true);
    return res;
  }

  /*
   * 編輯節電話題
   */
  static async editTopics({
    id, topicTitle, lineGroup, status,
  }) {
    const formdata = new FormData();
    formdata.set('id', id);
    formdata.set('topicTitle', topicTitle);
    formdata.set('lineGroup', lineGroup);
    formdata.set('status', status);


    const res = await this.callAxios('PATCH', '/backstage/topics', formdata, 'multipart/form-data', true);
    return res;
  }

  /*
   * 刪除節電話題
   */
  static async deleteTopics({
    id,
  }) {
    const formdata = new FormData();
    formdata.set('id', id);

    const res = await this.callAxios('DELETE', '/backstage/topics', formdata, 'multipart/form-data', true);
    return res;
  }

  /**
   * 匯出許願池留言Excel
   */
  static async getWishingPondExcel({
    page, size, startDate, endDate,
  }) {
    let url = '';
    if (startDate && endDate) {
      url = `/backstage/wishing-pond/excel?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`;
    } else {
      url = `/backstage/wishing-pond/excel?page=${page}&size=${size}`;
    }
    const res = await this.callAxios('GET', url, undefined, undefined, true, 'arraybuffer');
    return res;
  }

  /**
   * 匯出節電話題留言Excel
   */
  static async getTopicExcel({
    page, size, startDate, endDate,
  }) {
    let url = '';
    if (startDate && endDate) {
      url = `/backstage/topics/excel?page=${page}&size=${size}&startDate=${startDate}&endDate=${endDate}`;
    } else {
      url = `/backstage/topics/excel?page=${page}&size=${size}`;
    }
    const res = await this.callAxios('GET', url, undefined, undefined, true, 'arraybuffer');
    return res;
  }

  /*
   * 刪除許願池留言
   */
  static async deleteWishingPond({
    id,
  }) {
    const formdata = new FormData();
    formdata.set('id', id);

    const res = await this.callAxios('DELETE', '/backstage/wishing-pond', formdata, 'multipart/form-data', true);
    return res;
  }

  /*
   * 編輯許願池留言狀態
   */
  static async editWishingPond({
    id, status,
  }) {
    const formdata = new FormData();
    formdata.set('id', id);
    formdata.set('status', status);


    const res = await this.callAxios('PATCH', '/backstage/wishing-pond', formdata, 'multipart/form-data', true);
    return res;
  }

  /*
   * 取得用戶資料
   */
  static async getUserInfo({
    page, size, sortColumn, isDescending, searchContent,
  }) {
    const res = await this.callAxios('GET', `/backstage/user-info/page?page=${page}&size=${size}&sortColumn=${sortColumn}&isDescending=${isDescending}&searchContent=${searchContent}`, undefined, undefined, true);
    return res;
  }

  /**
   * 忘記密碼 - 發送要求
   */
  static async passwordForget(mail) {
    const data = qs.stringify({
      mail,
    });
    const res = await this.callAxios('POST', '/backstage/password-forget', data, undefined, false);
    return res;
  }

  /*
   * 忘記密碼 - 修改密碼
   */
  static async restPassword({
    userId, code, newPassword, reNewPassword,
  }) {
    const formdata = new FormData();
    formdata.set('userId', userId);
    formdata.set('code', code);
    formdata.set('newPassword', newPassword);
    formdata.set('reNewPassword', reNewPassword);


    const res = await this.callAxios('PATCH', '/backstage/password-forget-reset', formdata, undefined, false);
    return res;
  }

  /*
   *取得週報紀錄EXCEL
   */
  static async getWeeklyExcel({ startMonth, endMonth }) {
    const data = {
      startMonth,
      endMonth,
    };
    const str = helper.jsonToQueryString(data);
    const res = await this.callAxios('GET', `/backstage/report-send/excel${str}`, undefined, undefined, true, 'arraybuffer');
    return res;
  }

  /*
   * 取得用戶登入次數圓餅圖
   */
  static async getLoginPieChart() {
    const res = await this.callAxios('GET', '/backstage/login-status/pie-chart', undefined, undefined, true);
    return res;
  }

  /**
   * 取得週報紀錄列表
   */
  static async getWeeklyList({ month, page, size }) {
    const res = await this.callAxios('GET', `/backstage/report-send/page?month=${month}&page=${page}&size=${size}`, undefined, undefined, true);
    return res;
  }

  /*
   * 取得連線狀態圓餅圖
   */
  static async getConnectionPieChart() {
    const res = await this.callAxios('GET', '/backstage/connection-status/pie-chart', undefined, undefined, true);

    return res;
  }

  /**
   * 取得登入記錄統計EXCEL
   */
  static async getLoginRecordExcel({ startDate, endDate }) {
    const data = {
      startDate,
      endDate,
    };
    const str = helper.jsonToQueryString(data);
    const res = await this.callAxios('GET', `/backstage/data-download/statistics-login${str}`, undefined, undefined, true, 'arraybuffer');
    return res;
  }

  /*
   * 取得斷線列表
   */
  static async getDisconnectionList({ page, size }) {
    const res = await this.callAxios('GET', `/backstage/connection-status/disconnected/page?page=${page}&size=${size}`, undefined, undefined, true);

    return res;
  }

  /**
   * 取得用電統計EXCEL
   */
  static async getPowerRecordExcel({ startMonth, endMonth }) {
    const data = {
      startMonth,
      endMonth,
    };
    const str = helper.jsonToQueryString(data);
    const res = await this.callAxios('GET', `/backstage/data-download/statistics-usage${str}`, undefined, undefined, true, 'arraybuffer');
    return res;
  }

  /**
   * 節電建議回饋
   */
  static async downloadAdvice({ startMonth, endMonth }) {
    const data = {
      startMonth,
      endMonth,
    };
    const str = helper.jsonToQueryString(data);
    const res = await this.callAxios('GET', `/backstage/data-download/advice${str}`, undefined, undefined, true, 'arraybuffer');
    return res;
  }

  /**
   * 異常/警示統計回饋
   */
  static async downloadError({ startMonth, endMonth }) {
    const data = {
      startMonth,
      endMonth,
    };
    const str = helper.jsonToQueryString(data);
    const res = await this.callAxios('GET', `/backstage/data-download/statistics-error${str}`, undefined, undefined, true, 'arraybuffer');
    return res;
  }

  /**
   * 取得斷線列表 EXCEL
   */
  static async getDisconnectionExcel() {
    const res = await this.callAxios('GET', '/backstage/connection-status/disconnected/excel', undefined, undefined, true, 'arraybuffer');
    return res;
  }

  /**
   * 取得用戶設備清單
   */
  static async getItemList() {
    const res = await this.callAxios('GET', '/backstage/data-download/appliance', undefined, undefined, true, 'arraybuffer');
    return res;
  }

  /**
   * 用戶資料下載
   */
  static async downloadUserInfo() {
    const res = await this.callAxios('GET', '/backstage/data-download/user-info', undefined, undefined, true, 'arraybuffer');
    return res;
  }

  /*
   * 變更密碼
   */
  static async changePassword({
    oldPassword, newPassword, reNewPassword,
  }) {
    const data = qs.stringify({
      oldPassword, newPassword, reNewPassword,
    });
    const res = await this.callAxios('PATCH', '/backstage/password-reset', data, undefined, true);
    return res;
  }

  /**
   * 取得問卷填寫人數
   */
  static async getSurveyNumber() {
    const res = await this.callAxios('GET', '/backstage/survey', undefined, undefined, true);
    return res;
  }

  /**
   * 取得問卷填寫紀錄
   */
  static async getSurvey({
    page, size, searchText,
  }) {
    let url = '';
    if (searchText) {
      url = `/backstage/survey/page?page=${page}&size=${size}&searchText=${searchText}`;
    } else {
      url = `/backstage/survey/page?page=${page}&size=${size}`;
    }
    const res = await this.callAxios('GET', url, undefined, undefined, true);
    return res;
  }

  /**
   * 問卷統計Excel
   */
  static async getSurveyExcel({
    page, size, searchText,
  }) {
    let url = '';
    if (searchText) {
      url = `/backstage/survey/excel?page=${page}&size=${size}&searchText=${searchText}`;
    } else {
      url = `/backstage/survey/excel?page=${page}&size=${size}`;
    }
    const res = await this.callAxios('GET', url, undefined, undefined, true, 'arraybuffer');
    return res;
  }

  /**
   * 寄送週、月報排程設定
   */
  static async editSchedule({
    reportType, weeklyCron, MonthlyCron,
  }) {
    const formdata = new FormData();
    formdata.set('reportType', reportType);
    if (weeklyCron) {
      formdata.set('weeklyCron', weeklyCron);
    }
    if (MonthlyCron) {
      formdata.set('MonthlyCron', MonthlyCron);
    }
    const res = await this.callAxios('PATCH', '/backstage/report-corn', formdata, undefined, true);
    return res;
  }

  /**
   * 電器下拉選單
  */
  static async getDeviceList() {
    const res = await this.callAxios('GET', '/main/device-list', null, undefined, false);
    return res;
  }

  /**
   * 取得管理者用戶列表
   */
  static async getManagerList({
    page = 1, size = 10, name, phone, gatewayId, email, account,
  }) {
    // const nameStr = name ? `&name=${name}` : '';
    // const phoneStr = phone ? `&phone=${phone}` : '';
    // const gatewayIdStr = gatewayId ? `&gatewayId=${gatewayId}` : '';
    // const emailStr = email ? `&email=${email}` : '';
    // const accountStr = account ? `&account=${account}` : '';
    // const paramStr = `${nameStr}${phoneStr}${gatewayIdStr}${emailStr}${accountStr}`;
    // const res = await this.callAxios('GET', `/backstage/manager/page?page=${page}&size=${size}${paramStr}`, undefined, undefined, true);

    const formdata = new FormData();
    formdata.set('page', page);
    formdata.set('size', size);
    formdata.set('name', name);
    formdata.set('phone', phone);
    formdata.set('gatewayId', gatewayId);
    formdata.set('email', email);
    formdata.set('account', account);
    const res = await this.callAxios('POST', '/backstage/manager/page', formdata, undefined, true);

    return res;
  }

  /**
   * 取得用戶綁定設備資料
  */
  static async getManagerInfo({ userId, ntpc }) {
    const res = await this.callAxios('GET', `/backstage/manager/info?userId=${userId}&ntpc=${ntpc}`, null, undefined, true);
    return res;
  }

  /*
   * 綁定電器
   */
  static async bindDevice({
    ammeterList, appIdList, socketList, gatewayId, userId,
  }) {
    const formdata = new FormData();

    Object.entries({
      ammeterList, appIdList, socketList, gatewayId, userId, ntpc: 'ntpc3',
    }).forEach(([key, value]) => {
      formdata.set(key, value);
    });

    const res = await this.callAxios('PATCH', '/backstage/manager/edit', formdata, undefined, true);
    return res;
  }

  /**
   * 註冊
   */
  static async register({
    username, name, password, checkPassword, area, community, summaryList, deviceList, socketList, gatewayId,
  }) {
    const formdata = new FormData();

    Object.entries({
      username, name, password, checkPassword, area, community, summaryList, deviceList, socketList, gatewayId,
    }).forEach(([key, value]) => {
      if (value && value.constructor.name === 'Array') {
        if (value?.length) {
          formdata.set(key, value);
        }
      } else if (value) {
        formdata.set(key, value);
      }
    });

    const res = await this.callAxios('POST', '/backstage/manager/register', formdata, undefined, true);
    return res;
  }

  /*
   * 取得用戶資料
  */
  static async getUserDataList({
    page, size, searchContent, belongNtpc,
  }) {
    let query = '';
    Object.entries({
      page, size, searchContent, belongNtpc,
    }).forEach(([key, value]) => {
      if (value || (!value && value === 0)) {
        query += (`${key}=${value}&`);
      }
    });

    const res = await this.callAxios('GET', `/backstage/user-info/page?${query}`, undefined, undefined, true);
    return res;
  }
}

export default BackendApi;
