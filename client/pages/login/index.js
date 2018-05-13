import { Login } from '../../utils/api.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },
  bindGetUserInfo:function(e){
    this.login()
  },
  login: function () {
    let that = this;
    wx.login({
      success: function (res) {
        if (res.code) {
          console.log(res)
          wx.getUserInfo({
            withCredentials: true,
            lang: "zh_CN",
            success: function (userinfo) {
              let data = { "code": res.code, "encryptedData": userinfo.encryptedData, "iv": userinfo.iv }
              Login(data, function (re) {//调用后台登录api
                if (re.code) {
                  App.globalData.userInfo = re.data
                  wx.setStorageSync('userInfo', re.data)
                  console.log("后台返回登录状态", re)
                  wx.navigateBack()
                }
              })
            },
            fail: function (error) {
              console.log('拒绝授权咯');
            }
          })
        } else {
          console.log('没有获取到code');
        }
      }
    })

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
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