<template>
  <div class="block2">
    <div class="head">
      <span class="title">{{ title }}</span>
      <div class="action"><slot name="action" /></div>
    </div>
    <div class="body">
      <slot />
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss" scoped>
.block2 {
  padding: 2rem 1.5rem;
  border-radius: 1rem;
  background: #fff;
}

.head {
  display: flex;

  .title {
    font-size: 1.5rem;
  }

  .action {
    margin-left: auto;
  }
}

.body {
  margin-top: 1rem;
  background: #fff;
}
</style>
