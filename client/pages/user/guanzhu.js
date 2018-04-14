const Api = require("./api/api.js")
let Seesion = null
Page({
  data: {
    objUsers: []
  },
  //取消关注用户
  clickOn:function(e){
    let that = this
    let data = { "token": Seesion['token'], 'id': Seesion['id'], 'userid': e.currentTarget.dataset.userid }
    Api.DelGuanzhuUser(data,function(res){
      if(res.code){
        that.data.objUsers.splice(e.currentTarget.dataset.index, 1)
        that.setData({ objUsers: that.data.objUsers })
      }
    })
  },
  onLoad: function (options) {
    Seesion = wx.getStorageSync("userInfo")
  },
  onShow: function () {
    let that = this
    let data = { "token": Seesion['token'], 'id': Seesion['id'], 'userid': Seesion['id'] }
    Api.GetGuanzhu(data, function (res) {
      if (res.code) {
        that.setData({ objUsers: res.data })
      }
    })
  },
})