<template>
  <el-table-column
    v-if="vaildData(crud.option.menu, config.menu)"
    prop="menu"
    fixed="right"
    :align="crud.option.menuAlign || config.menuAlign"
    :header-align="crud.option.menuHeaderAlign || config.menuHeaderAlign"
    :label="crud.option.menuTitle || config.menuTitle"
    :width="crud.option.menuWidth || config.menuWidth"
  >
    <template slot-scope="{ row, $index }">
      <slot
        name="menu"
        :row="row"
        :type="menuText('primary')"
        :disabled="crud.btnDisabled"
        :size="crud.isMediumSize"
        :index="$index"
      ></slot>
    </template>
  </el-table-column>
</template>

<script>
import config from './config.js'
import { vaildData } from '@/utils/validate'

export default {
  name: 'columnMenu',
  inject: ['crud'],
  data() {
    return {
      config,
      vaildData,
    }
  },
  methods: {
    menuText(value) {
      return ['text', 'menu'].includes(this.menuType) ? 'text' : value
    },
  },
}
</script>
