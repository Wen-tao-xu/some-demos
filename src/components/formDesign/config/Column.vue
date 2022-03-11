<template>
  <el-form ref="form" :model="form" label-suffix="：">
    <el-form-item
      label="名称"
      prop="name"
      :rules="{ required: true, validator: checkName, trigger: 'blur' }"
    >
      <el-input
        v-model="form.name"
        placeholder="请输入"
        maxlength="20"
        @blur="handleNameInputBlur"
      ></el-input>
    </el-form-item>
    <el-form-item
      label="标题"
      prop="title"
      :rules="{
        required: true,
        message: '请输入标题',
        trigger: ['blur', 'change'],
      }"
    >
      <el-input
        v-model="form.title"
        placeholder="请输入"
        maxlength="20"
      ></el-input>
    </el-form-item>
    <!-- 控件私有配置 -->
    <component
      :is="getComponent()"
      :data="form"
      :control="Object.assign(form.control, { ft_prop: form.ft_prop })"
      v-if="form.control"
    ></component>

    <el-form-item
      v-if="form.control && form.control.configurationForRequester"
      prop="control"
      label="参与者权限"
    >
      <br />
      发起者：
      <el-checkbox
        v-model="configurationForRequester.editable"
        label="编辑"
        name="editable"
        :disabled="configurationForRequester.disabled"
      ></el-checkbox>
      <el-checkbox
        v-show="configurationForRequester.editable"
        v-model="configurationForRequester.required"
        label="必填"
        name="required"
        :disabled="configurationForRequester.disabled"
      ></el-checkbox>
      <br />
      响应者：
      <el-checkbox
        v-model="configurationForResponder.editable"
        label="编辑"
        name="editable"
        :disabled="configurationForResponder.disabled"
      ></el-checkbox>
      <el-checkbox
        v-if="configurationForResponder.editable"
        v-model="configurationForResponder.required"
        label="必填"
        name="required"
        :disabled="configurationForResponder.disabled"
      ></el-checkbox>
    </el-form-item>
    <el-form-item label="描述">
      <el-input
        v-model="form.description"
        type="textarea"
        placeholder="请输入"
        maxlength="200"
        show-word-limit
        :autosize="{ minRows: 2, maxRows: 4 }"
      ></el-input>
    </el-form-item>
  </el-form>
</template>

<script>
import InputConfig from './Input.vue'
import OptionsConfig from './Options.vue'
import ImageConfig from './Image.vue'
import configForm from '../mixins/configForm'
export default {
  name: 'ColumnConfig',
  mixins: [configForm],
  components: {
    'input-config': InputConfig,
    'options-config': OptionsConfig,
    'image-config': ImageConfig,
  },
  props: {
    // 模板集数据
    templateCollectionData: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  computed: {
    configurationForRequester: {
      get() {
        return this.form.control
          ? this.form.control.configurationForRequester
          : {}
      },
    },
    configurationForResponder: {
      get() {
        let configurationForResponder = {}
        if (this.form.control)
          configurationForResponder =
            this.form.control.configurationForResponder
        // 编辑反显时；若模板类型为②交付通知③交付请求 响应者不勾选编辑(且置灰不可勾选)
        if (this.templateCollectionData.id && this.data.ft_path) {
          let type =
            this.templateCollectionData.templates[this.data.ft_path[0]].type
          if (
            [
              'DeliveryRequestTemplate',
              'DeliveryNotificationTemplate',
            ].includes(type)
          ) {
            configurationForResponder.disabled = true
          }
        }
        return configurationForResponder
      },
    },
  },
  watch: {
    'configurationForRequester.editable': {
      handler(val) {
        if (!val) {
          this.configurationForRequester.required = false
        }
      },
    },
    'configurationForResponder.editable': {
      handler(val) {
        if (!val) {
          this.configurationForResponder.required = false
        }
      },
    },
    // 当文本输入框已有值时，更加最大长度限制截取字符
    'data.control.maxLength'(val) {
      if (val) {
        this.data.ft_values.forEach((item, index) => {
          item && (this.data.ft_values[index] = item.slice(0, val))
        })
      }
    },
    // 数字输入框最小值限制同步输入内容
    'data.control.minValue'(val) {
      if (val) {
        this.data.ft_values.forEach((item, index) => {
          if (item < val) {
            this.data.ft_values[index] = val
          }
        })
      }
    },
    // 数字输入框最大值限制同步输入内容
    'data.control.maxValue'(val) {
      if (val) {
        this.data.ft_values.forEach((item, index) => {
          if (item > val) {
            this.data.ft_values[index] = val
          }
        })
      }
    },
  },
  methods: {
    getComponent() {
      let type = this.form.control?.type
      const KEY = '-config'
      let result = 'input'
      if (['TextControl', 'NumericControl', 'PasswordControl'].includes(type)) {
        result = 'input'
      } else if (
        [
          'SingleSelectControl',
          'DropDownSingleSelectControl',
          'MultiSelectControl',
          'DropDownMultiSelectControl',
        ].includes(type)
      ) {
        result = 'options'
      } else if (['ImageControl'].includes(type)) {
        result = 'image'
      }
      return result + KEY
    },
    handleNameInputBlur() {
      // 没有标题时 标题根据名称自动填充
      if (!this.form.title) {
        this.form.title = this.form.name
      }
    },
  },
}
</script>
