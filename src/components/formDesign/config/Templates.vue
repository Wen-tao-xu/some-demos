<template>
  <el-form ref="form" :model="form" label-suffix="：">
    <el-form-item
      label="交付信息模板名称"
      prop="name"
      :key="`${form.ft_prop}tempalteName`"
      :rules="{ required: true, validator: checkName, trigger: 'blur' }"
    >
      <el-input
        v-model="form.name"
        placeholder="请输入"
        maxlength="30"
      ></el-input>
    </el-form-item>
    <el-form-item label="标题" :key="`${form.ft_prop}tempalteTitle`">
      <el-input
        v-model="form.title"
        placeholder="请输入"
        maxlength="30"
      ></el-input>
    </el-form-item>
    <el-form-item
      prop="type"
      :key="`${form.ft_prop}tempalteType`"
      :rules="{
        required: true,
        message: '请选择交付信息模板类型',
        trigger: 'change',
      }"
      label="交付信息模板类型"
    >
      <template v-slot:label>
        <span>交付信息模板类型：</span>
        <el-tooltip
          placement="top-start"
          effect="dark"
          content="确认交付信息模板类型以开始添加控件，类型确认后不可更改"
          class="custom-tooltip"
        >
          <i
            class="el-icon-info"
            style="font-size: 20px"
            v-if="!form.ft_typeDisable"
          ></i>
        </el-tooltip>
      </template>
      <br />
      <el-radio-group v-model="form.type" :disabled="form.ft_typeDisable"
        ><br />
        <el-radio label="DeliveryCollectionTemplate">交付收集</el-radio>
        <br />
        <el-radio label="DeliveryRequestTemplate">交付请求</el-radio>
        <br />
        <el-radio label="DeliveryNotificationTemplate">交付通知</el-radio>
      </el-radio-group>
    </el-form-item>
    <el-form-item label="描述" :key="`${form.ft_prop}tempalteDesc`">
      <el-input
        v-model="form.description"
        type="textarea"
        placeholder="请输入"
        maxlength="500"
        show-word-limit
        :autosize="{ minRows: 2, maxRows: 4 }"
      ></el-input>
    </el-form-item>
    <el-button
      type="primary"
      size="small"
      @click="onConfirm"
      v-if="!form.ft_typeDisable"
      >确认</el-button
    >
  </el-form>
</template>

<script>
import configForm from '../mixins/configForm'
export default {
  name: 'TemplatesConfig',
  mixins: [configForm],
  methods: {
    async onConfirm() {
      try {
        await this.validate()
        this.data.ft_typeDisable = true
      } catch (err) {}
    },
  },
}
</script>
