import { ShowMyPlan,DelPlan } from './api/api.js'
var App = getApp()
// pages/user/myrun.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myArticleList:[]
  },
  // showdel:function(e){
  //   let up = `myArticleList[${e.currentTarget.dataset.xiabiao}].delflag`
  //   this.setData({ [up]:true})
  // },
  // showdedel:function(e){
  //   let up = `myArticleList[${e.currentTarget.dataset.xiabiao}].delflag`
  //   this.setData({ [up]: false })
  // },
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
    let data = { id: App.globalData.userInfo.id, token: App.globalData.userInfo.token}
    let that = this
    ShowMyPlan(data,function (re){
      that.setData({ myArticleList:re.data})
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
  
  },
  delItem:function(e){
    let _this = this
    wx.showModal({
      title: '删除提醒',
      content: '你是否永久删除该主题帖，该主题下的评论回复也将会被删除。',
      confirmText: "删除",
      cancelText: "取消",
      success: function (res) {
        if (res.confirm) {
          let data = { id: App.globalData.userInfo.id, token: App.globalData.userInfo.token, planId: e.currentTarget.dataset.planid}
          DelPlan(data,function(re){
            if (re.code){
              _this.data.myArticleList.splice(e.currentTarget.dataset.xiabiao, 1)
              _this.setData({ myArticleList: _this.data.myArticleList })
            }
          })
        } else {
         
        }
      }
    });
  }
})