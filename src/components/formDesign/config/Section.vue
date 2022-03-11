<template>
  <el-form ref="form" :model="form" label-suffix="：">
    <el-form-item
      label="章节名称"
      prop="name"
      :key="`${form.ft_prop}sectionName`"
      :rules="{ required: true, validator: checkName, trigger: 'blur' }"
    >
      <el-input
        v-model="form.name"
        placeholder="请输入"
        maxlength="30"
      ></el-input>
    </el-form-item>
    <el-form-item label="标题">
      <el-input
        v-model="form.title"
        placeholder="请输入"
        maxlength="30"
        :key="`${form.ft_prop}seztionTitle`"
      ></el-input>
    </el-form-item>
    <el-form-item label="描述" :key="`${form.ft_prop}sectionDesc`">
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
  name: 'SectionConfig',
  mixins: [configForm],
}
</script>
