var app = getApp();
const Api = require("./api/api.js");
var util = require('../../utils/util.js'); 
Page({
  data: {
    //图片地址
    imagePath: "../../images",
    userInfo: "",
    planId:0,
    inputVal:"",
    showModal: false,  //模态框
    commentId:0,
    commentPlaceholder:"回复楼主",
    answerId:0,
    //主页记录 头像暂时用自己的头像代替
    messageList: {
    },
    // 评论内容
    commentNumber:0,
    comment:[
    ],
    showModal: false,  //模态框
    inputFocus:false //input键盘焦点
  },
  //主题评论
  comment:function(){
    this.setData({
      commentId:0,
      answerId:0,
      commentPlaceholder:"回复楼主",
      inputFocus: true
    })
  },
  //层主
  answer:function(){
    const _this = this
    if(this.data.commentId == 0 && this.data.answerId == 0){
      let data = {
        "token": app.globalData.userInfo.token, 'id': app.globalData.userInfo.id,
        "planId": this.data.planId, "content": this.data.inputVal
      }
      Api.generalPost("answer", data, function (res) {
        if (res.code) {
          _this.onfresh()
          _this.setData({
            inputVal: "",
            commentPlaceholder: "回复楼主",
            commentId: 0,
            answerId: 0
          })
        }
      })
    }else{
      let data = {
        "token": app.globalData.userInfo.token, 'id': app.globalData.userInfo.id,
        "planId": this.data.planId, "content": this.data.inputVal,
        "replyUserId":this.data.commentId,"answerId":this.data.answerId
      }
      Api.generalPost("reply", data, function (res) {
        if (res.code) {
          _this.onfresh()
          _this.setData({
            inputVal: "",
            commentPlaceholder: "回复楼主",
            commentId:0,
            answerId:0
          })
        }
      })
    }
  },
  //回复其他人
  havePersonComment:function(e){
    const id = e.currentTarget.dataset.id;//层主ID
    const answerId = e.currentTarget.dataset.answerid;//楼层id
    const name = e.currentTarget.dataset.name;//层主名字
    if (app.globalData.userInfo.id != id){
      this.setData({
        commentId: id,
        answerId: answerId,
        commentPlaceholder: "@" + name
      })
      this.showDialogBtn();
    }
  },
  // 子评论回复
  replyWho:function(e){
    const id = e.currentTarget.dataset.id;//楼中楼ID
    const answerId = e.currentTarget.dataset.answerid;//楼层id
    const name = e.currentTarget.dataset.name;//楼中楼名字
    if (app.globalData.userInfo.id != id){
      this.setData({
        commentId: id,
        answerId: answerId,
        commentPlaceholder: "@" + name
      })
      this.showDialogBtn();
    }
  },
  //回复按钮
  haveCommentOk: function () {
    this.hideModal();
    this.setData({
      inputFocus:true
    })
  },
  // 关注按钮
  goodPlan:function(e) {
    let _this = this;
    let status = e.currentTarget.dataset.status;//获取本动态的点赞状态
    let messageListStatus = "messageList.status";
    let messageListNumber = "messageList.goodNumber";
    let data = { "token": app.globalData.userInfo.token, 'id': app.globalData.userInfo.id, "planId": this.data.planId, "status": status }
    Api.generalPost("goodPlan", data, function (res) {
      _this.setData({
        [messageListStatus]: res.data.status,
        [messageListNumber]: res.data.goodNumber
      })
    })
  },
  //刷新事件
  onfresh:function(){
    const _this = this
    this.setData({ userInfo: app.globalData.userInfo })
    let data = { "token": app.globalData.userInfo.token, 'id': app.globalData.userInfo.id, "planId": this.data.planId }
    //主题内容展示
    Api.generalPost("showMessage", data, function (res) {
      _this.setData({
        messageList: res.data
      })
    })
    Api.generalPost("showComment", data, function (res) {
      res.data.forEach(function (item) {
        item.date = util.getDateBiff(item.date * 1000)
      })
      let commentNumber = res.data.length;
      res.data.forEach(function (item) {
        commentNumber = commentNumber + item.zpl.length
      })
      _this.setData({
        comment: res.data,
        commentNumber: commentNumber
      })
    })
  },
  onShow: function () {
  },
  onLoad: function (options){
    this.setData({
      planId:options.planId
    })
    const _this = this
    this.setData({ userInfo: app.globalData.userInfo })
    let data = { "token": app.globalData.userInfo.token, 'id': app.globalData.userInfo.id, "planId": this.data.planId }
    //主题内容展示
    Api.generalPost("showMessage", data, function (res) {
      _this.setData({
        messageList: res.data
      })
    })
    Api.generalPost("showComment", data, function (res) {
      if(res.data){
        res.data.forEach(function (item) {
          item.date = util.getDateBiff(item.date * 1000)
        })
        let commentNumber = res.data.length;
        res.data.forEach(function(item){
          commentNumber = commentNumber + item.zpl.length
        })
        _this.setData({
          comment: res.data,
          commentNumber: commentNumber
        })
      } 
    })
  },
  //模态框两个事件
  showDialogBtn: function () {
    this.setData({
      showModal: true
    })
  },
  hideModal: function () {
    this.setData({
      showModal: false,
    });
  },
  //输入框的内容
  inputTyping: function (e) {
    this.setData({
      inputVal: e.detail.value
    });
  },
  //预览图片
  viewPic: function (e) {
    var picUrl = e.currentTarget.dataset.src; //获得图片地址
    wx.previewImage({
      current: picUrl, // 当前显示图片的http链接
      urls: this.data.messageList.indexPic
    })
  },
  //查看个人资料
  gotowho: function (e) {
    var id = e.currentTarget.dataset.id;
    var name = e.currentTarget.dataset.name;
    wx.navigateTo({
      url: `../user/who?id=${id}&title=${name}的主页`
    })
  },
})