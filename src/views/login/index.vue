<script setup lang="ts">
import { mobileRules, passwordRules, codeRules } from '@/utils/rules' //导入封装的表单效验
import { ref } from 'vue'
import { showToast, type FormInstance } from 'vant' //导入Vant提示框
import { loginByPassword, sendMobileCode, loginByCode } from '@/services/user' //导入请求函数
import { useStoreUser } from '@/stores/index'
import { useRouter } from 'vue-router'
const router = useRouter()
const store = useStoreUser()
const mobile = ref('13230000032') //手机号
const password = ref('abc12345') //密码
const code = ref('') //验证码
const agree = ref(true)
const isPass = ref(true) //判断是密码登录还是验证码登录
const form = ref<FormInstance>()

// 密码登录
const login = async () => {
  if (!agree.value) return showToast('请输入协议条款')
  const res = isPass.value
    ? await loginByPassword(mobile.value, password.value)
    : await loginByCode(mobile.value, code.value)
  // console.log(res)
  store.setUser(res.data)
  router.push('/user')
  showToast('登录成功')
}

var tiemText = ref('发送验证码')
var timeId: any = null
var time = ref(5)
// 获取验证码
const getCode = async () => {
  if (time.value < 0) return
  time.value = 5
  const res = await sendMobileCode(mobile.value, 'login')
  // console.log(res)
  code.value = res.data.code

  await form.value?.validate('mobile')

  clearInterval(timeId)
  timeId = setInterval(() => {
    time.value -= 1
    tiemText.value = `${time.value}秒后在获取`
    if (time.value < 1) {
      tiemText.value = '发送验证码'
      return clearInterval(timeId)
    }
  }, 1000)
}
</script>

<template>
  <div class="login-page">
    <cp-nav-bar
      right-text="注册"
      @click-right="$router.push('/register')"
    ></cp-nav-bar>
    <!-- 头部 -->
    <div class="login-head">
      <h3>{{ isPass ? '密码登录' : '短信验证码登录' }}</h3>
      <a href="javascript:;" @click="isPass = !isPass">
        <span>{{ !isPass ? '密码登录' : '验证码登录' }}</span>
        <van-icon name="arrow"></van-icon>
      </a>
    </div>
    <!-- 表单 -->
    <van-form autocomplete="off" @submit="login" ref="form">
      <van-field
        v-model="mobile"
        name="mobile"
        :rules="mobileRules"
        placeholder="请输入手机号"
        type="tel"
      ></van-field>
      <!-- 密码 -->
      <van-field
        v-if="isPass"
        v-model="password"
        :rules="passwordRules"
        placeholder="请输入密码"
        type="password"
      ></van-field>
      <!-- 验证码 -->
      <van-field
        v-else
        v-model="code"
        :rules="codeRules"
        placeholder="请输入验证码"
        type="password"
      >
        <template #button>
          <span class="btn-send" @click="getCode">{{ tiemText }}</span>
        </template>
      </van-field>

      <div class="cp-cell">
        <van-checkbox v-model="agree">
          <span>我已同意</span>
          <a href="javascript:;">用户协议</a>
          <span>及</span>
          <a href="javascript:;">隐私条款</a>
        </van-checkbox>
      </div>
      <div class="cp-cell">
        <van-button block round type="primary" native-type="submit">
          登 录
        </van-button>
      </div>
      <div class="cp-cell">
        <a href="javascript:;">忘记密码？</a>
      </div>
    </van-form>
    <!-- 底部 -->
    <div class="login-other">
      <van-divider>第三方登录</van-divider>
      <div class="icon">
        <img src="@/assets/qq.svg" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.login {
  &-page {
    padding-top: 46px;
  }
  &-head {
    display: flex;
    padding: 30px 30px 50px;
    justify-content: space-between;
    align-items: flex-end;
    line-height: 1;
    h3 {
      font-weight: normal;
      font-size: 24px;
    }
    a {
      font-size: 15px;
    }
  }
  &-other {
    margin-top: 60px;
    padding: 0 30px;
    .icon {
      display: flex;
      justify-content: center;
      img {
        width: 36px;
        height: 36px;
        padding: 4px;
      }
    }
  }
}
.van-form {
  padding: 0 14px;
  .cp-cell {
    height: 52px;
    line-height: 24px;
    padding: 14px 16px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    .van-checkbox {
      a {
        color: var(--cp-primary);
        padding: 0 5px;
      }
    }
  }
  .btn-send {
    color: var(--cp-primary);
    &.active {
      color: rgba(22, 194, 163, 0.5);
    }
  }
}
</style>
