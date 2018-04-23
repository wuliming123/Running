// pages/index/comment.js
const Api = require("./api/api.js");
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    files: [], //图片
    textValue:"",
    userInfo:null,
    departure:"请选择约跑地点",  //地址
    planId:0
  },
  // 获取文本内容
  changeValue:function(e){
      this.setData({
        textValue: e.detail.value
      })
  },
  //选择地址
  sexDeparture: function () {
    var that = this;
    wx.chooseLocation({
      success: function (res) {
        that.setData({
          departure: res.address
        })
      }
    })
  },
  // 发布主题事件
  havePlan:function(){
    var _this = this
    if(this.data.textValue == ""){
      wx.showModal({
        content: '请输入主题内容',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
          }
        }
      });
    }else{
      let content = this.data.textValue
      let data = { "token": app.globalData.userInfo.token, 'id': app.globalData.userInfo.id, "content": content, "planAddress": this.data.departure}
      Api.generalPost("createPlan", data, function (res) {
        _this.setData({
          planId:res.data
        })
        let seesion = { "token": app.globalData.userInfo.token, 'id': app.globalData.userInfo.id, 'planId': _this.data.planId }
        console.log(_this.data.files.length)
        if(_this.data.files.length != 0){
          let success = 0
          let error = 0
          for (var i = 0; i < _this.data.files.length; i++) {
            let picAddress = _this.data.files[i];
            // 逐个上传图片
            Api.upPic(picAddress, seesion, function (res) {
              if (res) {
                success++;
              } else {
                error++;
              }
              // 判断是否图片上传完毕
              if (success + error == i) {
                app.globalData.fresh = 1;
                wx.navigateBack();
              }
            })
          }
        }else{
          app.globalData.fresh = 1;
          wx.navigateBack();
        }
      }) 
    }
  },
  onLoad: function (options) {
  },
  onShow: function () {
    this.setData({ userInfo: app.globalData.userInfo })
  },
  //图片选择事件
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          files: that.data.files.concat(res.tempFilePaths)
        });
      }
    })
  },
  previewImage: function (e) {
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.files // 需要预览的图片http链接列表
    })
  }
})




