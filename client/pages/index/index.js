const app = getApp()
const Api = require("./api/api.js");
Page({
  data: {
    //图片地址
    imagePath:"../../images",
    userInfo: null,
    indexPage:10,
    loadMore:1,
    searchShow:false,
    // 轮播图
    swiperPic: [
      'banner_1.jpg',
      'banner_2.jpg',
      'banner_3.jpg'
    ],
    inputShowed: false, //搜索框
    inputVal: "", //搜索框
    showModal: false,  //模态框
    //主页记录 头像暂时用自己的头像代替
    messageList:[
    ],
    messageSearch:[

    ]
  },
  // 发布主题
  havePlan:function(e){
    if (app.globalData.userInfo){
      var id = e.currentTarget.dataset.id;//本文章的作者
      wx.navigateTo({
        url: '../index/comment?id' + id
      })
    }else{
      Api.login()
    }
  },
  //查看个人资料
  gotowho:function(e){
    Api.login()
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `../user/who?id=${id}&title=${name}的主页`
    })
  },
  //显示所有图片
  showAllPic:function(e){
    const index = e.currentTarget.dataset.index;
    const showPic = 'messageList['+ index+'].showPic'
    this.setData({
      [showPic]:9
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
  onShow:function(){
    if (app.globalData.fresh == 1){
      const _this = this;
      this.setData({ userInfo: app.globalData.userInfo })
      let data = {}
      Api.generalPost("showPlan", data, function (res) {
        _this.setData({
          messageList: res.data
        })
      })
      app.globalData.fresh = 0
    }
    
  },
  //下拉刷新
  onPullDownRefresh: function () {
    const _this = this;
    this.setData({ userInfo: app.globalData.userInfo })
    let data = {}
    Api.generalPost("showPlan", data, function (res) {
      _this.setData({
        messageList: res.data
      })
    })
    wx.stopPullDownRefresh()
  },
  //上拉加载
  onReachBottom: function () {
    let _this = this
    if (this.data.indexPage <= this.data.messageList.length){
      setTimeout(function(){
        _this.setData({
          indexPage: _this.data.indexPage + 5
        })
      },500)
    }else{
      this.setData({
        loadMore:0,
      })
    }
  },
  onShareAppMessage:function(e){
    var planId = e.currentTarget.dataset.id;
  },
  //搜索栏的四个事件
  showInput: function () {
    this.setData({
      inputShowed: true,
      searchShow:true,
      messageSearch:[]
    });
  },
  hideInput: function () {
    this.setData({
      inputVal: "",
      inputShowed: false,
      searchShow: false
    });
  },
  clearInput: function () {
    this.setData({
      inputVal: ""
    });
  },
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value,
      messageSearch: []
    });
    for (let i = 0; i < this.data.messageList.length; i++) {
      if (this.data.messageList[i].content.indexOf(this.data.inputVal)!= -1 && this.data.inputVal != "") {
        this.data.messageSearch.push(this.data.messageList[i])
      }
    }
    this.setData({
      messageSearch:this.data.messageSearch
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