<script setup lang="ts">
const props = defineProps<{
  title?: string
  rightText?: string
  back?: () => void
}>()

const emit = defineEmits<{
  (e: 'handleLeft'): void
  (e: 'handleRight'): void
}>()

const onClickLeft = () => {
  // TODO 点击左侧返回按钮
  emit('handleLeft')
  if (props.back) {
    return props.back()
  }
}
const onClickRight = () => {
  // TODO 点击右侧文字按钮
  emit('handleRight')
}
</script>

<template>
  <van-nav-bar
    fixed
    left-arrow
    :title="title"
    :right-text="rightText"
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
