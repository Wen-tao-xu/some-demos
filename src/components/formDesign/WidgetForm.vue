<template>
  <div class="widget-form-container">
    <draggable
      class="widget-form-list"
      ghost-class="ghost"
      :list="data.templates"
      :group="{ name: 'form', put: false }"
      :animation="300"
    >
      <el-form
        ref="widgetForm"
        label-position="left"
        label-width="100px"
        label-suffix=":"
        size="small"
        :model="form"
        v-for="(item, index) in data.templates"
        :key="index"
        :data-prop="item.ft_prop"
      >
        <el-row>
          <div
            class="widget-form-template"
            :class="{
              active: selectWidget.ft_prop == item.ft_prop,
            }"
            :key="index"
            @click="handleSelectWidget(index)"
          >
            <widget-form-template
              :data="data"
              :column="item"
              :indexs="[index]"
              :select.sync="selectWidget"
              @click.native.stop="handleWidgetSelect(index)"
            >
            </widget-form-template>
          </div>
        </el-row>
      </el-form>
    </draggable>
  </div>
</template>

<script>
import WidgetFormTemplate from './WidgetFormTemplate'
import draggable from 'vuedraggable'
import widgetProps from './mixins/widgetProps'
export default {
  name: 'WidgetForm',
  mixins: [widgetProps],
  components: { draggable, WidgetFormTemplate },
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
      form: {},
    }
  },
  methods: {
    handleWidgetSelect(index) {
      this.selectWidget = this.data.templates[index]
      this.currentTemplateCopy = this.data.templates[index]
    },
  },
}
</script>
