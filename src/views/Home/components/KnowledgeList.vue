<script setup lang="ts">
import KnowledgeCard from './KnowledgeCard.vue'
import { getKnowledgePage } from '@/services/consult'
import type {
  KnowledgeList,
  KnowledgeParams,
  KnowledgeType
} from '@/types/consult'
import { ref } from 'vue'

const props = defineProps<{
  type: KnowledgeType
}>()

const loading = ref(false)
const finished = ref(false)
const refreshing = ref(false)

const list = ref<KnowledgeList>([])
const params = ref<KnowledgeParams>({
  type: props.type,
  current: 1,
  pageSize: 10
})
const onLoad = async () => {
  // 加载更多
  const res = await getKnowledgePage(params.value)
  list.value = [...list.value, ...res.data.rows]
  loading.value = false
  refreshing.value = false
  params.value.current += 1

  if (params.value.current >= res.data.pageTotal) {
    finished.value = true
  }
}

const onRefresh = () => {
  // 清空列表数据
  finished.value = false

  // 重新加载数据
  // 将 loading 设置为 true，表示处于加载状态
  loading.value = true
  list.value = []
  params.value.current = 1
  onLoad()
}
</script>

<template>
  <div class="knowledge-list">
    <van-pull-refresh v-model="refreshing" @refresh="onRefresh">
      <van-list
        v-model:loading="loading"
        :finished="finished"
        finished-text="没有更多了"
        @load="onLoad"
      >
        <knowledge-card v-for="i in list" :key="i.id"></knowledge-card>
      </van-list>
    </van-pull-refresh>
  </div>
</template>
<style lang="scss" scoped>
.knowledge-list {
  padding: 0 15px;
}
</style>
