import { IMyApp } from '../../app'
import * as webAPI from '../../api/app/AppService';
import * as globalEnum from '../../api/GlobalEnum'
const app = getApp<IMyApp>()

class LoginPage {
  public data = {
    //canIUse: wx.canIUse('button.open-type.getUserInfo'),
    scope: ""
  }

  public onLoad() {

  }

  // public bindGetUserInfo(e) {
  //   // 查看是否授权
  //   wx.getSetting({
  //     success: function (res) {
  //       if (res.authSetting['scope.userInfo']) {
  //         wx.authorize({
  //           scope: "scope.userInfo",
  //           complete: function (res) {
  //             console.log(res);
  //             //从数据库获取用户信息
  //             wx.navigateTo({
  //               url: '../onBoard/onBoard'
  //             });
  //           },
  //           fail: function (err) {
  //             console.log(err);
  //           }
  //         });
  //       }
  //     }
  //   })
  // }
  public bindGetUserInfo(e) {
    wx.reLaunch({ url: "/pages/invitation/invitation" });
  }
}

Page(new LoginPage())
