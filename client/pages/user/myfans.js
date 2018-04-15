const Api = require("./api/api.js")
let Session =null
Page({
  data: {
    objUsers: []
  },
  //点击关注按钮
  clickOn:function(e){
    let that = this
    let data = { "token": Session['token'], 'id': Session['id'], 'userid': e.currentTarget.dataset.userid }
    Api.AddGuanzhuUser(data, function (res) {
      if (res.code) {
        let up = `objUsers[${e.target.dataset.index}].xianghuguanzhu`;
        that.setData({ [up]: true })
      }
    })    
   
  },
  //点击取消相互关注按钮
  clickOff: function (e) {
    let that = this
    let data = { "token": Session['token'], 'id': Session['id'], 'userid': e.currentTarget.dataset.userid }
    Api.DelGuanzhuUser(data, function (res) {
      if (res.code) {
        let up = `objUsers[${e.target.dataset.index}].xianghuguanzhu`;
        that.setData({ [up]: false })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this
    Session = wx.getStorageSync("userInfo")
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let that = this
    let data = { "token": Session['token'], 'id': Session['id'], 'userid': Session['id'] }
    Api.GetFensi(data, function (res) {
      if (res.code) {
        that.setData({ objUsers: res.data })
      }
    })
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})