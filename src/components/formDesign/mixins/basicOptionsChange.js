export default {
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: {
      type: [Array, String, Number],
      default: () => [],
    },
    options: {
      type: Array,
      default: () => [],
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      bindValue: this.value,
    }
  },
  watch: {
    value(val) {
      this.bindValue = val
    },
    bindValue(val) {
      this.$emit('update:value', val)
      this.$emit('change', val)
    },
  },
}
