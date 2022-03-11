<template>
  <el-radio-group v-model="bindValue" :disabled="disabled">
    <el-radio
      :label="item"
      v-for="item in options"
      :key="item"
      @click.prevent.native="onRadioClick(item)"
      >{{ item }}</el-radio
    >
  </el-radio-group>
</template>

<script>
import basicOptionsChange from '../mixins/basicOptionsChange'
export default {
  name: 'JWRadio',
  mixins: [basicOptionsChange],
  methods: {
    onRadioClick(val) {
      if (val == this.bindValue) {
        this.bindValue = ''
      } else {
        this.bindValue = val
      }
      document.activeElement.blur()
    },
  },
}
</script>
