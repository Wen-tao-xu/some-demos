<template>
  <div
    class="widget-form-table"
    :class="{
      active: select.ft_prop == column.ft_prop,
    }"
  >
    <div class="widget-form-section__header">{{ column.title || '--' }}</div>
    <draggable
      tag="el-row"
      class="widget-form-table__body custom-scroll"
      ghost-class="ghost"
      :list="column.headers"
      :group="{
        name: 'form',
        put: !['templates', 'sections', 'tables'].includes(
          selectWidget.ft_type
        ),
      }"
      :animation="200"
      @add="handleDraggableAdd($event, column)"
      @choose="handleChoose($event, column)"
      @remove="handleRemove"
    >
      <template v-for="(item, headerIndex) in column.headers">
        <WidgetFormTableColumn
          ref="WidgetFormTableColumn"
          :key="item.ft_prop"
          :data="data"
          :column="item"
          :select.sync="selectWidget"
          :indexs="[...indexs, headerIndex]"
          @click.native.stop="handleWidgetSelect(headerIndex)"
        />
      </template>
    </draggable>
    <delete-button
      v-if="selectWidget.ft_prop == column.ft_prop"
      @click.native.stop="handleWidgetDelete"
    />
  </div>
</template>

<script>
import WidgetFormItem from './WidgetFormItem'
import WidgetFormTableColumn from './WidgetFormTableColumn'
import DeleteButton from './DeleteButton'
import Draggable from 'vuedraggable'
import widgetProps from './mixins/widgetProps'
export default {
  name: 'WidgetFormTable',
  inject: ['jwFormDesigner'],
  mixins: [widgetProps],
  components: {
    WidgetFormItem,
    WidgetFormTableColumn,
    DeleteButton,
    Draggable,
  },
  data() {
    return {
      rowNum: 1,
    }
  },
  watch: {
    'column.headers': {
      handler(headers) {
        let rowNum = 1
        if (headers) {
          headers.forEach((item) => {
            if (item.ft_values.length > rowNum) {
              rowNum = item.ft_values.length
            }
          })
        }
        this.rowNum = rowNum
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    handleDraggableAdd(evt, column) {
      let newIndex = evt.newIndex
      const data = this.deepClone(column.headers[newIndex])
      if (!data.ft_type) {
        data.ft_type = 'headers'
        if (!data.ft_label.includes('只读')) this.setConfiguration(data.control)
        this.addRows(data)
      }
      if (!data.ft_prop)
        data.ft_prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      this.$set(column.headers, newIndex, { ...data })
      this.selectWidget = column.headers[newIndex]
    },
    handleWidgetSelect(index) {
      this.selectWidget = this.column.headers[index]
    },
    handleChoose(evt, column) {
      let oldIndex = evt.oldIndex
      this.selectWidget = column.headers[oldIndex]
    },
    handleRemove() {
      let [templatesIndex, sectionIndex, tablesIndex] = this.indexs
      if (this.column.headers.length === 0) {
        // 表格中不含列时，删除该表格
        this.data.templates[templatesIndex].sections[
          sectionIndex
        ].tables.splice(tablesIndex, 1)
        if (
          this.data.templates[templatesIndex].sections[sectionIndex].tables
            .length === 0
        ) {
          // 章节中不含表格时，删除该章节
          this.data.templates[templatesIndex].sections.splice(sectionIndex, 1)
        }
      }
    },
    // 补充基础控件行
    addRows(data) {
      if (this.rowNum > 1) {
        for (let i = 1; i < this.rowNum; i++) {
          data.ft_values.push(null)
        }
      }
      this.rowNum = 1
    },
  },
}
</script>
