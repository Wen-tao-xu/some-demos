<template>
  <div class="select-option-list">
    <el-form-item
      label="选项"
      prop="control.options"
      :key="`${control.ft_prop}options`"
      :rules="[
        { required: true, message: '请输入选项', trigger: 'blur' },
        { validator: checkOptions, trigger: 'blur' },
      ]"
    >
      <br />
      <div class="custom-scroll" style="max-height: 200px">
        <div
          class="select-option-item"
          v-for="(item, index) in control.options"
          :key="index"
        >
          <el-input
            ref="inputs"
            v-model="control.options[index]"
            placeholder="请输入"
            maxlength="40"
            @focus="onFocus($event)"
            @change="onChange"
          ></el-input>
          <el-button
            v-if="control.options.length > 1"
            circle
            class="el-icon-minus"
            @click="hadnleDelete(index)"
          ></el-button>
        </div>
      </div>
    </el-form-item>
    <el-button size="small" type="text" @click="handleAdd">添加</el-button>
  </div>
</template>

<script>
export default {
  name: 'SelectConfig',
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
  methods: {
    handleAdd() {
      this.control.options.push(`选项${this.control.options.length + 1}`)
      this.$nextTick(() => {
        // 自动聚焦并全选输入框内容
        this.$refs.inputs.forEach((item, index) => {
          if (index == this.control.options.length - 1) {
            item.focus()
            item.select()
          }
        })
      })
    },
    hadnleDelete(index) {
      this.resetValue()
      this.control.options.splice(index, 1)
    },
    onFocus(e) {
      // 聚焦时全选
      // e.currentTarget.select()
    },
    onChange() {
      this.resetValue()
    },
    // 当选项改变或者选项删除时，若选项已被选择，需置空
    resetValue() {
      this.data.ft_values.forEach((val, i) => {
        if (val && this.control.options.every((option) => option != val)) {
          this.data.ft_values.splice(i, 1, undefined)
        }
      })
    },
    checkOptions(rule, value, callback) {
      let emptyVals = value.filter((item) => item === '')
      if (emptyVals.length > 0) {
        callback(new Error('请填写选项'))
      } else {
        callback()
      }
    },
  },
}
</script>

<style></style>
