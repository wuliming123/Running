var app = getApp();
Page({
  data: {
    //图片地址
    imagePath:"../../images",
    userInfo:"",
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
      {id:"1",headPic: "",name:"余鸿靖",gender:0, date: "04-06", time: "19:42", address: "重庆师范大学", content: "每天都要坚持跑步呀", 
        contentPic: [
          "https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=1903028679,3782879263&fm=27&gp=0.jpg",
          'https://ss0.bdstatic.com/70cFvHSh_Q1YnxGkpoWK1HF6hhy/it/u=2285804361,334155081&fm=27&gp=0.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175833047715.jpg',
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg'
        ],
        message: "566", attention: [false,666]
      },
      {id:"2",headPic: "",name:"吴黎明", gender:1,date: "03-10", time: "15:42", address: "哈佛大学", content: "每天都要坚持锻炼啊",
        contentPic: [
          'http://img06.tooopen.com/images/20160818/tooopen_sy_175866434296.jpg',
          'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=546708538,2220333639&fm=27&gp=0.jpg'
        ], message: "14", attention: [false, 333]
      }
    ]
  },
  // 发布主题
  havePlan:function(){
    wx.navigateTo({
      url: '../index/comment'
    })
  },
  //评论按钮
  comment:function(e){
    var id = e.currentTarget.dataset.id;
    // 跳转网页，并且获取当前用户的评论内容
    wx.navigateTo({
      url: '../index/message?id='+id
    })
  },
  // 关注按钮
  attentionPerson:function(e){
    var id = e.currentTarget.dataset.id;
    var attentionIcon = "messageList[" + id + "].attention[0]";
    var attentionNumber = "messageList[" + id + "].attention[1]";
    if(this.data.messageList[id].attention[0]){
      this.setData({
        [attentionIcon]: false,
        [attentionNumber]: this.data.messageList[id].attention[1] - 1
      })
    }else{
      this.setData({
        [attentionIcon]: true,
        [attentionNumber]: this.data.messageList[id].attention[1] + 1
      })
    }
  },
  // 关注按钮
  attentionPerson: function (e) {
    var id = e.currentTarget.dataset.id;
    var attentionIcon = "messageList[" + id + "].attention[0]";
    var attentionNumber = "messageList[" + id + "].attention[1]";
    if (this.data.messageList[id].attention[0]) {
      this.setData({
        [attentionIcon]: false,
        [attentionNumber]: this.data.messageList[id].attention[1] - 1
      })
    } else {
      this.setData({
        [attentionIcon]: true,
        [attentionNumber]: this.data.messageList[id].attention[1] + 1
      })
    }
  },
  onLoad: function (re) {

  },
  onShow: function () {
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
    this.setData({
      messageList: this.data.messageList.reverse()
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