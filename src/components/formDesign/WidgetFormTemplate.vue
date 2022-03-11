<template>
  <div>
    <div class="widget-form-template__header">
      <div class="left">
        <p class="gray-txt">{{ templateTypeMap[column.type] || '--' }}</p>
        <p>{{ column.title || '--' }}</p>
      </div>
      <!-- <div class="center">标题</div> -->
      <div class="right">
        <el-button type="text" @click.stop="handleCopy">复制</el-button>
        <el-button type="text" @click.stop="handlePreview">预览</el-button>
        <el-button
          type="text"
          class="el-icon-delete"
          @click="handleWidgetDelete"
        ></el-button>
      </div>
    </div>
    <draggable
      class="widget-form-template__body"
      ghost-class="ghost"
      :list="column.sections"
      :group="{
        name: 'form',
        put: !['templates'].includes(selectWidget.ft_type),
      }"
      :animation="200"
      @add="handleDraggableAdd($event, column)"
      @choose="handleChoose($event, column)"
    >
      <template v-for="(item, sectionIndex) in column.sections">
        <widget-form-section
          :data="data"
          :column="item"
          :indexs="[...indexs, sectionIndex]"
          :select.sync="selectWidget"
          :key="item.ft_prop"
          @click.native.stop="handleWidgetSelect(sectionIndex)"
        >
        </widget-form-section>
      </template>
    </draggable>
  </div>
</template>

<script>
import WidgetFormSection from './WidgetFormSection'
import Draggable from 'vuedraggable'
import widgetProps from './mixins/widgetProps'

export default {
  name: 'WidgetFormTemplate',
  inject: ['jwFormDesigner'],
  components: { WidgetFormSection, Draggable },
  mixins: [widgetProps],
  data() {
    return {
      templateTypeMap: {
        DeliveryCollectionTemplate: '交付收集',
        DeliveryRequestTemplate: '交付请求',
        DeliveryNotificationTemplate: '交付通知',
      },
    }
  },
  methods: {
    handleDraggableAdd(evt, column) {
      let newIndex = evt.newIndex
      const data = this.deepClone(column.sections[newIndex])

      // 校验交付信息模板配置是否填写
      if (!column.ft_typeDisable) {
        this.$message.warning('当前交付信息模板未确认类型，请先确认模板类型')
        this.selectWidget = column
        column.sections.splice(newIndex, 1)
        return
      }
      if (!data.ft_type) {
        data.ft_type = 'headers'
        if (!data.ft_label.includes('只读')) this.setConfiguration(data.control)
      }
      if (!data.ft_prop)
        data.ft_prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)

      let section = {
        name: `章节${column.sections.length}`,
        title: '',
        description: '',
        tables: [],
        ft_type: 'sections',
        ft_prop: Date.now() + '_' + Math.ceil(Math.random() * 99999),
      }
      if (data.ft_type === 'headers') {
        let table = {
          name: '表格1',
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
        section.tables.push(table)
        this.$set(column.sections, newIndex, section)
      }
      if (data.ft_type === 'tables') {
        section.tables.push(data)
        this.$set(column.sections, newIndex, section)
      }
      if (data.ft_type === 'sections') {
        this.$set(column.sections, newIndex, data)
      }
      this.selectWidget = data
    },
    handleWidgetSelect(index) {
      this.selectWidget = this.column.sections[index]
    },
    handleChoose(evt, column) {
      let oldIndex = evt.oldIndex
      this.selectWidget = column.sections[oldIndex]
    },
    handleCopy() {
      let copyTemplate = this.deepClone(this.data.templates[this.indexs[0]])
      copyTemplate.name += '_副本'
      let ft_prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      copyTemplate.ft_prop = ft_prop
      this.reWriteFtProp(copyTemplate)
      this.data.templates.splice(this.indexs[0] + 1, 0, copyTemplate)
    },
    // 复制模板时重写模板下各个层级的ft_prop，防止配置表单key值重复
    reWriteFtProp(data) {
      let keys = ['sections', 'tables', 'headers']
      let ft_prop = Date.now() + '_' + Math.ceil(Math.random() * 99999)
      keys.forEach((key) => {
        if (data[key]) {
          data[key].forEach((item) => {
            item.ft_prop = ft_prop
            this.reWriteFtProp(item)
          })
        }
      })
    },
    async handlePreview() {
      try {
        await this.jwFormDesigner.$refs.WidgetConfig.validateConfigForm(
          this.column
        )
        let data = this.deepClone(this.column)
        this.jwFormDesigner.handleKeysList(data, true)
        this.jwFormDesigner.previewTemplatedata = data
        this.jwFormDesigner.drawerVisible = true
      } catch (err) {
        console.log(err)
        this.$message.warning('存在控件未配置完成，请将控件配置完整后预览')
        this.selectWidget = err
      }
    },
  },
}
</script>
