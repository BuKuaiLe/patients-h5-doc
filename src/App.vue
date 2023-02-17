<template>
  <div>
    遇事不决,可问春风!
    <van-button type="primary" @click="btn">本地存储</van-button>
    <van-button type="primary" @click="btn1">清空存储</van-button>

    <hr />
  </div>
</template>
<script setup lang="ts">
import { useStoreUser } from './stores'
const store = useStoreUser()

const btn = () => {
  store.setUser({
    token: '111',
    id: '222',
    account: 'bukuaile',
    mobile: '166666666',
    avatar: '1111111'
  })
}

const btn1 = () => {
  store.delUser()
}
</script>
<style scoped lang="scss"></style>
