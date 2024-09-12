<template>
  <div class="register">
    <w-dialog v-model="show" title="綁定電器" width="600px" @save="submitForm('ruleForm')" @cancel="closeDialog">
      <el-form ref="ruleForm" :model="ruleForm" :rules="rules" class="register-form" label-width="150px">
        <!--
        <el-form-item v-if="deviceInfo.length" label="已綁定電器" class="register-item--full">
          <div class="device-info">
            <span>{{ bindDevice }}</span>
          </div>
        </el-form-item>
        -->
        <el-form-item label="總表ID" prop="ammeter" class="register-item--full">
          <div class="register-item__two-items">
            <el-input v-model="ruleForm.ammeter.ammeter1" :disabled="disabled" />
            <el-input v-model="ruleForm.ammeter.ammeter2" :disabled="disabled" />
          </div>
        </el-form-item>
        <device-and-slot-pc :disabled="disabled" :device-list="deviceList" :rule-form="ruleForm" />
        <el-form-item v-if="showGateway" prop="gateway" label="Gateway" class="register-item--full">
          <el-input v-model="ruleForm.gateway" />
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
    showGateway: {
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
        ammeter: [{ validator: vm.checkAmmeter }],
        device: [{ validator: vm.checkDevice }],
        slot: [{ validator: vm.checkSlot }],
        gateway: [{ validator: vm.checkGateway, required: vm.showGateway }],
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
    submitForm(formName) {
      const vm = this;
      vm.$refs[formName].validate(async (valid) => {
        if (valid) {
          const res = await backendApi.bindDevice({
            ammeterList: [vm.ruleForm.ammeter.ammeter1, vm.ruleForm.ammeter.ammeter2],
            appIdList: Object.values(vm.ruleForm.device),
            socketList: Object.values(vm.ruleForm.slot),
            gatewayId: vm.ruleForm.gateway,
            userId: vm.userName,
          });

          if (res.code === 200) {
            vm.$message.success('綁定成功');
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

.device-info {
  color: #333;
  font-weight: bold;
  font-size: 1.25rem;
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
      font-size: 1.25rem;
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

/deep/ .el-input, /deep/ .el-select {
  width: 100%;
}
</style>
