<template>
  <el-select
    v-model="bindValue"
    placeholder="请选择"
    filterable
    clearable
    :multiple="multiple"
    :disabled="disabled"
  >
    <el-option v-for="item in options" :key="item" :label="item" :value="item">
    </el-option>
  </el-select>
</template>

<script>
import basicOptionsChange from '../mixins/basicOptionsChange'
export default {
  name: 'JWSelect',
  mixins: [basicOptionsChange],
  props: {
    multiple: {
      type: Boolean,
      default: false,
    },
  },
}
</script>

<style></style>
