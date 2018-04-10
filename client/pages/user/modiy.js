// pages/user/modiy.js
const Api = require("../../utils/api.js");

Page({
  /**
   * 页面的初始数据
   */
  data: {
    userInfo:null,
    // index:1,
    name:null,
    nameFocus:false,
    sex: ['保密', '男', '女'],
    flagSex:null,
    isAbled:true,
    region: ['', '', ''],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  //昵称
  bindBlurName:function(e){
    let that = this;
    if (e.detail.value == ''){
      wx.showModal({
        title: '提示',
        showCancel:false,
        content: '请输入用户名',
        success: function (res) {
          if (res.confirm) {
            // console.log('用户点击确定')
            that.setData({ nameFocus:true})
            return
          }
          that.setData({ nameFocus: false })
        }
      })
    }else{
      let up = "userInfo.nickName"  
      if(e.detail.value != that.data.name){
        that.setData({ [up]: e.detail.value, isAbled:false})
      }else{
        that.setData({ [up]: that.data.name, isAbled: true })
      }
    }
  },
  //性别
  bindPickerChangeSex: function (e) {
    let val = e.detail.value
    if (val != this.data.flagSex){
      let up = "userInfo.gender"  
      this.setData({ [up]: val, isAbled:false})
    }else{
      let up = "userInfo.gender"
      this.setData({ [up]: this.data.flagSex, isAbled: true })
    }
  },
  //地区
  bindRegionChange: function (e) {
    let up = "userInfo.province"
    this.setData({
      region: e.detail.value,
      [up]: e.detail.value.join(',')
    })
    //console.log(this.data.userInfo)
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  //头像上传
  dateAvatar: function () {
    var that = this;
    wx.chooseImage({
      count: 1,
      success: function (res) {
        let tempFilePaths = res.tempFilePaths//选择图片后的临时路径 console.log(tempFilePaths);
        let session = { "token": that.data.userInfo['token'], 'id': that.data.userInfo['id'] }
        Api.UpHead(tempFilePaths[0],session,function(res){
          if (res) {
            let up = "userInfo.avatarUrl"
            if (res.code) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({ [up]: res.data})
              wx.setStorageSync('userInfo', that.data.userInfo)
            }
          } else {
            wx.showToast({
              title: '上传失败',
              icon: 'loading',
              duration: 2000
            })
          }
        })
        
        
      }
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userInfo: wx.getStorageSync("userInfo")
    })
    this.setData({
      region: this.data.userInfo['province'].split(','),
      name: this.data.userInfo['nickName'],
      flagSex: this.data.userInfo['gender']
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})