<template>
  <el-form
    size="small"
    :inline="true"
    :model="searchForm"
    label-suffix=":"
    @submit.native.prevent
  >
    <el-form-item
      v-for="(item, index) in searchOption"
      :key="index"
      :label="item.label"
      v-permission="item.permission"
    >
      <template v-if="!item.searchslot">
        <component
          :is="getComponent(item)"
          :placeholder="item.placeholder"
          :is-range="item.type == 'time'"
          :type="getDatePickerType(item)"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          :options="getSearchCascader(item)"
          clearable
          :props="{
            multiple: item.searchMultiple,
            checkStrictly: item.searchCheckStrictly,
            expandTrigger: item.searcExpandTrigger || 'hover',
            label: getDicDataValue(item).label,
            value: getDicDataValue(item).value,
            emitPath: item.searchEmitPath,
          }"
          :filterable="item.searchFilterable"
          :show-all-levels="item.searchShowAllLevels"
          :default-time="['00:00:00', '23:59:59']"
          v-model.trim="searchForm[item.prop]"
          v-if="!['select'].includes(item.type)"
        ></component>

        <el-select
          v-model="searchForm[item.prop]"
          :placeholder="item.placeholder"
          :multiple="item.searchMultiple"
          :filterable="item.searchFilterable"
          :allow-create="item.searchAllowCreate"
          clearable
          v-else
        >
          <el-option
            :label="selectOption[getDicDataValue(item).label]"
            :value="selectOption[getDicDataValue(item).value]"
            v-for="selectOption in item.dicData"
            :key="selectOption.value"
          ></el-option>
        </el-select>
      </template>
      <template v-else>
        <slot
          :name="slotName"
          v-for="slotName in crud.searchSlot"
          v-bind="{ search: searchForm }"
        ></slot>
      </template>
    </el-form-item>
  </el-form>
</template>

<script>
export default {
  name: 'dynamicForm',
  inject: ['crud'],
  props: {
    search: {
      type: Object,
      default: () => {
        return {}
      },
    },
    searchOption: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      searchForm: {},
    }
  },
  watch: {
    search: {
      handler(val) {
        this.searchForm = val
      },
      immediate: true,
      deep: true,
    },
    searchForm: {
      handler() {
        this.crud.$emit('update:search', this.searchForm)
      },
      immediate: true,
      deep: true,
    },
  },
  methods: {
    getComponent(column) {
      let KEY_COMPONENT_NAME = 'el-'
      let result = 'input'
      let { type } = column
      if (type === 'select') result = 'select'
      else if (type === 'time') result = 'time-picker'
      else if (type === 'date') result = 'date-picker'
      else if (type === 'datetime') result = 'date-picker'
      else if (type === 'cascader') result = 'cascader'
      return KEY_COMPONENT_NAME + result
    },
    getDatePickerType(column) {
      let result = ''
      let { type } = column
      if (type == 'date') return (result = 'daterange')
      else if (type == 'datetime') return (result = 'datetimerange')
      return result
    },
    getSearchCascader(column) {
      return column.dicData || []
    },
    getDicDataValue(item) {
      let dicProps = {
        label: 'label',
        value: 'value',
      }
      if (item.props) {
        dicProps.label = item.props.label
        dicProps.value = item.props.value
      }
      return dicProps
    },
  },
}
</script>
