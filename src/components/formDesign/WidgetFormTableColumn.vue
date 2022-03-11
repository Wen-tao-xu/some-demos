<template>
  <el-col :span="currentTable.headers.length === 1 ? 24 : 8">
    <div
      v-if="currentTable.headers.length === 1 && column.ft_values.length == 1"
    >
      <el-form-item
        class="widget-form-item"
        :label="column.title"
        :labelWidth="column.labelWidth || '90px'"
        :prop="column.prop"
        :class="{
          active: selectWidget.ft_prop == column.ft_prop,
          required:
            column.control.configurationForRequester.required ||
            column.control.configurationForResponder.required,
        }"
      >
        <template v-slot:label>
          <el-tooltip
            placement="top-start"
            :content="column.title"
            :disabled="!column.title"
            v-bind="elTooltip"
          >
            <p class="line-ellipsis widget-form-item__label">
              {{ column.title }} <span v-if="column.title">：</span>
            </p>
          </el-tooltip>
        </template>
        <widget-form-item :item="column" :index="0"></widget-form-item>
        <delete-button
          v-if="selectWidget.ft_prop == column.ft_prop"
          @click.native.stop="handleWidgetDelete()"
        />
      </el-form-item>
    </div>
    <div
      class="widget-form-item widget-form-item-table"
      :class="{
        active: selectWidget.ft_prop == column.ft_prop,
        required:
          column.control.configurationForRequester.required ||
          column.control.configurationForResponder.required,
      }"
      v-else
    >
      <el-table ref="table" :data="tableData" border :resizable="false">
        <el-table-column
          v-if="
            indexs[indexs.length - 1] == 0 &&
            (currentTable.configurationForRequester.editable ||
              currentTable.configurationForResponder.editable)
          "
          class-name="index-column"
          type="index"
          align="center"
          width="70"
        >
          <template v-slot="{ $index }">
            <el-button
              class="delete-btn"
              type="text"
              circle
              size="small"
              icon="el-icon-delete"
              @click="removeRow($index)"
            ></el-button>
            <span class="index-txt">{{ $index + 1 }}</span>
          </template>
          <template v-slot:header>
            <el-button
              type="primary"
              circle
              size="small"
              icon="el-icon-plus"
              @click="addRow"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column :prop="column.name" :label="column.title">
          <template v-slot="{ $index }">
            <widget-form-item
              ref="widgetFormItems"
              :item="column"
              :index="$index"
            ></widget-form-item>
          </template>
        </el-table-column>
      </el-table>
      <delete-button
        v-if="selectWidget.ft_prop == column.ft_prop"
        @click.native.stop="handleWidgetDelete()"
      />
    </div>
  </el-col>
</template>

<script>
import WidgetFormItem from './WidgetFormItem'
import DeleteButton from './DeleteButton'
import widgetProps from './mixins/widgetProps'

export default {
  name: 'WidgetFormTableColumn',
  inject: ['jwFormDesigner'],
  mixins: [widgetProps],
  components: { WidgetFormItem, DeleteButton },
  data() {
    return {
      elTooltip: {
        enterable: false,
        placement: 'top',
        effect: 'dark',
      },
    }
  },
  computed: {
    tableData() {
      let tableData = []
      if (this.column.ft_values) {
        this.column.ft_values.forEach((val) => {
          let obj = {}
          obj[this.column.name] = val
          tableData.push(obj)
        })
      }
      return tableData
    },
    currentTable: {
      get() {
        let [templatesIndex, sectionIndex, tablesIndex] = this.indexs
        return this.data.templates[templatesIndex].sections[sectionIndex]
          .tables[tablesIndex]
      },
      set(val) {
        let [templatesIndex, sectionIndex, tablesIndex] = this.indexs
        this.data.templates[templatesIndex].sections[sectionIndex].tables[
          tablesIndex
        ] = val
      },
    },
  },
  watch: {
    // 最小行数调整时，补充行
    'currentTable.minRows'(val) {
      let rowLen = val - this.column.ft_values.length
      this.$nextTick(() => {
        for (let i = 0; i < rowLen; i++) {
          this.addRow()
        }
      })
    },
  },
  methods: {
    addRow() {
      if (this.column.ft_values.length >= this.currentTable.maxRows) {
        this.$message.warning(`最多可添加${this.currentTable.maxRows}行`)
        return
      }
      this.currentTable.headers.forEach((header) => {
        header.ft_values.push(undefined)
      })
    },
    removeRow(index) {
      if (this.column.ft_values.length <= this.currentTable.minRows) {
        this.$message.warning(`最少存在${this.currentTable.minRows}行`)
        return
      }
      this.currentTable.headers.forEach((header) => {
        header.ft_values.splice(index, 1)
      })
    },
  },
}
</script>
