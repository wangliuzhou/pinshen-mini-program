"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webAPI = require("../../api/app/AppService");
var globalEnum = require("../../api/GlobalEnum");
var moment = require("moment");
var uploadFile = require("../../api/uploader.js");
var FoodDiaryPage = (function () {
    function FoodDiaryPage() {
        this.data = {
            nutrientSummary: [
                { nutrient_name: "热量", intaken_percentage: 0, intaken_num: 0, total_num: 0, unit: "千卡" },
                { nutrient_name: "脂肪", intaken_percentage: 0, intaken_num: 0, total_num: 0, unit: "克" },
                { nutrient_name: "碳水化合物", intaken_percentage: 0, intaken_num: 0, total_num: 0, unit: "克" },
                { nutrient_name: "蛋白质", intaken_percentage: 0, intaken_num: 0, total_num: 0, unit: "克" }
            ],
            mealList: [
                { meal_id: 0, mealName: '早餐', mealEngry: 0, suggestedIntake: 0, mealPercentage: "", meals: [], mealSummary: [] },
                { meal_id: 1, mealName: '午餐', mealEngry: 0, suggestedIntake: 0, mealPercentage: "", meals: [], mealSummary: [] },
                { meal_id: 2, mealName: '晚餐', mealEngry: 0, suggestedIntake: 0, mealPercentage: "", meals: [], mealSummary: [] },
            ],
            score: 0
        };
        this.mealType = 0;
        this.mealDate = 0;
        this.path = '';
    }
    FoodDiaryPage.prototype.onLoad = function () {
        webAPI.SetAuthToken(wx.getStorageSync(globalEnum.globalKey_token));
    };
    FoodDiaryPage.prototype.onShow = function () {
        if (this.mealDate !== 0) {
            this.retrieveFoodDiaryData(this.mealDate);
        }
    };
    FoodDiaryPage.prototype.loadReportBadge = function () {
        var _this = this;
        var token = wx.getStorageSync(globalEnum.globalKey_token);
        console.log(token);
        if (token) {
            var currentDate = moment().startOf('day');
            var firstDayOfWeek = currentDate.week(currentDate.week()).day(1).unix();
            var lastDayOfWeek = currentDate.week(currentDate.week()).day(7).unix();
            var req = {
                date_from: firstDayOfWeek,
                date_to: lastDayOfWeek
            };
            webAPI.RetrieveUserReports(req).then(function (resp) {
                wx.hideLoading({});
                _this.countReportBadge(resp);
            }).catch(function (err) {
                console.log(err);
            });
        }
    };
    FoodDiaryPage.prototype.countReportBadge = function (resp) {
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
    FoodDiaryPage.prototype.retrieveFoodDiaryData = function (currentTimeStamp) {
        var _this = this;
        var req = { date: currentTimeStamp };
        webAPI.RetrieveFoodDiary(req).then(function (resp) { return _this.foodDiaryDataParsing(resp); }).catch(function (err) {
            return wx.showModal({
                title: '',
                content: '获取日志失败',
                showCancel: false
            });
        });
    };
    FoodDiaryPage.prototype.retrieveMealLog = function (mealId) {
        var _this = this;
        var req = { meal_id: mealId };
        return webAPI.RetrieveMealLog(req).then(function (resp) {
            return _this.parseMealLog(resp);
        }).catch(function (err) {
            console.log(err);
            wx.showModal({
                title: '',
                content: '获取食物数据失败',
                showCancel: false
            });
        });
    };
    FoodDiaryPage.prototype.parseMealLog = function (resp) {
        var foodList = [];
        var _loop_1 = function (index) {
            var foodLog = resp.food_log[index];
            var unitObj = foodLog.unit_option.find(function (o) { return o.unit_id === foodLog.unit_id; });
            var unitName = "份";
            if (unitObj) {
                unitName = unitObj.unit_name;
            }
            var food = {
                foodName: foodLog.food_name,
                energy: Math.floor(foodLog.energy / 100),
                unitName: unitName,
                weight: Math.round(foodLog.amount) / 100
            };
            foodList.push(food);
        };
        for (var index in resp.food_log) {
            _loop_1(index);
        }
        return foodList;
    };
    FoodDiaryPage.prototype.loadMealSummary = function (resp) {
        var _this = this;
        var breakfast;
        var breakfastSummary = [];
        var breakfastIds = [];
        resp.breakfast.forEach((function (item) {
            return breakfastIds.push(item.meal_id);
        }));
        var breakfastProms = Promise.all(breakfastIds.map(function (id) { return _this.retrieveMealLog(id); })).then(function (result) {
            result.map(function (list) { return breakfastSummary.push.apply(breakfastSummary, list); });
            return breakfast = {
                mealId: 0,
                mealName: '早餐',
                mealEngry: Math.floor(resp.breakfast_suggestion.energy_intake / 100),
                suggestedIntake: Math.floor(resp.breakfast_suggestion.suggested_intake / 100),
                mealPercentage: resp.breakfast_suggestion.percentage,
                meals: resp.breakfast,
                mealSummary: breakfastSummary
            };
        });
        var lunch;
        var lunchSummary = [];
        var lunchIds = [];
        resp.lunch.forEach((function (item) {
            return lunchIds.push(item.meal_id);
        }));
        var lunchProms = Promise.all(lunchIds.map(function (id) { return _this.retrieveMealLog(id); })).then(function (result) {
            result.map(function (list) { return lunchSummary.push.apply(lunchSummary, list); });
            return lunch = {
                mealId: 1,
                mealName: '午餐',
                mealEngry: Math.floor(resp.lunch_suggestion.energy_intake / 100),
                suggestedIntake: Math.floor(resp.lunch_suggestion.suggested_intake / 100),
                mealPercentage: resp.lunch_suggestion.percentage,
                meals: resp.lunch,
                mealSummary: lunchSummary
            };
        });
        var dinner;
        var dinnerSummary = [];
        var dinnerIds = [];
        resp.dinner.forEach((function (item) {
            return dinnerIds.push(item.meal_id);
        }));
        var dinnerProms = Promise.all(dinnerIds.map(function (id) { return _this.retrieveMealLog(id); })).then(function (result) {
            result.map(function (list) { return dinnerSummary.push.apply(dinnerSummary, list); });
            return dinner = {
                mealId: 2,
                mealName: '晚餐', mealEngry: Math.floor(resp.dinner_suggestion.energy_intake / 100),
                suggestedIntake: Math.floor(resp.dinner_suggestion.suggested_intake / 100),
                mealPercentage: resp.dinner_suggestion.percentage,
                meals: resp.dinner,
                mealSummary: dinnerSummary
            };
        });
        var addition;
        var additionSummary = [];
        var additionIds = [];
        resp.addition.forEach((function (item) {
            return dinnerIds.push(item.meal_id);
        }));
        var additionProms = Promise.all(additionIds.map(function (id) { return _this.retrieveMealLog(id); })).then(function (result) {
            result.map(function (list) { return additionSummary.push.apply(additionSummary, list); });
            return addition = {
                mealId: 3,
                mealName: '加餐',
                mealEngry: Math.floor(resp.addition_suggestion.energy_intake / 100),
                suggestedIntake: Math.floor(resp.addition_suggestion.suggested_intake / 100),
                mealPercentage: resp.addition_suggestion.percentage,
                meals: resp.addition,
                mealSummary: additionSummary
            };
        });
        var mealList = [];
        Promise.all([breakfastProms, lunchProms, dinnerProms]).then(function (result) {
            result.map(function (meal) { return mealList.push(meal); });
            _this.setData({
                mealList: mealList,
            });
            console.log(mealList);
        });
    };
    FoodDiaryPage.prototype.foodDiaryDataParsing = function (resp) {
        console.log("summary", resp);
        var score = resp.score;
        var energy = resp.daily_intake.energy;
        var protein = resp.daily_intake.protein;
        var carbohydrate = resp.daily_intake.carbohydrate;
        var fat = resp.daily_intake.fat;
        var nutrientSummary = [
            { nutrient_name: "热量", intaken_percentage: energy.percentage, intaken_num: Math.floor(energy.intake / 100), total_num: Math.floor(energy.suggested_intake / 100), unit: "千卡" },
            { nutrient_name: "脂肪", intaken_percentage: fat.percentage, intaken_num: Math.floor(fat.intake / 100), total_num: Math.floor(fat.suggested_intake / 100), unit: "克" },
            { nutrient_name: "碳水化合物", intaken_percentage: carbohydrate.percentage, intaken_num: Math.floor(carbohydrate.intake / 100), total_num: Math.floor(carbohydrate.suggested_intake / 100), unit: "克" },
            { nutrient_name: "蛋白质", intaken_percentage: protein.percentage, intaken_num: Math.floor(protein.intake / 100), total_num: Math.floor(protein.suggested_intake / 100), unit: "克" }
        ];
        this.loadMealSummary(resp);
        this.setData({
            nutrientSummary: nutrientSummary,
            score: score
        });
    };
    FoodDiaryPage.prototype.bindNaviToOtherMiniApp = function () {
        wx.navigateToMiniProgram({
            appId: 'wx4b74228baa15489a',
            path: '',
            envVersion: 'develop',
            success: function (res) {
                console.log("succcess navigate");
            },
            fail: function (err) {
                console.log(err);
            }
        });
    };
    FoodDiaryPage.prototype.bindselect = function (event) {
        console.log(event);
    };
    FoodDiaryPage.prototype.bindgetdate = function (event) {
        var time = event.detail;
        var date = moment([time.year, time.month - 1, time.date]);
        this.mealDate = date.unix();
        console.log(this.mealDate);
        this.retrieveFoodDiaryData(this.mealDate);
    };
    FoodDiaryPage.prototype.onDailyReportClick = function (event) {
        console.log(event);
        this.retrieveDailyReport(this.mealDate);
    };
    FoodDiaryPage.prototype.retrieveDailyReport = function (currentTimeStamp) {
        var req = { date: currentTimeStamp };
        webAPI.RetrieveOrCreateUserReport(req).then(function (resp) {
            var reportUrl = resp.report_url;
            if (reportUrl && reportUrl != "") {
                wx.navigateTo({ url: "/pages/reportPage/reportPage?url=" + reportUrl });
            }
            else {
                wx.showModal({
                    title: "",
                    content: "请添加当天食物记录",
                    showCancel: false
                });
            }
        }).catch(function (err) { return console.log(err); });
    };
    FoodDiaryPage.prototype.addFoodImage = function (event) {
        var mealIndex = event.currentTarget.dataset.mealIndex;
        var that = this;
        this.mealType = mealIndex + 1;
        console.log("mealIndex:" + mealIndex);
        wx.showActionSheet({
            itemList: ['拍照记录', '相册', '文字搜索'],
            success: function (res) {
                switch (res.tapIndex) {
                    case 0:
                        that.chooseImage('camera');
                        wx.reportAnalytics('record_type_select', {
                            sourcetype: 'camera',
                        });
                        break;
                    case 1:
                        that.chooseImage('album');
                        wx.reportAnalytics('record_type_select', {
                            sourcetype: 'album',
                        });
                        break;
                    case 2:
                        wx.navigateTo({
                            url: "../../pages/textSearch/index?title=" + that.data.mealList[mealIndex].mealName + "&mealType=" + that.mealType + "&naviType=0&filterType=0&mealDate=" + that.mealDate
                        });
                        wx.reportAnalytics('record_type_select', {
                            sourcetype: 'textSearch',
                        });
                        break;
                }
            }
        });
    };
    FoodDiaryPage.prototype.chooseImage = function (sourceType) {
        var that = this;
        wx.chooseImage({
            count: 1,
            sizeType: ['original', 'compressed'],
            sourceType: [sourceType],
            success: function (res) {
                wx.showLoading({ title: "上传中...", mask: true });
                var imagePath = res.tempFilePaths[0];
                that.path = imagePath;
                console.log(999, uploadFile);
                uploadFile(imagePath, that.onImageUploadSuccess, that.onImageUploadFailed, that.onUploadProgressing, 0, 0);
            },
            fail: function (err) {
                console.log(err);
            }
        });
    };
    FoodDiaryPage.prototype.onImageUploadSuccess = function (event) {
        console.log("uploadSucess" + this.mealType + "," + this.mealDate);
        wx.hideLoading();
        console.log('=====path====', this.path);
        wx.navigateTo({
            url: '/pages/imageTag/index?imageUrl=' + this.path + "&mealType=" + this.mealType + "&mealDate=" + this.mealDate,
        });
    };
    FoodDiaryPage.prototype.onImageUploadFailed = function (event) {
        console.log("uploadfailed");
        wx.hideLoading();
    };
    FoodDiaryPage.prototype.onUploadProgressing = function (event) {
        console.log("progress:");
    };
    FoodDiaryPage.prototype.naviToFoodDetail = function (event) {
        var defaultImageUrl = "https://dietlens-1258665547.cos.ap-shanghai.myqcloud.com/mini-app-image/defaultImage/textsearch-default-image.png";
        var mealIndex = event.currentTarget.dataset.mealIndex;
        var imageIndex = event.currentTarget.dataset.imageIndex;
        var mealId = this.data.mealList[mealIndex].meals[imageIndex].meal_id;
        var imageKey = this.data.mealList[mealIndex].meals[imageIndex].img_key;
        var imageUrl = imageKey == "" ? defaultImageUrl : "https://dietlens-1258665547.cos.ap-shanghai.myqcloud.com/food-image/" + this.data.mealList[mealIndex].meals[imageIndex].img_key;
        var param = {};
        param.mealId = mealId;
        param.imageUrl = imageUrl;
        param.showDeleteBtn = true;
        param.showShareBtn = imageKey != "";
        var paramJson = JSON.stringify(param);
        wx.navigateTo({
            url: "/pages/foodDetail/index?paramJson=" + paramJson
        });
    };
    return FoodDiaryPage;
}());
Page(new FoodDiaryPage());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFtRDtBQU1uRCxpREFBa0Q7QUFDbEQsK0JBQWlDO0FBQ2pDLGtEQUFvRDtBQTRCcEQ7SUFBQTtRQUVTLFNBQUksR0FBRztZQUNaLGVBQWUsRUFBRTtnQkFDZixFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO2dCQUN4RixFQUFFLGFBQWEsRUFBRSxJQUFJLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO2dCQUN2RixFQUFFLGFBQWEsRUFBRSxPQUFPLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO2dCQUMxRixFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsa0JBQWtCLEVBQUUsQ0FBQyxFQUFFLFdBQVcsRUFBRSxDQUFDLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsR0FBRyxFQUFFO2FBQ3pGO1lBQ0QsUUFBUSxFQUFFO2dCQUNSLEVBQUUsT0FBTyxFQUFFLENBQUMsRUFBRSxRQUFRLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxDQUFDLEVBQUUsZUFBZSxFQUFFLENBQUMsRUFBRSxjQUFjLEVBQUUsRUFBRSxFQUFFLEtBQUssRUFBRSxFQUFFLEVBQUUsV0FBVyxFQUFFLEVBQUUsRUFBRTtnQkFDaEgsRUFBRSxPQUFPLEVBQUUsQ0FBQyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxlQUFlLEVBQUUsQ0FB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QUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLENBQUMsT0FBTyxDQUFDO1FBQ3ZFLElBQUksUUFBUSxHQUFHLFFBQVEsSUFBSSxFQUFFLENBQUMsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUMsc0VBQXNFLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUNuTCxJQUFJLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDZixLQUFLLENBQUMsTUFBTSxHQUFHLE1BQU0sQ0FBQztRQUN0QixLQUFLLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQztRQUMxQixLQUFLLENBQUMsYUFBYSxHQUFHLElBQUksQ0FBQztRQUMzQixLQUFLLENBQUMsWUFBWSxHQUFHLFFBQVEsSUFBSSxFQUFFLENBQUM7UUFDcEMsSUFBSSxTQUFTLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUN0QyxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osR0FBRyxFQUFFLG9DQUFvQyxHQUFHLFNBQVM7U0FDdEQsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUNILG9CQUFDO0FBQUQsQ0FBQyxBQTNZRCxJQTJZQztBQUVELElBQUksQ0FBQyxJQUFJLGFBQWEsRUFBRSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3ZWJBUEkgZnJvbSAnLi4vLi4vYXBpL2FwcC9BcHBTZXJ2aWNlJztcbmltcG9ydCB7XG4gIFJldHJpZXZlRm9vZERpYXJ5UmVxLCBSZXRyaWV2ZUZvb2REaWFyeVJlc3AsXG4gIFJldHJpZXZlT3JDcmVhdGVVc2VyUmVwb3J0UmVxLCBSZXRyaWV2ZU9yQ3JlYXRlVXNlclJlcG9ydFJlc3AsXG4gIFJldHJpZXZlTWVhbExvZ1JlcSwgTWVhbExvZ1Jlc3AsIEZvb2RMb2dJbmZvLCBNZWFsSW5mb1xufSBmcm9tIFwiLi4vLi4vYXBpL2FwcC9BcHBTZXJ2aWNlT2Jqc1wiXG5pbXBvcnQgKiBhcyBnbG9iYWxFbnVtIGZyb20gJy4uLy4uL2FwaS9HbG9iYWxFbnVtJ1xuaW1wb3J0ICogYXMgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQgKiBhcyB1cGxvYWRGaWxlIGZyb20gJy4uLy4uL2FwaS91cGxvYWRlci5qcyc7XG5cblxudHlwZSBOdXRyaXRpb25JbmZvID0ge1xuICBudXRyaWVudF9uYW1lOiBzdHJpbmc7XG4gIGludGFrZW5fcGVyY2VudGFnZTogbnVtYmVyO1xuICBwcm9ncmVzc19jb2xvcjogc3RyaW5nO1xuICBpbnRha2VuX251bTogbnVtYmVyO1xuICB0b3RhbF9udW06IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xufVxuXG50eXBlIE1lYWwgPSB7XG4gIG1lYWxJZDogbnVtYmVyO1xuICBtZWFsTmFtZTogc3RyaW5nO1xuICBtZWFsRW5ncnk6IG51bWJlcjtcbiAgc3VnZ2VzdGVkSW50YWtlOiBudW1iZXI7XG4gIG1lYWxQZXJjZW50YWdlOiBudW1iZXI7XG4gIG1lYWxzOiBNZWFsSW5mb1tdO1xuICBtZWFsU3VtbWFyeTogRm9vZFtdXG59XG50eXBlIEZvb2QgPSB7XG4gIGZvb2ROYW1lOiBzdHJpbmc7XG4gIGVuZXJneTogbnVtYmVyO1xuICB1bml0TmFtZTogc3RyaW5nO1xuICB3ZWlnaHQ6IG51bWJlclxufVxuXG5jbGFzcyBGb29kRGlhcnlQYWdlIHtcblxuICBwdWJsaWMgZGF0YSA9IHtcbiAgICBudXRyaWVudFN1bW1hcnk6IFtcbiAgICAgIHsgbnV0cmllbnRfbmFtZTogXCLng63ph49cIiwgaW50YWtlbl9wZXJjZW50YWdlOiAwLCBpbnRha2VuX251bTogMCwgdG90YWxfbnVtOiAwLCB1bml0OiBcIuWNg+WNoVwiIH0sXG4gICAgICB7IG51dHJpZW50X25hbWU6IFwi6ISC6IKqXCIsIGludGFrZW5fcGVyY2VudGFnZTogMCwgaW50YWtlbl9udW06IDAsIHRvdGFsX251bTogMCwgdW5pdDogXCLlhYtcIiB9LFxuICAgICAgeyBudXRyaWVudF9uYW1lOiBcIueis+awtOWMluWQiOeJqVwiLCBpbnRha2VuX3BlcmNlbnRhZ2U6IDAsIGludGFrZW5fbnVtOiAwLCB0b3RhbF9udW06IDAsIHVuaXQ6IFwi5YWLXCIgfSxcbiAgICAgIHsgbnV0cmllbnRfbmFtZTogXCLom4vnmb3otKhcIiwgaW50YWtlbl9wZXJjZW50YWdlOiAwLCBpbnRha2VuX251bTogMCwgdG90YWxfbnVtOiAwLCB1bml0OiBcIuWFi1wiIH1cbiAgICBdLFxuICAgIG1lYWxMaXN0OiBbXG4gICAgICB7IG1lYWxfaWQ6IDAsIG1lYWxOYW1lOiAn5pep6aSQJywgbWVhbEVuZ3J5OiAwLCBzdWdnZXN0ZWRJbnRha2U6IDAsIG1lYWxQZXJjZW50YWdlOiBcIlwiLCBtZWFsczogW10sIG1lYWxTdW1tYXJ5OiBbXSB9LFxuICAgICAgeyBtZWFsX2lkOiAxLCBtZWFsTmFtZTogJ+WNiOmkkCcsIG1lYWxFbmdyeTogMCwgc3VnZ2VzdGVkSW50YWtlOiAwLCBtZWFsUGVyY2VudGFnZTogXCJcIiwgbWVhbHM6IFtdLCBtZWFsU3VtbWFyeTogW10gfSxcbiAgICAgIHsgbWVhbF9pZDogMiwgbWVhbE5hbWU6ICfmmZrppJAnLCBtZWFsRW5ncnk6IDAsIHN1Z2dlc3RlZEludGFrZTogMCwgbWVhbFBlcmNlbnRhZ2U6IFwiXCIsIG1lYWxzOiBbXSwgbWVhbFN1bW1hcnk6IFtdIH0sXG4gICAgXSxcbiAgICBzY29yZTogMFxuICB9O1xuICBwdWJsaWMgbWVhbFR5cGUgPSAwO1xuICBwdWJsaWMgbWVhbERhdGUgPSAwO1xuICBwdWJsaWMgcGF0aCA9ICcnO1xuXG4gIHB1YmxpYyBvbkxvYWQoKSB7XG4gICAgLy9zZXQgdG9rZW4gaW50byB3ZWJBUElcbiAgICB3ZWJBUEkuU2V0QXV0aFRva2VuKHd4LmdldFN0b3JhZ2VTeW5jKGdsb2JhbEVudW0uZ2xvYmFsS2V5X3Rva2VuKSk7XG4gICAgLy8gbGV0IGN1cnJlbnRUaW1lU3RhbXAgPSBEYXRlLnBhcnNlKFN0cmluZyhuZXcgRGF0ZSgpKSk7XG4gICAgLy8gdGhpcy5yZXRyaWV2ZUZvb2REaWFyeURhdGEoY3VycmVudFRpbWVTdGFtcC8xMDAwKTtcbiAgfVxuXG4gIHB1YmxpYyBvblNob3coKSB7XG4gICAgaWYgKHRoaXMubWVhbERhdGUgIT09IDApIHtcbiAgICAgIHRoaXMucmV0cmlldmVGb29kRGlhcnlEYXRhKHRoaXMubWVhbERhdGUpO1xuICAgIH1cbiAgICAvLyB0aGlzLmxvYWRSZXBvcnRCYWRnZSgpO1xuICB9XG5cbiAgcHVibGljIGxvYWRSZXBvcnRCYWRnZSgpIHtcbiAgICBsZXQgdG9rZW4gPSB3eC5nZXRTdG9yYWdlU3luYyhnbG9iYWxFbnVtLmdsb2JhbEtleV90b2tlbik7XG4gICAgY29uc29sZS5sb2codG9rZW4pO1xuICAgIGlmICh0b2tlbikge1xuICAgICAgbGV0IGN1cnJlbnREYXRlID0gbW9tZW50KCkuc3RhcnRPZignZGF5Jyk7XG4gICAgICBsZXQgZmlyc3REYXlPZldlZWsgPSBjdXJyZW50RGF0ZS53ZWVrKGN1cnJlbnREYXRlLndlZWsoKSkuZGF5KDEpLnVuaXgoKTtcbiAgICAgIGxldCBsYXN0RGF5T2ZXZWVrID0gY3VycmVudERhdGUud2VlayhjdXJyZW50RGF0ZS53ZWVrKCkpLmRheSg3KS51bml4KCk7XG4gICAgICBsZXQgcmVxID0ge1xuICAgICAgICBkYXRlX2Zyb206IGZpcnN0RGF5T2ZXZWVrLFxuICAgICAgICBkYXRlX3RvOiBsYXN0RGF5T2ZXZWVrXG4gICAgICB9O1xuICAgICAgd2ViQVBJLlJldHJpZXZlVXNlclJlcG9ydHMocmVxKS50aGVuKHJlc3AgPT4ge1xuICAgICAgICB3eC5oaWRlTG9hZGluZyh7fSk7XG4gICAgICAgIHRoaXMuY291bnRSZXBvcnRCYWRnZShyZXNwKTtcbiAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY291bnRSZXBvcnRCYWRnZShyZXNwOiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwKTtcbiAgICBsZXQgcmVwb3J0TnVtID0gMDtcbiAgICBsZXQgcmVwb3J0cyA9IHJlc3AuZGFpbHlfcmVwb3J0O1xuICAgIGZvciAobGV0IGluZGV4IGluIHJlcG9ydHMpIHtcbiAgICAgIGxldCByZXBvcnQgPSByZXBvcnRzW2luZGV4XTtcbiAgICAgIGlmICghcmVwb3J0LmlzX3JlcG9ydF9nZW5lcmF0ZWQgJiYgIXJlcG9ydC5pc19mb29kX2xvZ19lbXB0eSkge1xuICAgICAgICBsZXQgdG9kYXlUaW1lID0gbW9tZW50KCkuc3RhcnRPZignZGF5JykudW5peCgpO1xuICAgICAgICBjb25zb2xlLmxvZyh0b2RheVRpbWUpO1xuICAgICAgICBpZiAocmVwb3J0LmRhdGUgPCB0b2RheVRpbWUgfHwgKHJlcG9ydC5kYXRlID09IHRvZGF5VGltZSAmJiBtb21lbnQobmV3IERhdGUoKSkuaG91cnMgPiAyMikpIHsgICAvL2NvdW50IHRvZGF5IHJlcG9ydHMgc3RhdHVzIGFmdGVyIDE5XG4gICAgICAgICAgcmVwb3J0TnVtKys7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJlcG9ydE51bSAhPSAwKSB7XG4gICAgICB3eC5zZXRUYWJCYXJCYWRnZSh7XG4gICAgICAgIGluZGV4OiAyLFxuICAgICAgICB0ZXh0OiBTdHJpbmcocmVwb3J0TnVtKVxuICAgICAgfSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHd4LnJlbW92ZVRhYkJhckJhZGdlKHtcbiAgICAgICAgaW5kZXg6IDJcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZXRyaWV2ZUZvb2REaWFyeURhdGEoY3VycmVudFRpbWVTdGFtcDogbnVtYmVyKSB7XG4gICAgbGV0IHJlcTogUmV0cmlldmVGb29kRGlhcnlSZXEgPSB7IGRhdGU6IGN1cnJlbnRUaW1lU3RhbXAgfTtcbiAgICB3ZWJBUEkuUmV0cmlldmVGb29kRGlhcnkocmVxKS50aGVuKHJlc3AgPT4gdGhpcy5mb29kRGlhcnlEYXRhUGFyc2luZyhyZXNwKSkuY2F0Y2goZXJyID0+XG5cbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgY29udGVudDogJ+iOt+WPluaXpeW/l+Wksei0pScsXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcmV0cmlldmVNZWFsTG9nKG1lYWxJZDogbnVtYmVyKSB7XG4gICAgbGV0IHJlcTogUmV0cmlldmVNZWFsTG9nUmVxID0geyBtZWFsX2lkOiBtZWFsSWQgfVxuICAgIHJldHVybiB3ZWJBUEkuUmV0cmlldmVNZWFsTG9nKHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgIHJldHVybiB0aGlzLnBhcnNlTWVhbExvZyhyZXNwKTtcbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgY29udGVudDogJ+iOt+WPlumjn+eJqeaVsOaNruWksei0pScsXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICB9KVxuICAgIH1cbiAgICApO1xuICB9XG4gIHB1YmxpYyBwYXJzZU1lYWxMb2cocmVzcDogTWVhbExvZ1Jlc3ApIHtcbiAgICBsZXQgZm9vZExpc3Q6IEZvb2RbXSA9IFtdO1xuICAgIGZvciAobGV0IGluZGV4IGluIHJlc3AuZm9vZF9sb2cpIHtcbiAgICAgIGxldCBmb29kTG9nOiBGb29kTG9nSW5mbyA9IHJlc3AuZm9vZF9sb2dbaW5kZXhdO1xuICAgICAgbGV0IHVuaXRPYmogPSBmb29kTG9nLnVuaXRfb3B0aW9uLmZpbmQobyA9PiBvLnVuaXRfaWQgPT09IGZvb2RMb2cudW5pdF9pZCk7XG4gICAgICBsZXQgdW5pdE5hbWUgPSBcIuS7vVwiXG4gICAgICBpZiAodW5pdE9iaikge1xuICAgICAgICB1bml0TmFtZSA9IHVuaXRPYmoudW5pdF9uYW1lO1xuICAgICAgfVxuICAgICAgbGV0IGZvb2Q6IEZvb2QgPSB7XG4gICAgICAgIGZvb2ROYW1lOiBmb29kTG9nLmZvb2RfbmFtZSxcbiAgICAgICAgZW5lcmd5OiBNYXRoLmZsb29yKGZvb2RMb2cuZW5lcmd5IC8gMTAwKSxcbiAgICAgICAgdW5pdE5hbWU6IHVuaXROYW1lLFxuICAgICAgICB3ZWlnaHQ6IE1hdGgucm91bmQoZm9vZExvZy5hbW91bnQpIC8gMTAwXG5cbiAgICAgIH1cbiAgICAgIGZvb2RMaXN0LnB1c2goZm9vZClcbiAgICB9XG4gICAgcmV0dXJuIGZvb2RMaXN0XG4gIH1cbiAgcHVibGljIGxvYWRNZWFsU3VtbWFyeShyZXNwOiBSZXRyaWV2ZUZvb2REaWFyeVJlc3ApIHtcbiAgICBsZXQgYnJlYWtmYXN0OiBNZWFsO1xuICAgIGxldCBicmVha2Zhc3RTdW1tYXJ5OiBGb29kW10gPSBbXTtcbiAgICBsZXQgYnJlYWtmYXN0SWRzOiBudW1iZXJbXSA9IFtdXG4gICAgcmVzcC5icmVha2Zhc3QuZm9yRWFjaCgoaXRlbSA9PlxuICAgICAgYnJlYWtmYXN0SWRzLnB1c2goaXRlbS5tZWFsX2lkKVxuICAgICkpXG4gICAgY29uc3QgYnJlYWtmYXN0UHJvbXMgPSBQcm9taXNlLmFsbChicmVha2Zhc3RJZHMubWFwKGlkID0+IHRoaXMucmV0cmlldmVNZWFsTG9nKGlkKSkpLnRoZW4oXG4gICAgICByZXN1bHQgPT4ge1xuICAgICAgICByZXN1bHQubWFwKGxpc3QgPT4gYnJlYWtmYXN0U3VtbWFyeS5wdXNoKC4uLmxpc3QpKTtcbiAgICAgICAgcmV0dXJuIGJyZWFrZmFzdCA9IHtcbiAgICAgICAgICBtZWFsSWQ6IDAsXG4gICAgICAgICAgbWVhbE5hbWU6ICfml6nppJAnLFxuICAgICAgICAgIG1lYWxFbmdyeTogTWF0aC5mbG9vcihyZXNwLmJyZWFrZmFzdF9zdWdnZXN0aW9uLmVuZXJneV9pbnRha2UgLyAxMDApLFxuICAgICAgICAgIHN1Z2dlc3RlZEludGFrZTogTWF0aC5mbG9vcihyZXNwLmJyZWFrZmFzdF9zdWdnZXN0aW9uLnN1Z2dlc3RlZF9pbnRha2UgLyAxMDApLFxuICAgICAgICAgIG1lYWxQZXJjZW50YWdlOiByZXNwLmJyZWFrZmFzdF9zdWdnZXN0aW9uLnBlcmNlbnRhZ2UsXG4gICAgICAgICAgbWVhbHM6IHJlc3AuYnJlYWtmYXN0LFxuICAgICAgICAgIG1lYWxTdW1tYXJ5OiBicmVha2Zhc3RTdW1tYXJ5XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAvL2x1bmNoXG4gICAgbGV0IGx1bmNoOiBNZWFsO1xuICAgIGxldCBsdW5jaFN1bW1hcnk6IEZvb2RbXSA9IFtdO1xuICAgIGxldCBsdW5jaElkczogbnVtYmVyW10gPSBbXVxuICAgIHJlc3AubHVuY2guZm9yRWFjaCgoaXRlbSA9PlxuICAgICAgbHVuY2hJZHMucHVzaChpdGVtLm1lYWxfaWQpXG4gICAgKSk7XG4gICAgY29uc3QgbHVuY2hQcm9tcyA9IFByb21pc2UuYWxsKGx1bmNoSWRzLm1hcChpZCA9PiB0aGlzLnJldHJpZXZlTWVhbExvZyhpZCkpKS50aGVuKFxuICAgICAgcmVzdWx0ID0+IHtcbiAgICAgICAgcmVzdWx0Lm1hcChsaXN0ID0+IGx1bmNoU3VtbWFyeS5wdXNoKC4uLmxpc3QpKTtcbiAgICAgICAgcmV0dXJuIGx1bmNoID0ge1xuICAgICAgICAgIG1lYWxJZDogMSxcbiAgICAgICAgICBtZWFsTmFtZTogJ+WNiOmkkCcsXG4gICAgICAgICAgbWVhbEVuZ3J5OiBNYXRoLmZsb29yKHJlc3AubHVuY2hfc3VnZ2VzdGlvbi5lbmVyZ3lfaW50YWtlIC8gMTAwKSxcbiAgICAgICAgICBzdWdnZXN0ZWRJbnRha2U6IE1hdGguZmxvb3IocmVzcC5sdW5jaF9zdWdnZXN0aW9uLnN1Z2dlc3RlZF9pbnRha2UgLyAxMDApLFxuICAgICAgICAgIG1lYWxQZXJjZW50YWdlOiByZXNwLmx1bmNoX3N1Z2dlc3Rpb24ucGVyY2VudGFnZSxcbiAgICAgICAgICBtZWFsczogcmVzcC5sdW5jaCxcbiAgICAgICAgICBtZWFsU3VtbWFyeTogbHVuY2hTdW1tYXJ5XG4gICAgICAgIH07XG4gICAgICB9KTtcbiAgICAvL2Rpbm5lclxuICAgIGxldCBkaW5uZXI6IE1lYWw7XG4gICAgbGV0IGRpbm5lclN1bW1hcnk6IEZvb2RbXSA9IFtdO1xuICAgIGxldCBkaW5uZXJJZHM6IG51bWJlcltdID0gW11cbiAgICByZXNwLmRpbm5lci5mb3JFYWNoKChpdGVtID0+XG4gICAgICBkaW5uZXJJZHMucHVzaChpdGVtLm1lYWxfaWQpXG4gICAgKSk7XG4gICAgY29uc3QgZGlubmVyUHJvbXMgPSBQcm9taXNlLmFsbChkaW5uZXJJZHMubWFwKGlkID0+IHRoaXMucmV0cmlldmVNZWFsTG9nKGlkKSkpLnRoZW4oXG4gICAgICByZXN1bHQgPT4ge1xuICAgICAgICByZXN1bHQubWFwKGxpc3QgPT4gZGlubmVyU3VtbWFyeS5wdXNoKC4uLmxpc3QpKTtcbiAgICAgICAgcmV0dXJuIGRpbm5lciA9IHtcbiAgICAgICAgICBtZWFsSWQ6IDIsXG4gICAgICAgICAgbWVhbE5hbWU6ICfmmZrppJAnLCBtZWFsRW5ncnk6IE1hdGguZmxvb3IocmVzcC5kaW5uZXJfc3VnZ2VzdGlvbi5lbmVyZ3lfaW50YWtlIC8gMTAwKSxcbiAgICAgICAgICBzdWdnZXN0ZWRJbnRha2U6IE1hdGguZmxvb3IocmVzcC5kaW5uZXJfc3VnZ2VzdGlvbi5zdWdnZXN0ZWRfaW50YWtlIC8gMTAwKSxcbiAgICAgICAgICBtZWFsUGVyY2VudGFnZTogcmVzcC5kaW5uZXJfc3VnZ2VzdGlvbi5wZXJjZW50YWdlLFxuICAgICAgICAgIG1lYWxzOiByZXNwLmRpbm5lcixcbiAgICAgICAgICBtZWFsU3VtbWFyeTogZGlubmVyU3VtbWFyeVxuICAgICAgICB9O1xuXG4gICAgICB9KTtcbiAgICAvL2FkZGl0aW9uYWxcbiAgICBsZXQgYWRkaXRpb246IE1lYWw7XG4gICAgbGV0IGFkZGl0aW9uU3VtbWFyeTogRm9vZFtdID0gW107XG4gICAgbGV0IGFkZGl0aW9uSWRzOiBudW1iZXJbXSA9IFtdXG4gICAgcmVzcC5hZGRpdGlvbi5mb3JFYWNoKChpdGVtID0+XG4gICAgICBkaW5uZXJJZHMucHVzaChpdGVtLm1lYWxfaWQpXG4gICAgKSk7XG4gICAgY29uc3QgYWRkaXRpb25Qcm9tcyA9IFByb21pc2UuYWxsKGFkZGl0aW9uSWRzLm1hcChpZCA9PiB0aGlzLnJldHJpZXZlTWVhbExvZyhpZCkpKS50aGVuKFxuICAgICAgcmVzdWx0ID0+IHtcbiAgICAgICAgcmVzdWx0Lm1hcChsaXN0ID0+IGFkZGl0aW9uU3VtbWFyeS5wdXNoKC4uLmxpc3QpKTtcbiAgICAgICAgcmV0dXJuIGFkZGl0aW9uID0ge1xuICAgICAgICAgIG1lYWxJZDogMyxcbiAgICAgICAgICBtZWFsTmFtZTogJ+WKoOmkkCcsXG4gICAgICAgICAgbWVhbEVuZ3J5OiBNYXRoLmZsb29yKHJlc3AuYWRkaXRpb25fc3VnZ2VzdGlvbi5lbmVyZ3lfaW50YWtlIC8gMTAwKSxcbiAgICAgICAgICBzdWdnZXN0ZWRJbnRha2U6IE1hdGguZmxvb3IocmVzcC5hZGRpdGlvbl9zdWdnZXN0aW9uLnN1Z2dlc3RlZF9pbnRha2UgLyAxMDApLFxuICAgICAgICAgIG1lYWxQZXJjZW50YWdlOiByZXNwLmFkZGl0aW9uX3N1Z2dlc3Rpb24ucGVyY2VudGFnZSxcbiAgICAgICAgICBtZWFsczogcmVzcC5hZGRpdGlvbixcbiAgICAgICAgICBtZWFsU3VtbWFyeTogYWRkaXRpb25TdW1tYXJ5XG4gICAgICAgIH07XG5cbiAgICAgIH0pO1xuICAgIGxldCBtZWFsTGlzdDogTWVhbFtdID0gW11cbiAgICBQcm9taXNlLmFsbChbYnJlYWtmYXN0UHJvbXMsIGx1bmNoUHJvbXMsIGRpbm5lclByb21zXSkudGhlbihcbiAgICAgIHJlc3VsdCA9PiB7XG4gICAgICAgIHJlc3VsdC5tYXAobWVhbCA9PiBtZWFsTGlzdC5wdXNoKG1lYWwpKTtcbiAgICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgICBtZWFsTGlzdDogbWVhbExpc3QsXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKG1lYWxMaXN0KVxuICAgICAgfVxuICAgICk7XG5cbiAgfVxuXG4gIHB1YmxpYyBmb29kRGlhcnlEYXRhUGFyc2luZyhyZXNwOiBSZXRyaWV2ZUZvb2REaWFyeVJlc3ApIHtcbiAgICBjb25zb2xlLmxvZyhcInN1bW1hcnlcIiwgcmVzcCk7XG4gICAgbGV0IHNjb3JlID0gcmVzcC5zY29yZTtcbiAgICBsZXQgZW5lcmd5ID0gcmVzcC5kYWlseV9pbnRha2UuZW5lcmd5O1xuICAgIGxldCBwcm90ZWluID0gcmVzcC5kYWlseV9pbnRha2UucHJvdGVpbjtcbiAgICBsZXQgY2FyYm9oeWRyYXRlID0gcmVzcC5kYWlseV9pbnRha2UuY2FyYm9oeWRyYXRlO1xuICAgIGxldCBmYXQgPSByZXNwLmRhaWx5X2ludGFrZS5mYXQ7XG4gICAgbGV0IG51dHJpZW50U3VtbWFyeSA9IFtcbiAgICAgIHsgbnV0cmllbnRfbmFtZTogXCLng63ph49cIiwgaW50YWtlbl9wZXJjZW50YWdlOiBlbmVyZ3kucGVyY2VudGFnZSwgaW50YWtlbl9udW06IE1hdGguZmxvb3IoZW5lcmd5LmludGFrZSAvIDEwMCksIHRvdGFsX251bTogTWF0aC5mbG9vcihlbmVyZ3kuc3VnZ2VzdGVkX2ludGFrZSAvIDEwMCksIHVuaXQ6IFwi5Y2D5Y2hXCIgfSxcbiAgICAgIHsgbnV0cmllbnRfbmFtZTogXCLohILogqpcIiwgaW50YWtlbl9wZXJjZW50YWdlOiBmYXQucGVyY2VudGFnZSwgaW50YWtlbl9udW06IE1hdGguZmxvb3IoZmF0LmludGFrZSAvIDEwMCksIHRvdGFsX251bTogTWF0aC5mbG9vcihmYXQuc3VnZ2VzdGVkX2ludGFrZSAvIDEwMCksIHVuaXQ6IFwi5YWLXCIgfSxcbiAgICAgIHsgbnV0cmllbnRfbmFtZTogXCLnorPmsLTljJblkIjnialcIiwgaW50YWtlbl9wZXJjZW50YWdlOiBjYXJib2h5ZHJhdGUucGVyY2VudGFnZSwgaW50YWtlbl9udW06IE1hdGguZmxvb3IoY2FyYm9oeWRyYXRlLmludGFrZSAvIDEwMCksIHRvdGFsX251bTogTWF0aC5mbG9vcihjYXJib2h5ZHJhdGUuc3VnZ2VzdGVkX2ludGFrZSAvIDEwMCksIHVuaXQ6IFwi5YWLXCIgfSxcbiAgICAgIHsgbnV0cmllbnRfbmFtZTogXCLom4vnmb3otKhcIiwgaW50YWtlbl9wZXJjZW50YWdlOiBwcm90ZWluLnBlcmNlbnRhZ2UsIGludGFrZW5fbnVtOiBNYXRoLmZsb29yKHByb3RlaW4uaW50YWtlIC8gMTAwKSwgdG90YWxfbnVtOiBNYXRoLmZsb29yKHByb3RlaW4uc3VnZ2VzdGVkX2ludGFrZSAvIDEwMCksIHVuaXQ6IFwi5YWLXCIgfVxuICAgIF1cblxuICAgIHRoaXMubG9hZE1lYWxTdW1tYXJ5KHJlc3ApO1xuICAgIC8vIGxldCBtZWFsTGlzdCA9IFticmVha2Zhc3QsIGx1bmNoLCBkaW5uZXIsIGFkZGl0aW9uYWxdO1xuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICBudXRyaWVudFN1bW1hcnk6IG51dHJpZW50U3VtbWFyeSxcbiAgICAgIHNjb3JlOiBzY29yZVxuICAgIH0pO1xuXG5cbiAgfVxuXG4gIHB1YmxpYyBiaW5kTmF2aVRvT3RoZXJNaW5pQXBwKCkge1xuICAgIC8vdGVzdCBvbiBuYXZpZ2F0ZSBtaW5pUHJvZ3JhbVxuICAgIHd4Lm5hdmlnYXRlVG9NaW5pUHJvZ3JhbSh7XG4gICAgICBhcHBJZDogJ3d4NGI3NDIyOGJhYTE1NDg5YScsXG4gICAgICBwYXRoOiAnJyxcbiAgICAgIGVudlZlcnNpb246ICdkZXZlbG9wJyxcbiAgICAgIHN1Y2Nlc3MocmVzOiBhbnkpIHtcbiAgICAgICAgLy8g5omT5byA5oiQ5YqfXG4gICAgICAgIGNvbnNvbGUubG9nKFwic3VjY2Nlc3MgbmF2aWdhdGVcIik7XG4gICAgICB9LFxuICAgICAgZmFpbChlcnI6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgfVxuICAgIH0pXG4gIH1cblxuICAvL3doZW4gb3Blbm5pbmcgdGhlIGNhbGVuZGFyXG4gIHB1YmxpYyBiaW5kc2VsZWN0KGV2ZW50OiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gIH1cblxuICAvL3doZW4gdXNlciBzZWxlY3QgZGF0ZVxuICBwdWJsaWMgYmluZGdldGRhdGUoZXZlbnQ6IGFueSkge1xuICAgIC8vQ29udmVydCBkYXRlIHRvIHVuaXggdGltZXN0YW1wXG4gICAgbGV0IHRpbWUgPSBldmVudC5kZXRhaWw7XG4gICAgbGV0IGRhdGUgPSBtb21lbnQoW3RpbWUueWVhciwgdGltZS5tb250aCAtIDEsIHRpbWUuZGF0ZV0pOyAvLyBNb21lbnQgbW9udGggaXMgc2hpZnRlZCBsZWZ0IGJ5IDFcbiAgICAvL2dldCBjdXJyZW50IHRpbWVzdGFtcFxuICAgIHRoaXMubWVhbERhdGUgPSBkYXRlLnVuaXgoKTtcbiAgICBjb25zb2xlLmxvZyh0aGlzLm1lYWxEYXRlKTtcbiAgICAvL3JlcXVlc3QgQVBJXG4gICAgdGhpcy5yZXRyaWV2ZUZvb2REaWFyeURhdGEodGhpcy5tZWFsRGF0ZSk7XG4gICAgLy9sZXQgdGltZURhdGEgPSB0aW1lLnllYXIgKyBcIi1cIiArIHRpbWUubW9udGggKyBcIi1cIiArIHRpbWUuZGF0ZTtcbiAgfVxuICBwdWJsaWMgb25EYWlseVJlcG9ydENsaWNrKGV2ZW50OiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhldmVudCk7XG4gICAgdGhpcy5yZXRyaWV2ZURhaWx5UmVwb3J0KHRoaXMubWVhbERhdGUpO1xuICB9XG4gIHB1YmxpYyByZXRyaWV2ZURhaWx5UmVwb3J0KGN1cnJlbnRUaW1lU3RhbXA6IG51bWJlcikge1xuICAgIGxldCByZXE6IFJldHJpZXZlT3JDcmVhdGVVc2VyUmVwb3J0UmVxID0geyBkYXRlOiBjdXJyZW50VGltZVN0YW1wIH07XG4gICAgd2ViQVBJLlJldHJpZXZlT3JDcmVhdGVVc2VyUmVwb3J0KHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgIGxldCByZXBvcnRVcmw6IHN0cmluZyA9IHJlc3AucmVwb3J0X3VybDtcbiAgICAgIGlmIChyZXBvcnRVcmwgJiYgcmVwb3J0VXJsICE9IFwiXCIpIHtcbiAgICAgICAgd3gubmF2aWdhdGVUbyh7IHVybDogXCIvcGFnZXMvcmVwb3J0UGFnZS9yZXBvcnRQYWdlP3VybD1cIiArIHJlcG9ydFVybCB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgdGl0bGU6IFwiXCIsXG4gICAgICAgICAgY29udGVudDogXCLor7fmt7vliqDlvZPlpKnpo5/nianorrDlvZVcIixcbiAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pLmNhdGNoKGVyciA9PiBjb25zb2xlLmxvZyhlcnIpKVxuICB9XG5cblxuXG4gIHB1YmxpYyBhZGRGb29kSW1hZ2UoZXZlbnQ6IGFueSkge1xuICAgIGxldCBtZWFsSW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQubWVhbEluZGV4O1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICB0aGlzLm1lYWxUeXBlID0gbWVhbEluZGV4ICsgMTtcbiAgICBjb25zb2xlLmxvZyhcIm1lYWxJbmRleDpcIiArIG1lYWxJbmRleCk7XG4gICAgd3guc2hvd0FjdGlvblNoZWV0KHtcbiAgICAgIGl0ZW1MaXN0OiBbJ+aLjeeFp+iusOW9lScsICfnm7jlhownLCAn5paH5a2X5pCc57SiJ10sXG4gICAgICBzdWNjZXNzKHJlczogYW55KSB7XG4gICAgICAgIHN3aXRjaCAocmVzLnRhcEluZGV4KSB7XG4gICAgICAgICAgY2FzZSAwOlxuICAgICAgICAgICAgdGhhdC5jaG9vc2VJbWFnZSgnY2FtZXJhJyk7XG4gICAgICAgICAgICB3eC5yZXBvcnRBbmFseXRpY3MoJ3JlY29yZF90eXBlX3NlbGVjdCcsIHtcbiAgICAgICAgICAgICAgc291cmNldHlwZTogJ2NhbWVyYScsXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIGNhc2UgMTpcbiAgICAgICAgICAgIHRoYXQuY2hvb3NlSW1hZ2UoJ2FsYnVtJyk7XG4gICAgICAgICAgICB3eC5yZXBvcnRBbmFseXRpY3MoJ3JlY29yZF90eXBlX3NlbGVjdCcsIHtcbiAgICAgICAgICAgICAgc291cmNldHlwZTogJ2FsYnVtJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgY2FzZSAyOlxuICAgICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICAgIHVybDogXCIuLi8uLi9wYWdlcy90ZXh0U2VhcmNoL2luZGV4P3RpdGxlPVwiICsgdGhhdC5kYXRhLm1lYWxMaXN0W21lYWxJbmRleF0ubWVhbE5hbWUgKyBcIiZtZWFsVHlwZT1cIiArIHRoYXQubWVhbFR5cGUgKyBcIiZuYXZpVHlwZT0wJmZpbHRlclR5cGU9MCZtZWFsRGF0ZT1cIiArIHRoYXQubWVhbERhdGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgd3gucmVwb3J0QW5hbHl0aWNzKCdyZWNvcmRfdHlwZV9zZWxlY3QnLCB7XG4gICAgICAgICAgICAgIHNvdXJjZXR5cGU6ICd0ZXh0U2VhcmNoJyxcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjaG9vc2VJbWFnZShzb3VyY2VUeXBlOiBzdHJpbmcpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgd3guY2hvb3NlSW1hZ2Uoe1xuICAgICAgY291bnQ6IDEsXG4gICAgICBzaXplVHlwZTogWydvcmlnaW5hbCcsICdjb21wcmVzc2VkJ10sXG4gICAgICBzb3VyY2VUeXBlOiBbc291cmNlVHlwZV0sXG4gICAgICBzdWNjZXNzOiBmdW5jdGlvbiAocmVzOiBhbnkpIHtcbiAgICAgICAgd3guc2hvd0xvYWRpbmcoeyB0aXRsZTogXCLkuIrkvKDkuK0uLi5cIiwgbWFzazogdHJ1ZSB9KTtcbiAgICAgICAgbGV0IGltYWdlUGF0aCA9IHJlcy50ZW1wRmlsZVBhdGhzWzBdO1xuICAgICAgICB0aGF0LnBhdGggPSBpbWFnZVBhdGhcbiAgICAgICAgLy9jcm9wIGltYWdlIHRoZW4gdXBsb2FkLCBmb2xsb3cgYnkgdGFnZ2luZyBwcm9jZXNzXG4gICAgICAgIC8vIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAvLyAgIHVybDogXCIvcGFnZXMvd2VDcm9wcGVyUGFnZS91cGxvYWQ/aW1hZ2VVcmw9XCIgKyBpbWFnZVBhdGggKyBcIiZtZWFsVHlwZT1cIiArIHRoYXQubWVhbFR5cGUgKyBcIiZtZWFsRGF0ZT1cIiArIHRoYXQubWVhbERhdGVcblxuICAgICAgICAgIC8vIHVybDogXCIvcGFnZXMvaW1hZ2VUYWcvaW5kZXg/aW1hZ2VVcmw9XCIgKyBpbWFnZVBhdGggKyBcIiZtZWFsVHlwZT1cIiArIHRoYXQubWVhbFR5cGUgKyBcIiZtZWFsRGF0ZT1cIiArIHRoYXQubWVhbERhdGVcbiAgICAgICAgICAgIFxuICAgICAgICAvLyB9KTtcbiAgICAgICAgY29uc29sZS5sb2coOTk5LCB1cGxvYWRGaWxlKVxuICAgICAgICB1cGxvYWRGaWxlKGltYWdlUGF0aCwgdGhhdC5vbkltYWdlVXBsb2FkU3VjY2VzcywgdGhhdC5vbkltYWdlVXBsb2FkRmFpbGVkLCB0aGF0Lm9uVXBsb2FkUHJvZ3Jlc3NpbmcsIDAsIDApO1xuICAgICAgfSxcbiAgICAgIGZhaWw6IGZ1bmN0aW9uIChlcnI6IGFueSkge1xuICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uSW1hZ2VVcGxvYWRTdWNjZXNzKGV2ZW50OiBhbnkpe1xuICAgIGNvbnNvbGUubG9nKFwidXBsb2FkU3VjZXNzXCIgKyB0aGlzLm1lYWxUeXBlICsgXCIsXCIgKyB0aGlzLm1lYWxEYXRlKTtcbiAgICB3eC5oaWRlTG9hZGluZygpO1xuICAgIGNvbnNvbGUubG9nKCc9PT09PXBhdGg9PT09Jyx0aGlzLnBhdGgpXG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6ICcvcGFnZXMvaW1hZ2VUYWcvaW5kZXg/aW1hZ2VVcmw9JyArIHRoaXMucGF0aCArIFwiJm1lYWxUeXBlPVwiICsgdGhpcy5tZWFsVHlwZSArIFwiJm1lYWxEYXRlPVwiICsgdGhpcy5tZWFsRGF0ZSxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkltYWdlVXBsb2FkRmFpbGVkKGV2ZW50OmFueSl7XG4gICAgY29uc29sZS5sb2coXCJ1cGxvYWRmYWlsZWRcIik7XG4gICAgd3guaGlkZUxvYWRpbmcoKTtcbiAgfVxuXG4gIHB1YmxpYyBvblVwbG9hZFByb2dyZXNzaW5nKGV2ZW50OiBhbnkpe1xuICAgIGNvbnNvbGUubG9nKFwicHJvZ3Jlc3M6XCIpO1xuICB9XG5cblxuICBwdWJsaWMgbmF2aVRvRm9vZERldGFpbChldmVudDogYW55KSB7XG4gICAgY29uc3QgZGVmYXVsdEltYWdlVXJsID0gXCJodHRwczovL2RpZXRsZW5zLTEyNTg2NjU1NDcuY29zLmFwLXNoYW5naGFpLm15cWNsb3VkLmNvbS9taW5pLWFwcC1pbWFnZS9kZWZhdWx0SW1hZ2UvdGV4dHNlYXJjaC1kZWZhdWx0LWltYWdlLnBuZ1wiO1xuICAgIGxldCBtZWFsSW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQubWVhbEluZGV4O1xuICAgIGxldCBpbWFnZUluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmltYWdlSW5kZXg7XG4gICAgbGV0IG1lYWxJZCA9IHRoaXMuZGF0YS5tZWFsTGlzdFttZWFsSW5kZXhdLm1lYWxzW2ltYWdlSW5kZXhdLm1lYWxfaWQ7XG4gICAgbGV0IGltYWdlS2V5ID0gdGhpcy5kYXRhLm1lYWxMaXN0W21lYWxJbmRleF0ubWVhbHNbaW1hZ2VJbmRleF0uaW1nX2tleTtcbiAgICBsZXQgaW1hZ2VVcmwgPSBpbWFnZUtleSA9PSBcIlwiID8gZGVmYXVsdEltYWdlVXJsIDogXCJodHRwczovL2RpZXRsZW5zLTEyNTg2NjU1NDcuY29zLmFwLXNoYW5naGFpLm15cWNsb3VkLmNvbS9mb29kLWltYWdlL1wiICsgdGhpcy5kYXRhLm1lYWxMaXN0W21lYWxJbmRleF0ubWVhbHNbaW1hZ2VJbmRleF0uaW1nX2tleTtcbiAgICBsZXQgcGFyYW0gPSB7fTtcbiAgICBwYXJhbS5tZWFsSWQgPSBtZWFsSWQ7XG4gICAgcGFyYW0uaW1hZ2VVcmwgPSBpbWFnZVVybDtcbiAgICBwYXJhbS5zaG93RGVsZXRlQnRuID0gdHJ1ZTtcbiAgICBwYXJhbS5zaG93U2hhcmVCdG4gPSBpbWFnZUtleSAhPSBcIlwiO1xuICAgIGxldCBwYXJhbUpzb24gPSBKU09OLnN0cmluZ2lmeShwYXJhbSk7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6IFwiL3BhZ2VzL2Zvb2REZXRhaWwvaW5kZXg/cGFyYW1Kc29uPVwiICsgcGFyYW1Kc29uXG4gICAgfSk7XG4gIH1cbn1cblxuUGFnZShuZXcgRm9vZERpYXJ5UGFnZSgpKVxuIl19