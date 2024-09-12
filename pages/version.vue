<template>
  <div class="version-page">
    <p>{{ version }}</p>
  </div>
</template>

<script>

export default {
  computed: {
    version() {
      return process.env.vueAppVersion;
    },
  },
};
</script>

<style lang="scss" scoped>
.version-page {
  min-height: calc(100vh - 192px);
  padding: 4rem;
  text-align: center;

  @media screen and (max-width: 880px) {
    min-height: calc(100vh - 202px);
  }
}
</style>
