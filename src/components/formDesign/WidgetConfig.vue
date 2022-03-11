<template>
  <div class="widget-config">
    <el-collapse v-model="activeName" accordion @change="onCollapseChange">
      <el-collapse-item title="交付信息模板集" name="templateCollection">
        <template slot="title">
          <el-tooltip
            placement="top-start"
            popper-class="top-start"
            :content="widgetData.name"
            :disabled="!widgetData.name"
            v-bind="elTooltip"
          >
            <p class="line-ellipsis">
              <span class="collapse-title">交付信息模板集</span
              >{{ widgetData.name }}
            </p>
          </el-tooltip>
        </template>
        <TemplateCollection ref="templateCollection" :data="widgetData" />
      </el-collapse-item>
      <el-collapse-item
        title="交付信息模板"
        name="templates"
        v-for="(template, index) in templatesList"
        :key="template.ft_prop"
        v-show="
          ['templates', 'sections', 'tables', 'headers'].includes(
            selectWidget.ft_type
          ) && getSamePath(template.ft_path)
        "
      >
        <template slot="title">
          <el-tooltip
            placement="top-start"
            popper-class="top-start"
            :content="template.name"
            :disabled="!template.name"
            v-bind="elTooltip"
          >
            <p class="line-ellipsis">
              <span class="collapse-title">交付信息模板</span
              >{{ template.name }}
            </p>
          </el-tooltip>
        </template>
        <Templates
          ref="templates"
          :data.sync="templatesList[index]"
          :parent="templatesList"
        />
      </el-collapse-item>
      <el-collapse-item
        title="章节"
        name="sections"
        v-for="(section, index) in sectionsList"
        :key="section.ft_prop"
        v-show="
          ['sections', 'tables', 'headers'].includes(selectWidget.ft_type) &&
          getSamePath(section.ft_path)
        "
      >
        <template slot="title">
          <el-tooltip
            placement="top-start"
            popper-class="top-start"
            :content="section.name"
            :disabled="!section.name"
            v-bind="elTooltip"
          >
            <p class="line-ellipsis">
              <span class="collapse-title">章节</span>{{ section.name }}
            </p>
          </el-tooltip>
        </template>
        <Section
          ref="sections"
          :data.sync="sectionsList[index]"
          :parent="getParentList(section)"
        />
      </el-collapse-item>
      <el-collapse-item
        title="表格"
        name="tables"
        v-for="(table, index) in tablesList"
        :key="table.ft_prop"
        v-show="
          ['tables', 'headers'].includes(selectWidget.ft_type) &&
          getSamePath(table.ft_path)
        "
      >
        <template slot="title">
          <el-tooltip
            placement="top-start"
            popper-class="top-start"
            :content="table.name"
            :disabled="!table.name"
            v-bind="elTooltip"
          >
            <p class="line-ellipsis">
              <span class="collapse-title">表格</span>{{ table.name }}
            </p>
          </el-tooltip>
        </template>
        <Table
          ref="tables"
          :data.sync="tablesList[index]"
          :parent="getParentList(table)"
        />
      </el-collapse-item>
      <el-collapse-item
        title="列"
        name="headers"
        v-for="(header, index) in headersList"
        :key="header.ft_prop"
        v-show="
          ['headers'].includes(selectWidget.ft_type) &&
          getSamePath(header.ft_path)
        "
      >
        <template slot="title">
          <el-tooltip
            placement="top-start"
            popper-class="top-start"
            :content="header.name"
            :disabled="!header.name"
            v-bind="elTooltip"
          >
            <p class="line-ellipsis">
              <span class="collapse-title">列{{ widgetPath[3] + 1 }}</span
              >{{ header.name }}
            </p>
          </el-tooltip>
        </template>
        <Column
          ref="headers"
          :templateCollectionData="data"
          :data.sync="headersList[index]"
          :parent="getParentList(header)"
        />
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
import TemplateCollection from './config/TemplateCollection.vue'
import Templates from './config/Templates.vue'
import Section from './config/Section.vue'
import Table from './config/Table.vue'
import Column from './config/Column.vue'
import widgetProps from './mixins/widgetProps'
export default {
  name: 'WidgetConfig',
  mixins: [widgetProps],
  components: {
    TemplateCollection,
    Templates,
    Section,
    Table,
    Column,
  },
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
  },
  data() {
    return {
      activeName: 'templateCollection',
      widgetData: this.data,
      elTooltip: {
        enterable: false,
        placement: 'top',
        effect: 'dark',
      },
      headersList: [],
      tablesList: [],
      sectionsList: [],
      templatesList: [],
    }
  },
  computed: {
    widgetPath() {
      return this.selectWidget.ft_path || []
    },
  },
  watch: {
    data: {
      handler(val) {
        let keys = ['templates', 'sections', 'tables', 'headers']
        keys.forEach((key) => {
          this[`${key}List`] = []
        })
        this.getWidgetList(val.templates || [], 'templates')
        this.widgetData = val
      },
      deep: true,
    },
    widgetData: {
      handler(val) {
        this.$emit('update:data', val)
      },
    },
    selectWidget: {
      handler(val) {
        this.activeName = val.ft_type || 'templateCollection'
        if (val.ft_type) {
          this.getWidgetData()
        }
        this.$emit('update:select', val)
      },
      deep: true,
    },
  },
  methods: {
    onCollapseChange(name) {
      /* if (name == 'templateCollection') {
        this.selectWidget = this.data
      } else if (name) {
        // 展开时选中对应控件 ['templates', 'sections', 'tables', 'headers']
        this.selectWidget = this[`${name}Data`]
      } */
    },
    // 校验所有模板的配置表单 传templateData时，只校验传入的模板
    validateConfigForm(templateData) {
      let refs = Object.keys(this.$refs)
      let list = []
      refs.forEach((key) => {
        let ref = this.$refs[key]
        if (Array.isArray(ref)) {
          ref.forEach((item) => {
            if (templateData) {
              if (item.data.ft_path[0] == templateData.ft_path[0]) {
                list.push(item.validate())
              }
            } else {
              list.push(item.validate())
            }
          })
        } else {
          list.push(ref.validate())
        }
      })
      return Promise.all(list)
    },
    // 获取各个层级的list集合
    getWidgetList(list, key) {
      let keys = ['sections', 'tables', 'headers']
      list.forEach((item) => {
        this[`${key}List`].push(item)
        keys.forEach((k) => {
          if (item[k]) {
            this.getWidgetList(item[k], k)
          }
        })
      })
    },
    // 获取当前模板各级的数据
    getWidgetData() {
      let indexs = this.widgetPath
      let keys = ['templates', 'sections', 'tables', 'headers']
      let temp = this.widgetData
      for (let i = 0; i < indexs.length; i++) {
        let widgetIndex = indexs[i]
        let key = keys[i]
        if (temp[key] && temp[key][widgetIndex]) {
          temp = temp[key][widgetIndex]
          this[`${keys[i]}Data`] = temp
        } else {
          break
        }
      }
    },
    // 判断是否属于当前选中的模板层
    getSamePath(path = []) {
      let result = 0
      this.widgetPath.forEach((item, index) => {
        if (path[index] !== undefined && path[index] === item) {
          result += 1
        }
      })
      return result == path.length
    },
    // 获取item所在list集合
    getParentList(item) {
      let keys = ['templates', 'sections', 'tables', 'headers']
      let indexs = item.ft_path || [],
        list = [],
        temp = { ...this.data }
      for (let i = 0; i < indexs.length; i++) {
        let v = indexs[i]
        let key = keys[i]
        list = temp[key]
        if (temp[key] && temp[key][v]) {
          temp = temp[key][v]
        } else {
          list = temp[key]
          break
        }
      }
      return list
    },
  },
}
</script>
