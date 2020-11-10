//index.js
//获取应用实例
const app = getApp()
var res = []
var res2 = []
var from
var to
  // 引入SDK核心类
  var QQMapWX = require('../qqmap-wx-jssdk1.2/qqmap-wx-jssdk');
 
  // 实例化API核心类
  var qqmapsdk = new QQMapWX({
      key: 'P4MBZ-W3WHJ-MKOFQ-KHO4R-7ND5O-YPBII' // 必填
  });

Page({
  data: {
    motto: 'Hello World',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  bindViewTap: function() {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  onLoad: function () {
    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo,
        hasUserInfo: true
      })
    } else if (this.data.canIUse){
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo,
          hasUserInfo: true
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo,
            hasUserInfo: true
          })
        }
      })
    }
  },
  getUserInfo: function(e) {
    console.log(e)
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },

//地址转坐标
//触发表单提交事件，调用接口
formSubmit1(e) {
  var _this = this;
  console.log(e)
  // 处理起点坐标
  qqmapsdk.geocoder({
    //获取表单传入地址
    address: e.detail.value.geocoder, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
    success: function(res) {//成功后的回调
      console.log(res);
      var res = res.result;
      var latitude = res.location.lat;
      var longitude = res.location.lng;
      //根据地址解析在地图上标记解析地址位置
      _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
        markers: [{
          id: 0,
          title: res.title,
          latitude: latitude,
          longitude: longitude,
          iconPath: '../icon.jpg',//图标路径
          width: 20,
          height: 20,
          callout: { //可根据需求是否展示经纬度
            content: latitude + ',' + longitude,
            color: '#000',
            display: 'ALWAYS'
          }
        }],
        poi: { //根据自己data数据设置相应的地图中心坐标变量名称
          latitude: latitude,
          longitude: longitude
        }
      });
    },
    fail: function(error) {
      console.error(error);
    },
    success: function(res) {
      console.log(res);
      app.globalData.beginning = res.result.location.lat + ',' + res.result.location.lng;
      console.log(app.globalData.beginning)
    }
  })

  // 处理终点坐标
  qqmapsdk.geocoder({
    //获取表单传入地址
    address: e.detail.value.geocoder2, //地址参数，例：固定地址，address: '北京市海淀区彩和坊路海淀西大街74号'
    success: function(res2) {//成功后的回调
      console.log(res2);
      var res2 = res2.result;
      var latitude2 = res2.location.lat;
      var longitude2 = res2.location.lng;
      //根据地址解析在地图上标记解析地址位置
      _this.setData({ // 获取返回结果，放到markers及poi中，并在地图展示
        markers2: [{
          id2: 0,
          title2: res2.title,
          latitude2: latitude2,
          longitude2: longitude2,
          iconPath2: '../icon.jpg',//图标路径
          width2: 20,
          height2: 20,
          callout2: { //可根据需求是否展示经纬度
            content2: latitude2 + ',' + longitude2,
            color: '#000',
            display2: 'ALWAYS'
          }
        }],
        poi2: { //根据自己data数据设置相应的地图中心坐标变量名称
          latitude2: latitude2,
          longitude2: longitude2
        }
      });
    },
    fail: function(error) {
      console.error(error);
    },
    success: function(res2) {
      console.log(res2);
      app.globalData.ending = res2.result.location.lat + ',' + res2.result.location.lng;
    }
  }),
// },
 console.log(app.globalData.beginning),
 console.log(app.globalData.ending),
//路线规划

    //调用距离计算接口
    qqmapsdk.direction({
      mode: 'driving',
      //from参数不填默认当前地址
      
      // from: res.poi,
      // to: res2.poi2, 
      from: app.globalData.beginning,
      to: app.globalData.ending,
      
      success: function (ret) {
        console.log(ret);
        // var ret = res;
        var coors = ret.result.routes[0].polyline, pl = [];
        //坐标解压（返回的点串坐标，通过前向差分进行压缩）
        var kr = 1000000;
        for (var i = 2; i < coors.length; i++) {
          coors[i] = Number(coors[i - 2]) + Number(coors[i]) / kr;
        }
        //将解压后的坐标放入点串数组pl中
        for (var i = 0; i < coors.length; i += 2) {
          pl.push({ latitude: coors[i], longitude: coors[i + 1] })
        }
        // console.log(pl)
        //设置polyline属性，将路线显示出来,将解压坐标第一个数据作为起点
        _this.setData({
          latitude:pl[0].latitude,
          longitude:pl[0].longitude,
          polyline: [{
            points: pl,
            color: '#FF0000DD',
            width: 4
          }]
        })
      },
      fail: function (_error) {
        // console.error(error);
      },
      complete: function (reu) {
        // console.log(reu);
      }
    });
  
}
})
