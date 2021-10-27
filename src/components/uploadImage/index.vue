<template>
  <div>
    <div v-paste="handlePaste" class="upLoad_picsss" :class="imgWideHigh">
      <el-upload
        v-show="imageList.length < uploadLimit.max"
        v-if="!justPreview || (justPreview && imageList.length === 0)"
        style="height: 100%"
        class="avatar-uploader"
        :disabled="disabled"
        :action="action"
        :data="ossData"
        :headers="headers"
        ref="uploader"
        drag
        accept=".jpg, .jpeg, .png, .bmp"
        :multiple="uploadLimit.max != 1"
        :file-list="imageList"
        :show-file-list="showFileList"
        :on-preview="handlePictureCardPreview"
        :on-success="uploadSuccess"
        :on-error="uploadError"
        :before-upload="beforeUpload"
        :limit="uploadLimit.max"
        :on-exceed="overLimitCb"
        :http-request="afrbtcUpload"
        list-type="picture-card"
      >
        <i class="el-icon-plus"></i>
      </el-upload>
      <el-dialog width="80%" :visible.sync="dialogVisible" append-to-body>
        <img width="100%" :src="dialogImageUrl" alt />
      </el-dialog>
      <draggable
        v-if="!showFileList"
        class="img-draggle"
        :list="imageList"
        :group="{ name: 'imglist', pull: false, put: false }"
        :sort="!justPreview"
        :animation="200"
        :disabled="draggableDisable"
      >
        <div
          class="img-wrap"
          :class="{ 'first-img': index == 0 && hasFirstPic }"
          :style="{ marginBottom: hasFirstPic ? '25px' : '0' }"
          v-for="(item, index) in imageList"
          :key="index"
        >
          <div class="img-preview">
            <el-image
              fit="fill"
              :src="item.url"
              :preview-src-list="imgPreviewList"
            >
            </el-image>
            <i
              class="el-icon-error"
              v-if="!justPreview || !disabled"
              @click="removeImg(index)"
            ></i>
          </div>
          <el-button
            type="primary"
            size="small"
            class="set-btn"
            v-if="index != 0 && hasFirstPic"
            @click="setFirstImg(index)"
            >设为首图</el-button
          >
        </div>
      </draggable>
    </div>
    <p
      class="tips"
      v-if="!hideLimitTip"
      v-show="imageList.length < uploadLimit.max"
    >
      <span style="color: red">*</span>
      <span>最多{{ uploadLimit.max }}张</span>
      <span v-if="uploadLimit.min > 0">&nbsp; 最少{{ uploadLimit.min }}张</span>
    </p>
  </div>
</template>
<script>
import draggable from 'vuedraggable'
import { compress } from 'image-conversion'
import { throttle } from 'lodash-es'

import { getRealUrl } from '@/utils'
import { getOssObjectId } from '@/api/service/common'
import hmacSha256 from 'crypto-js/hmac-sha256'
import upload from '@/utils/ajax'

export default {
  name: 'PublicUploader',
  model: {
    prop: 'objectIds',
    event: 'uploadSuccess',
  },
  components: {
    draggable,
  },
  props: {
    hasFirstPic: {
      type: Boolean,
      default: false,
    },
    fileSize: {
      type: Number, // 限制图片大小(kb)
      default: () => 0,
    },
    uploadLimit: {
      type: Object,
      default: () => {
        return {
          max: 10,
          min: 0,
        }
      },
    },
    // 是否使用el-upload默认预览
    showFileList: {
      type: Boolean,
      default: false,
    },
    // 反显预览--隐藏上传组件、隐藏删除按钮、禁用拖拽
    justPreview: {
      type: Boolean,
      default: false,
    },
    // 是否隐藏图片限制张数文字提示
    hideLimitTip: {
      type: Boolean,
      default: false,
    },
    // 是否禁用上传
    disabled: {
      type: Boolean,
      default: false,
    },
    // 是否禁用拖拽
    draggableDisable: {
      type: Boolean,
      default: false,
    },
    // 图片大小类名
    imgWideHigh: {
      type: String,
      default: 'img40', // img40 img60 img80
    },
    // 图片的objectId
    objectIds: {
      type: [String, Array],
      default: '',
    },
  },
  watch: {
    objectIds: {
      handler(val) {
        if (Array.isArray(val)) {
          this.objectIdType = 'Array'
          val.forEach((id) => {
            let bol = this.imageList.some(
              (item) => item.objectId == id && item.url
            )
            if (id && !bol) {
              this.imageList.push({
                objectId: id,
                url: id && getRealUrl(id),
              })
            }
          })
        } else {
          this.objectIdType = 'String'
          let bol = this.imageList.some(
            (item) => item.objectId == val && item.url
          )
          if (val && !bol) {
            this.imageList.push({
              objectId: val,
              url: getRealUrl(val),
            })
          }
        }
      },
      immediate: true,
    },
    imageList: {
      handler(val) {
        if (this.objectIdType == 'Array' || val.length > 1) {
          let objectIds = []
          val.forEach((item) => {
            objectIds.push(item.objectId)
          })
          this.$emit('update:objectIds', objectIds)
        } else {
          this.$emit('update:objectIds', val[0] ? val[0].objectId : '')
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      objectIdType: 'String',
      // 上传图片
      imageList: [],
      headers: { AllowedHeader: '*' },
      ossData: {},
      action: '',
      dialogImageUrl: '',
      dialogVisible: false,
      uids: [],
      objectId: '',
    }
  },
  computed: {
    imgPreviewList() {
      return this.imageList.map((item) => item.url)
    },
  },
  mounted() {
    let avatarUploaders = document.getElementsByClassName('avatar-uploader')
    let elUploadListPictureCards = document.getElementsByClassName(
      'el-upload-list--picture-card'
    )
    for (let i = 0; i <= avatarUploaders.length; i++) {
      let avatarUploader = avatarUploaders[i]
      let elUploadListPictureCard = elUploadListPictureCards[i]
      if (
        avatarUploader &&
        avatarUploader.firstElementChild.nodeName === 'UL'
      ) {
        avatarUploader.removeChild(elUploadListPictureCard)
        avatarUploader.appendChild(elUploadListPictureCard)
      }
    }
  },
  methods: {
    // 设置首图事件
    setFirstImg(index) {
      this.imageList.unshift(this.imageList.splice(index, 1)[0])
      let objectIds = this.imageList.map((item) => item.objectId)
      this.$emit('uploadSuccess', objectIds)
    },
    // 删除图片事件
    removeImg(index) {
      this.imageList.splice(index, 1)
      let objectIds = this.imageList.map((item) => item.objectId)
      this.$emit('uploadSuccess', objectIds)
    },
    // 上传图片
    handlePictureCardPreview(file) {
      this.dialogImageUrl = file.url
      this.dialogVisible = true
    },
    // 上传成功的回调
    uploadSuccess(response, file, fileList) {
      this.$emit('checkAllImgUploadStatus', 'pending')
      this.imageList = fileList
      let successList = fileList.filter((item) => item.status == 'success')
      let objectIds = successList.map((item) => item.objectId)
      this.$emit('uploadSuccess', objectIds)
      if (successList.length == fileList.length) {
        this.$emit('checkAllImgUploadStatus', 'success')
      }
    },
    uploadError(err, file, fileList) {
      this.$message.error('上传失败，请重试。')
    },
    //微信截图上传图片时触发
    handlePaste: throttle(function (e) {
      let rawFile = null
      let warningFlag = true
      if (
        e.clipboardData &&
        e.clipboardData.items &&
        e.clipboardData.items.length
      ) {
        //这里就是判断是否有粘贴进来的文件且文件为图片格式
        let items = e.clipboardData.items

        // 特征识别，解决从微信复制图片粘贴会上传两张问题
        if (items.length === 2 && items[0].getAsFile().name === 'image.png') {
          items = [items[1]]
        } else if (items.length > 1) {
          // 限制只可复制一张本地图片上传
          return this.$message.warning(
            '上传的文件必须为图片且无法同时复制多张图片'
          )
        }

        if (items && items.length) {
          for (let i = 0; i < items.length; i++) {
            if (items[i] && items[i].type.indexOf('image') > -1) {
              rawFile = items[i].getAsFile()
              rawFile.uid = rawFile.uid || Date.now() + 1
              let file = {
                status: 'ready',
                name: rawFile.name,
                size: rawFile.size,
                percentage: 0,
                uid: rawFile.uid,
                raw: rawFile,
              }
              try {
                file.url = URL.createObjectURL(rawFile)
              } catch (err) {
                console.error('[Element Error][Upload]', err)
                return
              }
              // 复制粘贴限制十张图片
              if (
                this.$refs['uploader'].uploadFiles.length ==
                this.uploadLimit.max
              ) {
                this.$message.error(`最多可上传${this.uploadLimit.max}张图片`)
              } else {
                this.$refs['uploader'].uploadFiles.push(file)
              }
              warningFlag = false
            }
          }
        }
      }
      if (warningFlag) {
        this.$message({
          type: 'warning',
          message: '上传的文件必须为图片',
        })
        return
      }
      this.$refs['uploader'].submit()
    }, 500),
    async afrbtcUpload() {
      return new Promise((resolve, reject) => {
        let uploadFiles = this.$refs['uploader'].uploadFiles
        for (let i = 0; i < uploadFiles.length; i++) {
          let rawFile = uploadFiles[i]
          if (this.uids.indexOf(rawFile.uid) < 0 && rawFile.status == 'ready') {
            this.uids.push(rawFile.uid)
            // console.log("高度",height,'宽度',width)
            let expires =
              parseInt(Date.now() / 1000) +
              Number(process.env.VUE_APP_OSS_OBJECT_EXPIRES)
            let butketId = process.env.VUE_APP_BUCKETID
            let signString = `POST\n${butketId}\n${expires}`
            compress(rawFile.raw, {
              quality: 0.9,
              size: 2048,
              width: 1080,
            })
              .then((res) => {
                let data = {
                  bucketId: butketId,
                  expires: expires,
                  clientId: process.env.VUE_APP_CLIENT_ID,
                  signature: hmacSha256(
                    signString,
                    process.env.VUE_APP_CLIENT_SECRET
                  ).toString(),
                }
                getOssObjectId(data).then((response) => {
                  this.ossData = response.data.form
                  this.action = response.data.form.action
                  this.objectId = response.data.objectId
                  rawFile.objectId = this.objectId
                  rawFile.signature = response.data.form.contents.Signature
                  const options = {
                    action: this.action,
                    data: {
                      ...response.data.form.contents,
                      file: res,
                    },
                  }
                  upload(options)
                  resolve()
                })
              })
              .catch((err) => {
                reject(err)
              })
          }
        }
      })
    },
    //文件超出个数限制时的钩子
    overLimitCb(files, fileList) {
      this.$message.error(`最多可上传${this.uploadLimit.max}张图片`)
    },
    // 上传之前获取亚马逊签名： 这里用的是阿里云的，要改
    beforeUpload(file) {
      this.$emit('checkAllImgUploadStatus', 'start')
      if (this.fileSize) {
        const isLimtKB = file.size / 1024 / 1024 < (1 / 1024) * this.fileSize
        if (!isLimtKB) {
          this.$message.error(`上传图片大小不能超过${this.fileSize}kb!`)
        }
        return isLimtKB
      }
    },
  },
}
</script>
<style lang="scss" scoped>
.avatar-uploader {
  margin-right: 10px;
}
.upLoad_picsss {
  display: flex;
  position: relative;
  & ::v-deep .el-upload-list--picture-card {
    margin: 0;
    display: inline;
    vertical-align: top;
    overflow-y: hidden;
    overflow-x: auto;
    height: 70px;
    & ::v-deep .el-upload-list__item {
      overflow: hidden;
      background-color: #fff;
      border: 1px solid #c0ccda;
      border-radius: 6px;
      -webkit-box-sizing: border -box;
      box-sizing: border-box;
      width: 60px;
      height: 60px;
      margin: 0 8px 8px 0;
      transition: all 0s cubic-bezier(0.55, 0, 0.1, 1) !important;
    }
  }
  & ::v-deep .el-upload--picture-card {
    background-color: #fbfdff;
    border: 1px dashed #c0ccda;
    border: none;
    border-radius: 6px;
    box-sizing: border-box;
    vertical-align: top;
    // float: left;
    // margin-right: 20px;
  }
  & ::v-deep .el-upload-dragger {
    background-color: #fff;
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    box-sizing: border-box;
    text-align: center;
    position: relative;
    overflow: hidden;
    .el-icon-plus {
      font-size: 20px;
    }
  }
}
.img-draggle {
  width: 100%;
  display: flex;
  flex-wrap: wrap;
}
.img-wrap {
  position: relative;
  margin-bottom: 25px;
  .set-btn {
    position: absolute;
    bottom: -28px;
    padding: 4px 8px;
    font-size: 12px;
  }
}
.first-img {
  position: relative;
  & ::v-deep .el-image {
    // position: relative;
    &::before {
      content: '';
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100px;
      height: 15px;
      background-color: #409eff;
      transform: rotate(-45deg) translate(-30px, -25px);
    }
    &::after {
      content: '首图';
      display: inline-block;
      position: absolute;
      top: 0;
      left: 0;
      line-height: 100%;
      color: #fff;
      font-size: 10px;
      transform: rotate(-45deg) scale(0.8) translate(-6px, 3px);
    }
  }
}
.img-preview {
  // margin-top: 10px;
  border: 1px solid #c0ccda;
  border-radius: 6px;
  overflow: hidden;
  position: relative;
  margin-right: 10px;
  margin-bottom: 8px;
  display: flex;
  .el-icon-error {
    color: #051427;
    position: absolute;
    top: 0;
    right: 0;
    font-size: 16px;
    cursor: pointer;
  }
}
.chosen {
  border: 1px solid #409eff;
}
.tips {
  margin: 8px 0 0 0;
  font-size: 12px;
  line-height: 1em;
  color: #686e89;
}
.img40 {
  & ::v-deep .el-upload--picture-card,
  & ::v-deep .el-upload-dragger,
  .img-preview {
    width: 41px;
    height: 40px;
    line-height: 42px;
  }
}
.img60 {
  & ::v-deep .el-upload--picture-card,
  & ::v-deep .el-upload-dragger,
  .img-preview {
    width: 61px;
    height: 60px;
    line-height: 62px;
  }
}
.img80 {
  & ::v-deep .el-upload--picture-card,
  & ::v-deep .el-upload-dragger,
  .img-preview {
    width: 81px;
    height: 80px;
    line-height: 82px;
  }
}
</style>
