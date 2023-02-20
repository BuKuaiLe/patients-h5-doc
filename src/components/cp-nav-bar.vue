<script setup lang="ts">
const onClickLeft = () => {
  // TODO 点击左侧返回按钮
}
const onClickRight = () => {
  // TODO 点击右侧文字按钮
}
</script>

<template>
  <van-nav-bar
    fixed
    left-arrow
    title="登录"
    right-text="注册"
    @click-left="onClickLeft"
    @click-right="onClickRight"
  ></van-nav-bar>
</template>

<style lang="scss" scoped>
:deep() {
  .van-nav-bar {
    &__arrow {
      font-size: 18px;
      color: var(--cp-text1);
    }
    &__text {
      font-size: 15px;
    }
  }
}
</style>
