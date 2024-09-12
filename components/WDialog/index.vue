<template>
  <el-dialog
    :title="title"
    :width="width"
    :visible.sync="visible"
    :show-close="showClose"
    :before-close="handleClose"
    :modal-append-to-body="false"
    class="w-dialog"
    @close="btnEmitEvent('cancel')"
  >
    <template #title>
      <slot name="title" />
    </template>
    <slot />
    <div v-if="footerBtnArray.length" slot="footer" class="dialog-footer">
      <el-button
        v-if="usedBtn('cancel')"
        class="btn-cancel-color"
        @click="btnEmitEvent('cancel')"
      ><img :src="require('@/assets/img/pages/device/icon-clear.svg')">{{ cancelTitle }}</el-button>
      <el-button
        v-if="usedBtn('save')"
        :disabled="disabledSave"
        class="btn-main-color"
        @click="btnEmitEvent('save')"
      ><img :src="require('@/assets/img/pages/device/icon-confirm.svg')">{{ saveTitle }}</el-button>
    </div>
  </el-dialog>
</template>
<script>

export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    width: {
      type: String,
      default: '',
    },
    showClose: {
      type: Boolean,
      default: true,
    },
    title: {
      type: String,
      default: '',
    },
    /**
     * 目前會需要的按鈕
     * @save 儲存
     * @cancel 取消
     * @close 關閉
     */
    footerBtnArray: {
      type: Array,
      default: () => ['save', 'cancel'],
    },
    saveTitle: {
      type: String,
      default: '確認',
    },
    cancelTitle: {
      type: String,
      default: '取消',
    },
    disabledSave: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Object,
      default: () => {},
    },
  },
  data() {
    return {
      visible: false,
    };
  },
  watch: {
    value: {
      handler() {
        const vm = this;

        vm.visible = vm.value;
      },
    },
    visible: {
      handler() {
        const vm = this;

        vm.$emit('input', vm.visible);
      },
    },
  },
  methods: {
    usedBtn(btnType) {
      return this.footerBtnArray.includes(btnType);
    },
    btnEmitEvent(emitName) {
      this.$emit(emitName);
    },
    handleClose(done) {
      this.$emit('beforeClose');
      done();
    },
  },
};
</script>

<style lang="scss" scoped>
.w-dialog {
  /deep/ .el-dialog {
    scrollbar-width: none;

    &::-webkit-scrollbar {
      display: none;
    }

    &__footer {
      justify-content: flex-end;
    }
  }
}

.dialog-footer {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
