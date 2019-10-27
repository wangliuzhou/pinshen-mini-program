import * as webAPI from '../../api/app/AppService';
import * as globalEnum from '../../api/GlobalEnum';

class FoodSharePage {
  public mealLogId = 0;
  public data = {
    imageUrl: "",
    bgUrl: "../../images/bg@3x.png"
  }

  public onLoad(option: any) {
    webAPI.SetAuthToken(wx.getStorageSync(globalEnum.globalKey_token));
    this.mealLogId = Number(option.mealId);
    this.getSharePic();
  }

  public getSharePic() {
    wx.showLoading({ title: "生成美图中..." });
    let req = { "meal_log_id": this.mealLogId };
    webAPI.RetrieveMealLogShareURL(req).then(resp => {
      wx.hideLoading({});
      let imageUrl = resp.sharing_img_link;
      console.log(imageUrl);
      (this as any).setData({
        imageUrl: imageUrl
      });
    }).catch(err => {
      wx.hideLoading({});
      console.log(err);
      wx.showModal({
        title: '',
        content: '生成美图失败',
        showCancel: false
      });
    });
    // (this as any).setData({ imageUrl:"http://s5.sinaimg.cn/mw690/002aRmVFzy764G2z0gYe4&690"});
  }

  public onSaveToAlbumBtnPressed() {
    //downloadFile -> save tempFile from tempFilePath
    var that = this;
    wx.showLoading({
      title: '保存中...'
    });
    console.log(new Date().getTime());
    wx.downloadFile({
      url: this.data.imageUrl,
      success: function (res) {
        //图片保存到本地
        console.log(new Date().getTime());
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (data) {
            wx.hideLoading({});
            wx.showToast({
              title: '保存图片成功,赶快分享给好友吧!',
            });
          },
          fail: function (err) {
            wx.hideLoading({});
            if (err.errMsg === "saveImageToPhotosAlbum:fail:auth denied" || err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
              // 这边微信做过调整，必须要在按钮中触发，因此需要在弹框回调中进行调用
              wx.showModal({
                title: '提示',
                content: '需要您授权保存相册',
                showCancel: false,
                success: modalSuccess => {
                  wx.openSetting({
                    success(settingdata) {
                      console.log("settingdata", settingdata)
                      if (settingdata.authSetting['scope.writePhotosAlbum']) {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限成功,再次点击图片即可保存',
                          showCancel: false,
                        })
                      } else {
                        wx.showModal({
                          title: '提示',
                          content: '获取权限失败，将无法保存到相册哦~',
                          showCancel: false,
                        })
                      }
                    },
                    fail(failData) {
                      console.log("failData", failData)
                    },
                    complete(finishData) {
                      console.log("finishData", finishData)
                    }
                  })
                }
              })
            } else {
              wx.showModal({
                title: '提示',
                content: err.errMsg,
                showCancel: false,
              });
            }
          },
          complete(res:any) {
            console.log(res);
            wx.hideLoading({})
          }
        })
      },
      fail: function (err:any) {
        wx.hideLoading({});
        wx.showModal({
          title: '提示',
          content: err.errMsg + that.data.imageUrl,
          showCancel: false,
        });
      }
    });
    // wx.downloadFile({
    //   url: this.data.imageUrl,
    //   success(res:any){
    //     wx.saveImageToPhotosAlbum({
    //       filePath: res.tempFilePath,
    //       success(res) {
    //         wx.showToast({
    //           title: '保存图片成功,赶快分享给好友吧!',
    //         })
    //       },
    //       fail(err) {
    //         wx.showToast({
    //           title: '保存图片失败！',
    //           icon: 'none'
    //         });
    //       }
    //     });
    //   },
    //   fail(err:any){
    //     wx.showToast({
    //       title: err,
    //       icon: 'none'
    //     });
    //   }
    // });
  }

  public onShareAppMessage() { //TODO add param for webview url
    return {
      title: '知食',
      path: '',
      imageUrl: this.data.imageUrl
    }
  }


}

Page(new FoodSharePage());