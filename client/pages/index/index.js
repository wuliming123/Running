const app = getApp()
const Api = require("./api/api.js");
Page({
  data: {
    //图片地址
    imagePath:"../../images",
    userInfo: null,
    // 轮播图
    swiperPic: [
      'http://img02.tooopen.com/images/20150928/tooopen_sy_143912755726.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
      'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg'
    ],
    inputShowed: false, //搜索框
    inputVal: "", //搜索框
    showModal: false,  //模态框
    //主页记录 头像暂时用自己的头像代替
    messageList:[
    ]
  },
  // 发布主题
  havePlan:function(e){
    var id = e.currentTarget.dataset.id;//本文章的作者
    wx.navigateTo({
      url: '../index/comment?id' + id
    })
  },
  //查看个人资料
  gotowho:function(e){
    var id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../user/who?id=' + id
    })
  },
  //评论按钮
  comment:function(e){
    var planId = e.currentTarget.dataset.id;
    // 跳转网页，并且获取当前用户的评论内容
    wx.navigateTo({
      url: '../index/message?planId=' + planId
    })
  },
  onLoad: function (re) {
    const _this = this;
    this.setData({ userInfo: app.globalData.userInfo })
    let data = {}
    Api.generalPost("showPlan", data, function (res) {
      _this.setData({
        messageList: res.data
      })
    })
  },
  onShow: function () {
   
  },
  //搜索栏的四个事件
  showInput: function () {
    this.setData({
      inputShowed: true
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //模态框两个事件
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  hideModal: function () {
    this.setData({
      showModal: false
    });
    wx.showToast({
      title: '已完成',
      icon: 'success',
      duration: 1000
    });
  },
  //预览图片
  viewPic: function (e) {
    var picUrl = e.currentTarget.dataset.src; //获得图片地址
    var index = e.currentTarget.dataset.index;  //获得发布者id
    wx.previewImage({
      current: picUrl, // 当前显示图片的http链接
      urls: this.data.messageList[index].indexPic
    })
  }
})