<template>
  <div class="column">
    <slot name="header"></slot>
    <div v-for="(column, index) in columnOption" :key="column.prop + index">
      <el-table-column
        v-if="!column.hide"
        :prop="column.prop"
        :label="column.label"
        :sortable="column.sortable"
        :width="column.width"
        :min-width="column.minWidth"
        :align="column.align || crud.option.align"
        :header-align="column.headerAlign || crud.option.headerAlign"
      >
        <template slot="header" slot-scope="{ $index }">
          <slot
            :name="crud.getSlotName(column, 'H')"
            v-if="crud.getSlotName(column, 'H', crud.$scopedSlots)"
            v-bind="{ column, $index }"
          ></slot>
          <span v-else>{{ column.label }}</span>
        </template>
        <template slot-scope="{ row, $index }">
          <slot
            v-if="crud.$scopedSlots[column.prop]"
            :row="row"
            :value="row[column.prop]"
            :index="$index"
            :label="column.label"
            :name="column.prop"
          ></slot>
          <span v-else v-html="handleDetail(row, column)"></span>
        </template>
      </el-table-column>
    </div>
    <slot name="footer"></slot>
  </div>
</template>

<script>
import moment from 'moment'
import { validatenull } from '@/utils/validate'
const DIC_PROPS = {
  label: 'label',
  value: 'value',
  children: 'children',
}
const DATE_LIST = ['date', 'datetime', 'time']

export default {
  name: 'tableColumn',
  inject: ['crud'],
  props: {
    columnOption: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {}
  },
  methods: {
    // 根据label去找到节点
    findLabelNode(dic, value, props, obj) {
      let result
      let rev = (dic1) => {
        const labelKey = props.label || DIC_PROPS.label
        const valueKey = props.value || DIC_PROPS.value
        const childrenKey = props.children || DIC_PROPS.children
        for (let i = 0; i < dic1.length; i++) {
          const ele = dic1[i]
          const children = ele[childrenKey] || []
          if (ele[valueKey] === value) {
            result = obj ? ele : ele[labelKey]
          } else {
            rev(children)
          }
        }
      }
      rev(dic)
      return result
    },
    // 根据字典的value显示label
    findByValue(dic, value, props) {
      // 如果为空直接返回
      if (validatenull(dic) || validatenull(value)) return value
      let result = ''
      let isArray = value instanceof Array
      let list = isArray ? value : [value]
      props = props || DIC_PROPS
      result = []
      for (let i = 0; i < list.length; i++) {
        result.push(this.findLabelNode(dic, list[i], props) || list[i])
      }
      if (isArray) {
        return result.join('、').toString()
      }
      return result.join()
    },
    handleDetail(row, column) {
      let result = row[column.prop]
      let type = column.type
      let dic = column.dicData || []
      // 时间日期处理
      if (!validatenull(result) && DATE_LIST.includes(type) && column.format) {
        result = moment(new Date(result)).format(column.format)
      }
      // 字典处理
      if (!validatenull(dic)) {
        result = this.findByValue(dic, result, column.props)
      }
      // 自定义格式化
      if (column.formatter && typeof column.formatter === 'function') {
        result = column.formatter(row, row[column.prop], result, column)
      }
      return result
    },
  },
}
</script>

<style></style>
