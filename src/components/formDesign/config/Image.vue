<template>
  <el-form-item
    prop="control"
    label="图片张数限制"
    :key="`${control.ft_prop}imageLimit`"
    :rules="{ required: true, validator: checkImageNum, trigger: 'blur' }"
  >
    <br />
    <div style="margin-bottom: 10px">
      最少
      <el-input-number
        v-model="control.minImage"
        step-strictly
        :step="1"
        placeholder="请输入"
      ></el-input-number>
      张
    </div>
    <div>
      最多
      <el-input-number
        v-model="control.maxImage"
        step-strictly
        :step="1"
        placeholder="请输入"
      ></el-input-number>
      张
    </div>
  </el-form-item>
</template>

<script>
import { validatenull } from '@/utils/validate'
export default {
  name: 'ImageConfig',
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    control: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  watch: {
    'control.minImage'(val) {
      if (val && val > this.control.maxImage) {
        this.control.maxImage = val
      }
    },
  },
  methods: {
    checkImageNum(rule, control, callback) {
      let { minImage, maxImage } = control
      if (validatenull(minImage) || validatenull(maxImage)) {
        callback(new Error('请输入图片张数限制'))
      } else if (minImage < 0 || minImage > 999999999) {
        // :max="999999999" :min="0"
        callback(new Error('图片最小取值范围为0-999999999'))
      } else if (maxImage < (control.minImage || 0) || maxImage > 999999999) {
        // :max="999999999" :min="control.minImage || 0"
        callback(new Error('图片最大取值范围为0-999999999且不能小于最小取值'))
      } else {
        callback()
      }
    },
  },
}
</script>
