import { PlAboutMe, HfAboutMe  } from './api/api.js'
const App = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    zan:[],
    pl:[],
    hf:[]
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
    let data = {
      "token": App.globalData.userInfo.token,
      'id': App.globalData.userInfo.id,
    }
    let that = this
    if(options.npl  != 0){
        PlAboutMe(data, function (res) {
          let pl = wx.getStorageSync('pl') || []
          for (let i = res.length - 1; i >= 0; i--) {
            res[i]["plTime"] = that.timestampToTime(res[i]["plTime"])
            pl.unshift(res[i]);
          }
          wx.setStorageSync('pl', pl)
          that.setData({ pl: pl})
        })
    }
    if (options.nhf != 0){
      HfAboutMe(data, function (res) {
        let hf = wx.getStorageSync('hf') || []
        for (let i = res.length - 1; i >= 0; i--) {
          res[i]["cengzhuTime"] = that.timestampToTime(res[i]["cengzhuTime"])
          res[i]["fromTime"] = that.timestampToTime(res[i]["fromTime"])
          hf.unshift(res[i]);
        }
        wx.setStorageSync('hf', hf)
        that.setData({ hf: hf })
      })
    }
  },
  gotowho:function(val){
    wx:wx.navigateTo({
      url: '/pages/user/who?id=' + val.currentTarget.dataset.id + "&title=" + val.currentTarget.dataset.title,
      success: function(res) {},
      fail: function(res) {},
      complete: function(res) {},
    })
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
    let taht = this
    let zan = wx.getStorageSync('zan')
    let pl = wx.getStorageSync('pl')
    let hf = wx.getStorageSync('hf')
    this.setData({ zan: zan,pl:pl,hf:hf})
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
  
  },
  timestampToTime:function(timestamp) {
    let date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() + ' ';
    let h = date.getHours() + ':';
    let m = date.getMinutes();
    return M + D + h + m;
  }
})