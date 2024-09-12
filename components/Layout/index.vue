<template>
  <div class="layout">
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    btnText: {
      type: String,
      default: '',
    },
    showFilterBar: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {};
  },
};
</script>

<style scoped lang="scss">
.layout {
  max-width: 1480px;
  height: 100%;
  margin: 2rem auto;
}

.title-img-box {
  width: 16px;
  height: 18px;
  margin-right: 13px;

  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
}
</style>
