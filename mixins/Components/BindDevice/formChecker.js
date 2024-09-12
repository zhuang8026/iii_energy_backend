export default {
  methods: {
    checkPassword(rule, value, callback) {
      const vm = this;

      if (!vm.ruleForm.password || !vm.ruleForm.checkPassword) {
        return callback(new Error('請確認密碼填寫正確'));
      }

      return callback();
    },
    checkAccount(rule, value, callback) {
      const vm = this;

      if (!vm.ruleForm.account) {
        return callback(new Error('帳號尚未填寫'));
      }

      return callback();
    },
    checkName(rule, value, callback) {
      const vm = this;

      if (!vm.ruleForm.name) {
        return callback(new Error('帳號尚未填寫'));
      }

      return callback();
    },
    checkAmmeter(rule, value, callback) {
      const vm = this;
      if (!vm.ruleForm.ammeter.ammeter1 || !vm.ruleForm.ammeter.ammeter2) {
        return callback(new Error('總表ID尚未填寫完畢'));
      }
      return callback();
    },
    checkDevice(rule, value, callback) {
      const vm = this;
      if (!vm.ruleForm.device.device1 || !vm.ruleForm.device.device2 || !vm.ruleForm.device.device3) {
        return callback(new Error('電器尚未選擇完畢'));
      }
      return callback();
    },
    checkSlot(rule, value, callback) {
      const vm = this;
      if (!vm.ruleForm.slot.slot1 || !vm.ruleForm.slot.slot2 || !vm.ruleForm.slot.slot3) {
        return callback(new Error('插座ID尚未填寫完畢'));
      }
      return callback();
    },
    checkGateway(rule, value, callback) {
      const vm = this;

      if (!rule.required) return callback();

      if (!vm.ruleForm.gateway) {
        return callback(new Error('Gateway尚未填寫完畢'));
      }
      return callback();
    },
  },
};
