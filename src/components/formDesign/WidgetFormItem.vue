<template>
  <div class="widget-form-item__body">
    <component
      :is="getComponent(item.control.type, item.component)"
      v-model="item.ft_values[index]"
      v-bind="
        Object.assign(deepClone(item), parmas, { size: item.size || 'small' })
      "
      :placeholder="item.placeholder || getPlaceholder(item)"
    >
    </component>
  </div>
</template>
<script>
import Radio from './basic/Radio.vue'
import Select from './basic/Select.vue'
import Checkbox from './basic/Checkboxs.vue'
import JwUpload from '@/components/common/publicUploaderzip'
export default {
  name: 'WidgetFormItem',
  components: {
    'jw-radio': Radio,
    'jw-select': Select,
    'jw-checkbox': Checkbox,
    'jw-upload': JwUpload,
  },
  props: {
    item: {
      type: Object,
      default: () => {
        return {}
      },
    },
    index: {
      type: [Number, String],
      default: '',
    },
  },
  data() {
    return {
      parmas: {},
    }
  },
  methods: {
    getComponent(type, component) {
      let result = 'el-input'
      if (component) return component
      else if (['TextControl', 'PasswordControl'].includes(type)) {
        result = 'el-input'
      } else if (type === 'NumericControl') result = 'el-input-number'
      else if (
        ['DropDownSingleSelectControl', 'DropDownMultiSelectControl'].includes(
          type
        )
      ) {
        result = 'jw-select'
      } else if (type === 'SingleSelectControl') {
        result = 'jw-radio'
      } else if (['MultiSelectControl'].includes(type)) {
        result = 'jw-checkbox'
      } else if (type === 'ImageControl') result = 'jw-upload'
      this.setOtherParams(type)
      return result
    },
    getPlaceholder(item) {
      const label = item.control.hint
      if (
        ['DropDownSingleSelectControl', 'DropDownMultiSelectControl'].includes(
          item.type
        )
      )
        return `${label}` || `请选择`
      else return `${label}` || '请输入'
    },
    setOtherParams(type) {
      if (['TextControl', 'PasswordControl'].includes(type)) {
        this.parmas.maxLength = this.item.control.maxLength || 200
        if (type === 'PasswordControl') {
          this.parmas.showPassword = true
        }
      } else if (
        [
          'DropDownSingleSelectControl',
          'DropDownMultiSelectControl',
          'SingleSelectControl',
          'MultiSelectControl',
        ].includes(type)
      ) {
        this.parmas.options = this.item.control.options
        if (type === 'DropDownMultiSelectControl') {
          this.parmas.multiple = true
        }
        // if (type === 'SingleSelectControl') {
        //   this.parmas.max = 1
        // }
      } else if (['NumericControl'].includes(type)) {
        let { minValue, maxValue } = this.item.control
        this.parmas.max = maxValue || 999999999
        this.parmas.min = minValue
      } else if (['ImageControl'].includes(type)) {
        let { minImage, maxImage } = this.item.control
        this.parmas.uploadLimit = {
          min: minImage,
          max: maxImage,
        }
        this.parmas.imgWideHigh = 'img60'
      }
    },
  },
}
</script>
