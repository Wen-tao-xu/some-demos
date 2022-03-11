<template>
  <el-form ref="form" :model="form" label-suffix="：">
    <el-form-item
      label="交付信息模板集名称"
      prop="name"
      :rules="{ required: true, message: '请输入交付信息模板集名称' }"
    >
      <el-input
        v-model="form.name"
        placeholder="请输入"
        maxlength="30"
      ></el-input>
    </el-form-item>
    <el-form-item label="错误表">
      <el-table
        size="mini"
        :data="form.predefinedErrors"
        border
        :resizable="false"
      >
        <el-table-column
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
              size="mini"
              icon="el-icon-delete"
              @click="removeErrorRow($index)"
            ></el-button>
            <span class="index-txt">{{ $index + 1 }}</span>
          </template>
          <template v-slot:header>
            <el-button
              type="primary"
              circle
              size="mini"
              icon="el-icon-plus"
              @click="addErrorRow"
            ></el-button>
          </template>
        </el-table-column>
        <el-table-column width="110" prop="code" label="错误码">
          <template v-slot="{ row, $index }">
            <el-form-item
              size="mini"
              style="margin: 15px 0"
              :prop="`predefinedErrors[${$index}].code`"
              :rules="{ validator: checkErrorsCode, trigger: 'blur' }"
            >
              <el-input-number
                v-model="row.code"
                step-strictly
                :step="1"
                :min="-1000"
                :max="-1"
                :controls="false"
                placeholder="请输入"
                style="width: 70px"
              ></el-input-number>
            </el-form-item>
          </template>
        </el-table-column>
        <el-table-column prop="meaasge" label="错误信息">
          <template v-slot="{ row, $index }">
            <el-form-item
              size="mini"
              style="margin: 15px 0"
              :prop="`predefinedErrors[${$index}].message`"
              :rules="{ validator: checkErrorsMessage, trigger: 'blur' }"
            >
              <el-input
                v-model="row.message"
                maxlength="50"
                placeholder="请输入"
              ></el-input>
            </el-form-item>
          </template>
        </el-table-column>
      </el-table>
    </el-form-item>
  </el-form>
</template>

<script>
import configForm from '../mixins/configForm'
export default {
  name: 'TemplateCollectionConfig',
  mixins: [configForm],
  methods: {
    addErrorRow() {
      let errorsLen = this.data.predefinedErrors.length
      let lastCode = this.data.predefinedErrors[errorsLen - 1]
        ? this.data.predefinedErrors[errorsLen - 1].code
        : 0
      this.data.predefinedErrors.push({
        code: lastCode - 1,
        message: '',
      })
    },
    checkErrorsCode(rule, value, callback) {
      let codeList = this.data.predefinedErrors.map((item) => item.code)
      let result = {},
        repeatList = []
      this.data.predefinedErrors.forEach((item) => {
        if (!result[item.code]) {
          result[item.code] = item.message
        } else {
          repeatList.push(item.code)
        }
      })
      if (codeList.length != Object.keys.length && repeatList.includes(value)) {
        return callback(new Error('错误码重复'))
      } else if (!value) {
        return callback(new Error('请填写完整'))
      } else {
        return callback()
      }
    },
    checkErrorsMessage(rule, value, callback) {
      if (!value) {
        return callback(new Error('请填写完整'))
      } else {
        return callback()
      }
    },
    removeErrorRow(index) {
      this.data.predefinedErrors.splice(index, 1)
    },
  },
}
</script>

<style></style>
