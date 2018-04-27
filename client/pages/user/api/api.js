// const Host = 'http://localhost/wxrunapi/';
const Host = 'https://itliming.cn/wxrunapi/';
// const Host = "http://localhost/running/server/public/index.php/wxrunapi/";

//用户数据获取
const GetUserInfo = function (data, callback) {
  wx.showLoading({
    title: '加载中...',
    mask:true
  })
  wx.request({
    url: `${Host}Index/getuserinfo`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      if(res.data.code){
        wx.hideLoading()
      }else{
        wx.showLoading({
          title: '加载失败...',
          mask: true
        })
      }
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
       return typeof callback == "function" && callback(false)
    }
  })
}
//修改资料页面的头像上传
const UpHead = function (data, SessionObj, callback) {
  wx.showLoading({
    title: '上传中...',
  })
  wx.uploadFile({
    url: `${Host}Index/uphead`,
    filePath: data,
    name: 'file',
    formData: SessionObj,
    success: function (res) {
      wx.hideLoading()
      return typeof callback == "function" && callback(JSON.parse(res.data))
    },
    fail: function (error) {
      //  console.log(error)
      wx.hideLoading()
      return typeof callback == "function" && callback(false)
    }
  })
}
//修改资料
const ModifyMyInfo = function (data, callback) {
  wx.request({
    url: `${Host}Index/modifymyinfo`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      if (res.data.code) {
        wx.showToast({
          title: '修改成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: '没做任何更改',
          icon: 'none'
        });
      }
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      return typeof callback == "function" && callback(false)
    }
  })
}
//查询自己关注的人的资料，头像，昵称，性别，是否关注自己
const GetGuanzhu = function (data, callback) {
  wx.showLoading({
    title: '加载中...',
    mask: true
  })
  wx.request({
    url: `${Host}Index/getguanzhu`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      if (res.data.code) {
        wx.hideLoading()
      } else {
        wx.showLoading({
          title: '加载失败...',
          mask: true
        })
      }
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      return typeof callback == "function" && callback(false)
    }
  })
}
//查询粉丝们的资料，id,头像，昵称，性别，是否关注自己
const GetFensi = function (data, callback) {
  wx.showLoading({
    title: '加载中...',
    mask: true
  })
  wx.request({
    url: `${Host}Index/getfensi`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      if (res.data.code) {
        wx.hideLoading()
      } else {
        wx.showLoading({
          title: '加载失败...',
          mask: true
        })
      }
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      return typeof callback == "function" && callback(false)
    }
  })
}
//添加关注一个用户
const AddGuanzhuUser = function (data, callback) {
  wx.request({
    url: `${Host}Index/addaguanzhu`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      if (res.data.code) {
        wx.showToast({
          title: '关注成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: '关注失败',
          icon: 'none'
        });
      }
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      return typeof callback == "function" && callback(false)
    }
  })
}
//取消关注一个用户
const DelGuanzhuUser = function (data,callback) {
  wx.request({
    url: `${Host}Index/delaguanzhu`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      if (res.data.code) {
        wx.showToast({
          title: '取消关注成功',
          icon: 'success'
        });
      } else {
        wx.showToast({
          title: '取消关注失败',
          icon: 'none'
        });
      }
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      return typeof callback == "function" && callback(false)
    }
  })
}
//获取我发布的主题
const ShowMyPlan = function (data,callback) {
  wx.showLoading({
    title: '加载中...'
  })
  wx.request({
    url: `${Host}Index/showmyplan`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      wx.hideLoading()
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      return typeof callback == "function" && callback(false)
    }
  })
}
//删除一条计划delplan
const DelPlan = function (data,callback) {
  wx.request({
    url: `${Host}Index/delplan`,
    method: "POST",
    header: {
      "content-type": "application/x-www-form-urlencoded"
    },
    data: data,
    success: function (res) {
      if(res.data.code){
        wx.showToast({
          title: '删除成功',
          icon: 'success'
        });
      }else{
        wx.showToast({
          title: '删除失败',
          icon: 'none'
        });
      }
      return typeof callback == "function" && callback(res.data)
    },
    fail: function (error) {
      wx.showToast({
        title: '删除失败',
        icon: 'none'
      });
      return typeof callback == "function" && callback(false)
    }
  })
}
module.exports = {
  UpHead: UpHead,
  ModifyMyInfo: ModifyMyInfo,
  GetUserInfo: GetUserInfo,
  GetGuanzhu: GetGuanzhu,
  GetFensi: GetFensi,
  AddGuanzhuUser: AddGuanzhuUser,
  DelGuanzhuUser: DelGuanzhuUser,
  ShowMyPlan: ShowMyPlan,
  DelPlan: DelPlan,
}