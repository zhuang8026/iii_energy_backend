<template>
  <div class="logo">
    <div class="logo__icon">
      <img
        :src="require(`@/assets/img/header/icon-logo.svg`)"
        alt="台灣電力公司"
      >
    </div>
    <div class="logo__title">
      <p>經濟部能源局</p>
      <p>Bureau of Energy ,</p>
      <p>Ministry of Economic Affairs</p>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.logo {
  display: flex;
  gap: 1rem;
  align-items: center;

  &__icon {
    width: 5rem;
    height: 5rem;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
    }
  }

  &__title {
    color: #268842;
    font-weight: bold;
    font-size: 0.5rem;
    font-family: Noto Sans CJK TC, sans-serif;

    p {
      &:first-child {
        font-size: 1.5rem;
        letter-spacing: 0.1rem;
      }
    }
  }
}
</style>
