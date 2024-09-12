<template>
  <div class="block">
    <slot />
  </div>
</template>

<style lang="scss" scoped>
.block {
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  border-radius: 0.625rem;
  background-color: #fff;
  box-shadow: 5px 5px 10px #00000029;
}
</style>
