import { index } from 'mathjs'

export default {
  props: {
    // 所有数据
    data: {
      type: Object,
      default: () => {
        return {}
      },
    },
    column: {
      type: Object,
      default: () => {
        return {}
      },
    },
    select: {
      type: Object,
      default: () => {
        return {}
      },
    },
    // column的路径
    indexs: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      selectWidget: this.select,
    }
  },
  watch: {
    select: {
      handler(val) {
        this.selectWidget = val
      },
      deep: true,
    },
    selectWidget: {
      handler(val) {
        this.$emit('update:select', val)
      },
      deep: true,
    },
    indexs: {
      handler(n) {
        this.column.ft_path = n
      },
      immediate: true,
    },
  },
  methods: {
    handleWidgetDelete() {
      let indexs = this.indexs
      let keys = ['templates', 'sections', 'tables', 'headers'] // 每个层级的集合，下标与indexs下标一致
      let currentItem = this.data, // 当前点击删除的控件
        lenList = [] // 各个层级集合的长度集合
      for (let i = 0; i < indexs.length; i++) {
        let v = indexs[i]
        let key = keys[i]
        list = currentItem[key]
        lenList[i] = currentItem[key].length
        if (currentItem[key] && currentItem[key][v]) {
          currentItem = currentItem[key][v]
        }
      }
      let b = lenList.reverse().findIndex((v) => v != 1) // 要删除的list下标(逆向)
      let c = lenList.length - b - 1 // 正向要删除的list的类型下标

      // 当删除了具体某一项时，若所在层级长度为0，则删除该层级的所在项；
      // temolates层级中各项的sections为空时应当保留该temolate项
      if (indexs.length == 1) {
        this.data.templates.splice(indexs[0], 1)
        this.jwFormDesigner.widgetFormSelect = this.data.templates[indexs[0]]
      } else if (b == -1 || c == 0) {
        this.data.templates[indexs[0]].sections.splice(indexs[1], 1)
        this.jwFormDesigner.widgetFormSelect = this.data.templates[indexs[0]]
      } else {
        let delItem = this.data
        const delKey = keys[c] // 要删除的层级key
        const delOuterKey = keys[c - 1] // 要删除的层级的父层级key
        for (let i = 0; i < indexs.length; i++) {
          let v = indexs[i]
          let key = keys[i]
          if (delItem[key] && delItem[key][v]) {
            delItem = delItem[key][v]
            if (key == delOuterKey) {
              delItem[delKey].splice(indexs[c], 1)
              this.jwFormDesigner.widgetFormSelect = delItem[delKey][0]
              return
            }
          }
        }
      }
    },
    setConfiguration(widgetControl) {
      let type = this.data.templates[this.indexs[0]].type
      switch (type) {
        // ①交付收集：发起者默认不勾选编辑，响应者默认勾选编辑和必填，
        case 'DeliveryCollectionTemplate':
          widgetControl.configurationForRequester.editable = false
          widgetControl.configurationForRequester.required = false
          widgetControl.configurationForResponder.editable = true
          widgetControl.configurationForResponder.required = true
          break
        // ②交付通知：发起者默认勾选编辑和必填，响应者不勾选编辑(且置灰不可勾选)
        case 'DeliveryRequestTemplate':
          widgetControl.configurationForRequester.editable = true
          widgetControl.configurationForRequester.required = true
          widgetControl.configurationForResponder.editable = false
          widgetControl.configurationForResponder.required = false
          widgetControl.configurationForResponder.disabled = true
          break
        // ③交付请求：发起者默认勾选编辑和必填，响应者不勾选编辑(且置灰不可勾选)
        case 'DeliveryNotificationTemplate':
          widgetControl.configurationForRequester.editable = true
          widgetControl.configurationForRequester.required = true
          widgetControl.configurationForResponder.editable = false
          widgetControl.configurationForResponder.required = false
          widgetControl.configurationForResponder.disabled = true
          break
      }
    },
  },
}
