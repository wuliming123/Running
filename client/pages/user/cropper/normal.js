import WeCropper from './we-cropper.js'
const Api = require("../api/api.js")
const App = getApp()
const device = wx.getSystemInfoSync()

Page({
  data: {
    cropperOpt: {
      id: 'cropper',
      width: device.windowWidth,
      height: device.windowWidth,
      scale: 2.5,
      zoom: 8
    }
  },
  touchStart (e) {
    this.wecropper.touchStart(e)
  },
  touchMove (e) {
    this.wecropper.touchMove(e)
  },
  touchEnd (e) {
    this.wecropper.touchEnd(e)
  },
  getCropperImage () {
    this.wecropper.getCropperImage((avatar) => {
      if (avatar) {//  获取到裁剪后的图片
        let data = { "token": App.globalData.userInfo.token, 'id': App.globalData.userInfo.id }
        Api.UpHead(avatar, data, function (res) {
          if (res) {
            if (res.code) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              App.globalData.userInfo.avatarUrl = res.data
              let temp = wx.getStorageSync("userInfo")
              temp.avatarUrl = res.data
              wx.setStorageSync('userInfo', temp)
              wx.redirectTo({
                url: `/pages/user/modiy`
              })
            } else {
              wx.showToast({
                title: '上传失败',
                icon: 'loading',
                duration: 2000
              })
            }
          } else {
            wx.showToast({
              title: '上传失败',
              icon: 'loading',
              duration: 2000
            })
          }
        })
      } else {
        wx.showToast({
          title: '上传失败',
          icon: 'loading',
          duration: 2000
        })
      }
    })
  },
  uploadTap () {
    const self = this

    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success (res) {
        const src = res.tempFilePaths[0]

        self.wecropper.pushOrign(src)
      }
    })
  },
  onLoad (option) {
    if (option.src) {
      const { cropperOpt } = this.data
      cropperOpt.src = option.src
      new WeCropper(cropperOpt)
        .on('ready', function (ctx) {
          
        })
        .on('beforeImageLoad', (ctx) => {
          
        })
        .on('imageLoad', (ctx) => {
        
        })
    }
  }
})
