<script setup lang="ts">
import type { PatientList } from '@/types/user'
import {
  getPatientList,
  addPatient,
  editPatient,
  delPatient
} from '@/services/user'
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import type { Patient } from '@/types/user'
import { type FormInstance, showSuccessToast, showConfirmDialog } from 'vant' //导入Vant提示框
import { nameRules, idCardRules } from '@/utils/rules'
const router = useRouter()
// 家庭档案列表
const list = ref<PatientList>([])
const getList = async () => {
  const res = await getPatientList()
  list.value = res.data
}
onMounted(() => {
  getList()
})
//控制弹出层
const show = ref(false)

const options = [
  { label: '男', value: 1 },
  { label: '女', value: 0 }
]
const gender = ref(1)

const patient = ref<Patient>({
  name: '玫瑰',
  idCard: '110101198702171378',
  gender: 1,
  defaultFlag: 0
})
const initPatient: Patient = { name: '', idCard: '', gender: 1, defaultFlag: 0 }
// 点击出现弹出层+表单初始化
const showPop = () => {
  patient.value = { ...initPatient }
  show.value = true
}
// computed使用把单选框的布尔值改成0|1
const defaultFlag = computed({
  get() {
    return patient.value.defaultFlag == 1 ? true : false
  },
  set(value) {
    patient.value.defaultFlag = value ? 1 : 0
    console.log(patient.value.defaultFlag)
  }
})

const form = ref<FormInstance>()
// 添加患者
const onSubmit = async () => {
  await form.value?.validate()
  // 身份证倒数第二位，单数是男，双数是女
  const gender = +patient.value.idCard.slice(-2, -1) % 2
  if (gender !== patient.value.gender) {
    await showConfirmDialog({
      title: '温馨提示',
      message: '填写的性别和身份证号中的不一致\n您确认提交吗？'
    }).catch((err) => err)
  }
  patient.value.id
    ? await editPatient(patient.value)
    : await addPatient(patient.value)
  show.value = false
  getList()
  showSuccessToast('添加成功')
}

// 编辑患者
const edit = (item: any) => {
  show.value = true
  const { name, idCard, gender, defaultFlag, id } = item
  patient.value = { name, idCard, gender, defaultFlag, id }
}
// 删除患者
const del = async (id: any) => {
  await delPatient(id)
  show.value = false
  getList()
  showSuccessToast('删除成功')
}
</script>

<template>
  <div class="patient-page">
    <cp-nav-bar title="家庭档案" @click="router.go(-1)"></cp-nav-bar>
    <div class="patient-list">
      <div class="patient-item" v-for="item in list" :key="item.id">
        <div class="info">
          <span class="name">{{ item.name }}</span>
          <span class="id">{{
            item.idCard.replace(/^(.{6}).+(.{4})$/, '\$1********\$2')
          }}</span>
          <span>{{ item.genderValue }}</span>
          <span>{{ item.age }}岁</span>
        </div>
        <div class="icon" @click="edit(item)"><cp-icon name="user-edit" /></div>
        <div class="tag" v-if="item.defaultFlag === 1">默认</div>
      </div>
      <div class="patient-add" v-if="list.length < 6" @click="showPop">
        <cp-icon name="user-add" />
        <p>添加患者</p>
      </div>
      <div class="patient-tip">最多可添加 6 人</div>
    </div>
    <!-- 右侧弹出 -->
    <van-popup
      v-model:show="show"
      position="right"
      :style="{ width: '100%', height: '100%' }"
    >
      <cp-nav-bar
        :back="() => (show = false)"
        :title="patient.id ? '编辑患者' : '添加患者'"
        right-text="保存"
        @handleRight="onSubmit"
      ></cp-nav-bar>
      <van-form autocomplete="off" ref="form">
        <van-field
          label="真实姓名"
          placeholder="请输入真实姓名"
          v-model="patient.name"
          :rules="nameRules"
        />
        <van-field
          label="身份证号"
          placeholder="请输入身份证号"
          v-model="patient.idCard"
          :rules="idCardRules"
        />
        <van-field label="性别" class="pb4">
          <!-- 单选按钮组件 -->
          <template #input>
            <CpRadioBtn :options="options" v-model="gender"> </CpRadioBtn>
          </template>
        </van-field>
        <van-field label="默认就诊人">
          <template #input>
            <van-checkbox :icon-size="18" round v-model="defaultFlag" />
          </template>
        </van-field>
      </van-form>
      <!-- 删除按钮 -->
      <van-action-bar v-if="patient.id">
        <van-action-bar-button @click="del(patient.id)"
          >删除</van-action-bar-button
        >
      </van-action-bar>
    </van-popup>
  </div>
</template>

<style lang="scss" scoped>
// 底部操作栏
.van-action-bar {
  padding: 0 10px;
  margin-bottom: 10px;
  .van-button {
    color: var(--cp-price);
    background-color: var(--cp-bg);
  }
}

.patient-page {
  padding: 46px 0 80px;
}
.patient-list {
  padding: 15px;
}
.patient-item {
  display: flex;
  align-items: center;
  padding: 15px;
  background-color: var(--cp-bg);
  border-radius: 8px;
  margin-bottom: 15px;
  position: relative;
  border: 1px solid var(--cp-bg);
  transition: all 0.3s;
  overflow: hidden;
  .info {
    display: flex;
    flex-wrap: wrap;
    flex: 1;
    span {
      color: var(--cp-tip);
      margin-right: 20px;
      line-height: 30px;
      &.name {
        font-size: 16px;
        color: var(--cp-text1);
        width: 80px;
        margin-right: 0;
      }
      &.id {
        color: var(--cp-text2);
        width: 180px;
      }
    }
  }
  .icon {
    color: var(--cp-tag);
    width: 20px;
    text-align: center;
  }
  .tag {
    position: absolute;
    right: 60px;
    top: 21px;
    width: 30px;
    height: 16px;
    font-size: 10px;
    color: #fff;
    background-color: var(--cp-primary);
    border-radius: 2px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.selected {
    border-color: var(--cp-primary);
    background-color: var(--cp-plain);
    .icon {
      color: var(--cp-primary);
    }
  }
}
.patient-add {
  background-color: var(--cp-bg);
  color: var(--cp-primary);
  text-align: center;
  padding: 15px 0;
  border-radius: 8px;
  .cp-icon {
    font-size: 24px;
  }
}
.patient-tip {
  color: var(--cp-tag);
  padding: 12px 0;
}
.pb4 {
  padding-bottom: 4px;
}
.patient-page {
  padding: 46px 0 80px;
  :deep() {
    .van-popup {
      width: 100%;
      height: 100%;
      padding-top: 46px;
      box-sizing: border-box;
    }
  }
}
</style>
