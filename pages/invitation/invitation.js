"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var loginAPI = require("../../api/login/LoginService");
var globalEnum = require("../../api/GlobalEnum");
var invitation = (function () {
    function invitation() {
        this.data = {
            canIUse: wx.canIUse('button.open-type.getUserInfo'),
            hasCode: false,
            codeInput: "",
            empty: true,
            codeValidate: "",
            showAuth: false,
            userStatus: 1
        };
    }
    invitation.prototype.onLoad = function (option) {
        console.log(option.user_status);
        if (option.user_status == '2' || option.user_status == '3') {
            this.setData({
                userStatus: Number(option.user_status),
                showAuth: true
            });
            console.log(this.data.userStatus);
        }
        if (!this.data.showAuth) {
            wx.setNavigationBarTitle({
                title: "使用小程序"
            });
            wx.showModal({
                content: "我们的测试版小程序目前只对部分用户开放，对所有用户开放的正式版小程序即将上线，敬请期待",
                confirmText: "好的",
                showCancel: false,
                success: function (res) {
                    if (res.confirm) {
                        console.log('');
                    }
                }
            });
        }
    };
    invitation.prototype.onShow = function () {
        this.setData({ hasCode: false });
    };
    invitation.prototype.bindCodeInput = function (event) {
        this.setData({ codeInput: event.detail.value });
        if (this.data.codeInput == "") {
            this.setData({ empty: true, codeValidate: "You do not have the invitation code to use the app" });
        }
        else {
            this.setData({ empty: false, codeValidate: "" });
        }
    };
    invitation.prototype.submit = function (event) {
        var _this = this;
        wx.showLoading({ title: "提交中..." });
        var code = this.data.codeInput.trim();
        wx.login({
            success: function (_res) {
                wx.hideLoading({});
                var req = { jscode: _res.code, invitation_code: code };
                loginAPI.MiniProgramRegister(req).then(function (resp) {
                    if (resp.token && resp.token != "") {
                        wx.setStorageSync(globalEnum.globalKey_token, resp.token);
                        _this.setData({
                            showAuth: true,
                        });
                    }
                    else {
                        wx.showModal({ title: "", content: "验证邀请码失败，请联系客服。", showCancel: false });
                    }
                }).catch(function (err) {
                    console.log(err);
                    wx.hideLoading({});
                    wx.showModal({ title: "", content: err.message, showCancel: false });
                });
            }
        });
    };
    invitation.prototype.bindgetuserInfo = function (e) {
        var _this = this;
        console.log(e.detail.userInfo);
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    if (_this.data.userStatus == 1 || _this.data.userStatus == 2) {
                        wx.reLaunch({
                            url: '../onBoard/onBoard'
                        });
                    }
                    else if (_this.data.userStatus == 3) {
                        console.log('home page');
                        wx.reLaunch({
                            url: '../../pages/home/index'
                        });
                    }
                }
            }
        });
    };
    return invitation;
}());
Page(new invitation());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW52aXRhdGlvbi5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbImludml0YXRpb24udHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSx1REFBd0Q7QUFDeEQsaURBQW1EO0FBR25EO0lBQUE7UUFDUyxTQUFJLEdBQUc7WUFDWixPQUFPLEVBQUUsRUFBRSxDQUFDLE9BQU8sQ0FBQyw4QkFBOEIsQ0FBQztZQUNuRCxPQUFPLEVBQUUsS0FBSztZQUNkLFNBQVMsRUFBRSxFQUFFO1lBQ2IsS0FBSyxFQUFFLElBQUk7WUFDWCxZQUFZLEVBQUUsRUFBRTtZQUNoQixRQUFRLEVBQUUsS0FBSztZQUNmLFVBQVUsRUFBRSxDQUFDO1NBQ2QsQ0FBQTtJQTBGSCxDQUFDO0lBeEZRLDJCQUFNLEdBQWIsVUFBYyxNQUFNO1FBQ2xCLE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFBO1FBQy9CLElBQUksTUFBTSxDQUFDLFdBQVcsSUFBSSxHQUFHLElBQUUsTUFBTSxDQUFDLFdBQVcsSUFBSSxHQUFHLEVBQUU7WUFDeEQsSUFBSSxDQUFDLE9BQU8sQ0FBQztnQkFDWCxVQUFVLEVBQUUsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFXLENBQUM7Z0JBQ3RDLFFBQVEsRUFBRSxJQUFJO2FBQ2YsQ0FBQyxDQUFBO1lBQ0YsT0FBTyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxDQUFBO1NBQ2xDO1FBRUQsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ3ZCLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztnQkFDdkIsS0FBSyxFQUFFLE9BQU87YUFDZixDQUFDLENBQUM7WUFFSCxFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLE9BQU8sRUFBRSw2Q0FBNkM7Z0JBQ3RELFdBQVcsRUFBRSxJQUFJO2dCQUNqQixVQUFVLEVBQUUsS0FBSztnQkFDakIsT0FBTyxFQUFFLFVBQVUsR0FBRztv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LEVBQUU7b0JBQ3JDLElBQUksS0FBSyxDQUFDLElBQUksQ0FBQyxVQUFVLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLENBQUMsRUFBRTt3QkFDNUQsRUFBRSxDQUFDLFFBQVEsQ0FBQzs0QkFDVixHQUFHLEVBQUUsb0JBQW9CO3lCQUMxQixDQUFDLENBQUM7cUJBQ0o7eUJBQU0sSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLFVBQVUsSUFBSSxDQUFDLEVBQUU7d0JBQ3JDLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxDQUFDLENBQUE7d0JBQ3hCLEVBQUUsQ0FBQyxRQUFRLENBQUM7NEJBQ1YsR0FBRyxFQUFFLHdCQUF3Qjt5QkFDOUIsQ0FBQyxDQUFDO3FCQUNKO2lCQUVGO1lBQ0gsQ0FBQztTQUNGLENBQUMsQ0FBQTtJQUNKLENBQUM7SUFDSCxpQkFBQztBQUFELENBQUMsQUFuR0QsSUFtR0M7QUFFRCxJQUFJLENBQUMsSUFBSSxVQUFVLEVBQUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbG9naW5BUEkgZnJvbSAnLi4vLi4vYXBpL2xvZ2luL0xvZ2luU2VydmljZSdcbmltcG9ydCAqIGFzIGdsb2JhbEVudW0gZnJvbSAnLi4vLi4vYXBpL0dsb2JhbEVudW0nO1xuXG5cbmNsYXNzIGludml0YXRpb24ge1xuICBwdWJsaWMgZGF0YSA9IHtcbiAgICBjYW5JVXNlOiB3eC5jYW5JVXNlKCdidXR0b24ub3Blbi10eXBlLmdldFVzZXJJbmZvJylcbiAgICBoYXNDb2RlOiBmYWxzZSxcbiAgICBjb2RlSW5wdXQ6IFwiXCIsXG4gICAgZW1wdHk6IHRydWUsXG4gICAgY29kZVZhbGlkYXRlOiBcIlwiLFxuICAgIHNob3dBdXRoOiBmYWxzZSxcbiAgICB1c2VyU3RhdHVzOiAxXG4gIH1cblxuICBwdWJsaWMgb25Mb2FkKG9wdGlvbik6IHZvaWQge1xuICAgIGNvbnNvbGUubG9nKG9wdGlvbi51c2VyX3N0YXR1cylcbiAgICBpZiAob3B0aW9uLnVzZXJfc3RhdHVzID09ICcyJ3x8b3B0aW9uLnVzZXJfc3RhdHVzID09ICczJykge1xuICAgICAgdGhpcy5zZXREYXRhKHtcbiAgICAgICAgdXNlclN0YXR1czogTnVtYmVyKG9wdGlvbi51c2VyX3N0YXR1cyksXG4gICAgICAgIHNob3dBdXRoOiB0cnVlXG4gICAgICB9KVxuICAgICAgY29uc29sZS5sb2codGhpcy5kYXRhLnVzZXJTdGF0dXMpXG4gICAgfVxuXG4gICAgaWYgKCF0aGlzLmRhdGEuc2hvd0F1dGgpIHtcbiAgICAgIHd4LnNldE5hdmlnYXRpb25CYXJUaXRsZSh7XG4gICAgICAgIHRpdGxlOiBcIuS9v+eUqOWwj+eoi+W6j1wiXG4gICAgICB9KTtcblxuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgY29udGVudDogXCLmiJHku6znmoTmtYvor5XniYjlsI/nqIvluo/nm67liY3lj6rlr7npg6jliIbnlKjmiLflvIDmlL7vvIzlr7nmiYDmnInnlKjmiLflvIDmlL7nmoTmraPlvI/niYjlsI/nqIvluo/ljbPlsIbkuIrnur/vvIzmlazor7fmnJ/lvoVcIixcbiAgICAgICAgY29uZmlybVRleHQ6IFwi5aW955qEXCIsXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlLFxuICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgaWYgKHJlcy5jb25maXJtKSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZygnJylcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pXG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uU2hvdygpOiB2b2lkIHtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyBoYXNDb2RlOiBmYWxzZSB9KTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kQ29kZUlucHV0KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyBjb2RlSW5wdXQ6IGV2ZW50LmRldGFpbC52YWx1ZSB9KTtcblxuICAgIGlmICh0aGlzLmRhdGEuY29kZUlucHV0ID09IFwiXCIpIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IGVtcHR5OiB0cnVlLCBjb2RlVmFsaWRhdGU6IFwiWW91IGRvIG5vdCBoYXZlIHRoZSBpbnZpdGF0aW9uIGNvZGUgdG8gdXNlIHRoZSBhcHBcIiB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHsgZW1wdHk6IGZhbHNlLCBjb2RlVmFsaWRhdGU6IFwiXCIgfSk7XG4gICAgfVxuICB9XG5cbiAgc3VibWl0KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIHd4LnNob3dMb2FkaW5nKHsgdGl0bGU6IFwi5o+Q5Lqk5LitLi4uXCIgfSk7XG4gICAgbGV0IGNvZGUgPSB0aGlzLmRhdGEuY29kZUlucHV0LnRyaW0oKTtcbiAgICB3eC5sb2dpbih7XG4gICAgICBzdWNjZXNzKF9yZXMpIHtcbiAgICAgICAgd3guaGlkZUxvYWRpbmcoe30pO1xuICAgICAgICBsZXQgcmVxID0geyBqc2NvZGU6IF9yZXMuY29kZSwgaW52aXRhdGlvbl9jb2RlOiBjb2RlIH07XG4gICAgICAgIGxvZ2luQVBJLk1pbmlQcm9ncmFtUmVnaXN0ZXIocmVxKS50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgIGlmIChyZXNwLnRva2VuICYmIHJlc3AudG9rZW4gIT0gXCJcIikge1xuICAgICAgICAgICAgd3guc2V0U3RvcmFnZVN5bmMoZ2xvYmFsRW51bS5nbG9iYWxLZXlfdG9rZW4sIHJlc3AudG9rZW4pO1xuICAgICAgICAgICAgX3RoaXMuc2V0RGF0YSh7XG4gICAgICAgICAgICAgIHNob3dBdXRoOiB0cnVlLFxuICAgICAgICAgICAgfSlcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgd3guc2hvd01vZGFsKHsgdGl0bGU6IFwiXCIsIGNvbnRlbnQ6IFwi6aqM6K+B6YKA6K+356CB5aSx6LSl77yM6K+36IGU57O75a6i5pyN44CCXCIsIHNob3dDYW5jZWw6IGZhbHNlIH0pO1xuICAgICAgICAgIH1cbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKHt9KTtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoeyB0aXRsZTogXCJcIiwgY29udGVudDogZXJyLm1lc3NhZ2UsIHNob3dDYW5jZWw6IGZhbHNlIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuICBwdWJsaWMgYmluZGdldHVzZXJJbmZvKGUpIHtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIGNvbnNvbGUubG9nKGUuZGV0YWlsLnVzZXJJbmZvKVxuICAgIHd4LmdldFNldHRpbmcoe1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XG4gICAgICAgICAgaWYgKF90aGlzLmRhdGEudXNlclN0YXR1cyA9PSAxIHx8IF90aGlzLmRhdGEudXNlclN0YXR1cyA9PSAyKSB7XG4gICAgICAgICAgICB3eC5yZUxhdW5jaCh7XG4gICAgICAgICAgICAgIHVybDogJy4uL29uQm9hcmQvb25Cb2FyZCdcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0gZWxzZSBpZiAoX3RoaXMuZGF0YS51c2VyU3RhdHVzID09IDMpIHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKCdob21lIHBhZ2UnKVxuICAgICAgICAgICAgd3gucmVMYXVuY2goe1xuICAgICAgICAgICAgICB1cmw6ICcuLi8uLi9wYWdlcy9ob21lL2luZGV4J1xuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgfVxuXG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KVxuICB9XG59XG5cblBhZ2UobmV3IGludml0YXRpb24oKSk7XG4iXX0=