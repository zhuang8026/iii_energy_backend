<template>
  <div class="register-item--full pc">
    <el-form-item label="綁定電器" prop="device">
      <el-select v-model="form.device.device1" placeholder="請選擇電器">
        <el-option v-for="(device, index) in deviceList" :key="index" :value="device.appId" :label="device.applianceName" :disabled="disabledOption('device1', device)" />
      </el-select>
      <el-select v-model="form.device.device2" placeholder="請選擇電器">
        <el-option v-for="(device, index) in deviceList" :key="index" :value="device.appId" :label="device.applianceName" :disabled="disabledOption('device2', device)" />
      </el-select>
      <el-select v-model="form.device.device3" placeholder="請選擇電器">
        <el-option v-for="(device, index) in deviceList" :key="index" :value="device.appId" :label="device.applianceName" :disabled="disabledOption('device3', device)" />
      </el-select>
    </el-form-item>
    <el-form-item label="對應插座ID" prop="slot">
      <el-input v-model="form.slot.slot1" :disabled="disabled" placeholder="請輸入插座ID" />
      <el-input v-model="form.slot.slot2" :disabled="disabled" placeholder="請輸入插座ID" />
      <el-input v-model="form.slot.slot3" :disabled="disabled" placeholder="請輸入插座ID" />
    </el-form-item>
  </div>
</template>

<script>
export default {
  props: {
    disabled: {
      type: Boolean,
      default: false,
    },
    deviceList: {
      type: Array,
      default: () => [],
    },
    ruleForm: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      form: {},
    };
  },
  watch: {
    ruleForm: {
      handler() {
        const vm = this;
        vm.form = vm.ruleForm;
      },
      immediate: true,
    },
  },
  methods: {
    disabledOption(currentSelect, deviceOption) {
      const vm = this;
      const deviceList = Object.keys(vm.form.device).filter((key) => key !== currentSelect);
      return deviceList.some((key) => vm.form.device[key] === deviceOption.appId);
    },
  },
};
</script>

<style lang="scss" scoped>
/deep/ .el-form {
  &-item {
    &__content {
      display: flex;
      justify-content: space-between;

      .el-select,
      .el-input {
        &:not(:nth-child(3)) {
          margin-right: 10px;
        }
      }
    }
  }
}
</style>
