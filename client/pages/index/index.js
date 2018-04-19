var app = getApp();
const Api = require("./api/api.js");
let Seesion = null;
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
      // {id:"1",headPic: "",name:"余鸿靖",gender:0, date: "04-06", time: "19:42", address: "重庆师范大学", content: "每天都要坚持跑步呀", 
      //   contentPic: [
      //     "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1903028679,3782879263&fm=27&gp=0.jpg",
      //     'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2285804361,334155081&fm=27&gp=0.jpg',
      //     'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
      //     'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
      //   ],
      //   message: "566", attention: [false,666]
      // }
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
  // 关注按钮
  goodPlan:function(e){
    let _this = this;
    let id = e.currentTarget.dataset.id;//获取本动态的id
    let status = e.currentTarget.dataset.status;//获取本动态的点赞状态
    let index = e.currentTarget.dataset.index;//获取本动态数组下标
    let messageListStatus = "messageList[" + index + "].status";
    let messageListNumber = "messageList[" + index + "].goodNumber";
    let data = { "token": Seesion['token'], 'id': Seesion['id'],"planId":id,"status":status}
    Api.generalPost("goodPlan", data, function (res){
      _this.setData({
        [messageListStatus]:res.data.status,
        [messageListNumber]:res.data.goodNumber
      })
    })
  },
  onLoad:function(re){
    Seesion = wx.getStorageSync("userInfo")
  },
  onShow:function(){
    var _this = this;
    try {
      let userInfo = wx.getStorageSync('userInfo')
      if (userInfo) {
        this.setData({
          userInfo: userInfo
        })
      }
    } catch (e) {
      console.log(e);
    }
    let data = { "token": Seesion['token'], 'id': Seesion['id'] }
    Api.generalPost("showPlan", data, function (res) {
      _this.setData({
        messageList: res.data
      })
    })
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
    var id = e.currentTarget.dataset.id;  //获得发布者id
    wx.previewImage({
      current: picUrl, // 当前显示图片的http链接
      urls: this.data.messageList[id-1].contentPic
    })
  }
})