"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webAPI = require("../../api/app/AppService");
var globalEnum = require("../../api/GlobalEnum");
var FoodSharePage = (function () {
    function FoodSharePage() {
        this.mealLogId = 0;
        this.data = {
            imageUrl: "",
            bgUrl: "../../images/bg@3x.png"
        };
    }
    FoodSharePage.prototype.onLoad = function (option) {
        webAPI.SetAuthToken(wx.getStorageSync(globalEnum.globalKey_token));
        this.mealLogId = Number(option.mealId);
        this.getSharePic();
    };
    FoodSharePage.prototype.getSharePic = function () {
        var _this = this;
        wx.showLoading({ title: "生成美图中..." });
        var req = { "meal_log_id": this.mealLogId };
        webAPI.RetrieveMealLogShareURL(req).then(function (resp) {
            wx.hideLoading({});
            var imageUrl = resp.sharing_img_link;
            console.log(imageUrl);
            _this.setData({
                imageUrl: imageUrl
            });
        }).catch(function (err) {
            wx.hideLoading({});
            console.log(err);
            wx.showModal({
                title: '',
                content: '生成美图失败',
                showCancel: false
            });
        });
    };
    FoodSharePage.prototype.onSaveToAlbumBtnPressed = function () {
        var that = this;
        wx.showLoading({
            title: '保存中...'
        });
        console.log(new Date().getTime());
        wx.downloadFile({
            url: this.data.imageUrl,
            success: function (res) {
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
                            wx.showModal({
                                title: '提示',
                                content: '需要您授权保存相册',
                                showCancel: false,
                                success: function (modalSuccess) {
                                    wx.openSetting({
                                        success: function (settingdata) {
                                            console.log("settingdata", settingdata);
                                            if (settingdata.authSetting['scope.writePhotosAlbum']) {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '获取权限成功,再次点击图片即可保存',
                                                    showCancel: false,
                                                });
                                            }
                                            else {
                                                wx.showModal({
                                                    title: '提示',
                                                    content: '获取权限失败，将无法保存到相册哦~',
                                                    showCancel: false,
                                                });
                                            }
                                        },
                                        fail: function (failData) {
                                            console.log("failData", failData);
                                        },
                                        complete: function (finishData) {
                                            console.log("finishData", finishData);
                                        }
                                    });
                                }
                            });
                        }
                        else {
                            wx.showModal({
                                title: '提示',
                                content: err.errMsg,
                                showCancel: false,
                            });
                        }
                    },
                    complete: function (res) {
                        console.log(res);
                        wx.hideLoading({});
                    }
                });
            },
            fail: function (err) {
                wx.hideLoading({});
                wx.showModal({
                    title: '提示',
                    content: err.errMsg + that.data.imageUrl,
                    showCancel: false,
                });
            }
        });
    };
    FoodSharePage.prototype.onShareAppMessage = function () {
        return {
            title: '知食',
            path: '',
            imageUrl: this.data.imageUrl
        };
    };
    return FoodSharePage;
}());
Page(new FoodSharePage());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFtRDtBQUNuRCxpREFBbUQ7QUFFbkQ7SUFBQTtRQUNTLGNBQVMsR0FBRyxDQUFDLENBQUM7UUFDZCxTQUFJLEdBQUc7WUFDWixRQUFRLEVBQUUsRUFBRTtZQUNaLEtBQUssRUFBRSx3QkFBd0I7U0FDaEMsQ0FBQTtJQWdKSCxDQUFDO0lBOUlRLDhCQUFNLEdBQWIsVUFBYyxNQUFXO1FBQ3ZCLE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUNuRSxJQUFJLENBQUMsU0FBUyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFTSxtQ0FBVyxHQUFsQjtRQUFBLGlCQW9CQztRQW5CQyxFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsS0FBSyxFQUFFLFVBQVUsRUFBRSxDQUFDLENBQUM7UUFDdEMsSUFBSSxHQUFHLEdBQUcsRUFBRSxhQUFhLEVBQUUsSUFBSSxDQUFDLFNBQVMsRUFBRSxDQUFDO1FBQzVDLE1BQU0sQ0FBQyx1QkFBdUIsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO1lBQzNDLEVBQUUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUM7WUFDbkIsSUFBSSxRQUFRLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDO1lBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLENBQUM7WUFDckIsS0FBWSxDQUFDLE9BQU8sQ0FBQztnQkFDcEIsUUFBUSxFQUFFLFFBQVE7YUFDbkIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsR0FBRztZQUNWLEVBQUUsQ0FBQyxX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RyxDQUFDLEdBQUcsQ0FBQyxDQUFDO3dCQUNqQixFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFBO29CQUNwQixDQUFDO2lCQUNGLENBQUMsQ0FBQTtZQUNKLENBQUM7WUFDRCxJQUFJLEVBQUUsVUFBVSxHQUFPO2dCQUNyQixFQUFFLENBQUMsV0FBVyxDQUFDLEVBQUUsQ0FBQyxDQUFDO2dCQUNuQixFQUFFLENBQUMsU0FBUyxDQUFDO29CQUNYLEtBQUssRUFBRSxJQUFJO29CQUNYLE9BQU8sRUFBRSxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtvQkFDeEMsVUFBVSxFQUFFLEtBQUs7aUJBQ2xCLENBQUMsQ0FBQztZQUNMLENBQUM7U0FDRixDQUFDLENBQUM7SUEwQkwsQ0FBQztJQUVNLHlDQUFpQixHQUF4QjtRQUNFLE9BQU87WUFDTCxLQUFLLEVBQUUsSUFBSTtZQUNYLElBQUksRUFBRSxFQUFFO1lBQ1IsUUFBUSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUTtTQUM3QixDQUFBO0lBQ0gsQ0FBQztJQUdILG9CQUFDO0FBQUQsQ0FBQyxBQXJKRCxJQXFKQztBQUVELElBQUksQ0FBQyxJQUFJLGFBQWEsRUFBRSxDQUFDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3ZWJBUEkgZnJvbSAnLi4vLi4vYXBpL2FwcC9BcHBTZXJ2aWNlJztcbmltcG9ydCAqIGFzIGdsb2JhbEVudW0gZnJvbSAnLi4vLi4vYXBpL0dsb2JhbEVudW0nO1xuXG5jbGFzcyBGb29kU2hhcmVQYWdlIHtcbiAgcHVibGljIG1lYWxMb2dJZCA9IDA7XG4gIHB1YmxpYyBkYXRhID0ge1xuICAgIGltYWdlVXJsOiBcIlwiLFxuICAgIGJnVXJsOiBcIi4uLy4uL2ltYWdlcy9iZ0AzeC5wbmdcIlxuICB9XG5cbiAgcHVibGljIG9uTG9hZChvcHRpb246IGFueSkge1xuICAgIHdlYkFQSS5TZXRBdXRoVG9rZW4od3guZ2V0U3RvcmFnZVN5bmMoZ2xvYmFsRW51bS5nbG9iYWxLZXlfdG9rZW4pKTtcbiAgICB0aGlzLm1lYWxMb2dJZCA9IE51bWJlcihvcHRpb24ubWVhbElkKTtcbiAgICB0aGlzLmdldFNoYXJlUGljKCk7XG4gIH1cblxuICBwdWJsaWMgZ2V0U2hhcmVQaWMoKSB7XG4gICAgd3guc2hvd0xvYWRpbmcoeyB0aXRsZTogXCLnlJ/miJDnvo7lm77kuK0uLi5cIiB9KTtcbiAgICBsZXQgcmVxID0geyBcIm1lYWxfbG9nX2lkXCI6IHRoaXMubWVhbExvZ0lkIH07XG4gICAgd2ViQVBJLlJldHJpZXZlTWVhbExvZ1NoYXJlVVJMKHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgIHd4LmhpZGVMb2FkaW5nKHt9KTtcbiAgICAgIGxldCBpbWFnZVVybCA9IHJlc3Auc2hhcmluZ19pbWdfbGluaztcbiAgICAgIGNvbnNvbGUubG9nKGltYWdlVXJsKTtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICAgIGltYWdlVXJsOiBpbWFnZVVybFxuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIHd4LmhpZGVMb2FkaW5nKHt9KTtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICB0aXRsZTogJycsXG4gICAgICAgIGNvbnRlbnQ6ICfnlJ/miJDnvo7lm77lpLHotKUnLFxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgfSk7XG4gICAgfSk7XG4gICAgLy8gKHRoaXMgYXMgYW55KS5zZXREYXRhKHsgaW1hZ2VVcmw6XCJodHRwOi8vczUuc2luYWltZy5jbi9tdzY5MC8wMDJhUm1WRnp5NzY0RzJ6MGdZZTQmNjkwXCJ9KTtcbiAgfVxuXG4gIHB1YmxpYyBvblNhdmVUb0FsYnVtQnRuUHJlc3NlZCgpIHtcbiAgICAvL2Rvd25sb2FkRmlsZSAtPiBzYXZlIHRlbXBGaWxlIGZyb20gdGVtcEZpbGVQYXRoXG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgIHRpdGxlOiAn5L+d5a2Y5LitLi4uJ1xuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICB3eC5kb3dubG9hZEZpbGUoe1xuICAgICAgdXJsOiB0aGlzLmRhdGEuaW1hZ2VVcmwsXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgIC8v5Zu+54mH5L+d5a2Y5Yiw5pys5ZywXG4gICAgICAgIGNvbnNvbGUubG9nKG5ldyBEYXRlKCkuZ2V0VGltZSgpKTtcbiAgICAgICAgd3guc2F2ZUltYWdlVG9QaG90b3NBbGJ1bSh7XG4gICAgICAgICAgZmlsZVBhdGg6IHJlcy50ZW1wRmlsZVBhdGgsXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKGRhdGEpIHtcbiAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKHt9KTtcbiAgICAgICAgICAgIHd4LnNob3dUb2FzdCh7XG4gICAgICAgICAgICAgIHRpdGxlOiAn5L+d5a2Y5Zu+54mH5oiQ5YqfLOi1tuW/q+WIhuS6q+e7meWlveWPi+WQpyEnLFxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfSxcbiAgICAgICAgICBmYWlsOiBmdW5jdGlvbiAoZXJyKSB7XG4gICAgICAgICAgICB3eC5oaWRlTG9hZGluZyh7fSk7XG4gICAgICAgICAgICBpZiAoZXJyLmVyck1zZyA9PT0gXCJzYXZlSW1hZ2VUb1Bob3Rvc0FsYnVtOmZhaWw6YXV0aCBkZW5pZWRcIiB8fCBlcnIuZXJyTXNnID09PSBcInNhdmVJbWFnZVRvUGhvdG9zQWxidW06ZmFpbCBhdXRoIGRlbnlcIikge1xuICAgICAgICAgICAgICAvLyDov5novrnlvq7kv6HlgZrov4fosIPmlbTvvIzlv4XpobvopoHlnKjmjInpkq7kuK3op6blj5HvvIzlm6DmraTpnIDopoHlnKjlvLnmoYblm57osIPkuK3ov5vooYzosIPnlKhcbiAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgICB0aXRsZTogJ+aPkOekuicsXG4gICAgICAgICAgICAgICAgY29udGVudDogJ+mcgOimgeaCqOaOiOadg+S/neWtmOebuOWGjCcsXG4gICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXG4gICAgICAgICAgICAgICAgc3VjY2VzczogbW9kYWxTdWNjZXNzID0+IHtcbiAgICAgICAgICAgICAgICAgIHd4Lm9wZW5TZXR0aW5nKHtcbiAgICAgICAgICAgICAgICAgICAgc3VjY2VzcyhzZXR0aW5nZGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwic2V0dGluZ2RhdGFcIiwgc2V0dGluZ2RhdGEpXG4gICAgICAgICAgICAgICAgICAgICAgaWYgKHNldHRpbmdkYXRhLmF1dGhTZXR0aW5nWydzY29wZS53cml0ZVBob3Rvc0FsYnVtJ10pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+iOt+WPluadg+mZkOaIkOWKnyzlho3mrKHngrnlh7vlm77niYfljbPlj6/kv53lrZgnLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgY29udGVudDogJ+iOt+WPluadg+mZkOWksei0pe+8jOWwhuaXoOazleS/neWtmOWIsOebuOWGjOWTpn4nLFxuICAgICAgICAgICAgICAgICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZSxcbiAgICAgICAgICAgICAgICAgICAgICAgIH0pXG4gICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBmYWlsKGZhaWxEYXRhKSB7XG4gICAgICAgICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmYWlsRGF0YVwiLCBmYWlsRGF0YSlcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgY29tcGxldGUoZmluaXNoRGF0YSkge1xuICAgICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmluaXNoRGF0YVwiLCBmaW5pc2hEYXRhKVxuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICB9KVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgICAgICAgIGNvbnRlbnQ6IGVyci5lcnJNc2csXG4gICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXG4gICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0sXG4gICAgICAgICAgY29tcGxldGUocmVzOmFueSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2cocmVzKTtcbiAgICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKHt9KVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH0sXG4gICAgICBmYWlsOiBmdW5jdGlvbiAoZXJyOmFueSkge1xuICAgICAgICB3eC5oaWRlTG9hZGluZyh7fSk7XG4gICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgdGl0bGU6ICfmj5DnpLonLFxuICAgICAgICAgIGNvbnRlbnQ6IGVyci5lcnJNc2cgKyB0aGF0LmRhdGEuaW1hZ2VVcmwsXG4gICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIHd4LmRvd25sb2FkRmlsZSh7XG4gICAgLy8gICB1cmw6IHRoaXMuZGF0YS5pbWFnZVVybCxcbiAgICAvLyAgIHN1Y2Nlc3MocmVzOmFueSl7XG4gICAgLy8gICAgIHd4LnNhdmVJbWFnZVRvUGhvdG9zQWxidW0oe1xuICAgIC8vICAgICAgIGZpbGVQYXRoOiByZXMudGVtcEZpbGVQYXRoLFxuICAgIC8vICAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgLy8gICAgICAgICB3eC5zaG93VG9hc3Qoe1xuICAgIC8vICAgICAgICAgICB0aXRsZTogJ+S/neWtmOWbvueJh+aIkOWKnyzotbblv6vliIbkuqvnu5nlpb3lj4vlkKchJyxcbiAgICAvLyAgICAgICAgIH0pXG4gICAgLy8gICAgICAgfSxcbiAgICAvLyAgICAgICBmYWlsKGVycikge1xuICAgIC8vICAgICAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAvLyAgICAgICAgICAgdGl0bGU6ICfkv53lrZjlm77niYflpLHotKXvvIEnLFxuICAgIC8vICAgICAgICAgICBpY29uOiAnbm9uZSdcbiAgICAvLyAgICAgICAgIH0pO1xuICAgIC8vICAgICAgIH1cbiAgICAvLyAgICAgfSk7XG4gICAgLy8gICB9LFxuICAgIC8vICAgZmFpbChlcnI6YW55KXtcbiAgICAvLyAgICAgd3guc2hvd1RvYXN0KHtcbiAgICAvLyAgICAgICB0aXRsZTogZXJyLFxuICAgIC8vICAgICAgIGljb246ICdub25lJ1xuICAgIC8vICAgICB9KTtcbiAgICAvLyAgIH1cbiAgICAvLyB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvblNoYXJlQXBwTWVzc2FnZSgpIHsgLy9UT0RPIGFkZCBwYXJhbSBmb3Igd2VidmlldyB1cmxcbiAgICByZXR1cm4ge1xuICAgICAgdGl0bGU6ICfnn6Xpo58nLFxuICAgICAgcGF0aDogJycsXG4gICAgICBpbWFnZVVybDogdGhpcy5kYXRhLmltYWdlVXJsXG4gICAgfVxuICB9XG5cblxufVxuXG5QYWdlKG5ldyBGb29kU2hhcmVQYWdlKCkpOyJdfQ==