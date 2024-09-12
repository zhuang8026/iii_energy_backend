<template>
  <div class="register">
    <w-dialog v-model="show" title="新增用戶" width="600px" @save="submitForm()" @cancel="closeDialog">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="register-form" label-width="150px">
        <el-form-item label="帳號" class="half" prop="account" required>
          <el-input v-model="ruleForm.account" placeholder="請輸入信箱" />
        </el-form-item>
        <el-form-item label="社區" class="half" prop="community" required>
          <el-input v-model="ruleForm.community" placeholder="請輸入" />
        </el-form-item>
        <el-form-item label="密碼" class="half" prop="password" required>
          <el-input v-model="ruleForm.password"  placeholder="八位數以上含大小寫、含特殊字元" type="password" />
        </el-form-item>
        <el-form-item label="行政區" class="half" prop="area" required>
          <el-input v-model="ruleForm.area" placeholder="請輸入" />
        </el-form-item>
        <el-form-item label="確認密碼" class="half" prop="checkPassword" required>
          <el-input v-model="ruleForm.checkPassword" placeholder="請再次確認密碼" type="password" />
        </el-form-item>
        <el-form-item label="總表ID" prop="ammeter" class="half" required>
          <el-input v-model="ruleForm.ammeter.ammeter1" :disabled="disabled" class="half" placeholder="請輸入" />
          <el-input v-model="ruleForm.ammeter.ammeter2" :disabled="disabled" class="half" placeholder="請輸入" />
        </el-form-item>
        <el-form-item label="姓名" class="half" prop="name" required>
          <el-input v-model="ruleForm.name" placeholder="請輸入" />
        </el-form-item>
        <el-form-item label="綁定電器" prop="device" required>
          <el-select v-model="ruleForm.device.device1" class="one-third" placeholder="請選擇">
            <el-option v-for="(device, index) in deviceList" :key="index" :value="device.appId" :label="device.applianceName" :disabled="disabledOption('device1', device)" />
          </el-select>
          <el-select v-model="ruleForm.device.device2" class="one-third" placeholder="請選擇">
            <el-option v-for="(device, index) in deviceList" :key="index" :value="device.appId" :label="device.applianceName" :disabled="disabledOption('device2', device)" />
          </el-select>
          <el-select v-model="ruleForm.device.device3" class="one-third" placeholder="請選擇">
            <el-option v-for="(device, index) in deviceList" :key="index" :value="device.appId" :label="device.applianceName" :disabled="disabledOption('device3', device)" />
          </el-select>
        </el-form-item>
        <el-form-item label="對應插座ID" prop="slot" required>
          <el-input v-model="ruleForm.slot.slot1" :disabled="disabled" placeholder="請輸入" class="one-third" />
          <el-input v-model="ruleForm.slot.slot2" :disabled="disabled" placeholder="請輸入" class="one-third" />
          <el-input v-model="ruleForm.slot.slot3" :disabled="disabled" placeholder="請輸入" class="one-third" />
        </el-form-item>
        <el-form-item prop="gateway" label="Gateway" required>
          <el-input v-model="ruleForm.gateway"  placeholder="請輸入" />
        </el-form-item>
      </el-form>
    </w-dialog>
  </div>
</template>

<script>
import WDialog from '@/components/WDialog';
import DeviceAndSlotPc from '@/components/BindDevice/deviceAndSlotPc';
import FormChecker from '@/mixins/Components/BindDevice/formChecker';
import { mapState } from 'vuex';
import backendApi from '@/assets/js/api/backendApi';

export default {
  components: {
    WDialog,
    DeviceAndSlotPc,
  },
  mixins: [FormChecker],
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    deviceList: {
      type: Array,
      default: () => [],
    },
    deviceInfo: {
      type: Array,
      default: () => [],
    },
    userName: {
      type: String,
      default: '',
    },
  },
  data() {
    const vm = this;
    return {
      show: false,
      ruleForm: {
        account: '',
        password: '',
        checkPassword: '',
        community: '',
        are: '',
        ammeter: {
          ammeter1: '',
          ammeter2: '',
        },
        device: {
          device1: '',
          device2: '',
          device3: '',
        },
        slot: {
          slot1: '',
          slot2: '',
          slot3: '',
        },
        gateway: '',
      },
      rules: {
        account: [{ required: true, message: '帳號為必填' }],
        password: [{ required: true, message: '密碼為必填' }, { validator: vm.checkPassword }],
        checkPassword: [{ required: true, message: '密碼為必填' }],
        name: [{ required: true, message: '姓名為必填' }],
        area: [{ required: true, message: '行政區為必填' }],
        community: [{ required: true, message: '社區為必填' }],
        ammeter: [{ validator: vm.checkAmmeter, message: '總表為必填' }],
        device: [{ validator: vm.checkDevice, message: '設備為必填' }],
        slot: [{ validator: vm.checkSlot, message: '插座為必填' }],
        gateway: [{ required: true, message: 'Gateway為必填' }],
      },
    };
  },
  computed: {
    ...mapState('user', {
      userId: (state) => state.userId,
    }),
    bindDevice() {
      return this.deviceInfo.filter((e) => e.appId !== '10').map((e) => e.deviceName).join('、');
    },
  },
  watch: {
    value(val) {
      const vm = this;
      vm.show = val;
    },
    show(val) {
      const vm = this;
      vm.$emit('input', val);
    },
    deviceInfo: {
      handler() {
        const vm = this;
        if (!vm.deviceInfo.length) return;
        vm.setData();
      },
    },
  },
  methods: {
    disabledOption(currentSelect, deviceOption) {
      const vm = this;
      const deviceList = Object.keys(vm.ruleForm.device).filter((key) => key !== currentSelect);
      return deviceList.some((key) => vm.ruleForm.device[key] === deviceOption.appId);
    },
    setData() {
      const vm = this;
      const ammeterList = vm.deviceInfo.filter((e) => e.appId === '10');
      ammeterList.forEach((e, index) => {
        vm.ruleForm.ammeter[`ammeter${index + 1}`] = e.deviceId;
      });

      const appList = vm.deviceInfo.filter((e) => e.appId !== '10');
      appList.forEach((e, index) => {
        vm.ruleForm.device[`device${index + 1}`] = e.appId;
        vm.ruleForm.slot[`slot${index + 1}`] = e.deviceId;
      });

      vm.ruleForm.gateway = vm.deviceInfo[0].gatewayId;
    },
    closeDialog() {
      const vm = this;
      vm.show = false;
      vm.reset();
    },
    reset() {
      const vm = this;
      vm.$nextTick(() => vm.$refs.ruleForm.clearValidate());
      Object.keys(vm.ruleForm.ammeter).forEach((key) => {
        vm.ruleForm.ammeter[key] = '';
      });
      Object.keys(vm.ruleForm.device).forEach((key) => {
        vm.ruleForm.device[key] = '';
      });
      Object.keys(vm.ruleForm.slot).forEach((key) => {
        vm.ruleForm.slot[key] = '';
      });
    },
    submitForm() {
      const vm = this;
      vm.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const res = await backendApi.register({
            ...vm.ruleForm, summaryList: Object.values(vm.ruleForm.ammeter).filter((e) => e), socketList: Object.values(vm.ruleForm.slot).filter((e) => e), deviceList: Object.values(vm.ruleForm.device).filter((e) => e), gatewayId: vm.ruleForm.gateway, username: vm.ruleForm.account,
          });

          if (res.code === 200) {
            vm.$message.success('新增成功');
            vm.closeDialog();
          } else {
            vm.$message.success(res.message);
          }
        }
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.register {
  width: 100%;
  padding: 0 3rem;

  &-form {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }

  &-item {
    flex-basis: 48%;

    &--full {
      flex-basis: 100%;
    }

    &__two-items {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 0 10px;
    }
  }
}

/* 表單 */
/deep/ .el-form {
  &-item {
    display: flex;
    flex-direction: column;
    margin-bottom: 0.5rem !important;

    &__label {
      flex-basis: unset !important;
      padding: 0;
      color: #333;
      font-weight: bolder;
      text-align: left;

      &::before {
        display: none;
      }
    }

    &__content {
      flex-basis: 100%;
      margin-left: 0 !important;
    }
  }
}

.half {
  flex: 0 1 49%;
  max-width: 49%;
}

.one-third {
  width: 32%;
}
</style>
