<template>
  <div
    class="widget-form-section"
    :class="{
      active: select.ft_prop == column.ft_prop,
    }"
  >
    <div class="widget-form-section__header">{{ column.title || '--' }}</div>
    <draggable
      class="widget-form-section__body"
      ghost-class="ghost"
      :list="column.tables"
      :group="{
        name: 'form',
        put: !['templates', 'sections'].includes(selectWidget.ft_type),
      }"
      :animation="200"
      @add="handleAdd($event, column)"
      @choose="handleChoose($event, column)"
      @remove="handleRemove"
    >
      <template v-for="(item, tableIndex) in column.tables">
        <widget-form-table
          :data="data"
          :column="item"
          :indexs="[...indexs, tableIndex]"
          :select.sync="selectWidget"
          :key="item.ft_prop"
          @click.native.stop="handleWidgetSelect(tableIndex)"
        >
        </widget-form-table>
      </template>
    </draggable>
    <delete-button
      v-if="selectWidget.ft_prop == column.ft_prop"
      @click.native.stop="handleWidgetDelete"
    />
  </div>
</template>

<script>
import WidgetFormTable from './WidgetFormTable'
import Draggable from 'vuedraggable'
import DeleteButton from './DeleteButton'
import widgetProps from './mixins/widgetProps'

export default {
  name: 'WidgetFormSection',
  inject: ['jwFormDesigner'],
  mixins: [widgetProps],
  components: { WidgetFormTable, Draggable, DeleteButton },
  methods: {
    handleAdd(evt, column) {
      let newIndex = evt.newIndex
      const data = this.deepClone(column.tables[newIndex])
      if (!data.ft_type) {
        data.ft_type = 'headers'
        if (!data.ft_label.includes('只读')) this.setConfiguration(data.control)
      }
      if (!data.ft_prop)
        data.ft_prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)

      // 拖入的是基础控件
      if (data.ft_type === 'headers') {
        let table = {
          name: `表格${column.tables.length}`,
          title: '',
          controls: [],
          headers: [],
          maxRows: 1,
          minRows: 1,
          configurationForRequester: {
            editable: false,
          },
          configurationForResponder: {
            editable: false,
          },
          ft_type: 'tables',
          ft_prop: Date.now() + '_' + Math.ceil(Math.random() * 99999),
        }
        table.headers.push(data)
        this.$set(column.tables, newIndex, table)
      }
      // 拖入的是表格
      if (data.ft_type === 'tables') {
        this.$set(column.tables, newIndex, data)
      }
      this.selectWidget = data
    },
    handleWidgetSelect(index) {
      this.selectWidget = this.column.tables[index]
    },
    handleChoose(evt, column) {
      let oldIndex = evt.oldIndex
      this.selectWidget = column.tables[oldIndex]
    },
    handleRemove() {
      let [templatesIndex, sectionIndex] = this.indexs
      if (this.column.tables.length === 0) {
        // 章节中不含表格时，删除该章节
        this.data.templates[templatesIndex].sections.splice(sectionIndex, 1)
      }
    },
  },
}
</script>
