"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var webAPI = require("../../api/app/AppService");
var morePage = (function () {
    function morePage() {
        this.data = {
            userInfo: {},
            hasUserInfo: false,
            canIUse: wx.canIUse('button.open-type.getUserInfo'),
        };
    }
    morePage.prototype.bindViewTap = function () {
        wx.navigateTo({
            url: '../logs/logs'
        });
    };
    morePage.prototype.handlePortfolioPageNav = function () {
        wx.navigateTo({
            url: '/pages/portfolio/index'
        });
    };
    morePage.prototype.handleNutriDatabaseNav = function () {
        wx.navigateTo({
            url: '/pages/nutritionalDatabasePage/index'
        });
    };
    morePage.prototype.handleweightRecordNav = function () {
        wx.navigateTo({
            url: '/pages/weightRecord/index'
        });
    };
    morePage.prototype.handleRDINav = function () {
        webAPI.RetrieveUserRDA({}).then(function (resp) {
            var rdaUrl = resp.rda_url;
            wx.navigateTo({ url: '../../pages/rdiPage/rdiPage?url=' + rdaUrl });
        }).catch(function (err) {
            console.log(err);
            wx.showModal({
                title: '',
                content: '获取推荐值失败',
                showCancel: false
            });
        });
    };
    morePage.prototype.handleCustomerServiceCP = function () {
        wx.setClipboardData({
            data: "DietlensZhaoyan",
            success: function (res) {
                wx.showModal({
                    title: '提示',
                    content: '已将客服微信号复制到剪贴板,请通过搜索微信号添加好友使用。',
                    showCancel: false,
                    success: function (res) {
                        if (res.confirm) {
                            console.log('确定');
                        }
                        else if (res.cancel) {
                            console.log('取消');
                        }
                    }
                });
            }
        });
    };
    morePage.prototype.onLoad = function () {
    };
    morePage.prototype.getUserInfo = function (e) {
        var that = this;
        console.log(e);
        app.globalData.userInfo = e.detail.userInfo;
        this.setUserInfo(e.detail.userInfo);
    };
    morePage.prototype.setUserInfo = function (userInfo) {
        this.setData({
            userInfo: userInfo,
            hasUserInfo: true
        });
    };
    return morePage;
}());
Page(new morePage());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBQzVCLGlEQUFtRDtBQUVuRDtJQUFBO1FBQ1MsU0FBSSxHQUFHO1lBQ1osUUFBUSxFQUFFLEVBQUU7WUFDWixXQUFXLEVBQUUsS0FBSztZQUNsQixPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQztTQUNwRCxDQUFBO0lBa0dILENBQUM7SUFoR1EsOEJBQVcsR0FBbEI7UUFDRSxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osR0FBRyxFQUFFLGNBQWM7U0FDcEIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVNLHlDQUFzQixHQUE3QjtRQUNFLEVBQUUsQ0FBQyxVQUFVLENBQUM7WUFDWixHQUFHLEVBQUUsd0JBQXdCO1NBQzlCLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFFTSx5Q0FBc0IsR0FBN0I7UUFDRSxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osR0FBRyxFQUFFLHNDQUFzQztTQUM1QyxDQUFDLENBQUE7SUFDSixDQUFDO0lBRU0sd0NBQXFCLEdBQTVCO1FBQ0UsRUFBRSxDQUFDLFVBQVUsQ0FBQztZQUNaLEdBQUcsRUFBRSwyQkFBMkI7U0FDakMsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUVNLCtCQUFZLEdBQW5CO1FBQ0UsTUFBTSxDQUFDLGVBQWUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO1lBQ2xDLElBQUksTUFBTSxHQUFHLElBQUksQ0FBQyxPQUFPLENBQUM7WUFDMUIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxFQUFFLEdBQUcsRUFBRSxrQ0FBa0MsR0FBRyxNQUFNLEVBQUUsQ0FBQyxDQUFDO1FBQ3RFLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUc7WUFDVixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLFNBQVM7Z0JBQ2xCLFVBQVUsRUFBRSxLQUFLO2FBQ2xCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBSUwsQ0FBQztJQUVNLDBDQUF1QixHQUE5QjtRQUNFLEVBQUUsQ0FBQyxnQkFBZ0IsQ0FBQztZQUNsQixJQUFJLEVBQUUsaUJBQWlCO1lBQ3ZCLE9BQU8sRUFBRSxVQUFVLEdBQUc7Z0JBQ3BCLEVBQUUsQ0FBQyxTQUFTLENBQUM7b0JBQ1gsS0FBSyxFQUFFLElBQUk7b0JBQ1gsT0FBTyxFQUFFLCtCQUErQjtvQkFDeEMsVUFBVSxFQUFFLEtBQUs7b0JBQ2pCLE9BQU8sRUFBRSxVQUFVLEdBQUc7d0JBQ3BCLElBQUksR0FBRyxDQUFDLE9BQU8sRUFBRTs0QkFDZixPQUFPLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxDQUFBO3lCQUNsQjs2QkFBTSxJQUFJLEdBQUcsQ0FBQyxNQUFNLEVBQUU7NEJBQ3JCLE9BQU8sQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLENBQUE7eUJBQ2xCO29CQUNILENBQUM7aUJBQ0YsQ0FBQyxDQUFBO1lBQ0osQ0FBQztTQUNGLENBQUMsQ0FBQztJQUNMLENBQUM7SUFFTSx5QkFBTSxHQUFiO0lBbUJBLENBQUM7SUFFTSw4QkFBVyxHQUFsQixVQUFtQixDQUFNO1FBQ3ZCLElBQUksSUFBSSxHQUFHLElBQUksQ0FBQztRQUNoQixPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ2YsR0FBRyxDQUFDLFVBQVUsQ0FBQyxRQUFRLEdBQUcsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxRQUFRLENBQUM7UUFFNUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3RDLENBQUM7SUFFTyw4QkFBVyxHQUFuQixVQUFvQixRQUFhO1FBQzlCLElBQVksQ0FBQyxPQUFPLENBQUM7WUFDcEIsUUFBUSxFQUFFLFFBQVE7WUFDbEIsV0FBVyxFQUFFLElBQUk7U0FDbEIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILGVBQUM7QUFBRCxDQUFDLEFBdkdELElBdUdDO0FBRUQsSUFBSSxDQUFDLElBQUksUUFBUSxFQUFFLENBQUMsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vaW5kZXguanNcblxuY29uc3QgYXBwID0gZ2V0QXBwPElNeUFwcD4oKVxuaW1wb3J0ICogYXMgd2ViQVBJIGZyb20gJy4uLy4uL2FwaS9hcHAvQXBwU2VydmljZSc7XG5cbmNsYXNzIG1vcmVQYWdlIHtcbiAgcHVibGljIGRhdGEgPSB7XG4gICAgdXNlckluZm86IHt9LFxuICAgIGhhc1VzZXJJbmZvOiBmYWxzZSxcbiAgICBjYW5JVXNlOiB3eC5jYW5JVXNlKCdidXR0b24ub3Blbi10eXBlLmdldFVzZXJJbmZvJyksXG4gIH1cblxuICBwdWJsaWMgYmluZFZpZXdUYXAoKTogdm9pZCB7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6ICcuLi9sb2dzL2xvZ3MnXG4gICAgfSlcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVQb3J0Zm9saW9QYWdlTmF2KCk6IHZvaWQge1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiAnL3BhZ2VzL3BvcnRmb2xpby9pbmRleCdcbiAgICB9KVxuICB9XG5cbiAgcHVibGljIGhhbmRsZU51dHJpRGF0YWJhc2VOYXYoKTogdm9pZCB7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6ICcvcGFnZXMvbnV0cml0aW9uYWxEYXRhYmFzZVBhZ2UvaW5kZXgnXG4gICAgfSlcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGV3ZWlnaHRSZWNvcmROYXYoKTogdm9pZCB7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6ICcvcGFnZXMvd2VpZ2h0UmVjb3JkL2luZGV4J1xuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgaGFuZGxlUkRJTmF2KCk6IHZvaWQge1xuICAgIHdlYkFQSS5SZXRyaWV2ZVVzZXJSREEoe30pLnRoZW4ocmVzcCA9PiB7XG4gICAgICBsZXQgcmRhVXJsID0gcmVzcC5yZGFfdXJsO1xuICAgICAgd3gubmF2aWdhdGVUbyh7IHVybDogJy4uLy4uL3BhZ2VzL3JkaVBhZ2UvcmRpUGFnZT91cmw9JyArIHJkYVVybCB9KTtcbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgY29udGVudDogJ+iOt+WPluaOqOiNkOWAvOWksei0pScsXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgICAvLyB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAvLyAgIHVybDogJy9wYWdlcy9yZGlHb2FsL2luZGV4J1xuICAgIC8vIH0pXG4gIH1cblxuICBwdWJsaWMgaGFuZGxlQ3VzdG9tZXJTZXJ2aWNlQ1AoKSB7XG4gICAgd3guc2V0Q2xpcGJvYXJkRGF0YSh7XG4gICAgICBkYXRhOiBcIkRpZXRsZW5zWmhhb3lhblwiLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgIHRpdGxlOiAn5o+Q56S6JyxcbiAgICAgICAgICBjb250ZW50OiAn5bey5bCG5a6i5pyN5b6u5L+h5Y+35aSN5Yi25Yiw5Ymq6LS05p2/LOivt+mAmui/h+aQnOe0ouW+ruS/oeWPt+a3u+WKoOWlveWPi+S9v+eUqOOAgicsXG4gICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2UsXG4gICAgICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCfnoa7lrponKVxuICAgICAgICAgICAgfSBlbHNlIGlmIChyZXMuY2FuY2VsKSB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKCflj5bmtognKVxuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfSlcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkxvYWQoKTogdm9pZCB7XG4gICAgLy8gdmFyIHRoYXQgPSB0aGlzO1xuXG4gICAgLy8gaWYgKGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvKSB7XG4gICAgLy8gICB0aGlzLnNldFVzZXJJbmZvKGFwcC5nbG9iYWxEYXRhLnVzZXJJbmZvKTtcblxuICAgIC8vIH0gZWxzZSB7XG4gICAgLy8gICB3eC5nZXRVc2VySW5mbyh7XG4gICAgLy8gICAgIHN1Y2Nlc3M6IHJlcyA9PiB7XG4gICAgLy8gICAgICAgYXBwLmdsb2JhbERhdGEudXNlckluZm8gPSByZXMudXNlckluZm9cbiAgICAvLyAgICAgICB0aGF0LnNldFVzZXJJbmZvKHJlcy51c2VySW5mbyk7XG4gICAgLy8gICAgIH0sXG4gICAgLy8gICAgIGZhaWw6IGVyciA9PiB7XG4gICAgLy8gICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgLy8gICAgICAgICB1cmw6ICcuLi9pbnZpdGF0aW9uL2luZGV4J1xuICAgIC8vICAgICAgIH0pXG4gICAgLy8gICAgIH1cbiAgICAvLyAgIH0pXG4gICAgLy8gfVxuICB9XG5cbiAgcHVibGljIGdldFVzZXJJbmZvKGU6IGFueSk6IHZvaWQge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBjb25zb2xlLmxvZyhlKTtcbiAgICBhcHAuZ2xvYmFsRGF0YS51c2VySW5mbyA9IGUuZGV0YWlsLnVzZXJJbmZvO1xuXG4gICAgdGhpcy5zZXRVc2VySW5mbyhlLmRldGFpbC51c2VySW5mbyk7XG4gIH1cblxuICBwcml2YXRlIHNldFVzZXJJbmZvKHVzZXJJbmZvOiBhbnkpIHtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgdXNlckluZm86IHVzZXJJbmZvLFxuICAgICAgaGFzVXNlckluZm86IHRydWVcbiAgICB9KTtcbiAgfVxufVxuXG5QYWdlKG5ldyBtb3JlUGFnZSgpKTtcbiJdfQ==