import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';

class Helper {
  static generateRandomString(length) {
    let result = '';
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  }

  static transformTime(timestamp, type = 0) {
    dayjs.extend(utc);
    if (!type) {
      return dayjs.utc(timestamp).format('YYYY-MM-DD');
    } if (type === 1) {
      return dayjs.utc(timestamp).format('YYYY-MM-DD HH:mm:ss');
    }
    return true;
  }

  static jsonToQueryString(json) {
    return `?${Object.keys(json).map((key) => (json[key] !== null && json[key] !== undefined && json[key] !== '' ? `${key}=${json[key]}` : '')).filter((el) => el !== '').join('&')}`;
  }
}

export default Helper;
