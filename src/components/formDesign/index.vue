<template>
  <div class="form-design">
    <el-container class="form-design__body">
      <el-aside :width="leftWidth">
        <div class="fields-list custom-scroll">
          <div v-for="(fieldGroup, index) in fields" :key="index">
            <draggable
              v-if="!fieldGroup.hide"
              tag="ul"
              class="divider"
              :list="fieldGroup.list"
              :group="{ name: 'form', pull: 'clone', put: false }"
              :sort="false"
              ghost-class="ghost"
              @choose="handleChoose($event, fieldGroup.list)"
            >
              <li
                class="fields-item"
                v-for="(item, i) in fieldGroup.list"
                :key="i"
              >
                {{ item.ft_label }}
              </li>
            </draggable>
          </div>
        </div>
      </el-aside>
      <el-main class="form-design__main custom-scroll" id="FormBody">
        <widget-form
          ref="widgetForm"
          :data="widgetForm"
          :select.sync="widgetFormSelect"
        ></widget-form>
      </el-main>
      <el-aside :width="rightWidth">
        <div class="right-aside custom-scroll">
          <div class="btn-wrap justify-left">
            <el-button type="primary" size="small" @click="addInfoTemplate"
              >新增交付信息模板</el-button
            >
            <el-button type="primary" size="small" @click="handleSave"
              >保存</el-button
            >
          </div>
          <WidgetConfig
            ref="WidgetConfig"
            :data.sync="widgetForm"
            :select.sync="widgetFormSelect"
          />
        </div>
      </el-aside>
    </el-container>
    <!-- 预览 -->
    <el-drawer
      direction="rtl"
      size="50%"
      :visible.sync="drawerVisible"
      :show-close="false"
      ref="drawer"
    >
      <i
        class="el-icon-d-arrow-right"
        style="font-size: 30px; padding: 10px; cursor: pointer"
        @click="closePreview"
      ></i>
      <Preview :template="previewTemplatedata"></Preview>
    </el-drawer>
  </div>
</template>

<script>
import fields from './fieldsConfig.js'
import Draggable from 'vuedraggable'
import WidgetForm from './WidgetForm'
import WidgetConfig from './WidgetConfig'
import { validatenull } from '@/utils/validate'
import Preview from './preview'

export default {
  name: 'jwFormDesign',
  provide() {
    return {
      jwFormDesigner: this,
    }
  },
  components: {
    Draggable,
    WidgetConfig,
    WidgetForm,
    Preview,
  },
  props: {
    asideLeftWidth: {
      type: [String, Number],
      default: '200px',
    },
    asideRightWidth: {
      type: [String, Number],
      default: '400px',
    },
    data: {
      type: Object,
      default: () => {
        return {
          id: undefined, // 编辑反显时存在id
          businessId: '',
          name: '',
          predefinedErrors: [], // 预设错误集合
          templates: [], // 模板集合
        }
      },
    },
  },
  data() {
    return {
      fields,
      drawerVisible: false,
      widgetForm: this.data,
      widgetFormSelect: {},
      previewTemplatedata: {},
    }
  },
  computed: {
    leftWidth() {
      if (typeof this.asideLeftWidth == 'string') {
        return this.asideLeftWidth
      } else {
        return `${this.asideLeftWidth}px`
      }
    },
    rightWidth() {
      if (typeof this.asideRightWidth == 'string') {
        return this.asideRightWidth
      } else {
        return `${this.asideRightWidth}px`
      }
    },
  },
  watch: {
    data: {
      handler(val) {
        this.widgetForm = val
        this.widgetForm.ft_type = 'templateCollection'
      },
      deep: true,
    },
    widgetForm: {
      handler(val) {
        this.$emit('update:data', val)
      },
      deep: true,
    },
    'widgetForm.id': {
      handler(val) {
        let temp = this.widgetForm
        if (val) this.handleKeysList(temp, false)
      },
      immediate: true,
    },
  },
  methods: {
    closePreview() {
      this.drawerVisible = false
      this.previewTemplatedata = {}
    },
    handleChoose(evt, column) {
      let oldIndex = evt.oldIndex
      this.widgetFormSelect = column[oldIndex]
    },
    async addInfoTemplate() {
      try {
        let { templates } = this.widgetForm
        await this.$refs.WidgetConfig.validateConfigForm()
        let template = {
          name: '',
          title: '',
          description: '',
          type: '', // 交付信息模板类型
          sections: [],
          ft_typeDisable: false, // 模板类型锁
          ft_type: 'templates',
          ft_prop: Date.now() + '_' + Math.ceil(Math.random() * 99999),
        }
        templates.push(template)
        let len = templates.length
        this.widgetFormSelect = templates[len - 1]
      } catch (err) {
        console.log(err)
        this.$message.warning('请完善模板集配置内容')
        this.widgetFormSelect = err
      }
    },
    // 保存按钮事件
    async handleSave() {
      try {
        let { templates } = this.widgetForm
        if (!templates.length) {
          return this.$message.warning('请至少添加一个交付信息模板')
        }
        await this.$refs.WidgetConfig.validateConfigForm()
        let widgetFormCopy = this.deepClone(this.widgetForm)
        let temp = widgetFormCopy
        this.handleKeysList(temp, true)
        this.$emit('save', widgetFormCopy)
      } catch (err) {
        console.log(err)
        this.$message.warning('请完善模板集配置内容')
        this.widgetFormSelect = err
      }
    },
    // 数据转换处理；bol==true时提交数据，否则为页面反显数据处理
    handleKeysList(temp, bol) {
      let keys = [
        'templateCollection',
        'templates',
        'sections',
        'tables',
        'headers',
      ]
      for (let i = 0; i < keys.length; i++) {
        let key = keys[i]
        if (temp[key]) {
          temp[key].forEach((item) => {
            let tables = item.tables || []
            // 新增or删除自定义字段，ft_
            if (bol) {
              delete item.ft_type
              delete item.ft_prop
              delete item.ft_path
              delete item.ft_typeDisable
              this.handleTableControls(tables)
              delete item.ft_values
            } else {
              this.handleTableControlsReverse(tables)
              item.ft_type = key
              if (!item.ft_prop)
                item.ft_prop =
                  Date.now() + '_' + Math.ceil(Math.random() * 99999)
              if (key === 'templates') {
                item.ft_typeDisable = true
              }
            }
            this.handleKeysList(item, bol)
          })
        }
      }
    },
    // 行与列的数据处理
    handleTableControls(tables = []) {
      tables.forEach((table) => {
        let rows = [] // 二维数组，外层行内层列
        table.headers.forEach((header, colIndex) => {
          header.ft_values.forEach((value, rowIndex) => {
            let obj = this.deepClone(header.control)
            if (Array.isArray(value)) {
              !validatenull(value) && (obj.values = value)
            } else {
              !validatenull(value) && (obj.value = value)
            }

            if (!rows[rowIndex]) {
              rows.push([])
            }
            if (!rows[rowIndex][colIndex]) {
              rows[rowIndex].push([])
            }
            rows[rowIndex][colIndex] = obj
          })
        })
        table.controls = rows
      })
    },
    // 行与列的数据处理--反向
    handleTableControlsReverse(tables = []) {
      tables.forEach((table) => {
        table.controls.forEach((row, rowIndex) => {
          row.forEach((col, colIndex) => {
            if (!table.headers[colIndex].ft_values) {
              this.$set(table.headers[colIndex], 'ft_values', [])
            }
            if (col.value) {
              table.headers[colIndex].ft_values[rowIndex] = col.value
            } else if (col.values) {
              table.headers[colIndex].ft_values[rowIndex] = col.values
            } else {
              // 复原行数
              table.headers[colIndex].ft_values = []
              for (let i = 0; i < table.controls.length; i++) {
                table.headers[colIndex].ft_values.push(undefined)
              }
            }
          })
        })
      })
    },
    // 滚动到对应模板位置
    scrollToTemplateByName(name) {
      let prop = ''
      this.widgetForm.templates.forEach((item) => {
        if (item.name === name) {
          prop = item.ft_prop
          this.widgetFormSelect = item
        }
      })
      let domList = document.querySelectorAll('.el-form')
      let scrollTop = ''
      domList.forEach((dom) => {
        if (dom.getAttribute('data-prop') == prop) {
          scrollTop = dom.offsetTop
        }
      })
      document.getElementById('FormBody').scrollTop = scrollTop - 141
    },
  },
}
</script>

<style lang="scss">
@import './styles/index.scss';
.form-design {
  .justify-left {
    justify-content: left;
  }
}
</style>
