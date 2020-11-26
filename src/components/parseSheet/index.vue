<!--
 * @Author: xwt
 * @Date: 2020-11-24 17:04:59
 * @LastEditors: xwt
 * @LastEditTime: 2020-11-26 16:34:24
 * @Description: 插件地址：https://github.com/SheetJS/sheetjs
 * @FilePath: \some-demos\src\components\parseSheet\index.vue
-->
<template>
  <el-row>
    <el-col class="control-wrap">
      <el-button type="primary" style="margin-bottom: 20px" @click="downLoadTemplate">下载excel模板</el-button>
      <el-upload
        class="upload"
        action="#"
        accept=".xsl,.xlsx"
        :http-request="uploadFile"
        :on-change="handleChange"
        :on-preview="handlePreview"
        :on-remove="handleRemove"
        :before-remove="beforeRemove"
        :file-list="fileList"
      >
        <el-button type="primary">点击上传excel</el-button>
      </el-upload>
    </el-col>
  </el-row>
</template>

<script>
import XLSX from 'xlsx'
function readXLSX(file) {
  let nameSplit = file.name.split('.')
  let format = nameSplit[nameSplit.length - 1]
  if (!['xlsx', 'csv'].includes(format)) {
    return false
  }
  return new Promise((resolve) => {
    let reader = new FileReader()
    reader.readAsBinaryString(file)
    reader.onload = function (evt) {
      let data = evt.target.result // 读到的数据
      var workbook = XLSX.read(data, { type: 'binary' })
      resolve(workbook)
    }
  })
}
export default {
  name: 'parseSheet',
  data() {
    return {
      fileList: [],
    }
  },
  methods: {
    // 下载excel模板
    downLoadTemplate() {
      let data = [
          { name:"用户名", gender:"性别", age:"年龄" },
          { name: 1,  gender: 2,  age: 3},
        ]
      let start = Date.now()
      let ws_name = 'Sheet1',
        filename = '模板.xlsx',
        wb = XLSX.utils.book_new(),
        ws = XLSX.utils.json_to_sheet(data, { header:["name","gender","age"], skipHeader:true })

      XLSX.utils.book_append_sheet(wb, ws, ws_name)
      XLSX.writeFile(wb, filename)
      console.log((Date.now() - start)/1000)
    },
    // 上传并解析
    async uploadFile(param) {
      let start = Date.now()
      const workbook = await readXLSX(param.file)
      let sheetNames = workbook.SheetNames // 工作表名称集合
      let resultJson = []
      sheetNames.forEach(item => {
        let worksheet = workbook.Sheets[item] //工作表
        let sheetList = XLSX.utils.sheet_to_json(worksheet) //解析后的数据集合
        resultJson.push(...sheetList)
      })
      console.log(resultJson)
      console.log((Date.now() - start)/1000)
      
    },

    handleRemove(file, fileList) {
      console.log(file, fileList)
    },
    
    handlePreview(file) {
      console.log(file)
    },

    beforeRemove(file, fileList) {
      console.log(fileList)
      return this.$confirm(`确定移除 ${file.name}？`)
    },

    handleChange(file, fileList) {
      if (fileList.length > 0) {
        this.fileList = [fileList[fileList.length - 1]]
      }
    },
  },
}
</script>

<style lang="css" scoped>
.control-wrap {
  display: flex;
  flex-flow: column nowrap;
  align-items: center;
  justify-content: center;
  padding: 50px;
}
</style>