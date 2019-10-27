"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var app = getApp();
var webAPI = require("../../api/app/AppService");
var globalEnum = require("../../api/GlobalEnum");
var onBoard = (function () {
    function onBoard() {
        this.data = {
            yearDisplay: "yearDisplay",
            datePicker: "datePicker",
            textInputClass: "section",
            pregnantStageCondition: true,
            dueDateCondition: false,
            weightBeforePregnancy: false,
            numberOfPregnancies: false,
            countPage: 0,
            finalPage: false,
            nextPage: false,
            empty: false,
            gender: 0,
            height: 0,
            weight: 0,
            pregnancyStage: '',
            pregStageSelected: 4,
            prePregWeight: 0,
            numPreg: 1,
            todayYear: 0,
            year: '2019',
            month: '10',
            date: '1',
            years: [0],
            months: [9],
            days: [0],
            activityLevel: '',
            activitySelected: 0,
            medical: '',
            medicalselected: 5,
            inputValidate: '请输入你的答案',
            optionsValidate: '请选择你的答案',
            heightValidate: '请在40-230厘米范围内输入您的身高',
            weightValidate: '请在30-300千克范围内输入您的体重',
            expectedDateValidate: '请在今天到未来45周的日期内选择您的预产期',
            ageValidate: '请确保您的年龄在1-100岁范围内',
            rdiGoal: 2000,
            birthVal: [72],
            pregnancyNumVal: [0],
            birthYears: [],
            birthYear: 1991,
            numPregOptions: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
            totalPage: 7,
            currentPage: 1,
            nickName: "",
            avatarUrl: "",
            rdiValue: " "
        };
        this.rdaUrl = "";
    }
    onBoard.prototype.genderEvent = function (event) {
        this.setData({
            nextPage: true,
            empty: false,
        });
        if (event.target.id == "男") {
            this.setData({
                totalPage: 6,
                gender: 1
            });
        }
        else {
            this.setData({
                totalPage: 7,
                gender: 2,
            });
        }
    };
    onBoard.prototype.onLoad = function () {
        wx.setNavigationBarTitle({
            title: "基本信息"
        });
        var today = new Date();
        this.setBirthYearPicker(today);
        this.setDueDatePicker(today);
    };
    onBoard.prototype.setDueDatePicker = function (today) {
        var dueYear = [];
        var dueMonth = [];
        var dueDays = [];
        for (var i = today.getFullYear(); i <= today.getFullYear() + 2; i++) {
            dueYear.push(i);
        }
        for (var i = 1; i <= 12; i++) {
            dueMonth.push(i);
        }
        for (var i = 1; i <= 31; i++) {
            dueDays.push(i);
        }
        this.setData({ years: dueYear, months: dueMonth, days: dueDays });
    };
    onBoard.prototype.setBirthYearPicker = function (today) {
        this.setData({ countPage: this.data.countPage + 1, todayYear: today.getFullYear() - 1 });
        var years = [];
        for (var i = 1919; i <= today.getFullYear() - 1; i++) {
            years.push(i);
        }
        this.setData({ birthYears: years });
    };
    onBoard.prototype.focusInput = function (event) {
        this.setData({ textInputClass: "section-input" });
    };
    onBoard.prototype.bindHeightInput = function (event) {
        this.focusInput(event);
        var heightInput = event.detail.value;
        if (heightInput >= 40 && heightInput <= 230 && heightInput != "") {
            this.setData({ height: heightInput, nextPage: true, empty: false });
        }
        else {
            this.setData({ nextPage: false, empty: false });
            if (heightInput == "") {
                this.setData({ textInputClass: "section" });
            }
        }
    };
    onBoard.prototype.bindWeightInput = function (event) {
        this.focusInput(event);
        var weightInput = event.detail.value;
        if (weightInput >= 30 && weightInput <= 300 && weightInput != "") {
            this.setData({
                weight: weightInput,
                nextPage: true,
                empty: false
            });
        }
        else {
            this.setData({
                nextPage: false,
                empty: false
            });
            if (weightInput == "") {
                this.setData({ textInputClass: "section" });
            }
        }
    };
    onBoard.prototype.bindAgeInput = function (event) {
        var val = event.detail.value;
        var birthYear = this.data.birthYears[val];
        var age = this.data.todayYear - birthYear;
        this.setData({ yearDisplay: "yearDisplay-input" });
        if (age >= 1 && age <= 100) {
            this.setData({
                birthYear: birthYear,
                nextPage: true,
                empty: false,
            });
        }
        else {
            this.setData({
                birthYear: birthYear,
                nextPage: false,
                empty: false
            });
        }
    };
    onBoard.prototype.nextSubmit = function () {
        if (this.data.dueDateCondition) {
            var moment = require('moment');
            var expectedBirthDate = moment([Number(this.data.year), Number(this.data.month) - 1, Number(this.data.date)]) / 1000;
            var today = moment() / 1000;
            if (today > expectedBirthDate) {
                this.setData({ empty: true });
                return;
            }
        }
        this.setData({
            textInputClass: "section",
            datePicker: "datePicker"
        });
        if (this.data.nextPage == true) {
            this.setData({
                countPage: this.data.countPage + 1,
                currentPage: this.data.currentPage + 1
            });
            this.onChange();
        }
        else {
            this.setData({ empty: true });
        }
        if (this.data.countPage == 11) {
            this.sendDatas();
        }
    };
    onBoard.prototype.bindDateChange = function (event) {
        var val = event.detail.value;
        this.setData({
            datePicker: "datePicker-input",
            year: this.data.years[val[0]],
            month: this.data.months[val[1]],
            date: this.data.days[val[2]],
            nextPage: true, empty: false
        });
    };
    onBoard.prototype.bindBeforePregWeightInput = function (event) {
        this.focusInput(event);
        var preWeightInput = event.detail.value;
        if (preWeightInput != null && preWeightInput != "") {
            this.setData({
                prePregWeight: preWeightInput,
                nextPage: true,
                empty: false
            });
        }
        else {
            this.setData({
                prePregWeight: 0,
                nextPage: false,
                empty: false
            });
            if (preWeightInput == "") {
                this.setData({ textInputClass: "section" });
            }
        }
    };
    onBoard.prototype.bindNumPregInput = function (event) {
        var numPreg = event.detail.value;
        if (numPreg == null) {
            this.setData({
                numPreg: 0,
                nextPage: true,
                empty: false
            });
        }
        else {
            this.setData({
                numPreg: Number(numPreg) + 1,
                nextPage: true,
                empty: false
            });
        }
    };
    onBoard.prototype.setGenderForms = function () {
        if (this.data.birthYear < 2003 && this.data.gender == 2) {
            this.setData({
                pregnantStageCondition: true,
                totalPage: 7,
            });
            this.setData({ countPage: this.data.countPage + 1 });
        }
        else {
            this.setData({
                pregnantStageCondition: false,
                countPage: this.data.countPage + 4,
                totalPage: 6,
            });
        }
    };
    onBoard.prototype.onChange = function () {
        if (this.data.countPage !== 4 && this.data.countPage !== 8) {
            this.setData({ nextPage: false });
        }
        if (this.data.countPage == 5) {
            this.setGenderForms();
        }
        this.handlePregnancyStageOptionsForms();
        this.handlePregnantFemaleForms();
    };
    onBoard.prototype.handlePregnantFemaleForms = function () {
        if (this.data.countPage == 7) {
            this.setData({ dueDateCondition: false, weightBeforePregnancy: true });
        }
        else if (this.data.countPage == 8) {
            this.setData({ dueDateCondition: false, weightBeforePregnancy: false, numberOfPregnancies: true });
        }
        else {
            this.setData({ weightBeforePregnancy: false, numberOfPregnancies: false });
        }
    };
    onBoard.prototype.handlePregnancyStageOptionsForms = function () {
        if (this.data.pregnancyStage == '怀孕期' && this.data.pregnantStageCondition == true && this.data.dueDateCondition == false) {
            this.setData({ dueDateCondition: true, countPage: this.data.countPage - 1, totalPage: 10 });
        }
        else if (this.data.pregnantStageCondition == true && (this.data.pregnancyStage == '备孕期' || this.data.pregnancyStage == '哺乳期' || this.data.pregnancyStage == '都不是')) {
            this.setData({
                pregnantStageCondition: false,
                dueDateCondition: false,
                countPage: this.data.countPage + 2,
                totalPage: 7
            });
        }
        else if (this.data.pregnancyStage == '怀孕期' && this.data.pregnantStageCondition == true && this.data.dueDateCondition == true) {
            this.setData({ countPage: this.data.countPage, pregnantStageCondition: false, dueDateCondition: false });
        }
    };
    onBoard.prototype.pregnancyStageEvent = function (event) {
        if (event.target.id == 1) {
            this.setData({ pregnancyStage: '备孕期', pregStageSelected: 1, totalPage: 7 });
        }
        else if (event.target.id == 2) {
            this.setData({ pregnancyStage: '怀孕期', pregStageSelected: 2, totalPage: 10 });
        }
        else if (event.target.id == 3) {
            this.setData({ pregnancyStage: '哺乳期', pregStageSelected: 3, totalPage: 7 });
        }
        else if (event.target.id == 0) {
            this.setData({ pregnancyStage: '都不是', pregStageSelected: 0, totalPage: 7 });
        }
        this.setData({ nextPage: true, empty: false });
    };
    onBoard.prototype.activityLevelEvent = function (event) {
        if (event.target.id == 1) {
            this.setData({ activityLevel: '卧床休息', activitySelected: 1 });
        }
        else if (event.target.id == 2) {
            this.setData({ activityLevel: '轻度，静坐少动', activitySelected: 2 });
        }
        else if (event.target.id == 3) {
            this.setData({ activityLevel: '中度，常常走动', activitySelected: 3 });
        }
        else if (event.target.id == 4) {
            this.setData({ activityLevel: '重度，负重', activitySelected: 4 });
        }
        else if (event.target.id == 5) {
            this.setData({ activityLevel: '剧烈，超负重', activitySelected: 5 });
        }
        this.setData({ nextPage: true, empty: false });
    };
    onBoard.prototype.medicalCondition = function (event) {
        if (event.target.id == 1) {
            this.setData({ medical: '糖尿病', medicalselected: 1 });
        }
        else if (event.target.id == 2) {
            this.setData({ medical: '甲状腺功能亢进症', medicalselected: 2 });
        }
        else if (event.target.id == 0) {
            this.setData({ medical: '无', medicalselected: 0 });
        }
        this.setData({ finalPage: true, nextPage: true, empty: false });
    };
    onBoard.prototype.getRDIGoal = function () {
        var _this = this;
        webAPI.SetAuthToken(wx.getStorageSync(globalEnum.globalKey_token));
        webAPI.RetrieveUserRDA({}).then(function (resp) {
            _this.rdaUrl = resp.rda_url;
        }).catch(function (err) { return console.log(err); });
        webAPI.RetrieveRecommendedDailyAllowance({}).then(function (resp) {
            wx.hideLoading({});
            var energy = resp.energy;
            _this.setData({
                rdiValue: Math.floor(energy / 100)
            });
        }).catch(function (err) { return console.log(err); });
    };
    onBoard.prototype.redirectToRDAPage = function () {
        if (this.rdaUrl !== "") {
            wx.navigateTo({
                url: '/pages/rdiPage/rdiPage?url=' + this.rdaUrl,
            });
        }
    };
    onBoard.prototype.sendDatas = function () {
        var token = wx.getStorageSync(globalEnum.globalKey_token);
        console.log(token);
        webAPI.SetAuthToken(token);
        var that = this;
        var gender = Number(that.data.gender);
        var birthYear = Number(that.data.birthYear);
        var height = Number(that.data.height);
        var weight = Number(that.data.weight);
        var weightBeforePreg = Number(that.data.prePregWeight);
        var activitySelected = Number(that.data.activitySelected);
        var pregStageSelected = Number(that.data.pregStageSelected);
        var medicalCondition = Number(that.data.medicalselected);
        if (pregStageSelected < 0 || pregStageSelected > 3) {
            pregStageSelected = 0;
        }
        var preg_birth_date = this.data.year + "-" + this.data.month + "-" + this.data.date;
        wx.getSetting({
            success: function (res) {
                if (res.authSetting['scope.userInfo']) {
                    wx.getUserInfo({
                        success: function (res) {
                            var userInfo = res.userInfo;
                            var nickName = userInfo.nickName;
                            var avatarUrl = userInfo.avatarUrl;
                            var moment = require('moment');
                            var updateUserProfileReq = {
                                gender: gender,
                                year_of_birth: birthYear,
                                height: height,
                                weight: weight,
                                weight_before_pregnancy: weightBeforePreg,
                                activity_level: activitySelected,
                                pregnancy_stage: pregStageSelected,
                                expected_birth_date: moment([Number(that.data.year), Number(that.data.month) - 1, Number(that.data.date)]) / 1000,
                                nickname: nickName,
                                avatar_url: avatarUrl,
                                times_of_pregnancy: that.data.numPreg
                            };
                            wx.showLoading({ title: "加载中..." });
                            console.log(updateUserProfileReq);
                            webAPI.UpdateUserProfile(updateUserProfileReq).then(function (resp) {
                                that.getRDIGoal();
                            }).catch(function (err) {
                                console.log(err);
                                wx.hideLoading({});
                                wx.showModal({
                                    title: '',
                                    content: '更新用户信息失败',
                                    showCancel: false
                                });
                            });
                            webAPI.UpdateUserProfile(updateUserProfileReq);
                            var updateMedicalProfileReq = {
                                food_allergy_ids: [],
                                medical_condition_ids: [medicalCondition],
                            };
                            if (medicalCondition != 0) {
                                webAPI.UpdateMedicalProfile(updateMedicalProfileReq);
                            }
                        }
                    });
                }
                else {
                    wx.navigateTo({
                        url: '../invitation/invitation?user_status=2'
                    });
                }
            }
        });
        wx.reportAnalytics('onboard_last_step', {
            counts: 'counts',
        });
    };
    onBoard.prototype.confirmSubmit = function () {
        wx.reLaunch({
            url: "../../pages/home/index",
        });
    };
    return onBoard;
}());
Page(new onBoard());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoib25Cb2FyZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIm9uQm9hcmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFJQSxJQUFNLEdBQUcsR0FBRyxNQUFNLEVBQVUsQ0FBQTtBQUM1QixpREFBbUQ7QUFFbkQsaURBQWtEO0FBR2xEO0lBQUE7UUFFUyxTQUFJLEdBQUc7WUFDWixXQUFXLEVBQUUsYUFBYTtZQUMxQixVQUFVLEVBQUUsWUFBWTtZQUN4QixjQUFjLEVBQUUsU0FBUztZQUN6QixzQkFBc0IsRUFBRSxJQUFJO1lBQzVCLGdCQUFnQixFQUFFLEtBQUs7WUFDdkIscUJBQXFCLEVBQUUsS0FBSztZQUM1QixtQkFBbUIsRUFBRSxLQUFLO1lBQzFCLFNBQVMsRUFBRSxDQUFDO1lBQ1osU0FBUyxFQUFFLEtBQUs7WUFDaEIsUUFBUSxFQUFFLEtBQUs7WUFDZixLQUFLLEVBQUUsS0FBSztZQUNaLE1BQU0sRUFBRSxDQUFDO1lBQ1QsTUFBTSxFQUFFLENBQUM7WUFDVCxNQUFNLEVBQUUsQ0FBQztZQUNULGNBQWMsRUFBRSxFQUFFO1lBQ2xCLGlCQUFpQixFQUFFLENBQUM7WUFDcEIsYUFBYSxFQUFFLENBQUM7WUFDaEIsT0FBTyxFQUFFLENBQUM7WUFDVixTQUFTLEVBQUUsQ0FBQztZQUNaLElBQUksRUFBRSxNQUFNO1lBQ1osS0FBSyxFQUFFLElBQUk7WUFDWCxJQUFJLEVBQUUsR0FBRztZQUNULEtBQUssRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNWLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNYLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQztZQUNULGFBQWEsRUFBRSxFQUFFO1lBQ2pCLGdCQUFnQixFQUFFLENBQUM7WUFDbkIsT0FBTyxFQUFFLEVBQUU7WUFDWCxlQUFlLEVBQUUsQ0FBQztZQUNsQixhQUFhLEVBQUUsU0FBUztZQUN4QixlQUFlLEVBQUUsU0FBUztZQUMxQixjQUFjLEVBQUUscUJBQXFCO1lBQ3JDLGNBQWMsRUFB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QUNMLEVBQUUsQ0FBQyxVQUFVLENBQUM7d0JBQ1osR0FBRyxFQUFFLHdDQUF3QztxQkFDOUMsQ0FBQyxDQUFBO2lCQUNIO1lBQ0gsQ0FBQztTQUNGLENBQUMsQ0FBQTtRQUdGLEVBQUUsQ0FBQyxlQUFlLENBQUMsbUJBQW1CLEVBQUU7WUFDdEMsTUFBTSxFQUFFLFFBQVE7U0FDakIsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVNLCtCQUFhLEdBQXBCO1FBQ0UsRUFBRSxDQUFDLFFBQVEsQ0FBQztZQUNWLEdBQUcsRUFBRSx3QkFBd0I7U0FDOUIsQ0FBQyxDQUFBO0lBQ0osQ0FBQztJQUNILGNBQUM7QUFBRCxDQUFDLEFBMWdCRCxJQTBnQkM7QUFFRCxJQUFJLENBQUMsSUFBSSxPQUFPLEVBQUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiXG5pbXBvcnQgeyBJTXlBcHAgfSBmcm9tICcuLi8uLi9hcHAnXG5pbXBvcnQgeyBlcG9jaCB9IGZyb20gJy4uLy4uL3V0aWxzL3V0aWwnXG5cbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KClcbmltcG9ydCAqIGFzIHdlYkFQSSBmcm9tICcuLi8uLi9hcGkvYXBwL0FwcFNlcnZpY2UnO1xuaW1wb3J0IHsgTWluaVByb2dyYW1Mb2dpbiB9IGZyb20gJy4uLy4uL2FwaS9sb2dpbi9Mb2dpblNlcnZpY2UnO1xuaW1wb3J0ICogYXMgZ2xvYmFsRW51bSBmcm9tICcuLi8uLi9hcGkvR2xvYmFsRW51bSdcbmltcG9ydCB7IFVwZGF0ZVVzZXJQcm9maWxlUmVxLCBVcGRhdGVNZWRpY2FsUHJvZmlsZSB9IGZyb20gJy4uLy4uL2FwaS9hcHAvQXBwU2VydmljZU9ianMnO1xuXG5jbGFzcyBvbkJvYXJkIHtcblxuICBwdWJsaWMgZGF0YSA9IHtcbiAgICB5ZWFyRGlzcGxheTogXCJ5ZWFyRGlzcGxheVwiLFxuICAgIGRhdGVQaWNrZXI6IFwiZGF0ZVBpY2tlclwiLFxuICAgIHRleHRJbnB1dENsYXNzOiBcInNlY3Rpb25cIixcbiAgICBwcmVnbmFudFN0YWdlQ29uZGl0aW9uOiB0cnVlLFxuICAgIGR1ZURhdGVDb25kaXRpb246IGZhbHNlLFxuICAgIHdlaWdodEJlZm9yZVByZWduYW5jeTogZmFsc2UsXG4gICAgbnVtYmVyT2ZQcmVnbmFuY2llczogZmFsc2UsXG4gICAgY291bnRQYWdlOiAwLFxuICAgIGZpbmFsUGFnZTogZmFsc2UsXG4gICAgbmV4dFBhZ2U6IGZhbHNlLFxuICAgIGVtcHR5OiBmYWxzZSxcbiAgICBnZW5kZXI6IDAsXG4gICAgaGVpZ2h0OiAwLFxuICAgIHdlaWdodDogMCxcbiAgICBwcmVnbmFuY3lTdGFnZTogJycsXG4gICAgcHJlZ1N0YWdlU2VsZWN0ZWQ6IDQsXG4gICAgcHJlUHJlZ1dlaWdodDogMCxcbiAgICBudW1QcmVnOiAxLFxuICAgIHRvZGF5WWVhcjogMCxcbiAgICB5ZWFyOiAnMjAxOScsXG4gICAgbW9udGg6ICcxMCcsXG4gICAgZGF0ZTogJzEnLFxuICAgIHllYXJzOiBbMF0sXG4gICAgbW9udGhzOiBbOV0sXG4gICAgZGF5czogWzBdLFxuICAgIGFjdGl2aXR5TGV2ZWw6ICcnLFxuICAgIGFjdGl2aXR5U2VsZWN0ZWQ6IDAsXG4gICAgbWVkaWNhbDogJycsXG4gICAgbWVkaWNhbHNlbGVjdGVkOiA1LFxuICAgIGlucHV0VmFsaWRhdGU6ICfor7fovpPlhaXkvaDnmoTnrZTmoYgnLFxuICAgIG9wdGlvbnNWYWxpZGF0ZTogJ+ivt+mAieaLqeS9oOeahOetlOahiCcsXG4gICAgaGVpZ2h0VmFsaWRhdGU6ICfor7flnKg0MC0yMzDljpjnsbPojIPlm7TlhoXovpPlhaXmgqjnmoTouqvpq5gnLFxuICAgIHdlaWdodFZhbGlkYXRlOiAn6K+35ZyoMzAtMzAw5Y2D5YWL6IyD5Zu05YaF6L6T5YWl5oKo55qE5L2T6YeNJyxcbiAgICBleHBlY3RlZERhdGVWYWxpZGF0ZTogJ+ivt+WcqOS7iuWkqeWIsOacquadpTQ15ZGo55qE5pel5pyf5YaF6YCJ5oup5oKo55qE6aKE5Lqn5pyfJyxcbiAgICBhZ2VWYWxpZGF0ZTogJ+ivt+ehruS/neaCqOeahOW5tOm+hOWcqDEtMTAw5bKB6IyD5Zu05YaFJyxcbiAgICByZGlHb2FsOiAyMDAwLFxuICAgIGJpcnRoVmFsOiBbNzJdLFxuICAgIHByZWduYW5jeU51bVZhbDogWzBdLFxuICAgIGJpcnRoWWVhcnM6IFtdLFxuICAgIGJpcnRoWWVhcjogMTk5MSxcbiAgICBudW1QcmVnT3B0aW9uczogWzEsIDIsIDMsIDQsIDUsIDYsIDcsIDgsIDksIDEwXSxcbiAgICB0b3RhbFBhZ2U6IDcsXG4gICAgY3VycmVudFBhZ2U6IDEsXG4gICAgbmlja05hbWU6IFwiXCIsXG4gICAgYXZhdGFyVXJsOiBcIlwiLFxuICAgIHJkaVZhbHVlOiBcIiBcIlxuICB9XG5cbiAgcHVibGljIHJkYVVybCA9IFwiXCI7XG5cblxuICBwdWJsaWMgZ2VuZGVyRXZlbnQoZXZlbnQ6IGFueSkge1xuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICBuZXh0UGFnZTogdHJ1ZSxcbiAgICAgIGVtcHR5OiBmYWxzZSxcbiAgICB9KTtcblxuICAgIGlmIChldmVudC50YXJnZXQuaWQgPT0gXCLnlLdcIikge1xuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgdG90YWxQYWdlOiA2LFxuICAgICAgICBnZW5kZXI6IDFcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgICB0b3RhbFBhZ2U6IDcsXG4gICAgICAgIGdlbmRlcjogMixcbiAgICAgIH0pO1xuICAgIH1cblxuICB9XG5cbiAgcHVibGljIG9uTG9hZCgpOiB2b2lkIHtcbiAgICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xuICAgICAgdGl0bGU6IFwi5Z+65pys5L+h5oGvXCJcbiAgICB9KTtcblxuICAgIGxldCB0b2RheSA9IG5ldyBEYXRlKCk7XG5cbiAgICB0aGlzLnNldEJpcnRoWWVhclBpY2tlcih0b2RheSk7XG4gICAgdGhpcy5zZXREdWVEYXRlUGlja2VyKHRvZGF5KTtcbiAgfVxuXG4gIC8vIFNldCB0aGUgcGlja2VyIG9wdGlvbnMgZm9yIHByZWduYW5jeSBkdWUgZGF0ZVxuICBwdWJsaWMgc2V0RHVlRGF0ZVBpY2tlcih0b2RheTogYW55KTogdm9pZCB7XG4gICAgbGV0IGR1ZVllYXIgPSBbXTtcbiAgICBsZXQgZHVlTW9udGggPSBbXTtcbiAgICBsZXQgZHVlRGF5cyA9IFtdO1xuXG4gICAgZm9yIChsZXQgaSA9IHRvZGF5LmdldEZ1bGxZZWFyKCk7IGkgPD0gdG9kYXkuZ2V0RnVsbFllYXIoKSArIDI7IGkrKykge1xuICAgICAgZHVlWWVhci5wdXNoKGkpXG4gICAgfVxuXG4gICAgZm9yIChsZXQgaSA9IDE7IGkgPD0gMTI7IGkrKykge1xuICAgICAgZHVlTW9udGgucHVzaChpKVxuICAgIH1cblxuICAgIGZvciAobGV0IGkgPSAxOyBpIDw9IDMxOyBpKyspIHtcbiAgICAgIGR1ZURheXMucHVzaChpKVxuICAgIH1cblxuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IHllYXJzOiBkdWVZZWFyLCBtb250aHM6IGR1ZU1vbnRoLCBkYXlzOiBkdWVEYXlzIH0pO1xuICB9XG5cbiAgLy8gU2V0IHRoZSBwaWNrZXIgb3B0aW9ucyBmb3IgYmlydGggeWVhclxuICBwdWJsaWMgc2V0QmlydGhZZWFyUGlja2VyKHRvZGF5OiBhbnkpOiB2b2lkIHtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyBjb3VudFBhZ2U6IHRoaXMuZGF0YS5jb3VudFBhZ2UgKyAxLCB0b2RheVllYXI6IHRvZGF5LmdldEZ1bGxZZWFyKCkgLSAxIH0pO1xuXG4gICAgbGV0IHllYXJzID0gW107XG5cbiAgICBmb3IgKGxldCBpID0gMTkxOTsgaSA8PSB0b2RheS5nZXRGdWxsWWVhcigpIC0gMTsgaSsrKSB7XG4gICAgICB5ZWFycy5wdXNoKGkpO1xuICAgIH1cblxuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IGJpcnRoWWVhcnM6IHllYXJzIH0pO1xuICB9XG5cbiAgLy8gTWV0aG9kIHRvIGhhbmRsZSBzdHlsaW5nIG9mIFdlQ2hhdCBpbnB1dFxuICBwdWJsaWMgZm9jdXNJbnB1dChldmVudDogYW55KTogdm9pZCB7XG4gICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHsgdGV4dElucHV0Q2xhc3M6IFwic2VjdGlvbi1pbnB1dFwiIH0pO1xuICB9XG5cbiAgLy8gSGFuZGxlIHRoZSBoZWlnaHQgaW5wdXQgZXZlbnRcbiAgcHVibGljIGJpbmRIZWlnaHRJbnB1dChldmVudDogYW55KTogdm9pZCB7XG4gICAgdGhpcy5mb2N1c0lucHV0KGV2ZW50KTtcblxuICAgIGxldCBoZWlnaHRJbnB1dCA9IGV2ZW50LmRldGFpbC52YWx1ZTtcblxuICAgIGlmIChoZWlnaHRJbnB1dCA+PSA0MCAmJiBoZWlnaHRJbnB1dCA8PSAyMzAgJiYgaGVpZ2h0SW5wdXQgIT0gXCJcIikge1xuXG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyBoZWlnaHQ6IGhlaWdodElucHV0LCBuZXh0UGFnZTogdHJ1ZSwgZW1wdHk6IGZhbHNlIH0pO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHsgbmV4dFBhZ2U6IGZhbHNlLCBlbXB0eTogZmFsc2UgfSk7XG5cbiAgICAgIGlmIChoZWlnaHRJbnB1dCA9PSBcIlwiKSB7XG4gICAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IHRleHRJbnB1dENsYXNzOiBcInNlY3Rpb25cIiB9KTtcbiAgICAgIH1cblxuICAgIH1cbiAgfVxuXG4gIC8vIEhhbmRsZSB0aGUgd2VpZ2h0IGlucHV0IGV2ZW50XG4gIHB1YmxpYyBiaW5kV2VpZ2h0SW5wdXQoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgIHRoaXMuZm9jdXNJbnB1dChldmVudCk7XG5cbiAgICBsZXQgd2VpZ2h0SW5wdXQgPSBldmVudC5kZXRhaWwudmFsdWU7XG5cbiAgICBpZiAod2VpZ2h0SW5wdXQgPj0gMzAgJiYgd2VpZ2h0SW5wdXQgPD0gMzAwICYmIHdlaWdodElucHV0ICE9IFwiXCIpIHtcblxuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgd2VpZ2h0OiB3ZWlnaHRJbnB1dCxcbiAgICAgICAgbmV4dFBhZ2U6IHRydWUsXG4gICAgICAgIGVtcHR5OiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgICBuZXh0UGFnZTogZmFsc2UsXG4gICAgICAgIGVtcHR5OiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICAgIGlmICh3ZWlnaHRJbnB1dCA9PSBcIlwiKSB7XG5cbiAgICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHsgdGV4dElucHV0Q2xhc3M6IFwic2VjdGlvblwiIH0pO1xuXG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLy8gSGFuZGxlIHRoZSBhZ2UgaW5wdXQgZXZlbnRcbiAgcHVibGljIGJpbmRBZ2VJbnB1dChldmVudDogYW55KTogdm9pZCB7XG4gICAgbGV0IHZhbCA9IGV2ZW50LmRldGFpbC52YWx1ZTtcblxuICAgIGxldCBiaXJ0aFllYXIgPSB0aGlzLmRhdGEuYmlydGhZZWFyc1t2YWxdO1xuXG4gICAgbGV0IGFnZSA9IHRoaXMuZGF0YS50b2RheVllYXIgLSBiaXJ0aFllYXI7XG5cbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyB5ZWFyRGlzcGxheTogXCJ5ZWFyRGlzcGxheS1pbnB1dFwiIH0pO1xuXG4gICAgaWYgKGFnZSA+PSAxICYmIGFnZSA8PSAxMDApIHtcblxuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgYmlydGhZZWFyOiBiaXJ0aFllYXIsXG4gICAgICAgIG5leHRQYWdlOiB0cnVlLFxuICAgICAgICBlbXB0eTogZmFsc2UsXG4gICAgICB9KTtcblxuICAgIH0gZWxzZSB7XG5cbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICAgIGJpcnRoWWVhcjogYmlydGhZZWFyLFxuICAgICAgICBuZXh0UGFnZTogZmFsc2UsXG4gICAgICAgIGVtcHR5OiBmYWxzZVxuICAgICAgfSk7XG4gICAgfVxuXG4gIH1cblxuICBwdWJsaWMgbmV4dFN1Ym1pdCgpIHtcbiAgICBpZiAodGhpcy5kYXRhLmR1ZURhdGVDb25kaXRpb24pIHtcbiAgICAgIC8vY2hlY2sgdGhlIGV4cGVjdGVkIGJpcnRoIGRhdGUgaGVyZVxuICAgICAgbGV0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuICAgICAgbGV0IGV4cGVjdGVkQmlydGhEYXRlID0gbW9tZW50KFtOdW1iZXIodGhpcy5kYXRhLnllYXIpLCBOdW1iZXIodGhpcy5kYXRhLm1vbnRoKSAtIDEsIE51bWJlcih0aGlzLmRhdGEuZGF0ZSldKSAvIDEwMDA7XG4gICAgICBsZXQgdG9kYXkgPSBtb21lbnQoKSAvIDEwMDA7XG4gICAgICBpZiAodG9kYXkgPiBleHBlY3RlZEJpcnRoRGF0ZSkge1xuICAgICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyBlbXB0eTogdHJ1ZSB9KTtcbiAgICAgICAgcmV0dXJuO1xuICAgICAgfVxuICAgIH1cbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgdGV4dElucHV0Q2xhc3M6IFwic2VjdGlvblwiLFxuICAgICAgZGF0ZVBpY2tlcjogXCJkYXRlUGlja2VyXCJcbiAgICB9KTtcbiAgICBpZiAodGhpcy5kYXRhLm5leHRQYWdlID09IHRydWUpIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICAgIGNvdW50UGFnZTogdGhpcy5kYXRhLmNvdW50UGFnZSArIDEsXG4gICAgICAgIGN1cnJlbnRQYWdlOiB0aGlzLmRhdGEuY3VycmVudFBhZ2UgKyAxXG4gICAgICB9KTtcbiAgICAgIHRoaXMub25DaGFuZ2UoKTtcbiAgICB9IGVsc2Uge1xuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHsgZW1wdHk6IHRydWUgfSk7XG4gICAgfVxuICAgIC8vICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IG5leHRQYWdlOiBmYWxzZSB9KTtcblxuICAgIGlmICh0aGlzLmRhdGEuY291bnRQYWdlID09IDExKSB7XG4gICAgICB0aGlzLnNlbmREYXRhcygpO1xuICAgIH1cbiAgfVxuXG4gIC8vIEhhbmRsZXMgdGhlIHByZWduYW5jeSBkdWUgZGF0ZSBwaWNrZXIgZXZlbnRcbiAgcHVibGljIGJpbmREYXRlQ2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICBsZXQgdmFsID0gZXZlbnQuZGV0YWlsLnZhbHVlO1xuXG4gICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgIGRhdGVQaWNrZXI6IFwiZGF0ZVBpY2tlci1pbnB1dFwiLFxuICAgICAgeWVhcjogdGhpcy5kYXRhLnllYXJzW3ZhbFswXV0sXG4gICAgICBtb250aDogdGhpcy5kYXRhLm1vbnRoc1t2YWxbMV1dLFxuICAgICAgZGF0ZTogdGhpcy5kYXRhLmRheXNbdmFsWzJdXSxcbiAgICAgIG5leHRQYWdlOiB0cnVlLCBlbXB0eTogZmFsc2VcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kQmVmb3JlUHJlZ1dlaWdodElucHV0KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICB0aGlzLmZvY3VzSW5wdXQoZXZlbnQpO1xuXG4gICAgbGV0IHByZVdlaWdodElucHV0ID0gZXZlbnQuZGV0YWlsLnZhbHVlO1xuXG4gICAgaWYgKHByZVdlaWdodElucHV0ICE9IG51bGwgJiYgcHJlV2VpZ2h0SW5wdXQgIT0gXCJcIikge1xuXG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgICBwcmVQcmVnV2VpZ2h0OiBwcmVXZWlnaHRJbnB1dCxcbiAgICAgICAgbmV4dFBhZ2U6IHRydWUsXG4gICAgICAgIGVtcHR5OiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgICBwcmVQcmVnV2VpZ2h0OiAwLFxuICAgICAgICBuZXh0UGFnZTogZmFsc2UsXG4gICAgICAgIGVtcHR5OiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICAgIGlmIChwcmVXZWlnaHRJbnB1dCA9PSBcIlwiKSB7XG4gICAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IHRleHRJbnB1dENsYXNzOiBcInNlY3Rpb25cIiB9KTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBwdWJsaWMgYmluZE51bVByZWdJbnB1dChldmVudDogYW55KTogdm9pZCB7XG5cbiAgICBsZXQgbnVtUHJlZyA9IGV2ZW50LmRldGFpbC52YWx1ZTtcblxuICAgIGlmIChudW1QcmVnID09IG51bGwpIHtcblxuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgbnVtUHJlZzogMCxcbiAgICAgICAgbmV4dFBhZ2U6IHRydWUsXG4gICAgICAgIGVtcHR5OiBmYWxzZVxuICAgICAgfSk7XG5cbiAgICB9IGVsc2Uge1xuXG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgICBudW1QcmVnOiBOdW1iZXIobnVtUHJlZykgKyAxLFxuICAgICAgICBuZXh0UGFnZTogdHJ1ZSxcbiAgICAgICAgZW1wdHk6IGZhbHNlXG4gICAgICB9KTtcblxuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBzZXRHZW5kZXJGb3JtcygpIHtcbiAgICBpZiAodGhpcy5kYXRhLmJpcnRoWWVhciA8IDIwMDMgJiYgdGhpcy5kYXRhLmdlbmRlciA9PSAyKSB7XG5cbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICAgIHByZWduYW50U3RhZ2VDb25kaXRpb246IHRydWUsXG4gICAgICAgIHRvdGFsUGFnZTogNyxcbiAgICAgIH0pO1xuXG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyBjb3VudFBhZ2U6IHRoaXMuZGF0YS5jb3VudFBhZ2UgKyAxIH0pO1xuXG4gICAgfSBlbHNlIHtcblxuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgcHJlZ25hbnRTdGFnZUNvbmRpdGlvbjogZmFsc2UsXG4gICAgICAgIGNvdW50UGFnZTogdGhpcy5kYXRhLmNvdW50UGFnZSArIDQsXG4gICAgICAgIHRvdGFsUGFnZTogNixcbiAgICAgIH0pO1xuXG4gICAgfVxuICB9XG5cbiAgcHVibGljIG9uQ2hhbmdlKCkge1xuICAgIC8vIEhhbmRsZXMgbmV4dCBwYWdlIHZhbGlkYXRpb25cbiAgICBpZiAodGhpcy5kYXRhLmNvdW50UGFnZSAhPT0gNCAmJiB0aGlzLmRhdGEuY291bnRQYWdlICE9PSA4KSB7XG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyBuZXh0UGFnZTogZmFsc2UgfSk7XG4gICAgfVxuXG4gICAgLy8gSGFuZGxlcyBkaWZmZXJlbnQgZm9ybXMgZmxvdyBmb3IgZGlmZmVyZW50IGdlbmRlclxuICAgIGlmICh0aGlzLmRhdGEuY291bnRQYWdlID09IDUpIHtcbiAgICAgIHRoaXMuc2V0R2VuZGVyRm9ybXMoKTtcbiAgICB9XG5cbiAgICAvLyBEaXNwbGF5IGNvcnJlc3BvbmRpbmcgZm9ybXMgYWNjb3JkaW5nIHRvIHNlbGVjdGVkIHByZWduYW5jeSBzdGFnZSBvcHRpb25cbiAgICB0aGlzLmhhbmRsZVByZWduYW5jeVN0YWdlT3B0aW9uc0Zvcm1zKCk7XG5cbiAgICAvLyBEaXNwbGF5IGNvcnJlc3BvbmRpbmcgZm9ybXMgaWYgZmVtYWxlIHVzZXIgaXMgcHJlZ25hbnRcbiAgICB0aGlzLmhhbmRsZVByZWduYW50RmVtYWxlRm9ybXMoKTtcbiAgfVxuXG4gIHB1YmxpYyBoYW5kbGVQcmVnbmFudEZlbWFsZUZvcm1zKCkge1xuICAgIGlmICh0aGlzLmRhdGEuY291bnRQYWdlID09IDcpIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IGR1ZURhdGVDb25kaXRpb246IGZhbHNlLCB3ZWlnaHRCZWZvcmVQcmVnbmFuY3k6IHRydWUgfSk7XG4gICAgfSBlbHNlIGlmICh0aGlzLmRhdGEuY291bnRQYWdlID09IDgpIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IGR1ZURhdGVDb25kaXRpb246IGZhbHNlLCB3ZWlnaHRCZWZvcmVQcmVnbmFuY3k6IGZhbHNlLCBudW1iZXJPZlByZWduYW5jaWVzOiB0cnVlIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyB3ZWlnaHRCZWZvcmVQcmVnbmFuY3k6IGZhbHNlLCBudW1iZXJPZlByZWduYW5jaWVzOiBmYWxzZSB9KTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgaGFuZGxlUHJlZ25hbmN5U3RhZ2VPcHRpb25zRm9ybXMoKSB7XG4gICAgaWYgKHRoaXMuZGF0YS5wcmVnbmFuY3lTdGFnZSA9PSAn5oCA5a2V5pyfJyAmJiB0aGlzLmRhdGEucHJlZ25hbnRTdGFnZUNvbmRpdGlvbiA9PSB0cnVlICYmIHRoaXMuZGF0YS5kdWVEYXRlQ29uZGl0aW9uID09IGZhbHNlKSB7XG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyBkdWVEYXRlQ29uZGl0aW9uOiB0cnVlLCBjb3VudFBhZ2U6IHRoaXMuZGF0YS5jb3VudFBhZ2UgLSAxLCB0b3RhbFBhZ2U6IDEwIH0pO1xuXG4gICAgfSBlbHNlIGlmICh0aGlzLmRhdGEucHJlZ25hbnRTdGFnZUNvbmRpdGlvbiA9PSB0cnVlICYmICh0aGlzLmRhdGEucHJlZ25hbmN5U3RhZ2UgPT0gJ+Wkh+WtleacnycgfHwgdGhpcy5kYXRhLnByZWduYW5jeVN0YWdlID09ICflk7rkubPmnJ8nIHx8IHRoaXMuZGF0YS5wcmVnbmFuY3lTdGFnZSA9PSAn6YO95LiN5pivJykpIHtcblxuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgcHJlZ25hbnRTdGFnZUNvbmRpdGlvbjogZmFsc2UsXG4gICAgICAgIGR1ZURhdGVDb25kaXRpb246IGZhbHNlLFxuICAgICAgICBjb3VudFBhZ2U6IHRoaXMuZGF0YS5jb3VudFBhZ2UgKyAyLFxuICAgICAgICB0b3RhbFBhZ2U6IDdcbiAgICAgIH0pO1xuXG4gICAgfSBlbHNlIGlmICh0aGlzLmRhdGEucHJlZ25hbmN5U3RhZ2UgPT0gJ+aAgOWtleacnycgJiYgdGhpcy5kYXRhLnByZWduYW50U3RhZ2VDb25kaXRpb24gPT0gdHJ1ZSAmJiB0aGlzLmRhdGEuZHVlRGF0ZUNvbmRpdGlvbiA9PSB0cnVlKSB7XG5cbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IGNvdW50UGFnZTogdGhpcy5kYXRhLmNvdW50UGFnZSwgcHJlZ25hbnRTdGFnZUNvbmRpdGlvbjogZmFsc2UsIGR1ZURhdGVDb25kaXRpb246IGZhbHNlIH0pO1xuXG4gICAgfVxuICB9XG5cbiAgcHVibGljIHByZWduYW5jeVN0YWdlRXZlbnQoZXZlbnQ6IGFueSkge1xuICAgIGlmIChldmVudC50YXJnZXQuaWQgPT0gMSkge1xuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHsgcHJlZ25hbmN5U3RhZ2U6ICflpIflrZXmnJ8nLCBwcmVnU3RhZ2VTZWxlY3RlZDogMSwgdG90YWxQYWdlOiA3IH0pO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0LmlkID09IDIpIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IHByZWduYW5jeVN0YWdlOiAn5oCA5a2V5pyfJywgcHJlZ1N0YWdlU2VsZWN0ZWQ6IDIsIHRvdGFsUGFnZTogMTAgfSk7XG4gICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQuaWQgPT0gMykge1xuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHsgcHJlZ25hbmN5U3RhZ2U6ICflk7rkubPmnJ8nLCBwcmVnU3RhZ2VTZWxlY3RlZDogMywgdG90YWxQYWdlOiA3IH0pO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0LmlkID09IDApIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IHByZWduYW5jeVN0YWdlOiAn6YO95LiN5pivJywgcHJlZ1N0YWdlU2VsZWN0ZWQ6IDAsIHRvdGFsUGFnZTogNyB9KTtcbiAgICB9XG5cbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyBuZXh0UGFnZTogdHJ1ZSwgZW1wdHk6IGZhbHNlIH0pO1xuICB9XG5cbiAgcHVibGljIGFjdGl2aXR5TGV2ZWxFdmVudChldmVudDogYW55KSB7XG5cbiAgICBpZiAoZXZlbnQudGFyZ2V0LmlkID09IDEpIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IGFjdGl2aXR5TGV2ZWw6ICfljafluorkvJHmga8nLCBhY3Rpdml0eVNlbGVjdGVkOiAxIH0pO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0LmlkID09IDIpIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IGFjdGl2aXR5TGV2ZWw6ICfovbvluqbvvIzpnZnlnZDlsJHliqgnLCBhY3Rpdml0eVNlbGVjdGVkOiAyIH0pO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0LmlkID09IDMpIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IGFjdGl2aXR5TGV2ZWw6ICfkuK3luqbvvIzluLjluLjotbDliqgnLCBhY3Rpdml0eVNlbGVjdGVkOiAzIH0pO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0LmlkID09IDQpIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IGFjdGl2aXR5TGV2ZWw6ICfph43luqbvvIzotJ/ph40nLCBhY3Rpdml0eVNlbGVjdGVkOiA0IH0pO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0LmlkID09IDUpIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IGFjdGl2aXR5TGV2ZWw6ICfliafng4jvvIzotoXotJ/ph40nLCBhY3Rpdml0eVNlbGVjdGVkOiA1IH0pO1xuICAgIH1cblxuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IG5leHRQYWdlOiB0cnVlLCBlbXB0eTogZmFsc2UgfSk7XG4gIH1cblxuICBwdWJsaWMgbWVkaWNhbENvbmRpdGlvbihldmVudDogYW55KSB7XG4gICAgaWYgKGV2ZW50LnRhcmdldC5pZCA9PSAxKSB7XG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyBtZWRpY2FsOiAn57OW5bC/55eFJywgbWVkaWNhbHNlbGVjdGVkOiAxIH0pO1xuICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0LmlkID09IDIpIHtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7IG1lZGljYWw6ICfnlLLnirbohbrlip/og73kuqLov5vnl4cnLCBtZWRpY2Fsc2VsZWN0ZWQ6IDIgfSk7XG4gICAgfSBlbHNlIGlmIChldmVudC50YXJnZXQuaWQgPT0gMCkge1xuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHsgbWVkaWNhbDogJ+aXoCcsIG1lZGljYWxzZWxlY3RlZDogMCB9KTtcbiAgICB9XG5cbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyBmaW5hbFBhZ2U6IHRydWUsIG5leHRQYWdlOiB0cnVlLCBlbXB0eTogZmFsc2UgfSk7XG5cbiAgfVxuXG4gIHB1YmxpYyBnZXRSRElHb2FsKCk6IHZvaWQge1xuICAgIHdlYkFQSS5TZXRBdXRoVG9rZW4od3guZ2V0U3RvcmFnZVN5bmMoZ2xvYmFsRW51bS5nbG9iYWxLZXlfdG9rZW4pKTtcbiAgICB3ZWJBUEkuUmV0cmlldmVVc2VyUkRBKHt9KS50aGVuKHJlc3AgPT4ge1xuICAgICAgdGhpcy5yZGFVcmwgPSByZXNwLnJkYV91cmw7XG4gICAgfSkuY2F0Y2goZXJyID0+IGNvbnNvbGUubG9nKGVycikpO1xuICAgIHdlYkFQSS5SZXRyaWV2ZVJlY29tbWVuZGVkRGFpbHlBbGxvd2FuY2Uoe30pLnRoZW4ocmVzcCA9PiB7XG4gICAgICB3eC5oaWRlTG9hZGluZyh7fSk7XG4gICAgICBsZXQgZW5lcmd5ID0gcmVzcC5lbmVyZ3k7XG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgICByZGlWYWx1ZTogTWF0aC5mbG9vcihlbmVyZ3kgLyAxMDApXG4gICAgICB9KTtcbiAgICB9KS5jYXRjaChlcnIgPT4gY29uc29sZS5sb2coZXJyKSk7XG4gIH1cblxuICBwdWJsaWMgcmVkaXJlY3RUb1JEQVBhZ2UoKSB7XG4gICAgaWYgKHRoaXMucmRhVXJsICE9PSBcIlwiKSB7XG4gICAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgICAgdXJsOiAnL3BhZ2VzL3JkaVBhZ2UvcmRpUGFnZT91cmw9JyArIHRoaXMucmRhVXJsLFxuICAgICAgfSlcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgc2VuZERhdGFzKCk6IHZvaWQge1xuICAgIC8vIOafpeeci+aYr+WQpuaOiOadg1xuICAgIGxldCB0b2tlbiA9IHd4LmdldFN0b3JhZ2VTeW5jKGdsb2JhbEVudW0uZ2xvYmFsS2V5X3Rva2VuKTtcbiAgICBjb25zb2xlLmxvZyh0b2tlbik7XG4gICAgd2ViQVBJLlNldEF1dGhUb2tlbih0b2tlbik7XG4gICAgbGV0IHRoYXQgPSB0aGlzO1xuICAgIGxldCBnZW5kZXIgPSBOdW1iZXIodGhhdC5kYXRhLmdlbmRlcik7XG4gICAgbGV0IGJpcnRoWWVhciA9IE51bWJlcih0aGF0LmRhdGEuYmlydGhZZWFyKTtcbiAgICBsZXQgaGVpZ2h0ID0gTnVtYmVyKHRoYXQuZGF0YS5oZWlnaHQpO1xuICAgIGxldCB3ZWlnaHQgPSBOdW1iZXIodGhhdC5kYXRhLndlaWdodCk7XG4gICAgbGV0IHdlaWdodEJlZm9yZVByZWcgPSBOdW1iZXIodGhhdC5kYXRhLnByZVByZWdXZWlnaHQpO1xuICAgIGxldCBhY3Rpdml0eVNlbGVjdGVkID0gTnVtYmVyKHRoYXQuZGF0YS5hY3Rpdml0eVNlbGVjdGVkKTtcbiAgICBsZXQgcHJlZ1N0YWdlU2VsZWN0ZWQgPSBOdW1iZXIodGhhdC5kYXRhLnByZWdTdGFnZVNlbGVjdGVkKTtcbiAgICBsZXQgbWVkaWNhbENvbmRpdGlvbiA9IE51bWJlcih0aGF0LmRhdGEubWVkaWNhbHNlbGVjdGVkKTtcbiAgICAvL0ZJWE1FIHNwZWNpYWwgc2V0dGluZyBmb3Igc2VydmVyIHByZWduYW5jeSBzdGFnZSBvdXQgb2YgaW5kZXggcmFuZ2Ugc2V0dGluZ1xuICAgIGlmIChwcmVnU3RhZ2VTZWxlY3RlZCA8IDAgfHwgcHJlZ1N0YWdlU2VsZWN0ZWQgPiAzKSB7XG4gICAgICBwcmVnU3RhZ2VTZWxlY3RlZCA9IDA7XG4gICAgfVxuXG4gICAgbGV0IHByZWdfYmlydGhfZGF0ZSA9IHRoaXMuZGF0YS55ZWFyICsgXCItXCIgKyB0aGlzLmRhdGEubW9udGggKyBcIi1cIiArIHRoaXMuZGF0YS5kYXRlO1xuXG4gICAgLy8gbGV0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuICAgIC8vIHd4LnNob3dNb2RhbCh7IHRpdGxlOiBcIlwiLCBjb250ZW50OiBcIlwiICsgbW9tZW50KFtOdW1iZXIodGhhdC5kYXRhLnllYXIpLCBOdW1iZXIodGhhdC5kYXRhLm1vbnRoKSAtIDEsIE51bWJlcih0aGF0LmRhdGEuZGF0ZSldKSB9KSBcblxuICAgIHd4LmdldFNldHRpbmcoe1xuICAgICAgc3VjY2VzcyhyZXMpIHtcbiAgICAgICAgaWYgKHJlcy5hdXRoU2V0dGluZ1snc2NvcGUudXNlckluZm8nXSkge1xuICAgICAgICAgIHd4LmdldFVzZXJJbmZvKHtcbiAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgICAgICAgbGV0IHVzZXJJbmZvID0gcmVzLnVzZXJJbmZvO1xuICAgICAgICAgICAgICBsZXQgbmlja05hbWUgPSB1c2VySW5mby5uaWNrTmFtZTtcbiAgICAgICAgICAgICAgbGV0IGF2YXRhclVybCA9IHVzZXJJbmZvLmF2YXRhclVybDtcbiAgICAgICAgICAgICAgbGV0IG1vbWVudCA9IHJlcXVpcmUoJ21vbWVudCcpO1xuICAgICAgICAgICAgICBsZXQgdXBkYXRlVXNlclByb2ZpbGVSZXEgPSB7XG4gICAgICAgICAgICAgICAgZ2VuZGVyOiBnZW5kZXIsXG4gICAgICAgICAgICAgICAgeWVhcl9vZl9iaXJ0aDogYmlydGhZZWFyLFxuICAgICAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgICAgIHdlaWdodDogd2VpZ2h0LFxuICAgICAgICAgICAgICAgIHdlaWdodF9iZWZvcmVfcHJlZ25hbmN5OiB3ZWlnaHRCZWZvcmVQcmVnLFxuICAgICAgICAgICAgICAgIGFjdGl2aXR5X2xldmVsOiBhY3Rpdml0eVNlbGVjdGVkLFxuICAgICAgICAgICAgICAgIHByZWduYW5jeV9zdGFnZTogcHJlZ1N0YWdlU2VsZWN0ZWQsXG4gICAgICAgICAgICAgICAgZXhwZWN0ZWRfYmlydGhfZGF0ZTogbW9tZW50KFtOdW1iZXIodGhhdC5kYXRhLnllYXIpLCBOdW1iZXIodGhhdC5kYXRhLm1vbnRoKSAtIDEsIE51bWJlcih0aGF0LmRhdGEuZGF0ZSldKSAvIDEwMDAsXG4gICAgICAgICAgICAgICAgbmlja25hbWU6IG5pY2tOYW1lLFxuICAgICAgICAgICAgICAgIGF2YXRhcl91cmw6IGF2YXRhclVybCxcbiAgICAgICAgICAgICAgICB0aW1lc19vZl9wcmVnbmFuY3k6IHRoYXQuZGF0YS5udW1QcmVnXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgd3guc2hvd0xvYWRpbmcoeyB0aXRsZTogXCLliqDovb3kuK0uLi5cIiB9KTtcbiAgICAgICAgICAgICAgY29uc29sZS5sb2codXBkYXRlVXNlclByb2ZpbGVSZXEpO1xuICAgICAgICAgICAgICB3ZWJBUEkuVXBkYXRlVXNlclByb2ZpbGUodXBkYXRlVXNlclByb2ZpbGVSZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgICAgICAgICAgdGhhdC5nZXRSRElHb2FsKCk7XG4gICAgICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICAgICAgICB3eC5oaWRlTG9hZGluZyh7fSk7XG4gICAgICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgICAgICAgICAgIGNvbnRlbnQ6ICfmm7TmlrDnlKjmiLfkv6Hmga/lpLHotKUnLFxuICAgICAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgd2ViQVBJLlVwZGF0ZVVzZXJQcm9maWxlKHVwZGF0ZVVzZXJQcm9maWxlUmVxKTtcblxuICAgICAgICAgICAgICBsZXQgdXBkYXRlTWVkaWNhbFByb2ZpbGVSZXEgPSB7XG4gICAgICAgICAgICAgICAgZm9vZF9hbGxlcmd5X2lkczogW10sXG4gICAgICAgICAgICAgICAgbWVkaWNhbF9jb25kaXRpb25faWRzOiBbbWVkaWNhbENvbmRpdGlvbl0sXG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgaWYgKG1lZGljYWxDb25kaXRpb24gIT0gMCkge1xuICAgICAgICAgICAgICAgIHdlYkFQSS5VcGRhdGVNZWRpY2FsUHJvZmlsZSh1cGRhdGVNZWRpY2FsUHJvZmlsZVJlcSk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9KVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICAgICAgdXJsOiAnLi4vaW52aXRhdGlvbi9pbnZpdGF0aW9uP3VzZXJfc3RhdHVzPTInXG4gICAgICAgICAgfSlcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pXG5cbiAgICAvL3JlY29yZCB0aGUgb25Cb2FyZCBsYXN0IHN0ZXAgdGltZXNcbiAgICB3eC5yZXBvcnRBbmFseXRpY3MoJ29uYm9hcmRfbGFzdF9zdGVwJywge1xuICAgICAgY291bnRzOiAnY291bnRzJyxcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBjb25maXJtU3VibWl0KCkge1xuICAgIHd4LnJlTGF1bmNoKHtcbiAgICAgIHVybDogXCIuLi8uLi9wYWdlcy9ob21lL2luZGV4XCIsXG4gICAgfSlcbiAgfVxufVxuXG5QYWdlKG5ldyBvbkJvYXJkKCkpO1xuIl19