"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var globalEnum = require("../../api/GlobalEnum");
var webAPI = require("../../api/app/AppService");
var loginAPI = require("../../api/login/LoginService");
var moment = require("moment");
var chart = null;
function initChart(canvas, width, height, F2) {
    var data = [
        { week: '周日', value: 1200, avg: 2000 },
        { week: '周一', value: 1150, avg: 2000 },
        { week: '周二', value: 1300, avg: 2000 },
        { week: '周三', value: 1200, avg: 2000 },
        { week: '周四', value: 1200, avg: 2000 },
        { week: '周五', value: 1200, avg: 2000 },
        { week: '周六', value: 1200, avg: 2000 }
    ];
    chart = new F2.Chart({
        el: canvas,
        width: width,
        height: height
    });
    chart.axis('week', {
        grid: null
    });
    chart.tooltip({
        showCrosshairs: true,
        onShow: function (ev) {
            var items = ev.items;
            items[0].name = "热量";
        }
    });
    chart.interval().position('week*value').color("#ed2c48");
    var targetLine = 0;
    chart.guide().line({
        start: ['周日', targetLine],
        end: ['周六', targetLine],
        style: {
            stroke: '#d0d0d0',
            lineDash: [0, 2, 2],
            lineWidth: 1
        }
    });
    chart.guide().text({
        position: ['周日', 'max'],
        content: '',
        style: {
            textAlign: 'start',
            textBaseline: 'top',
            fill: '#5ed470'
        },
        offsetX: -25,
        offsetY: 15
    });
    chart.render();
    return chart;
}
var HomePage = (function () {
    function HomePage() {
        this.data = {
            average_energy: 1104,
            target_energy: 1205,
            cardList: [
                { card_title: "体重", card_weight_value: 0.0, card_desc: "公斤", card_bar_color: "#ff822d", card_redirect_path: "/pages/weightRecord/index" },
                { card_title: "营养推荐值", card_desc: "营养平衡", card_bar_color: "#ffb400", card_redirect_path: "/pages/rdiPage/rdiPage" },
                { card_title: "营养知识", card_desc: "知食营养师组", card_bar_color: "#ff5c47", card_redirect_path: "/pages/nutritionalDatabasePage/index" }
            ],
            activityCardList: [],
            opts: {
                onInit: initChart
            },
            quesTitle: "",
            currentSurveyId: 0,
            isAnswerPositive: true,
            showFeedbackDlg: false,
            questionText: "",
            showQuesDlg: false
        };
    }
    HomePage.prototype.login = function () {
        var that = this;
        wx.login({
            success: function (_res) {
                console.log(_res);
                wx.showLoading({ title: '加载中...' });
                var req = { jscode: _res.code };
                loginAPI.MiniProgramLogin(req).then(function (resp) {
                    console.log(resp);
                    wx.hideLoading({});
                    var userStatus = resp.user_status;
                    webAPI.SetAuthToken(wx.getStorageSync(globalEnum.globalKey_token));
                    switch (userStatus) {
                        case 1:
                            wx.reLaunch({ url: '/pages/login/index' });
                            break;
                        case 2:
                            if (resp.token) {
                                wx.setStorageSync(globalEnum.globalKey_token, resp.token);
                                webAPI.SetAuthToken(wx.getStorageSync(globalEnum.globalKey_token));
                                wx.reLaunch({ url: '/pages/onBoard/onBoard' });
                            }
                            break;
                        case 3:
                            if (resp.token) {
                                wx.setStorageSync(globalEnum.globalKey_token, resp.token);
                                webAPI.SetAuthToken(wx.getStorageSync(globalEnum.globalKey_token));
                                that.authenticationRequest();
                                that.initHomePageInfo();
                                that.initHomePageCard();
                            }
                            break;
                    }
                }).catch(function (err) {
                    wx.hideLoading({});
                    console.log(err);
                    wx.showModal({
                        title: '',
                        content: '首页登陆失败',
                        showCancel: false
                    });
                });
            },
            fail: function (err) {
                wx.showModal({
                    title: '',
                    content: '首页登陆验证失败',
                    showCancel: false
                });
            }
        });
    };
    HomePage.prototype.authenticationRequest = function () {
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            console.log('get getUserInfo' + res.userInfo);
                        },
                        fail: function (err) {
                            console.log(err);
                        }
                    });
                }
                else {
                    wx.navigateTo({
                        url: '../invitation/invitation?user_status=3'
                    });
                }
            }
        });
    };
    HomePage.prototype.loadReportBadge = function () {
        var _this = this;
        var token = wx.getStorageSync(globalEnum.globalKey_token);
        if (token) {
            var currentDate = moment().startOf('day');
            console.log("home:" + currentDate.unix());
            var firstDayOfWeek = currentDate.week(currentDate.week()).day(1).unix();
            var lastDayOfWeek = currentDate.week(currentDate.week()).day(7).unix();
            var req = {
                date_from: firstDayOfWeek,
                date_to: lastDayOfWeek
            };
            console.log(req);
            webAPI.RetrieveUserReports(req).then(function (resp) {
                wx.hideLoading({});
                _this.countReportBadge(resp);
            }).catch(function (err) { return console.log(err); });
        }
    };
    HomePage.prototype.countReportBadge = function (resp) {
        console.log(resp);
        var reportNum = 0;
        var reports = resp.daily_report;
        for (var index in reports) {
            var report = reports[index];
            if (!report.is_report_generated && !report.is_food_log_empty) {
                var todayTime = moment().startOf('day').unix();
                console.log(todayTime);
                if (report.date < todayTime || (report.date == todayTime && moment(new Date()).hours > 22)) {
                    reportNum++;
                }
            }
        }
        if (reportNum != 0) {
            wx.setTabBarBadge({
                index: 2,
                text: String(reportNum)
            });
        }
        else {
            wx.removeTabBarBadge({
                index: 2
            });
        }
    };
    HomePage.prototype.onShow = function () {
        this.login();
    };
    HomePage.prototype.initHomePageInfo = function () {
        var _this = this;
        var currentFormattedDate = Date.parse(String(new Date())) / 1000;
        var req = { date: currentFormattedDate };
        webAPI.RetrieveHomePageInfo(req).then(function (resp) {
            _this.parseHomePageChartData(resp);
        }).catch(function (err) { return console.log(err); });
    };
    HomePage.prototype.initHomePageCard = function () {
        var _this = this;
        var req = {};
        webAPI.RetrieveCardList(req).then(function (resp) {
            _this.parseHomePageCardData(resp);
        }).catch(function (err) { return console.log(err); });
    };
    HomePage.prototype.parseHomePageChartData = function (resp) {
        var _a;
        console.log(resp);
        var dailyAvgIntake = Math.floor(resp.daily_avg_intake / 100);
        var dailyTargetIntake = Math.floor(resp.daily_target_intake / 100);
        var latestWeight = resp.latest_weight;
        var weightOperation = "cardList[0].card_weight_value";
        this.setData((_a = {
                average_energy: dailyAvgIntake,
                target_energy: dailyTargetIntake
            },
            _a[weightOperation] = latestWeight,
            _a));
        var dailyIntakes = resp.daily_intakes;
        for (var index in dailyIntakes) {
            dailyIntakes[index].value = Math.floor(dailyIntakes[index].value / 100);
            dailyIntakes[index].avg = dailyAvgIntake;
        }
        var targetIntake = resp.daily_target_intake;
        chart.changeData(dailyIntakes);
        chart.guide().line({
            start: ['周天', targetIntake],
            end: ['周六', targetIntake],
            style: {
                stroke: '#d0d0d0',
                lineDash: [0, 2, 2],
                lineWidth: 1
            }
        });
    };
    HomePage.prototype.parseHomePageCardData = function (resp) {
        console.log(resp);
        var cardInfo = [];
        for (var index in resp.card_list) {
            var card = resp.card_list[index];
            var entity = {
                cardId: card.card_id,
                title: card.title,
                description: card.description,
                cardType: card.card_type,
                iconLink: card.icon_link,
                contentLink: card.content_link,
                isChecked: card.is_checked
            };
            cardInfo.push(entity);
        }
        this.setData({
            activityCardList: cardInfo
        });
    };
    HomePage.prototype.redirectToPage = function (event) {
        var redirectPath = event.currentTarget.dataset.redirectPath;
        if (redirectPath === "/pages/rdiPage/rdiPage") {
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
        }
        else {
            wx.navigateTo({ url: redirectPath });
        }
    };
    HomePage.prototype.redirectFromFeed = function (event) {
        var _this = this;
        var myThis = this;
        var cardId = event.currentTarget.dataset.cardId;
        console.log(cardId);
        var cardLink = event.currentTarget.dataset.cardLink;
        var cardIndex = event.currentTarget.dataset.cardIndex;
        var cardDesc = event.currentTarget.dataset.cardDesc;
        var cardList = this.data.activityCardList;
        switch (cardId) {
            default:
                var req = { event_type: "click_card", event_value: cardId.toString() };
                webAPI.CreateUserEvent(req).then(function (resp) {
                    cardList[cardIndex].isChecked = true;
                    myThis.setData({
                        activityCardList: cardList
                    });
                    wx.switchTab({
                        url: "/pages/foodDiary/index"
                    });
                }).catch(function (err) { return console.log(err); });
                break;
            case 1:
                var req = { event_type: "click_card", event_value: cardId.toString() };
                webAPI.CreateUserEvent(req).then(function (resp) {
                    cardList[cardIndex].isChecked = true;
                    myThis.setData({
                        activityCardList: cardList
                    });
                    wx.navigateTo({
                        url: "/pages/nutritionalDatabasePage/articlePage?url=" + cardLink
                    });
                }).catch(function (err) { return console.log(err); });
                break;
            case 2:
                wx.showModal({
                    title: '',
                    content: '今日运动',
                    confirmText: "已完成",
                    cancelText: "未完成",
                    success: function (res) {
                        if (res.confirm) {
                            var req_1 = { event_type: "click_card", event_value: cardId.toString() };
                            webAPI.CreateUserEvent(req_1).then(function (resp) {
                                cardList[cardIndex].isChecked = true;
                                myThis.setData({
                                    activityCardList: cardList
                                });
                            }).catch(function (err) { return console.log(err); });
                        }
                    }
                });
                break;
            case 6:
                var req = { event_type: "click_card", event_value: cardId.toString() };
                webAPI.CreateUserEvent(req).then(function (resp) {
                    cardList[cardIndex].isChecked = true;
                    _this.setData({
                        activityCardList: cardList
                    });
                    wx.navigateTo({
                        url: "/pages/weightRecord/index"
                    });
                }).catch(function (err) { return console.log(err); });
                break;
        }
    };
    return HomePage;
}());
Page(new HomePage());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUNBLElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFBO0FBRTVCLGlEQUFtRDtBQUNuRCxpREFBbUQ7QUFDbkQsdURBQXlEO0FBQ3pELCtCQUFpQztBQVNqQyxJQUFJLEtBQUssR0FBRyxJQUFJLENBQUM7QUFDakIsU0FBUyxTQUFTLENBQUMsTUFBTSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsRUFBRTtJQUMxQyxJQUFNLElBQUksR0FBRztRQUNYLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7UUFDdEMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtRQUN0QyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO1FBQ3RDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7UUFDdEMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFLEtBQUssRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFLElBQUksRUFBRTtRQUN0QyxFQUFFLElBQUksRUFBRSxJQUFJLEVBQUUsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsSUFBSSxFQUFFO1FBQ3RDLEVBQUUsSUFBSSxFQUFFLElBQUksRUFBRSxLQUFLLEVBQUUsSUFBSSxFQUFFLEdBQUcsRUFBRSxJQUFJLEVBQUU7S0FDdkMsQ0FBQztJQUNGLEtBQUssR0FBRyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDbkIsRUFBRSxFQUFFLE1BQU07UUFDVixLQUFLLE9BQUE7UUFDTCxNQUFNLFFBQUE7S0FDUCxDQUFDLENB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QVMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxJQUFJLENBQUM7Z0NBQ3BDLE1BQWMsQ0FBQyxPQUFPLENBQUM7b0NBQ3RCLGdCQUFnQixFQUFFLFFBQVE7aUNBQzNCLENBQUMsQ0FBQzs0QkFDTCxDQUFDLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBQSxHQUFHLElBQUksT0FBQSxPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxFQUFoQixDQUFnQixDQUFDLENBQUE7eUJBQ2xDO29CQUNILENBQUM7aUJBQ0YsQ0FBQyxDQUFDO2dCQUNILE1BQU07WUFDUixLQUFLLENBQUM7Z0JBRUosSUFBSSxHQUFHLEdBQUcsRUFBRSxVQUFVLEVBQUUsWUFBWSxFQUFFLFdBQVcsRUFBRSxNQUFNLENBQUMsUUFBUSxFQUFFLEVBQUUsQ0FBQztnQkFDdkUsTUFBTSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJO29CQUNuQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsU0FBUyxHQUFHLElBQUksQ0FBQztvQkFDcEMsS0FBWSxDQUFDLE9BQU8sQ0FBQzt3QkFDcEIsZ0JBQWdCLEVBQUUsUUFBUTtxQkFDM0IsQ0FBQyxDQUFDO29CQUNILEVBQUUsQ0FBQyxVQUFVLENBQUM7d0JBQ1osR0FBRyxFQUFFLDJCQUEyQjtxQkFDakMsQ0FBQyxDQUFDO2dCQUNMLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUcsSUFBSSxPQUFBLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLEVBQWhCLENBQWdCLENBQUMsQ0FBQTtnQkFDakMsTUFBTTtTQUNUO0lBQ0gsQ0FBQztJQTBDSCxlQUFDO0FBQUQsQ0FBQyxBQXhXRCxJQXdXQztBQUVELElBQUksQ0FBQyxJQUFJLFFBQVEsRUFBRSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnXG5jb25zdCBhcHAgPSBnZXRBcHA8SU15QXBwPigpXG4vLyBpbXBvcnQgKiBhcyB3eENoYXJ0cyBmcm9tICcvdXRpbHMvd3hjaGFydHMnO1xuaW1wb3J0ICogYXMgZ2xvYmFsRW51bSBmcm9tICcuLi8uLi9hcGkvR2xvYmFsRW51bSc7XG5pbXBvcnQgKiBhcyB3ZWJBUEkgZnJvbSAnLi4vLi4vYXBpL2FwcC9BcHBTZXJ2aWNlJztcbmltcG9ydCAqIGFzIGxvZ2luQVBJIGZyb20gJy4uLy4uL2FwaS9sb2dpbi9Mb2dpblNlcnZpY2UnO1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgeyBSZXRyaWV2ZUhvbWVQYWdlSW5mb1JlcSwgUmV0cmlldmVDYXJkTGlzdFJlc3AsIENhcmRJbmZvIH0gZnJvbSBcIi9hcGkvYXBwL0FwcFNlcnZpY2VPYmpzXCI7XG4vLyB2YXIgd2ViQVBJID0gcmVxdWlyZSgnLi9hcGkvbG9naW4vTG9naW5TZXJ2aWNlJyk7XG5cbi8vY2FyZFR5cGUgIDE6bWVhbCAyOmFydGljbGUgMzpyZXBvcnQtZGFpbHkgNDpyZXBvcnQtd2Vla2x5ICA1OmZlZWRiYWNrICA2OnJlbWluZGVyIDc6ZXZlbnRcbiBcblxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKmluaXQgZjIgY2hhcnQgcGFydCoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbmxldCBjaGFydCA9IG51bGw7XG5mdW5jdGlvbiBpbml0Q2hhcnQoY2FudmFzLCB3aWR0aCwgaGVpZ2h0LCBGMikge1xuICBjb25zdCBkYXRhID0gW1xuICAgIHsgd2VlazogJ+WRqOaXpScsIHZhbHVlOiAxMjAwLCBhdmc6IDIwMDAgfSxcbiAgICB7IHdlZWs6ICflkajkuIAnLCB2YWx1ZTogMTE1MCwgYXZnOiAyMDAwIH0sXG4gICAgeyB3ZWVrOiAn5ZGo5LqMJywgdmFsdWU6IDEzMDAsIGF2ZzogMjAwMCB9LFxuICAgIHsgd2VlazogJ+WRqOS4iScsIHZhbHVlOiAxMjAwLCBhdmc6IDIwMDAgfSxcbiAgICB7IHdlZWs6ICflkajlm5snLCB2YWx1ZTogMTIwMCwgYXZnOiAyMDAwIH0sXG4gICAgeyB3ZWVrOiAn5ZGo5LqUJywgdmFsdWU6IDEyMDAsIGF2ZzogMjAwMCB9LFxuICAgIHsgd2VlazogJ+WRqOWFrScsIHZhbHVlOiAxMjAwLCBhdmc6IDIwMDAgfVxuICBdO1xuICBjaGFydCA9IG5ldyBGMi5DaGFydCh7XG4gICAgZWw6IGNhbnZhcyxcbiAgICB3aWR0aCxcbiAgICBoZWlnaHRcbiAgfSk7XG5cbiAgLy8gY2hhcnQuc291cmNlKGRhdGEsIHtcbiAgLy8gICB2YWx1ZToge1xuICAvLyAgICAgbWluOiAwLFxuICAvLyAgICAgbWF4OiAzMDAwLFxuICAvLyAgICAgdGlja0ludGVydmFsOiAxMCxcbiAgLy8gICAgIG5pY2U6IGZhbHNlXG4gIC8vICAgfSxcbiAgLy8gICBhdmc6IHtcbiAgLy8gICAgIG1pbjogMCxcbiAgLy8gICAgIG1heDogMzAwMCxcbiAgLy8gICAgIHRpY2tJbnRlcnZhbDogMTAsXG4gIC8vICAgICBuaWNlOiBmYWxzZVxuICAvLyAgIH1cbiAgLy8gfSk7XG5cbiAgY2hhcnQuYXhpcygnd2VlaycsIHtcbiAgICBncmlkOiBudWxsXG4gIH0pO1xuICBjaGFydC50b29sdGlwKHtcbiAgICBzaG93Q3Jvc3NoYWlyczogdHJ1ZSxcbiAgICBvblNob3coZXYpIHtcbiAgICAgIGNvbnN0IHsgaXRlbXMgfSA9IGV2O1xuICAgICAgaXRlbXNbMF0ubmFtZSA9IFwi54Ot6YePXCI7XG4gICAgfVxuICB9KTtcblxuICBjaGFydC5pbnRlcnZhbCgpLnBvc2l0aW9uKCd3ZWVrKnZhbHVlJykuY29sb3IoXCIjZWQyYzQ4XCIpO1xuICAvLyBjaGFydC5saW5lKCkucG9zaXRpb24oJ3dlZWsqYXZnJykuY29sb3IoJyNmNGY0ZjQnKS5zaGFwZSgnZGFzaGVkJyk7XG4gIC8vIGNoYXJ0LnBvaW50KCkucG9zaXRpb24oJ3dlZWsqdmFsdWUnKS5zdHlsZSh7XG4gIC8vICAgc3Ryb2tlOiAnIzVlZDQ3MCcsXG4gIC8vICAgZmlsbDogJyNmZmYnLFxuICAvLyAgIGxpbmVXaWR0aDogMlxuICAvLyB9KTtcbiAgbGV0IHRhcmdldExpbmUgPSAwO1xuICAvLyDnu5jliLbovoXliqnnur9cbiAgY2hhcnQuZ3VpZGUoKS5saW5lKHtcbiAgICBzdGFydDogWyflkajml6UnLCB0YXJnZXRMaW5lXSxcbiAgICBlbmQ6IFsn5ZGo5YWtJywgdGFyZ2V0TGluZV0sXG4gICAgc3R5bGU6IHtcbiAgICAgIHN0cm9rZTogJyNkMGQwZDAnLCAvLyDnur/nmoTpopzoibJcbiAgICAgIGxpbmVEYXNoOiBbMCwgMiwgMl0sIC8vIOiZmue6v+eahOiuvue9rlxuICAgICAgbGluZVdpZHRoOiAxIC8vIOe6v+eahOWuveW6plxuICAgIH0gLy8g5Zu+5b2i5qC35byP6YWN572uXG4gIH0pO1xuICBjaGFydC5ndWlkZSgpLnRleHQoe1xuICAgIHBvc2l0aW9uOiBbJ+WRqOaXpScsICdtYXgnXSxcbiAgICAvLyBwb3NpdGlvbih4U2NhbGUsIHlTY2FsZXMpIHtcbiAgICAvLyAgIGxldCBzdW0gPSAwO1xuICAgIC8vICAgY29uc3QgeVNjYWxlID0geVNjYWxlc1sxXTtcbiAgICAvLyAgIHlTY2FsZS52YWx1ZXMuZm9yRWFjaCh2ID0+IChzdW0gKz0gdikpO1xuICAgIC8vICAgcmV0dXJuIFsnbWF4Jywgc3VtIC8geVNjYWxlLnZhbHVlcy5sZW5ndGhdOyBcbiAgICAvLyB9LFxuICAgIGNvbnRlbnQ6ICcnLFxuICAgIHN0eWxlOiB7XG4gICAgICB0ZXh0QWxpZ246ICdzdGFydCcsXG4gICAgICB0ZXh0QmFzZWxpbmU6ICd0b3AnLFxuICAgICAgZmlsbDogJyM1ZWQ0NzAnXG4gICAgfSxcbiAgICBvZmZzZXRYOiAtMjUsXG4gICAgb2Zmc2V0WTogMTVcbiAgfSk7XG4gIGNoYXJ0LnJlbmRlcigpO1xuICByZXR1cm4gY2hhcnQ7XG5cbn1cblxuLy8qKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKmVuZCBvZiBmMiBjaGFydCBpbml0KioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuY2xhc3MgSG9tZVBhZ2Uge1xuICBwdWJsaWMgYmFydENoYXJ0OiBhbnk7XG4gIHB1YmxpYyBkYXRhID0ge1xuICAgIGF2ZXJhZ2VfZW5lcmd5OiAxMTA0LFxuICAgIHRhcmdldF9lbmVyZ3k6IDEyMDUsXG4gICAgY2FyZExpc3Q6IFtcbiAgICAgIHsgY2FyZF90aXRsZTogXCLkvZPph41cIiwgY2FyZF93ZWlnaHRfdmFsdWU6IDAuMCwgY2FyZF9kZXNjOiBcIuWFrOaWpFwiLCBjYXJkX2Jhcl9jb2xvcjogXCIjZmY4MjJkXCIsIGNhcmRfcmVkaXJlY3RfcGF0aDogXCIvcGFnZXMvd2VpZ2h0UmVjb3JkL2luZGV4XCIgfSxcbiAgICAgIHsgY2FyZF90aXRsZTogXCLokKXlhbvmjqjojZDlgLxcIiwgY2FyZF9kZXNjOiBcIuiQpeWFu+W5s+ihoVwiLCBjYXJkX2Jhcl9jb2xvcjogXCIjZmZiNDAwXCIsIGNhcmRfcmVkaXJlY3RfcGF0aDogXCIvcGFnZXMvcmRpUGFnZS9yZGlQYWdlXCIgfSxcbiAgICAgIHsgY2FyZF90aXRsZTogXCLokKXlhbvnn6Xor4ZcIiwgY2FyZF9kZXNjOiBcIuefpemjn+iQpeWFu+W4iOe7hFwiLCBjYXJkX2Jhcl9jb2xvcjogXCIjZmY1YzQ3XCIsIGNhcmRfcmVkaXJlY3RfcGF0aDogXCIvcGFnZXMvbnV0cml0aW9uYWxEYXRhYmFzZVBhZ2UvaW5kZXhcIiB9XG4gICAgXSxcbiAgICBhY3Rpdml0eUNhcmRMaXN0OiBbXG4gICAgICAvLyB7IGlkOiAwLCBuYW1lOiBcIjEw56eN55eH54q25bim5L2g5LqG6Kej5LuA5LmI5piv56KY57y65LmP77yBXCIsIGRlc2NyaXB0aW9uOiBcIjUxMuWNg+WNoVwiLCBpbWFnZTogXCJodHRwczovL2RpZXRsZW5zLTEyNTg2NjU1NDcuY29zLmFwLXNoYW5naGFpLm15cWNsb3VkLmNvbS9taW5pLWFwcC1pbWFnZS9hcnRpY2xlL2lvZGluZS5wbmdcIiwgbGluazogXCJodHRwczovL21wLndlaXhpbi5xcS5jb20vcy9tSWl5ZjlONXVYLTZFWlN0V1BybzVnXCIsIHRpbWU6IFwiMTQ6MTFcIiwgY2FyZFR5cGU6IDIsIGNoZWNrZWQ6IGZhbHNlIH0sXG4gICAgICAvLyB7IGlkOiAxLCBuYW1lOiBcIui/kOWKqOaJk+WNoVwiLCBkZXNjcmlwdGlvbjogXCLku4rml6VcIiwgaW1hZ2U6IFwiaHR0cHM6Ly9kaWV0bGVucy0xMjU4NjY1NTQ3LmNvcy5hcC1zaGFuZ2hhaS5teXFjbG91ZC5jb20vbWluaS1hcHAtaW1hZ2UvZmVlZC9kYWlseV9yZXBvcnQucG5nXCIsIGxpbms6IFwiXCIsIHRpbWU6IFwiMDk6MTFcIiwgY2FyZFR5cGU6IDMsIGNoZWNrZWQ6IGZhbHNlIH0sXG4gICAgICAvLyB7IGlkOiAyLCBuYW1lOiBcIuaXqemkkOaJk+WNoVwiLCBkZXNjcmlwdGlvbjogXCLku4rml6VcIiwgaW1hZ2U6IFwiaHR0cHM6Ly9kaWV0bGVucy0xMjU4NjY1NTQ3LmNvcy5hcC1zaGFuZ2hhaS5teXFjbG91ZC5jb20vbWluaS1hcHAtaW1hZ2UvZmVlZC9tZWFsX2JyZWFrZmFzdC5wbmdcIiwgbGluazogXCJcIiwgdGltZTogXCIwOToxMVwiLCBjYXJkVHlwZTogMSwgY2hlY2tlZDogZmFsc2UgfSxcbiAgICAgIC8vIHsgaWQ6IDMsIG5hbWU6IFwi5Y2I6aSQ5omT5Y2hXCIsIGRlc2NyaXB0aW9uOiBcIuS7iuaXpVwiLCBpbWFnZTogXCJodHRwczovL2RpZXRsZW5zLTEyNTg2NjU1NDcuY29zLmFwLXNoYW5naGFpLm15cWNsb3VkLmNvbS9taW5pLWFwcC1pbWFnZS9mZWVkL21lYWxfbHVuY2gucG5nXCIsIGxpbms6IFwiXCIsIHRpbWU6IFwiMTQ6MTFcIiwgY2FyZFR5cGU6IDEsIGNoZWNrZWQ6IGZhbHNlIH0sXG4gICAgICAvLyB7IGlkOiA0LCBuYW1lOiBcIuaZmumkkOaJk+WNoVwiLCBkZXNjcmlwdGlvbjogXCLku4rml6VcIiwgaW1hZ2U6IFwiaHR0cHM6Ly9kaWV0bGVucy0xMjU4NjY1NTQ3LmNvcy5hcC1zaGFuZ2hhaS5teXFjbG91ZC5jb20vbWluaS1hcHAtaW1hZ2UvZmVlZC9tZWFsX2Rpbm5lci5wbmdcIiwgbGluazogXCJcIiwgdGltZTogXCIwOToxMVwiLCBjYXJkVHlwZTogMSwgY2hlY2tlZDogZmFsc2UgfSxcbiAgICAgIC8vIHsgaWQ6IDUsIG5hbWU6IFwi5L2T6YeN5omT5Y2hXCIsIGRlc2NyaXB0aW9uOiBcIuS7iuaXpVwiLCBpbWFnZTogXCJodHRwczovL2RpZXRsZW5zLTEyNTg2NjU1NDcuY29zLmFwLXNoYW5naGFpLm15cWNsb3VkLmNvbS9taW5pLWFwcC1pbWFnZS9mZWVkL3dlaWdodC5wbmdcIiwgbGluazogXCJcIiwgdGltZTogXCIxOToxMVwiLCBjYXJkVHlwZTogNiwgY2hlY2tlZDogZmFsc2UgfVxuICAgIF0sXG4gICAgb3B0czoge1xuICAgICAgb25Jbml0OiBpbml0Q2hhcnRcbiAgICB9LFxuICAgIHF1ZXNUaXRsZTogXCJcIixcbiAgICBjdXJyZW50U3VydmV5SWQ6IDAsXG4gICAgaXNBbnN3ZXJQb3NpdGl2ZTogdHJ1ZSxcbiAgICBzaG93RmVlZGJhY2tEbGc6IGZhbHNlLFxuICAgIHF1ZXN0aW9uVGV4dDogXCJcIixcbiAgICBzaG93UXVlc0RsZzogZmFsc2VcbiAgfVxuXG4gIHB1YmxpYyBsb2dpbigpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgLy8g55m75b2VXG4gICAgd3gubG9naW4oe1xuICAgICAgc3VjY2VzcyhfcmVzKSB7XG4gICAgICAgIGNvbnNvbGUubG9nKF9yZXMpO1xuICAgICAgICAvLyDlj5HpgIEgX3Jlcy5jb2RlIOWIsOWQjuWPsOaNouWPliBvcGVuSWQsIHNlc3Npb25LZXksIHVuaW9uSWRcbiAgICAgICAgd3guc2hvd0xvYWRpbmcoeyB0aXRsZTogJ+WKoOi9veS4rS4uLicgfSk7XG4gICAgICAgIHZhciByZXEgPSB7IGpzY29kZTogX3Jlcy5jb2RlIH07XG4gICAgICAgIGxvZ2luQVBJLk1pbmlQcm9ncmFtTG9naW4ocmVxKS50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgICAgICAgIHd4LmhpZGVMb2FkaW5nKHt9KTtcbiAgICAgICAgICBsZXQgdXNlclN0YXR1cyA9IHJlc3AudXNlcl9zdGF0dXM7XG4gICAgICAgICAgd2ViQVBJLlNldEF1dGhUb2tlbih3eC5nZXRTdG9yYWdlU3luYyhnbG9iYWxFbnVtLmdsb2JhbEtleV90b2tlbikpO1xuICAgICAgICAgIC8vIHd4LnJlTGF1bmNoKHsgdXJsOiAnL3BhZ2VzL2xvZ2luL2luZGV4JyB9KTtcbiAgICAgICAgICBzd2l0Y2ggKHVzZXJTdGF0dXMpIHtcbiAgICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgICAgLy92YWxpZGF0aW9uIHBhZ2VcbiAgICAgICAgICAgICAgd3gucmVMYXVuY2goeyB1cmw6ICcvcGFnZXMvbG9naW4vaW5kZXgnIH0pO1xuICAgICAgICAgICAgICAvLyB3eC5uYXZpZ2F0ZVRvKHsgdXJsOiBcIi9wYWdlcy9pbnZpdGF0aW9uL2ludml0YXRpb25cIiB9KTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDI6XG4gICAgICAgICAgICAgIC8vb25Cb2FyZGluZyBwcm9jZXNzIHBhZ2VcbiAgICAgICAgICAgICAgaWYgKHJlc3AudG9rZW4pIHtcbiAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYyhnbG9iYWxFbnVtLmdsb2JhbEtleV90b2tlbiwgcmVzcC50b2tlbik7XG4gICAgICAgICAgICAgICAgd2ViQVBJLlNldEF1dGhUb2tlbih3eC5nZXRTdG9yYWdlU3luYyhnbG9iYWxFbnVtLmdsb2JhbEtleV90b2tlbikpO1xuICAgICAgICAgICAgICAgIHd4LnJlTGF1bmNoKHsgdXJsOiAnL3BhZ2VzL29uQm9hcmQvb25Cb2FyZCcgfSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlIDM6XG4gICAgICAgICAgICAgIC8va2VlcCBpdCBhdCBob21lIHBhZ2VcbiAgICAgICAgICAgICAgaWYgKHJlc3AudG9rZW4pIHtcbiAgICAgICAgICAgICAgICB3eC5zZXRTdG9yYWdlU3luYyhnbG9iYWxFbnVtLmdsb2JhbEtleV90b2tlbiwgcmVzcC50b2tlbik7XG4gICAgICAgICAgICAgICAgd2ViQVBJLlNldEF1dGhUb2tlbih3eC5nZXRTdG9yYWdlU3luYyhnbG9iYWxFbnVtLmdsb2JhbEtleV90b2tlbikpO1xuICAgICAgICAgICAgICAgIHRoYXQuYXV0aGVudGljYXRpb25SZXF1ZXN0KCk7XG4gICAgICAgICAgICAgICAgdGhhdC5pbml0SG9tZVBhZ2VJbmZvKCk7XG4gICAgICAgICAgICAgICAgdGhhdC5pbml0SG9tZVBhZ2VDYXJkKClcbiAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG5cbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgICB3eC5oaWRlTG9hZGluZyh7fSk7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgY29udGVudDogJ+mmlumhteeZu+mZhuWksei0pScsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgIH0sXG4gICAgICBmYWlsKGVycikge1xuICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgICBjb250ZW50OiAn6aaW6aG155m76ZmG6aqM6K+B5aSx6LSlJyxcbiAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICB9KTtcblxuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgYXV0aGVudGljYXRpb25SZXF1ZXN0KCkge1xuICAgIHd4LmdldFNldHRpbmcoe1xuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzLmF1dGhTZXR0aW5nWydzY29wZS51c2VySW5mbyddKSB7XG4gICAgICAgICAgd3guZ2V0VXNlckluZm8oe1xuICAgICAgICAgICAgc3VjY2VzczogcmVzID0+IHtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2coJ2dldCBnZXRVc2VySW5mbycgKyByZXMudXNlckluZm8pO1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGZhaWw6IGVyciA9PiB7XG4gICAgICAgICAgICAgIGNvbnNvbGUubG9nKGVycilcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgICAgdXJsOiAnLi4vaW52aXRhdGlvbi9pbnZpdGF0aW9uP3VzZXJfc3RhdHVzPTMnXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgfVxuXG4gIHB1YmxpYyBsb2FkUmVwb3J0QmFkZ2UoKSB7XG4gICAgbGV0IHRva2VuID0gd3guZ2V0U3RvcmFnZVN5bmMoZ2xvYmFsRW51bS5nbG9iYWxLZXlfdG9rZW4pO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgbGV0IGN1cnJlbnREYXRlID0gbW9tZW50KCkuc3RhcnRPZignZGF5Jyk7XG4gICAgICBjb25zb2xlLmxvZyhcImhvbWU6XCIgKyBjdXJyZW50RGF0ZS51bml4KCkpO1xuICAgICAgbGV0IGZpcnN0RGF5T2ZXZWVrID0gY3VycmVudERhdGUud2VlayhjdXJyZW50RGF0ZS53ZWVrKCkpLmRheSgxKS51bml4KCk7XG4gICAgICBsZXQgbGFzdERheU9mV2VlayA9IGN1cnJlbnREYXRlLndlZWsoY3VycmVudERhdGUud2VlaygpKS5kYXkoNykudW5peCgpO1xuICAgICAgbGV0IHJlcSA9IHtcbiAgICAgICAgZGF0ZV9mcm9tOiBmaXJzdERheU9mV2VlayxcbiAgICAgICAgZGF0ZV90bzogbGFzdERheU9mV2Vla1xuICAgICAgfTtcbiAgICAgIGNvbnNvbGUubG9nKHJlcSk7XG4gICAgICB3ZWJBUEkuUmV0cmlldmVVc2VyUmVwb3J0cyhyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgIHd4LmhpZGVMb2FkaW5nKHt9KTtcbiAgICAgICAgdGhpcy5jb3VudFJlcG9ydEJhZGdlKHJlc3ApO1xuICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBjb3VudFJlcG9ydEJhZGdlKHJlc3A6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgIGxldCByZXBvcnROdW0gPSAwO1xuICAgIGxldCByZXBvcnRzID0gcmVzcC5kYWlseV9yZXBvcnQ7XG4gICAgZm9yIChsZXQgaW5kZXggaW4gcmVwb3J0cykge1xuICAgICAgbGV0IHJlcG9ydCA9IHJlcG9ydHNbaW5kZXhdO1xuICAgICAgaWYgKCFyZXBvcnQuaXNfcmVwb3J0X2dlbmVyYXRlZCAmJiAhcmVwb3J0LmlzX2Zvb2RfbG9nX2VtcHR5KSB7XG4gICAgICAgIGxldCB0b2RheVRpbWUgPSBtb21lbnQoKS5zdGFydE9mKCdkYXknKS51bml4KCk7XG4gICAgICAgIGNvbnNvbGUubG9nKHRvZGF5VGltZSk7XG4gICAgICAgIGlmIChyZXBvcnQuZGF0ZSA8IHRvZGF5VGltZSB8fCAocmVwb3J0LmRhdGUgPT0gdG9kYXlUaW1lICYmIG1vbWVudChuZXcgRGF0ZSgpKS5ob3VycyA+IDIyKSkgeyAgIC8vY291bnQgdG9kYXkgcmVwb3J0cyBzdGF0dXMgYWZ0ZXIgMTlcbiAgICAgICAgICByZXBvcnROdW0rKztcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICBpZiAocmVwb3J0TnVtICE9IDApIHtcbiAgICAgIHd4LnNldFRhYkJhckJhZGdlKHtcbiAgICAgICAgaW5kZXg6IDIsXG4gICAgICAgIHRleHQ6IFN0cmluZyhyZXBvcnROdW0pXG4gICAgICB9KTtcbiAgICB9IGVsc2Uge1xuICAgICAgd3gucmVtb3ZlVGFiQmFyQmFkZ2Uoe1xuICAgICAgICBpbmRleDogMlxuICAgICAgfSk7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uU2hvdygpIHtcbiAgICB0aGlzLmxvZ2luKCk7XG4gIH1cblxuICBwdWJsaWMgaW5pdEhvbWVQYWdlSW5mbygpIHtcbiAgICBsZXQgY3VycmVudEZvcm1hdHRlZERhdGUgPSBEYXRlLnBhcnNlKFN0cmluZyhuZXcgRGF0ZSgpKSkgLyAxMDAwO1xuICAgIGxldCByZXEgPSB7IGRhdGU6IGN1cnJlbnRGb3JtYXR0ZWREYXRlIH07XG4gICAgd2ViQVBJLlJldHJpZXZlSG9tZVBhZ2VJbmZvKHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgIC8vdXBkYXRlIGNoYXJ0IHBhcnRcbiAgICAgIHRoaXMucGFyc2VIb21lUGFnZUNoYXJ0RGF0YShyZXNwKTtcbiAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gIH1cblxuICBwdWJsaWMgaW5pdEhvbWVQYWdlQ2FyZCgpIHtcbiAgICBsZXQgcmVxID0ge31cbiAgICB3ZWJBUEkuUmV0cmlldmVDYXJkTGlzdChyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICB0aGlzLnBhcnNlSG9tZVBhZ2VDYXJkRGF0YShyZXNwKTtcbiAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VIb21lUGFnZUNoYXJ0RGF0YShyZXNwOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwKTtcbiAgICBsZXQgZGFpbHlBdmdJbnRha2UgPSBNYXRoLmZsb29yKHJlc3AuZGFpbHlfYXZnX2ludGFrZSAvIDEwMCk7XG4gICAgbGV0IGRhaWx5VGFyZ2V0SW50YWtlID0gTWF0aC5mbG9vcihyZXNwLmRhaWx5X3RhcmdldF9pbnRha2UgLyAxMDApO1xuICAgIGxldCBsYXRlc3RXZWlnaHQgPSByZXNwLmxhdGVzdF93ZWlnaHQ7XG4gICAgLy91cGRhdGUgZGlzcGxheSBkYXRhXG4gICAgbGV0IHdlaWdodE9wZXJhdGlvbiA9IFwiY2FyZExpc3RbMF0uY2FyZF93ZWlnaHRfdmFsdWVcIjtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgYXZlcmFnZV9lbmVyZ3k6IGRhaWx5QXZnSW50YWtlLFxuICAgICAgdGFyZ2V0X2VuZXJneTogZGFpbHlUYXJnZXRJbnRha2UsXG4gICAgICBbd2VpZ2h0T3BlcmF0aW9uXTogbGF0ZXN0V2VpZ2h0XG4gICAgfSk7XG4gICAgLy91cGRhdGUgY2hhcnQgcGFydFxuICAgIGxldCBkYWlseUludGFrZXMgPSByZXNwLmRhaWx5X2ludGFrZXM7XG4gICAgZm9yIChsZXQgaW5kZXggaW4gZGFpbHlJbnRha2VzKSB7XG4gICAgICBkYWlseUludGFrZXNbaW5kZXhdLnZhbHVlID0gTWF0aC5mbG9vcihkYWlseUludGFrZXNbaW5kZXhdLnZhbHVlIC8gMTAwKTtcbiAgICAgIGRhaWx5SW50YWtlc1tpbmRleF0uYXZnID0gZGFpbHlBdmdJbnRha2VcbiAgICB9XG4gICAgbGV0IHRhcmdldEludGFrZSA9IHJlc3AuZGFpbHlfdGFyZ2V0X2ludGFrZTtcbiAgICBjaGFydC5jaGFuZ2VEYXRhKGRhaWx5SW50YWtlcyk7XG4gICAgLy8gY2hhcnQubGluZSgpLnBvc2l0aW9uKCd3ZWVrKmF2ZycpLmNvbG9yKCcjZjRmNGY0Jykuc2hhcGUoJ2Rhc2hlZCcpO1xuICAgIGNoYXJ0Lmd1aWRlKCkubGluZSh7XG4gICAgICBzdGFydDogWyflkajlpKknLCB0YXJnZXRJbnRha2VdLFxuICAgICAgZW5kOiBbJ+WRqOWFrScsIHRhcmdldEludGFrZV0sXG4gICAgICBzdHlsZToge1xuICAgICAgICBzdHJva2U6ICcjZDBkMGQwJywgLy8g57q/55qE6aKc6ImyXG4gICAgICAgIGxpbmVEYXNoOiBbMCwgMiwgMl0sIC8vIOiZmue6v+eahOiuvue9rlxuICAgICAgICBsaW5lV2lkdGg6IDEgLy8g57q/55qE5a695bqmXG4gICAgICB9IC8vIOWbvuW9ouagt+W8j+mFjee9rlxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHBhcnNlSG9tZVBhZ2VDYXJkRGF0YShyZXNwOiBSZXRyaWV2ZUNhcmRMaXN0UmVzcCkge1xuICAgIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgIGxldCBjYXJkSW5mbzogQ2FyZEluZm9bXSA9IFtdO1xuICAgIGZvciAobGV0IGluZGV4IGluIHJlc3AuY2FyZF9saXN0KSB7XG4gICAgICBsZXQgY2FyZCA9IHJlc3AuY2FyZF9saXN0W2luZGV4XTtcbiAgICAgIGxldCBlbnRpdHkgPSB7XG4gICAgICAgIGNhcmRJZDogY2FyZC5jYXJkX2lkLFxuICAgICAgICB0aXRsZTogY2FyZC50aXRsZSxcbiAgICAgICAgZGVzY3JpcHRpb246IGNhcmQuZGVzY3JpcHRpb24sXG4gICAgICAgIGNhcmRUeXBlOiBjYXJkLmNhcmRfdHlwZSxcbiAgICAgICAgaWNvbkxpbms6IGNhcmQuaWNvbl9saW5rLFxuICAgICAgICBjb250ZW50TGluazogY2FyZC5jb250ZW50X2xpbmssXG4gICAgICAgIGlzQ2hlY2tlZDogY2FyZC5pc19jaGVja2VkXG4gICAgICB9XG4gICAgICBjYXJkSW5mby5wdXNoKGVudGl0eSk7XG4gICAgfVxuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICBhY3Rpdml0eUNhcmRMaXN0OiBjYXJkSW5mb1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIHJlZGlyZWN0VG9QYWdlKGV2ZW50OiBhbnkpIHtcbiAgICBsZXQgcmVkaXJlY3RQYXRoID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnJlZGlyZWN0UGF0aDtcbiAgICBpZiAocmVkaXJlY3RQYXRoID09PSBcIi9wYWdlcy9yZGlQYWdlL3JkaVBhZ2VcIikge1xuICAgICAgd2ViQVBJLlJldHJpZXZlVXNlclJEQSh7fSkudGhlbihyZXNwID0+IHtcbiAgICAgICAgbGV0IHJkYVVybCA9IHJlc3AucmRhX3VybDtcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7IHVybDogJy4uLy4uL3BhZ2VzL3JkaVBhZ2UvcmRpUGFnZT91cmw9JyArIHJkYVVybCB9KTtcbiAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgIGNvbnRlbnQ6ICfojrflj5bmjqjojZDlgLzlpLHotKUnLFxuICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHd4Lm5hdmlnYXRlVG8oeyB1cmw6IHJlZGlyZWN0UGF0aCB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgcmVkaXJlY3RGcm9tRmVlZChldmVudDogYW55KSB7XG4gICAgdmFyIG15VGhpcyA9IHRoaXM7XG4gICAgbGV0IGNhcmRJZCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5jYXJkSWQ7XG4gICAgY29uc29sZS5sb2coY2FyZElkKTtcbiAgICBsZXQgY2FyZExpbmsgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuY2FyZExpbms7XG4gICAgbGV0IGNhcmRJbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5jYXJkSW5kZXg7XG4gICAgbGV0IGNhcmREZXNjID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmNhcmREZXNjXG4gICAgbGV0IGNhcmRMaXN0OiBDYXJkSW5mbyA9IHRoaXMuZGF0YS5hY3Rpdml0eUNhcmRMaXN0O1xuXG4gICAgc3dpdGNoIChjYXJkSWQpIHtcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGxldCByZXEgPSB7IGV2ZW50X3R5cGU6IFwiY2xpY2tfY2FyZFwiLCBldmVudF92YWx1ZTogY2FyZElkLnRvU3RyaW5nKCkgfTtcbiAgICAgICAgd2ViQVBJLkNyZWF0ZVVzZXJFdmVudChyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgICAgY2FyZExpc3RbY2FyZEluZGV4XS5pc0NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgIChteVRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgICAgIGFjdGl2aXR5Q2FyZExpc3Q6IGNhcmRMaXN0XG4gICAgICAgICAgfSk7XG4gICAgICAgICAgd3guc3dpdGNoVGFiKHtcbiAgICAgICAgICAgIHVybDogXCIvcGFnZXMvZm9vZERpYXJ5L2luZGV4XCJcbiAgICAgICAgICB9KTtcbiAgICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpXG4gICAgICAgIGJyZWFrOy8vbWVhbFxuICAgICAgY2FzZSAxOlxuICAgICAgICBsZXQgcmVxID0geyBldmVudF90eXBlOiBcImNsaWNrX2NhcmRcIiwgZXZlbnRfdmFsdWU6IGNhcmRJZC50b1N0cmluZygpIH07XG4gICAgICAgIHdlYkFQSS5DcmVhdGVVc2VyRXZlbnQocmVxKS50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgIGNhcmRMaXN0W2NhcmRJbmRleF0uaXNDaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAobXlUaGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICAgICAgICBhY3Rpdml0eUNhcmRMaXN0OiBjYXJkTGlzdFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgICAgdXJsOiBcIi9wYWdlcy9udXRyaXRpb25hbERhdGFiYXNlUGFnZS9hcnRpY2xlUGFnZT91cmw9XCIgKyBjYXJkTGlua1xuICAgICAgICAgIH0pO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcblxuICAgICAgICBicmVhazsvL2FydGljbGVcbiAgICAgIGNhc2UgMjpcbiAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgY29udGVudDogJ+S7iuaXpei/kOWKqCcsXG4gICAgICAgICAgY29uZmlybVRleHQ6IFwi5bey5a6M5oiQXCIsXG4gICAgICAgICAgY2FuY2VsVGV4dDogXCLmnKrlrozmiJBcIixcbiAgICAgICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzKSB7XG4gICAgICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICAgICAgbGV0IHJlcSA9IHsgZXZlbnRfdHlwZTogXCJjbGlja19jYXJkXCIsIGV2ZW50X3ZhbHVlOiBjYXJkSWQudG9TdHJpbmcoKSB9O1xuICAgICAgICAgICAgICB3ZWJBUEkuQ3JlYXRlVXNlckV2ZW50KHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgICAgICAgICAgICBjYXJkTGlzdFtjYXJkSW5kZXhdLmlzQ2hlY2tlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgKG15VGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgICAgICAgICAgICAgYWN0aXZpdHlDYXJkTGlzdDogY2FyZExpc3RcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpXG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgICAgYnJlYWs7Ly9leGVjaXNlXG4gICAgICBjYXNlIDY6XG4gICAgICAgIC8vd2VpZ2h0LXJlbWluZGVyXG4gICAgICAgIGxldCByZXEgPSB7IGV2ZW50X3R5cGU6IFwiY2xpY2tfY2FyZFwiLCBldmVudF92YWx1ZTogY2FyZElkLnRvU3RyaW5nKCkgfTtcbiAgICAgICAgd2ViQVBJLkNyZWF0ZVVzZXJFdmVudChyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgICAgY2FyZExpc3RbY2FyZEluZGV4XS5pc0NoZWNrZWQgPSB0cnVlO1xuICAgICAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICAgICAgICBhY3Rpdml0eUNhcmRMaXN0OiBjYXJkTGlzdFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgICAgdXJsOiBcIi9wYWdlcy93ZWlnaHRSZWNvcmQvaW5kZXhcIlxuICAgICAgICAgIH0pO1xuICAgICAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSlcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLy8gcHVibGljIG9uUXVlc0RsZ0J0blByZXNzKGV2ZW50OmFueSl7XG4gIC8vICAgbGV0IGZsYWcgPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuc2VsZWN0aW9uO1xuICAvLyAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gIC8vICAgICBpc0Fuc3dlclBvc2l0aXZlOiBmbGFnXG4gIC8vICAgfSlcbiAgLy8gfVxuXG5cbiAgLy8gcHVibGljIG9uUXVlc0RsZ0J0blN1Ym1pdCgpe1xuICAvLyAgIC8vc3VibWl0IGlzQW5zd2VyUG9zaXRpdmUgdG8gYmFja2VuZFxuICAvLyAgIGxldCBzdXJ2ZXlJZCA9IHRoaXMuZGF0YS5jdXJyZW50U3VydmV5SWQ7XG4gIC8vICAgaWYgKHN1cnZleUlkID09PSAwKXtcbiAgLy8gICAgIHJldHVybjtcbiAgLy8gICB9XG4gIC8vICAgbGV0IHJlcSA9IHsgc3VydmV5X2lkOiBzdXJ2ZXlJZCwgaXNfcG9zaXRpdmU6IHRoaXMuZGF0YS5pc0Fuc3dlclBvc2l0aXZlfTtcbiAgLy8gICB3ZWJBUEkuQ3JlYXRlU3VydmV5QW5zd2VyKHJlcSkudGhlbihyZXNwID0+IHtcbiAgLy8gICAgIC8vZGlzbWlzcyB0aGUgZGlhbG9nIHRoZW4gc2V0IHN1cnZleSBpZCB0byAwXG4gIC8vICAgICBjb25zb2xlLmxvZyhyZXNwKTtcbiAgLy8gICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IHNob3dRdWVzRGxnOiBmYWxzZSwgY3VycmVudFN1cnZleUlkOiAwIH0pO1xuICAvLyAgIH0pLmNhdGNoKGVyciA9PiB3eC5zaG93TW9kYWwoeyB0aXRsZTogXCJcIiwgY29udGVudDogXCLkuIrkvKDnlKjmiLflm57nrZTlpLHotKVcIiwgc2hvd0NhbmNlbDogZmFsc2UgfSkpO1xuICAvLyB9XG5cbiAgLy8gcHVibGljIGJpbmRGZWVkYmFja1F1ZXN0aW9uSW5wdXQoZXZlbnQ6YW55KXtcbiAgLy8gICBsZXQgcXVlc1RleHQgPSBTdHJpbmcoZXZlbnQuZGV0YWlsLnZhbHVlKTtcbiAgLy8gICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAvLyAgICAgcXVlc3Rpb25UZXh0OiBxdWVzVGV4dFxuICAvLyAgIH0pO1xuICAvLyB9XG5cbiAgLy8gcHVibGljIG9uRmVlZGJhY2tEbGdCdG5TdWJtaXQoKXtcbiAgLy8gICAvL3N1Ym1pdCBpc0ZlZWRiYWNrIHRvIGJhY2tlbmRcbiAgLy8gICBsZXQgcmVxID0geyBkYXRlOiBtb21lbnQoKS51bml4KCksIHF1ZXN0aW9uOiB0aGlzLmRhdGEucXVlc3Rpb25UZXh0fTtcbiAgLy8gICBpZiAoIXRoaXMuZGF0YS5xdWVzdGlvblRleHQgfHwgdGhpcy5kYXRhLnF1ZXN0aW9uVGV4dCA9PT0gXCJcIikge1xuICAvLyAgICAgcmV0dXJuXG4gIC8vICAgfVxuICAvLyAgIHdlYkFQSS5DcmVhdGVRdWVzdGlvbihyZXEpLnRoZW4ocmVzcCA9PiB7XG4gIC8vICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHsgc2hvd0ZlZWRiYWNrRGxnOiBmYWxzZSB9KTtcbiAgLy8gICB9KS5jYXRjaChlcnIgPT4geyB3eC5zaG93TW9kYWwoe3RpdGxlOiBcIlwiLGNvbnRlbnQ6XCLkuIrkvKDnlZnoqIDlpLHotKVcIiwgc2hvd0NhbmNlbDogZmFsc2V9ICl9KTtcbiAgLy8gfVxuXG59XG5cblBhZ2UobmV3IEhvbWVQYWdlKCkpIl19