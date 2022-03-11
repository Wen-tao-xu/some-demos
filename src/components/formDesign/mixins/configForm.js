import { validatenull } from '@/utils/validate'
export default {
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // data所在的list
    parent: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      form: {
        name: '',
        title: '',
      },
    }
  },
  watch: {
    data: {
      handler(val) {
        this.form = val
      },
      deep: true,
      immediate: true,
    },
    form: {
      handler(val) {
        this.$emit('update:data', val)
      },
      deep: true,
    },
  },
  methods: {
    // 名称查重
    checkName(rule, value, callback) {
      let repeatValue = this.parent.filter((item) => item.name == value)
      if (validatenull(value)) {
        callback(new Error('请输入名称'))
      } else if (value && repeatValue.length > 1) {
        callback(new Error('名称重复'))
      } else {
        callback()
      }
    },
    // 表单校验事件
    validate() {
      return new Promise((resolve, reject) => {
        this.$refs.form.validate((valid) => {
          if (valid) {
            resolve(this.data)
          } else {
            reject(this.data)
          }
        })
      })
    },
  },
}
