<template>
  <el-checkbox-group
    v-model="bindValue"
    :disabled="disabled"
    :min="min"
    :max="max"
  >
    <el-checkbox
      :label="item"
      v-for="item in options"
      :key="item"
    ></el-checkbox>
  </el-checkbox-group>
</template>

<script>
import basicOptionsChange from '../mixins/basicOptionsChange'
export default {
  name: 'JWCheckbox',
  mixins: [basicOptionsChange],
  props: {
    min: {
      type: Number,
      default: undefined,
    },
    max: {
      type: Number,
      default: undefined,
    },
  },
}
</script>
