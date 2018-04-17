const Api = require("./api/api.js")
const App = getApp()
Page({
  data: {
    userInfo: null,
    birth:'',
    nameFocus: false,
    sex: ['保密', '男', '女'],
    region: ['重庆市', '', ''],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  },
  //昵称
  bindBlurName:function(e){
    let up = 'userInfo.nickName'
    this.setData({ [up]: e.detail.value })
  },
  //性别
  bindPickerChangeSex: function (e) {
    let up = 'userInfo.gender'
    this.setData({ [up]: e.detail.value })
  },
  //手机
  bindBlurPhone: function (e) {
    let up = 'userInfo.phone'
    this.setData({ [up]: e.detail.value })
  },
  //学校
  bindBlurSchool: function (e) {
    let up = 'userInfo.school'
    this.setData({ [up]: e.detail.value })
  },
  //地区
  bindRegionChange: function (e) {
    // console.log(e)
    let temp = ''
    if (e.detail.value[1]=='县')
      temp = e.detail.value[0] + e.detail.value[2]
    else
      temp = e.detail.value[0] + e.detail.value[1] + e.detail.value[2]
    let up = 'userInfo.address';
    this.setData({[up]:temp})
  },
  //保存修改按钮
  saveModify:function(){
    let userinfo = this.data.userInfo
    let that = this
    if (userinfo.nickName==''){
      wx.showModal({
        title: '提示',
        content: '昵称不能为空',
        showCancel: false,
        success: function (res) {
          if (res.confirm) {
            that.setData({nameFocus:true})
          } 
        }
      })
      return
    }
    let data = {
      "token": App.globalData.userInfo.token,
      'id': App.globalData.userInfo.id,
      'myinfo': JSON.stringify(userinfo)
      }
    Api.ModifyMyInfo(data,function(res){
      if(res.code){
        App.globalData.userInfo.nickName = that.data.userInfo.nickName
        let temp = wx.getStorageSync("userInfo")
        temp.nickName = that.data.userInfo.nickName
        temp.avatarUrl = that.data.userInfo.avatarUrl
        wx.setStorageSync('userInfo', temp)
      }
    })
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
        let data = {"token": App.globalData.userInfo.token, 'id': App.globalData.userInfo.id}
        Api.UpHead(tempFilePaths[0], data,function(res){
          if (res) {
            let up = "userInfo.avatarUrl"
            if (res.code) {
              wx.showToast({
                title: '上传成功',
                icon: 'success',
                duration: 2000
              })
              that.setData({ [up]: res.data})
              App.globalData.userInfo.avatarUrl = res.data
              let temp = wx.getStorageSync("userInfo")
              temp.avatarUrl = res.data
              wx.setStorageSync('userInfo', temp)
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
  //生日
  bindDateChange:function(e){
    let that = this
    let up ='userInfo.dateOfBirth'
    that.setData({
      birth: e.detail.value,
      [up]: new Date(e.detail.value).getTime() / 1000
    })
  },
  onShow: function () {
    let that = this;
    let data = { 
      "token": App.globalData.userInfo.token,
      'id': App.globalData.userInfo.id, 
      'userid': App.globalData.userInfo.id
    }
    Api.GetUserInfo(data, function (res) {
      if(res.code){
        if (res.data.dateOfBirth){
          let dateOfBirth = new Date(res.data.dateOfBirth * 1000)
          let y = dateOfBirth.getFullYear()
          let m = dateOfBirth.getMonth() + 1
          let d = dateOfBirth.getDate()
          let birth = `${y}-${m < 10 ? '0' + m : m}-${d < 10 ? '0' + d : d}`
          that.setData({ birth: birth })//通过出生日期时间戳
        }
        that.setData({ userInfo: res.data })
      } 
    })
  }
})