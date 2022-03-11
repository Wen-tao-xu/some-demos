<template>
  <el-form ref="form" :model="form" label-suffix="：">
    <el-form-item
      label="表格名称"
      prop="name"
      :key="`${form.ft_prop}tableName`"
      :rules="{ required: true, validator: checkName, trigger: 'blur' }"
    >
      <el-input
        v-model="form.name"
        placeholder="请输入"
        maxlength="30"
      ></el-input>
    </el-form-item>
    <el-form-item label="标题" :key="`${form.ft_prop}tableTitle`">
      <el-input
        v-model="form.title"
        placeholder="请输入"
        maxlength="30"
      ></el-input>
    </el-form-item>
    <el-form-item
      v-if="form.configurationForRequester"
      prop="configurationForRequester.editable"
      :key="`${form.ft_prop}editable`"
      :rules="{ required: true, message: '请选择是或否', trigger: 'change' }"
      label="发起者是否可修改行数"
    >
      <el-radio-group v-model="configurationForRequester.editable">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      v-if="form.configurationForResponder"
      prop="configurationForResponder.editable"
      :key="`${form.ft_prop}editable2`"
      :rules="{ required: true, message: '请选择是或否', trigger: 'change' }"
      label="响应者是否可修改行数"
    >
      <el-radio-group v-model="configurationForResponder.editable">
        <el-radio :label="true">是</el-radio>
        <el-radio :label="false">否</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item
      class="left-number-input"
      prop="minRows"
      :key="`${form.ft_prop}minRows`"
      :rules="[
        { required: true, message: '请输入最小行数', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            value < 1 || value > 200
              ? callback('最小行数范围为1-200')
              : callback()
          },
          trigger: ['change', 'blur'],
        },
      ]"
      label="最小行数"
    >
      <el-input-number
        v-model="form.minRows"
        step-strictly
        :step="1"
        :controls="false"
        placeholder="请输入"
      ></el-input-number>
    </el-form-item>
    <el-form-item
      class="left-number-input"
      prop="maxRows"
      :key="`${form.ft_prop}maxRows`"
      :rules="[
        { required: true, message: '请输入最大行数', trigger: 'blur' },
        {
          validator: (rule, value, callback) => {
            value < (form.minRows || 1) || value > 200
              ? callback('最大行数范围为1-200且不能小于最小行数')
              : callback()
          },
          trigger: ['change', 'blur'],
        },
      ]"
      label="最大行数"
    >
      <el-input-number
        v-model="form.maxRows"
        step-strictly
        :step="1"
        :controls="false"
        placeholder="请输入"
      ></el-input-number>
    </el-form-item>
    <el-form-item label="描述" :key="`${form.ft_prop}tableDesc`">
      <el-input
        v-model="form.description"
        type="textarea"
        placeholder="请输入"
        maxlength="500"
        show-word-limit
        :autosize="{ minRows: 2, maxRows: 4 }"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import configForm from '../mixins/configForm'
export default {
  name: 'TableConfig',
  mixins: [configForm],
  computed: {
    configurationForRequester: {
      get() {
        return this.form.configurationForRequester
      },
    },
    configurationForResponder: {
      get() {
        return this.form.configurationForResponder
      },
    },
  },
  watch: {
    'form.minRows'(val) {
      // 最大行数不可小于最小行数
      if (val > this.form.maxRows) {
        this.form.maxRows = val
      }
    },
    'form.maxRows'() {
      // 当已有行数大于最大行数时删除多余行
      if (this.data.headers) {
        this.data.headers.forEach((item) => {
          if (item.ft_values && item.ft_values.length > this.form.maxRows) {
            for (let i = item.ft_values.length; i > 0; i--) {
              if (i > this.form.maxRows) {
                item.ft_values.splice(i - 1, 1)
              }
            }
          }
        })
      }
    },
  },
}
</script>

<style></style>
