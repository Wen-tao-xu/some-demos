<template>
  <div>
    <el-form-item
      label="输入提示"
      prop="control.hint"
      :key="`${control.ft_prop}hint`"
    >
      <!-- :rules="{ required: true, message: '请填写输入提示', trigger: 'blur' }" -->
      <el-input
        v-model="control.hint"
        placeholder="请输入"
        maxlength="40"
      ></el-input>
    </el-form-item>
    <el-form-item
      class="left-number-input"
      prop="control.maxLength"
      :key="`${control.ft_prop}length`"
      :rules="[
        { required: true, message: '请输入字数限制', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            value < 1 || value > 200 ? callback('取值范围为1-200') : callback()
          },
          trigger: ['change', 'blur'],
        },
      ]"
      label="字数限制"
      v-if="['TextControl', 'PasswordControl'].includes(control.type)"
    >
      <br />
      <el-input-number
        v-model="control.maxLength"
        step-strictly
        :step="1"
        :controls="false"
        placeholder="请输入"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      prop="control"
      :key="`${control.ft_prop}limit`"
      :rules="[{ required: true, validator: checkValue, trigger: 'blur' }]"
      label="值限制"
      v-if="control.type === 'NumericControl'"
    >
      <br />
      <div>
        <el-input-number
          v-model="control.minValue"
          step-strictly
          :step="1"
          :controls="false"
          placeholder="最小"
        ></el-input-number>
        <span>--</span>
        <el-input-number
          v-model="control.maxValue"
          step-strictly
          :step="1"
          :controls="false"
          placeholder="最大"
        ></el-input-number>
      </div>
    </el-form-item>
  </div>
</template>

<script>
import { validatenull } from '@/utils/validate'
export default {
  name: 'InputConfig',
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
    'control.minValue'(val) {
      if (val && val > this.control.maxValue) {
        this.control.maxValue = val
      }
    },
  },
  methods: {
    checkValue(rule, control, callback) {
      let { minValue, maxValue } = control
      if (validatenull(minValue) || validatenull(maxValue)) {
        callback(new Error('请输入值限制'))
      } else if (minValue < 0 || minValue > 999999999) {
        callback(new Error('最小值限制范围为0-999999999'))
      } else if (maxValue < (minValue || 0) || maxValue > 999999999) {
        callback(new Error('最大值限制范围为0-999999999且不能小于最小值'))
      } else {
        callback()
      }
    },
  },
}
</script>
