"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var webAPI = require("../../api/app/AppService");
var globalEnum = require("../../api/GlobalEnum");
var app = getApp();
var chart = null;
function setWeightLineAndPoints() {
    chart.line().position(['date', 'weight']);
    chart.point()
        .position(['date', 'weight'])
        .style({ fill: '#ffffff', r: 3.2, lineWidth: 2, stroke: '#f3465a' });
}
function setTooltips() {
    chart.tooltip({
        alwaysShow: true,
        showCrosshairs: true,
        showItemMarker: false,
        showTitle: true,
        offsetY: 50,
        background: { fill: '#485465', padding: [7, 7] },
        nameStyle: { fill: '#ffffff' },
        valueStyle: { fill: '#ffffff' },
        titleStyle: { fill: '#e2e2e2' },
        onShow: function onShow(ev) {
            var items = ev.items;
            items[0].title = items[0].title.toString();
            items[0].name = "";
            items[0].value = items[0].value.toString() + "公斤";
        }
    });
}
function setTargetLine(targetWeight) {
    chart.guide().line({
        start: ['min', targetWeight],
        end: ['max', targetWeight],
        style: { stroke: '#4caf50', lineWidth: 0.7, lineCap: 'round' }
    });
    chart.guide().text({
        position: ['max', targetWeight],
        content: '目标',
        style: { textAlign: 'start', textBaseline: 'top', fill: '#4caf50' },
        offsetX: 10
    });
}
function setInitLine(initWeight) {
    chart.guide().line({
        start: ['min', initWeight],
        end: ['max', initWeight],
        style: { stroke: '#ff822d', lineWidth: 0.7, lineCap: 'round' }
    });
    chart.guide().text({
        position: ['max', initWeight],
        content: '初始',
        style: { textAlign: 'start', textBaseline: 'bottom', fill: '#ff822d' },
        offsetX: 10
    });
}
function setRectLegends() {
    chart.legend({
        position: 'top',
        align: 'center',
        custom: true,
        items: [
            { name: '体重过重', value: '', marker: { symbol: 'circle', radius: 5, fill: '#ff5c47' } },
            { name: '体重过轻', value: '', marker: { symbol: 'circle', radius: 5, fill: '#fcda76' } }
        ],
        nameStyle: { fill: '#888888' }
    });
}
function setUpperBoundRect(startYCoord, endYCoord) {
    chart.guide().rect({
        start: ['min', startYCoord],
        end: ['max', endYCoord],
        style: { fillOpacity: 0.4, fill: '#ff5c47', lineWidth: 0.5, stroke: '#ff5c47' }
    });
}
function setLowerBoundRect(startYCoord, endYCoord) {
    chart.guide().rect({
        start: ['min', startYCoord],
        end: ['max', endYCoord],
        style: { fillOpacity: 0.4, fill: '#fcda76', lineWidth: 0.5, stroke: '#fcda76' }
    });
}
function computeMinMaxWeightWithTarget(inputArr, targetWeight) {
    var maxWeight = -1;
    var minWeight = Number.MAX_SAFE_INTEGER;
    for (var index = 0; index < inputArr.length; index++) {
        if (inputArr[index].weight > maxWeight || targetWeight > maxWeight) {
            if (inputArr[index].weight > targetWeight) {
                maxWeight = inputArr[index].weight;
            }
            else {
                maxWeight = targetWeight;
            }
        }
        if (inputArr[index].weight < minWeight || targetWeight < minWeight) {
            if (inputArr[index].weight < targetWeight) {
                minWeight = inputArr[index].weight;
            }
            else {
                minWeight = targetWeight;
            }
        }
    }
    return { minWeight: minWeight, maxWeight: maxWeight };
}
function computeMinMaxWeightWithoutTarget(inputArr) {
    var maxWeight = -1;
    var minWeight = Number.MAX_SAFE_INTEGER;
    for (var index = 0; index < inputArr.length; index++) {
        if (inputArr[index].weight > maxWeight) {
            maxWeight = inputArr[index].weight;
        }
        if (inputArr[index].weight < minWeight) {
            minWeight = inputArr[index].weight;
        }
    }
    return { minWeight: minWeight, maxWeight: maxWeight };
}
function renderChartWeekView(inputArr, currWeek, initWeight, targetWeight, isPregnantLady, upperBound, lowerBound) {
    var maxWeight = -1;
    var minWeight = Number.MAX_SAFE_INTEGER;
    chart.clear();
    chart.source(inputArr);
    var weekArr = [];
    for (var i = 0; i < 7; i++) {
        var tempDay = moment().week(currWeek).day(i).format('YYYY-MM-DD');
        weekArr.push(tempDay);
    }
    chart.scale('date', {
        type: 'cat',
        values: weekArr,
        formatter: function (date) {
            var dateTokenArr = date.split("-");
            return dateTokenArr[2];
        }
    });
    setWeightLineAndPoints();
    setTooltips();
    if (targetWeight != 0 && !isPregnantLady) {
        setTargetLine(targetWeight);
        var temp = computeMinMaxWeightWithTarget(inputArr, targetWeight);
        minWeight = temp.minWeight;
        maxWeight = temp.maxWeight;
    }
    else {
        var temp = computeMinMaxWeightWithoutTarget(inputArr);
        minWeight = temp.minWeight;
        maxWeight = temp.maxWeight;
    }
    if (initWeight >= minWeight - 3 && initWeight <= maxWeight + 3 && !isPregnantLady) {
        setInitLine(initWeight);
    }
    var scaleMin = minWeight - 3 < 0 ? 0 : minWeight - 3;
    var scaleMax = maxWeight + 3 < 3 ? 3 : maxWeight + 3;
    if (isPregnantLady) {
        if (upperBound < scaleMax && upperBound > scaleMin) {
            setUpperBoundRect(upperBound, scaleMax);
        }
        else if (upperBound < scaleMax && upperBound <= scaleMin) {
            setUpperBoundRect(scaleMin, scaleMax);
        }
        if (lowerBound > scaleMin && lowerBound < scaleMax) {
            setLowerBoundRect(scaleMin, lowerBound);
        }
        else if (lowerBound > scaleMin && lowerBound >= scaleMax) {
            setLowerBoundRect(scaleMin, scaleMax);
        }
        setRectLegends();
    }
    chart.scale('weight', {
        min: scaleMin,
        max: scaleMax,
    });
    chart.render();
}
function renderChartMonthView(inputArr, currMonth, initWeight, targetWeight, isPregnantLady, upperBound, lowerBound) {
    var maxWeight = -1;
    var minWeight = Number.MAX_SAFE_INTEGER;
    chart.clear();
    chart.source(inputArr);
    var monthArr = [];
    for (var i = 1; i <= moment().month(currMonth).daysInMonth(); i++) {
        var tempDay = moment().month(currMonth).date(i).format('YYYY-MM-DD');
        monthArr.push(tempDay);
    }
    var tickStart = monthArr[0];
    var tickEnd = monthArr[monthArr.length - 1];
    chart.scale('date', {
        type: 'cat',
        values: monthArr,
        ticks: [tickStart, tickEnd],
        formatter: function (date) {
            var dateTokenArr = date.split("-");
            return dateTokenArr[2];
        }
    });
    setWeightLineAndPoints();
    setTooltips();
    if (targetWeight != 0 && !isPregnantLady) {
        setTargetLine(targetWeight);
        var temp = computeMinMaxWeightWithTarget(inputArr, targetWeight);
        minWeight = temp.minWeight;
        maxWeight = temp.maxWeight;
    }
    else {
        var temp = computeMinMaxWeightWithoutTarget(inputArr);
        minWeight = temp.minWeight;
        maxWeight = temp.maxWeight;
    }
    if (initWeight >= minWeight - 3 && initWeight <= maxWeight + 3 && !isPregnantLady) {
        setInitLine(initWeight);
    }
    var scaleMin = minWeight - 3 < 0 ? 0 : minWeight - 3;
    var scaleMax = maxWeight + 3 < 3 ? 3 : maxWeight + 3;
    if (isPregnantLady) {
        if (upperBound < scaleMax && upperBound > scaleMin) {
            setUpperBoundRect(upperBound, scaleMax);
        }
        else if (upperBound < scaleMax && upperBound < scaleMin) {
            setUpperBoundRect(scaleMin, scaleMax);
        }
        if (lowerBound > scaleMin && lowerBound < scaleMax) {
            setLowerBoundRect(scaleMin, lowerBound);
        }
        else if (lowerBound > scaleMin && lowerBound > scaleMax) {
            setLowerBoundRect(scaleMin, scaleMax);
        }
        setRectLegends();
    }
    chart.scale('weight', {
        min: scaleMin,
        max: scaleMax,
    });
    chart.render();
}
function initChart(canvas, width, height, F2) {
    F2.Global.setTheme({
        colors: ['#F3465A', '#D66BCA', '#8543E0', '#8E77ED', '#3436C7', '#737EE6', '#223273', '#7EA2E6'],
        pixelRatio: 2,
        guide: {
            line: { stroke: '#F3465A', lineWidth: 2 }
        }
    });
    chart = new F2.Chart({ el: canvas, width: width, height: height, animate: true, padding: [50, 50, 50, 50] });
    var currWeek = moment().week();
    var weekArr = [];
    for (var i = 0; i < 7; i++) {
        var tempDay = moment().week(currWeek).day(i).format('YYYY-MM-DD');
        weekArr.push(tempDay);
    }
    var emptyInputArr = [{
            "date": "2019-06-01",
            "weight": 50
        }];
    chart.source(emptyInputArr, {
        date: {
            type: 'cat',
            values: weekArr,
            formatter: function (date) {
                var dateTokenArr = date.split("-");
                return dateTokenArr[2];
            }
        }
    });
    setWeightLineAndPoints();
    chart.render();
    var firstDayOfWeek = moment().week(currWeek).day(0).hour(0).minute(0).second(0).unix();
    var lastDayOfWeek = moment().week(currWeek).day(6).hour(0).minute(0).second(0).unix();
    console.log("First day of week unix " + firstDayOfWeek + " last day of week unix " + lastDayOfWeek);
    weightRecordPage.getWeekViewData(currWeek, firstDayOfWeek);
    return chart;
}
var weightRecordPage = (function () {
    function weightRecordPage() {
        this.data = {
            isPregnantLady: true,
            dateOfDelivery: { date: undefined, year: '', month: '', day: '' },
            numWeeksPreg: 0,
            dateRecord: {
                date: moment().format('YYYY-MM-DD'),
                year: moment().format('YYYY'),
                month: moment().format('MM'),
                day: moment().format('DD'),
            },
            weightRecord: '70',
            weights: [],
            datesWithRecords: undefined,
            dateOfConception: { date: '', year: '', month: '', day: '' },
            initWeight: '99.0',
            initDate: { date: '1970-01-01', year: '1970', month: '01', day: '01' },
            latestWeight: '99.0',
            latestDate: { date: '1970-01-01', year: '1970', month: '01', day: '01' },
            targetWeight: '99.0',
            targetDate: { date: '1970-01-01', year: '1970', month: '01', day: '01' },
            isTargetSet: false,
            pregUpperWeightLimit: 0,
            pregLowerWeightLimit: 0,
            weeklyWeightChangeLower: 0.3,
            weeklyWeightChangeUpper: 0.5,
            currMaxIdx: 6,
            opts: {
                onInit: initChart,
            },
            chartViewIdx: '0',
            chartView: ['周', '月'],
            chartWeekViewStart: { date: moment(), year: '2019', month: '01', day: '01' },
            chartWeekViewEnd: { date: moment(), year: '2019', month: '01', day: '07' },
            isPrevWeekAllowed: true,
            isNextWeekAllowed: false,
            chartMonthViewStart: { date: moment(), year: '2019', month: '01', day: '01' },
            chartMonthViewEnd: { date: moment(), year: '2019', month: '01', day: '31' },
            isPrevMonthAllowed: true,
            isNextMonthAllowed: false,
            isTabOneSelected: true,
            tabOneStyleClass: "weui-navbar__item weui-bar__item_on",
            tabTwoStyleClass: "weui-navbar__item",
        };
    }
    weightRecordPage.getWeekViewData = function (currWeek, startTimeStamp) {
        var tempTimestamp;
        var inputArr = [];
        for (var i = 0; i < 7; i++) {
            tempTimestamp = startTimeStamp + (i * 3600 * 24);
            var tempDate = moment.unix(tempTimestamp).format('YYYY-MM-DD');
            var tempWeight = weightRecordPage.timestampWeightMap.get(tempTimestamp);
            if (tempWeight != undefined) {
                var temp = {
                    "date": tempDate,
                    "weight": tempWeight
                };
                inputArr.push(temp);
            }
        }
        renderChartWeekView(inputArr, currWeek, weightRecordPage.initWeight, weightRecordPage.targetWeight, weightRecordPage.isPregnantLady, weightRecordPage.pregUpperBound, weightRecordPage.pregLowerBound);
    };
    weightRecordPage.getMonthViewData = function (currMonth, startTimeStamp) {
        var tempTimestamp;
        var inputArr = [];
        for (var i = 0; i < moment().month(currMonth).daysInMonth(); i++) {
            tempTimestamp = startTimeStamp + (i * 3600 * 24);
            var tempDate = moment.unix(tempTimestamp).format('YYYY-MM-DD');
            var tempWeight = weightRecordPage.timestampWeightMap.get(tempTimestamp);
            if (tempWeight != undefined) {
                var temp = {
                    "date": tempDate,
                    "weight": tempWeight
                };
                inputArr.push(temp);
            }
        }
        renderChartMonthView(inputArr, currMonth, weightRecordPage.initWeight, weightRecordPage.targetWeight, weightRecordPage.isPregnantLady, weightRecordPage.pregUpperBound, weightRecordPage.pregLowerBound);
    };
    weightRecordPage.prototype.onNavbarSelect1 = function () {
        this.setData({
            isTabOneSelected: true,
            tabOneStyleClass: "weui-navbar__item weui-bar__item_on",
            tabTwoStyleClass: "weui-navbar__item"
        });
    };
    weightRecordPage.prototype.onNavbarSelect2 = function () {
        this.setData({
            isTabOneSelected: false,
            tabOneStyleClass: "weui-navbar__item",
            tabTwoStyleClass: "weui-navbar__item weui-bar__item_on"
        });
        this.computeInitChartViewInterval();
    };
    weightRecordPage.prototype.navigateToWeightInputPage = function () {
        wx.navigateTo({
            url: "/pages/weightRecord/weightInput"
        });
    };
    weightRecordPage.prototype.navigateToTargetInputPage = function () {
        wx.navigateTo({
            url: "/pages/weightRecord/targetInput"
        });
    };
    weightRecordPage.prototype.checkWeekInterval = function (newWeekStart) {
        var presentWeek = moment();
        var newWeek = newWeekStart;
        if (newWeek.isAfter(presentWeek, 'week')) {
            this.setWeekViewFlags(true, false);
            return false;
        }
        else {
            if (newWeek.isSame(presentWeek, 'week')) {
                this.setWeekViewFlags(true, false);
            }
            else {
                this.setWeekViewFlags(true, true);
            }
            return true;
        }
    };
    weightRecordPage.prototype.checkMonthInterval = function (newMonthStart) {
        var presentMonth = moment();
        var newMonth = newMonthStart;
        if (newMonth.isAfter(presentMonth, 'month')) {
            this.setMonthViewFlags(true, false);
            return false;
        }
        else {
            if (newMonth.isSame(presentMonth, 'month')) {
                this.setMonthViewFlags(true, false);
            }
            else {
                this.setMonthViewFlags(true, true);
            }
            return true;
        }
    };
    weightRecordPage.prototype.setWeekViewFlags = function (prevWeekFlag, nextWeekFlag) {
        this.setData({
            isPrevWeekAllowed: prevWeekFlag,
            isNextWeekAllowed: nextWeekFlag
        });
    };
    weightRecordPage.prototype.setMonthViewFlags = function (prevMonthFlag, nextMonthFlag) {
        this.setData({
            isPrevMonthAllowed: prevMonthFlag,
            isNextMonthAllowed: nextMonthFlag
        });
    };
    weightRecordPage.prototype.prevWeekInterval = function () {
        var newWeekStart = this.data.chartWeekViewStart.date.subtract(1, 'w');
        var newWeekEnd = this.data.chartWeekViewEnd.date.subtract(1, 'w');
        if (this.checkWeekInterval(newWeekStart)) {
            this.setWeekViewInterval(newWeekStart, newWeekEnd);
            console.log("Unix: " + newWeekStart.unix() + " till " + newWeekEnd.unix());
            var weekNum = newWeekStart.week();
            weightRecordPage.getWeekViewData(weekNum, newWeekStart.unix());
        }
    };
    weightRecordPage.prototype.prevMonthInterval = function () {
        var newMonthStart = this.data.chartMonthViewStart.date.subtract(1, 'M');
        var newMonthEnd = this.data.chartMonthViewEnd.date.subtract(1, 'M');
        if (this.checkMonthInterval(newMonthStart)) {
            this.setMonthViewInterval(newMonthStart, newMonthEnd);
            console.log("Unix: " + newMonthStart.unix() + " till " + newMonthEnd.unix());
            var monthNum = newMonthStart.month();
            weightRecordPage.getMonthViewData(monthNum, newMonthStart.unix());
        }
    };
    weightRecordPage.prototype.nextWeekInterval = function () {
        var newWeekStart = this.data.chartWeekViewStart.date.add(1, 'w');
        var newWeekEnd = this.data.chartWeekViewEnd.date.add(1, 'w');
        if (this.checkWeekInterval(newWeekStart)) {
            this.setWeekViewInterval(newWeekStart, newWeekEnd);
            console.log("Unix: " + newWeekStart.unix() + " till " + newWeekEnd.unix());
            var weekNum = newWeekStart.week();
            weightRecordPage.getWeekViewData(weekNum, newWeekStart.unix());
        }
    };
    weightRecordPage.prototype.nextMonthInterval = function (e) {
        var newMonthStart = this.data.chartMonthViewStart.date.add(1, 'M');
        var newMonthEnd = this.data.chartMonthViewEnd.date.add(1, 'M');
        if (this.checkMonthInterval(newMonthStart)) {
            this.setMonthViewInterval(newMonthStart, newMonthEnd);
            console.log("Unix: " + newMonthStart.unix() + " till " + newMonthEnd.unix());
            var monthNum = newMonthStart.month();
            weightRecordPage.getMonthViewData(monthNum, newMonthStart.unix());
        }
    };
    weightRecordPage.prototype.setWeekViewInterval = function (newWeekStart, newWeekEnd) {
        this.setData({
            chartWeekViewStart: {
                date: newWeekStart,
                year: newWeekStart.format("YYYY"),
                month: newWeekStart.format("MM"),
                day: newWeekStart.format("DD")
            },
            chartWeekViewEnd: {
                date: newWeekEnd,
                year: newWeekEnd.format("YYYY"),
                month: newWeekEnd.format("MM"),
                day: newWeekEnd.format("DD")
            }
        });
    };
    weightRecordPage.prototype.setMonthViewInterval = function (newMonthStart, newMonthEnd) {
        this.setData({
            chartMonthViewStart: {
                date: newMonthStart,
                year: newMonthStart.format("YYYY"),
                month: newMonthStart.format("MM"),
                day: newMonthStart.format("DD")
            },
            chartMonthViewEnd: {
                date: newMonthEnd,
                year: newMonthEnd.format("YYYY"),
                month: newMonthEnd.format("MM"),
                day: newMonthEnd.format("DD")
            }
        });
    };
    weightRecordPage.prototype.bindChartViewChange = function (e) {
        if (this.data.chartViewIdx === '0' && e.detail.value === '1') {
            var currMonth = moment().month();
            var firstDayOfMonth = moment().month(currMonth).startOf("month");
            var lastDayOfMonth = moment().month(currMonth).endOf("month");
            console.log("First day of month " + firstDayOfMonth.format("MM-DD-HH-MM-SS") + "last day of month" + lastDayOfMonth.format("MM-DD-HH-MM-SS"));
            this.setMonthViewInterval(firstDayOfMonth, lastDayOfMonth);
            this.setData({
                chartViewIdx: e.detail.value,
            });
            console.log("Graphhhh first day of month unix " + firstDayOfMonth.unix() + " last day of month unix " + lastDayOfMonth.unix());
            weightRecordPage.getMonthViewData(currMonth, firstDayOfMonth.unix());
        }
        if (this.data.chartViewIdx === '1' && e.detail.value === '0') {
            var currWeek = moment().week();
            var firstDayOfWeek = moment().week(currWeek).day(0).hour(0).minute(0).second(0);
            var lastDayOfWeek = moment().week(currWeek).day(6).hour(0).minute(0).second(0);
            this.setWeekViewInterval(firstDayOfWeek, lastDayOfWeek);
            this.setData({
                chartViewIdx: e.detail.value,
            });
            console.log("Graphhhh first day of week unix " + firstDayOfWeek.unix() + " last day of week unix " + lastDayOfWeek.unix());
            weightRecordPage.getWeekViewData(currWeek, firstDayOfWeek.unix());
        }
    };
    weightRecordPage.prototype.computePregInfo = function (dateOfDelivery) {
        var dateOfConceptionMoment = dateOfDelivery.subtract(40, 'w');
        var tempDate = {
            date: dateOfConceptionMoment.format("YYYY-MM-DD"),
            year: dateOfConceptionMoment.format("YYYY"),
            month: dateOfConceptionMoment.format("MM"),
            day: dateOfConceptionMoment.format("DD")
        };
        this.setData({
            dateOfConception: tempDate
        });
    };
    weightRecordPage.prototype.computeInitChartViewInterval = function () {
        var currWeek = moment().week();
        var currMonth = moment().month();
        var firstDayOfWeek = moment().week(currWeek).day(0).hour(0).minute(0).second(0);
        var lastDayOfWeek = moment().week(currWeek).day(6).hour(0).minute(0).second(0);
        this.setWeekViewInterval(firstDayOfWeek, lastDayOfWeek);
        var firstDayOfMonth = moment().month(currMonth).startOf("month");
        var lastDayOfMonth = moment().month(currMonth).endOf("month");
        this.setMonthViewInterval(firstDayOfMonth, lastDayOfMonth);
        this.setData({
            isPrevWeekAllowed: true,
            isNextWeekAllowed: false,
            isPrevMonthAllowed: true,
            isNextMonthAllowed: false,
            chartViewIdx: '0'
        });
    };
    weightRecordPage.prototype.retrieveData = function () {
        var token = wx.getStorageSync(globalEnum.globalKey_token);
        webAPI.SetAuthToken(token);
        var that = this;
        var currWeek = moment().week();
        var firstDayOfWeek = moment().week(currWeek).day(0).unix();
        var lastDayOfWeek = moment().week(currWeek).day(6).unix();
        wx.showLoading({
            title: '正在加载',
        });
        setTimeout(function () {
            var req = {
                date_from: 0,
                date_to: lastDayOfWeek
            };
            webAPI.RetrieveWeightLog(req).then(function (resp) {
                console.log(resp);
                var tempDateOfDelivery = that.createLocalDateObject(moment.unix(resp.expected_birth_date));
                var tempInitDate = that.createLocalDateObject(moment.unix(resp.initial_weight.date));
                var tempLatestDate = that.createLocalDateObject(moment.unix(resp.latest_weight.date));
                var tempTargetDate = that.createLocalDateObject(moment.unix(resp.target_weight.date));
                var tempDatesWithRecords = [];
                var tempWeights = [];
                var tempMap = new Map();
                for (var i = 0; i < resp.weight_logs.length; i++) {
                    var tempMoment = moment.unix(resp.weight_logs[i].date);
                    tempDatesWithRecords.push({
                        date: tempMoment.format('YYYY-MM-DD'),
                        year: tempMoment.format("YYYY"),
                        month: tempMoment.format("MM"),
                        day: tempMoment.format("DD")
                    });
                    tempMap.set(resp.weight_logs[i].date, resp.weight_logs[i].value);
                    tempWeights.push(resp.weight_logs[i].value);
                }
                that.setData({
                    initWeight: resp.initial_weight.value,
                    latestWeight: resp.latest_weight.value,
                    targetWeight: resp.target_weight.value,
                    initDate: tempInitDate,
                    latestDate: tempLatestDate,
                    targetDate: tempTargetDate,
                    isTargetSet: true,
                    currMaxIdx: resp.weight_logs.length,
                    pregUpperWeightLimit: resp.weight_upper_bound,
                    pregLowerWeightLimit: resp.weight_lower_bound,
                    isPregnantLady: resp.is_pregnant_lady,
                    dateOfDelivery: tempDateOfDelivery,
                    numWeeksPreg: resp.number_of_pregnant_weeks,
                    weeklyWeightChangeLower: resp.weight_change_range.lower / 100,
                    weeklyWeightChangeUpper: resp.weight_change_range.upper / 100
                });
                weightRecordPage.initWeight = resp.initial_weight.value;
                weightRecordPage.targetWeight = resp.target_weight.value;
                weightRecordPage.isPregnantLady = resp.is_pregnant_lady;
                weightRecordPage.pregUpperBound = resp.weight_upper_bound;
                weightRecordPage.pregLowerBound = resp.weight_lower_bound;
                weightRecordPage.timestampWeightMap = tempMap;
                if (resp.target_weight.value == 0) {
                    that.setData({
                        isTargetSet: false
                    });
                }
                that.computePregInfo(moment.unix(resp.expected_birth_date));
            }).catch(function (err) {
                wx.showModal({
                    title: '',
                    content: '获取体重数据失败',
                    showCancel: false
                });
            });
            wx.hideLoading({});
        }, 0);
    };
    weightRecordPage.prototype.createLocalDateObject = function (dateMoment) {
        return {
            date: dateMoment,
            year: dateMoment.format('YYYY'),
            month: dateMoment.format('MM'),
            day: dateMoment.format('DD')
        };
    };
    weightRecordPage.prototype.onShow = function (e) {
        this.retrieveData();
    };
    weightRecordPage.prototype.onLoad = function () {
        this.retrieveData();
        this.computeInitChartViewInterval();
        wx.setNavigationBarTitle({
            title: "体重记录"
        });
        var windowWidth = 160;
        try {
            var res = wx.getSystemInfoSync();
            windowWidth = res.windowWidth;
        }
        catch (e) {
            console.error('getSystemInfoSync failed!');
        }
    };
    return weightRecordPage;
}());
Page(new weightRecordPage());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUVBLCtCQUFpQztBQUVqQyxpREFBbUQ7QUFDbkQsaURBQW1EO0FBRW5ELElBQU0sR0FBRyxHQUFHLE1BQU0sRUFBVSxDQUFDO0FBQzdCLElBQUksS0FBSyxHQUFHLElBQUksQ0FBQztBQUVqQixTQUFTLHNCQUFzQjtJQUM3QixLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsUUFBUSxDQUFDLENBQUMsTUFBTSxFQUFFLFFBQVEsQ0FBQyxDQUFDLENBQUM7SUFDMUMsS0FBSyxDQUFDLEtBQUssRUFBRTtTQUNWLFFBQVEsQ0FBQyxDQUFDLE1BQU0sRUFBRSxRQUFRLENBQUMsQ0FBQztTQUM1QixLQUFLLENBQUMsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxHQUFHLEVBQUUsU0FBUyxFQUFFLENBQUMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLENBQUMsQ0FBQztBQUN6RSxDQUFDO0FBRUQsU0FBUyxXQUFXO0lBQ2xCLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDWixVQUFVLEVBQUUsSUFBSTtRQUNoQixjQUFjLEVBQUUsSUFBSTtRQUNwQixjQUFjLEVBQUUsS0FBSztRQUNyQixTQUFTLEVBQUUsSUFBSTtRQUNmLE9BQU8sRUFBRSxFQUFFO1FBQ1gsVUFBVSxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRSxPQUFPLEVBQUUsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEVBQUU7UUFDaEQsU0FBUyxFQUFFLEVBQUUsSUFBSSxFQUFFLFNBQVMsRUFBRTtRQUM5QixVQUFVLEVBQUUsRUFBRSxJQUFJLEVBQUUsU0FBUyxFQUFFO1FBQy9CLFVBQVUsRUFBRSxFQUFFLElBQUksRUFBRSxTQUFTLEVBQUU7UUFDL0IsTUFBTSxFQUFFLFNBQVMsTUFBTSxDQUFDLEVBQUU7WUFDeEIsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFD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SUFDUixDQUFDO0lBRU8sZ0RBQXFCLEdBQTdCLFVBQThCLFVBQWtCO1FBQzlDLE9BQU87WUFDTCxJQUFJLEVBQUUsVUFBVTtZQUNoQixJQUFJLEVBQUUsVUFBVSxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUM7WUFDL0IsS0FBSyxFQUFFLFVBQVUsQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDO1lBQzlCLEdBQUcsRUFBRSxVQUFVLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQztTQUM3QixDQUFDO0lBQ0osQ0FBQztJQUVNLGlDQUFNLEdBQWIsVUFBYyxDQUFDO1FBQ2IsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO0lBQ3RCLENBQUM7SUFFTSxpQ0FBTSxHQUFiO1FBQ0UsSUFBSSxDQUFDLFlBQVksRUFBRSxDQUFDO1FBQ3BCLElBQUksQ0FBQyw0QkFBNEIsRUFBRSxDQUFDO1FBRXBDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztZQUN2QixLQUFLLEVBQUUsTUFBTTtTQUNkLENBQUMsQ0FBQztRQUVILElBQUksV0FBVyxHQUFHLEdBQUcsQ0FBQztRQUN0QixJQUFJO1lBQ0YsSUFBSSxHQUFHLEdBQUcsRUFBRSxDQUFDLGlCQUFpQixFQUFFLENBQUM7WUFDakMsV0FBVyxHQUFHLEdBQUcsQ0FBQyxXQUFXLENBQUM7U0FDL0I7UUFBQyxPQUFPLENBQUMsRUFBRTtZQUNWLE9BQU8sQ0FBQyxLQUFLLENBQUMsMkJBQTJCLENBQUMsQ0FBQztTQUM1QztJQUVILENBQUM7SUE2QkgsdUJBQUM7QUFBRCxDQUFDLEFBM2VELElBMmVDO0FBRUQsSUFBSSxDQUFDLElBQUksZ0JBQWdCLEVBQUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgSU15QXBwIH0gZnJvbSAnLi4vLi4vYXBwJztcbmltcG9ydCB7IGVwb2NoIH0gZnJvbSAnLi4vLi4vdXRpbHMvdXRpbCc7XG5pbXBvcnQgKiBhcyBtb21lbnQgZnJvbSAnbW9tZW50JztcbmltcG9ydCAqIGFzIEYyIGZyb20gJ0BhbnR2L3d4LWYyJztcbmltcG9ydCAqIGFzIHdlYkFQSSBmcm9tICcuLi8uLi9hcGkvYXBwL0FwcFNlcnZpY2UnO1xuaW1wb3J0ICogYXMgZ2xvYmFsRW51bSBmcm9tICcuLi8uLi9hcGkvR2xvYmFsRW51bSc7XG5cbmNvbnN0IGFwcCA9IGdldEFwcDxJTXlBcHA+KCk7XG5sZXQgY2hhcnQgPSBudWxsO1xuXG5mdW5jdGlvbiBzZXRXZWlnaHRMaW5lQW5kUG9pbnRzKCk6IHZvaWQge1xuICBjaGFydC5saW5lKCkucG9zaXRpb24oWydkYXRlJywgJ3dlaWdodCddKTtcbiAgY2hhcnQucG9pbnQoKVxuICAgIC5wb3NpdGlvbihbJ2RhdGUnLCAnd2VpZ2h0J10pXG4gICAgLnN0eWxlKHsgZmlsbDogJyNmZmZmZmYnLCByOiAzLjIsIGxpbmVXaWR0aDogMiwgc3Ryb2tlOiAnI2YzNDY1YScgfSk7XG59XG5cbmZ1bmN0aW9uIHNldFRvb2x0aXBzKCk6IHZvaWQge1xuICBjaGFydC50b29sdGlwKHtcbiAgICBhbHdheXNTaG93OiB0cnVlLFxuICAgIHNob3dDcm9zc2hhaXJzOiB0cnVlLFxuICAgIHNob3dJdGVtTWFya2VyOiBmYWxzZSxcbiAgICBzaG93VGl0bGU6IHRydWUsXG4gICAgb2Zmc2V0WTogNTAsXG4gICAgYmFja2dyb3VuZDogeyBmaWxsOiAnIzQ4NTQ2NScsIHBhZGRpbmc6IFs3LCA3XSB9LFxuICAgIG5hbWVTdHlsZTogeyBmaWxsOiAnI2ZmZmZmZicgfSxcbiAgICB2YWx1ZVN0eWxlOiB7IGZpbGw6ICcjZmZmZmZmJyB9LFxuICAgIHRpdGxlU3R5bGU6IHsgZmlsbDogJyNlMmUyZTInIH0sXG4gICAgb25TaG93OiBmdW5jdGlvbiBvblNob3coZXYpIHtcbiAgICAgIHZhciBpdGVtcyA9IGV2Lml0ZW1zO1xuICAgICAgaXRlbXNbMF0udGl0bGUgPSBpdGVtc1swXS50aXRsZS50b1N0cmluZygpXG4gICAgICBpdGVtc1swXS5uYW1lID0gXCJcIjtcbiAgICAgIGl0ZW1zWzBdLnZhbHVlID0gaXRlbXNbMF0udmFsdWUudG9TdHJpbmcoKSArIFwi5YWs5pakXCI7XG4gICAgfVxuICB9KTtcbn1cblxuZnVuY3Rpb24gc2V0VGFyZ2V0TGluZSh0YXJnZXRXZWlnaHQ6IG51bWJlcik6IHZvaWQge1xuICBjaGFydC5ndWlkZSgpLmxpbmUoe1xuICAgIHN0YXJ0OiBbJ21pbicsIHRhcmdldFdlaWdodF0sXG4gICAgZW5kOiBbJ21heCcsIHRhcmdldFdlaWdodF0sXG4gICAgc3R5bGU6IHsgc3Ryb2tlOiAnIzRjYWY1MCcsIGxpbmVXaWR0aDogMC43LCBsaW5lQ2FwOiAncm91bmQnIH1cbiAgfSk7XG5cbiAgY2hhcnQuZ3VpZGUoKS50ZXh0KHtcbiAgICBwb3NpdGlvbjogWydtYXgnLCB0YXJnZXRXZWlnaHRdLFxuICAgIGNvbnRlbnQ6ICfnm67moIcnLFxuICAgIHN0eWxlOiB7IHRleHRBbGlnbjogJ3N0YXJ0JywgdGV4dEJhc2VsaW5lOiAndG9wJywgZmlsbDogJyM0Y2FmNTAnIH0sXG4gICAgb2Zmc2V0WDogMTBcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldEluaXRMaW5lKGluaXRXZWlnaHQ6IG51bWJlcik6IHZvaWQge1xuICBjaGFydC5ndWlkZSgpLmxpbmUoe1xuICAgIHN0YXJ0OiBbJ21pbicsIGluaXRXZWlnaHRdLFxuICAgIGVuZDogWydtYXgnLCBpbml0V2VpZ2h0XSxcbiAgICBzdHlsZTogeyBzdHJva2U6ICcjZmY4MjJkJywgbGluZVdpZHRoOiAwLjcsIGxpbmVDYXA6ICdyb3VuZCcgfVxuICB9KTtcblxuICBjaGFydC5ndWlkZSgpLnRleHQoe1xuICAgIHBvc2l0aW9uOiBbJ21heCcsIGluaXRXZWlnaHRdLFxuICAgIGNvbnRlbnQ6ICfliJ3lp4snLFxuICAgIHN0eWxlOiB7IHRleHRBbGlnbjogJ3N0YXJ0JywgdGV4dEJhc2VsaW5lOiAnYm90dG9tJywgZmlsbDogJyNmZjgyMmQnIH0sXG4gICAgb2Zmc2V0WDogMTBcbiAgfSk7XG59XG5cbmZ1bmN0aW9uIHNldFJlY3RMZWdlbmRzKCk6IHZvaWQge1xuICBjaGFydC5sZWdlbmQoe1xuICAgIHBvc2l0aW9uOiAndG9wJyxcbiAgICBhbGlnbjogJ2NlbnRlcicsXG4gICAgY3VzdG9tOiB0cnVlLFxuICAgIGl0ZW1zOiBbXG4gICAgICB7IG5hbWU6ICfkvZPph43ov4fph40nLCB2YWx1ZTogJycsIG1hcmtlcjogeyBzeW1ib2w6ICdjaXJjbGUnLCByYWRpdXM6IDUsIGZpbGw6ICcjZmY1YzQ3JyB9IH0sXG4gICAgICB7IG5hbWU6ICfkvZPph43ov4fovbsnLCB2YWx1ZTogJycsIG1hcmtlcjogeyBzeW1ib2w6ICdjaXJjbGUnLCByYWRpdXM6IDUsIGZpbGw6ICcjZmNkYTc2JyB9IH1cbiAgICBdLFxuICAgIG5hbWVTdHlsZTogeyBmaWxsOiAnIzg4ODg4OCcgfVxuICB9KTtcbn1cblxuLy8gc2V0IHBpbmsgcmVjdFxuZnVuY3Rpb24gc2V0VXBwZXJCb3VuZFJlY3Qoc3RhcnRZQ29vcmQ6IG51bWJlciwgZW5kWUNvb3JkOiBudW1iZXIpOiB2b2lkIHtcbiAgY2hhcnQuZ3VpZGUoKS5yZWN0KHtcbiAgICBzdGFydDogWydtaW4nLCBzdGFydFlDb29yZF0sXG4gICAgZW5kOiBbJ21heCcsIGVuZFlDb29yZF0sXG4gICAgc3R5bGU6IHsgZmlsbE9wYWNpdHk6IDAuNCwgZmlsbDogJyNmZjVjNDcnLCBsaW5lV2lkdGg6IDAuNSwgc3Ryb2tlOiAnI2ZmNWM0NycgfVxuICB9KTtcbn1cblxuLy8gc2V0IHllbGxvdyByZWN0XG5mdW5jdGlvbiBzZXRMb3dlckJvdW5kUmVjdChzdGFydFlDb29yZDogbnVtYmVyLCBlbmRZQ29vcmQ6IG51bWJlcik6IHZvaWQge1xuICBjaGFydC5ndWlkZSgpLnJlY3Qoe1xuICAgIHN0YXJ0OiBbJ21pbicsIHN0YXJ0WUNvb3JkXSxcbiAgICBlbmQ6IFsnbWF4JywgZW5kWUNvb3JkXSxcbiAgICBzdHlsZTogeyBmaWxsT3BhY2l0eTogMC40LCBmaWxsOiAnI2ZjZGE3NicsIGxpbmVXaWR0aDogMC41LCBzdHJva2U6ICcjZmNkYTc2JyB9XG4gIH0pO1xufVxuXG50eXBlIG1pbk1heCA9IHsgbWluV2VpZ2h0OiBudW1iZXIsIG1heFdlaWdodDogbnVtYmVyIH07XG5cbi8vIENhbGN1bGF0ZSBtYXgteSBhbmQgbWluLXkgdmFsdWVzLCBhbmQgYWNjb3VudCBmb3IgdGFyZ2V0V2VpZ2h0XG5mdW5jdGlvbiBjb21wdXRlTWluTWF4V2VpZ2h0V2l0aFRhcmdldChpbnB1dEFycjogYW55W10sIHRhcmdldFdlaWdodDogbnVtYmVyKTogbWluTWF4IHtcbiAgbGV0IG1heFdlaWdodCA9IC0xO1xuICBsZXQgbWluV2VpZ2h0ID0gTnVtYmVyLk1BWF9TQUZFX0lOVEVHRVI7XG5cbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGlucHV0QXJyLmxlbmd0aDsgaW5kZXgrKykge1xuXG4gICAgaWYgKGlucHV0QXJyW2luZGV4XS53ZWlnaHQgPiBtYXhXZWlnaHQgfHwgdGFyZ2V0V2VpZ2h0ID4gbWF4V2VpZ2h0KSB7XG4gICAgICBpZiAoaW5wdXRBcnJbaW5kZXhdLndlaWdodCA+IHRhcmdldFdlaWdodCkge1xuICAgICAgICBtYXhXZWlnaHQgPSBpbnB1dEFycltpbmRleF0ud2VpZ2h0O1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbWF4V2VpZ2h0ID0gdGFyZ2V0V2VpZ2h0O1xuICAgICAgfVxuICAgIH1cblxuICAgIGlmIChpbnB1dEFycltpbmRleF0ud2VpZ2h0IDwgbWluV2VpZ2h0IHx8IHRhcmdldFdlaWdodCA8IG1pbldlaWdodCkge1xuICAgICAgaWYgKGlucHV0QXJyW2luZGV4XS53ZWlnaHQgPCB0YXJnZXRXZWlnaHQpIHtcbiAgICAgICAgbWluV2VpZ2h0ID0gaW5wdXRBcnJbaW5kZXhdLndlaWdodDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1pbldlaWdodCA9IHRhcmdldFdlaWdodDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHsgbWluV2VpZ2h0LCBtYXhXZWlnaHQgfTtcbn1cblxuLy8gQ2FsY3VsYXRlIG1heC15IGFuZCBtaW4teSB2YWx1ZXMsIG5vIG5lZWQgdG8gYWNjb3VudCBmb3IgdGFyZ2V0V2VpZ2h0XG5mdW5jdGlvbiBjb21wdXRlTWluTWF4V2VpZ2h0V2l0aG91dFRhcmdldChpbnB1dEFycjogYW55W10pOiBtaW5NYXgge1xuICBsZXQgbWF4V2VpZ2h0ID0gLTE7XG4gIGxldCBtaW5XZWlnaHQgPSBOdW1iZXIuTUFYX1NBRkVfSU5URUdFUjtcblxuICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgaW5wdXRBcnIubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgaWYgKGlucHV0QXJyW2luZGV4XS53ZWlnaHQgPiBtYXhXZWlnaHQpIHtcbiAgICAgIG1heFdlaWdodCA9IGlucHV0QXJyW2luZGV4XS53ZWlnaHQ7XG4gICAgfVxuXG4gICAgaWYgKGlucHV0QXJyW2luZGV4XS53ZWlnaHQgPCBtaW5XZWlnaHQpIHtcbiAgICAgIG1pbldlaWdodCA9IGlucHV0QXJyW2luZGV4XS53ZWlnaHQ7XG4gICAgfVxuICB9XG4gIHJldHVybiB7IG1pbldlaWdodCwgbWF4V2VpZ2h0IH07XG59XG5cbi8vIGNsZWFycyBhbmQgcmVsb2FkcyB0aGUgY2hhcnQgd2l0aCBkYXRhIGZyb20gaW5wdXRBcnIgZm9yIGN1cnJXZWVrICh3ZWVrVmlldykgXG5mdW5jdGlvbiByZW5kZXJDaGFydFdlZWtWaWV3KGlucHV0QXJyOiBhbnlbXSwgY3VycldlZWs6IG51bWJlciwgaW5pdFdlaWdodDogbnVtYmVyLCB0YXJnZXRXZWlnaHQ6IG51bWJlciwgaXNQcmVnbmFudExhZHk6IGJvb2xlYW4sIHVwcGVyQm91bmQ6IG51bWJlciwgbG93ZXJCb3VuZDogbnVtYmVyKTogdm9pZCB7XG4gIGxldCBtYXhXZWlnaHQgPSAtMTtcbiAgbGV0IG1pbldlaWdodCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuXG4gIC8vIHVwZGF0ZSBjaGFydCBkYXRhIGFuZCByZWxldmFudCBsaW5lcyBhbmQgY29tcG9uZW50c1xuICBjaGFydC5jbGVhcigpO1xuICBjaGFydC5zb3VyY2UoaW5wdXRBcnIpO1xuXG4gIGxldCB3ZWVrQXJyID0gW107XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgNzsgaSsrKSB7XG4gICAgbGV0IHRlbXBEYXkgPSBtb21lbnQoKS53ZWVrKGN1cnJXZWVrKS5kYXkoaSkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgd2Vla0Fyci5wdXNoKHRlbXBEYXkpO1xuICB9XG5cbiAgY2hhcnQuc2NhbGUoJ2RhdGUnLCB7XG4gICAgdHlwZTogJ2NhdCcsXG4gICAgdmFsdWVzOiB3ZWVrQXJyLFxuICAgIGZvcm1hdHRlcjogZnVuY3Rpb24gKGRhdGU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgICBsZXQgZGF0ZVRva2VuQXJyID0gZGF0ZS5zcGxpdChcIi1cIik7XG4gICAgICByZXR1cm4gZGF0ZVRva2VuQXJyWzJdO1xuICAgIH1cbiAgfSk7XG5cbiAgc2V0V2VpZ2h0TGluZUFuZFBvaW50cygpO1xuICBzZXRUb29sdGlwcygpO1xuXG4gIC8vIHRhcmdldCBoYXMgYmVlbiBzZXRcbiAgaWYgKHRhcmdldFdlaWdodCAhPSAwICYmICFpc1ByZWduYW50TGFkeSkge1xuICAgIHNldFRhcmdldExpbmUodGFyZ2V0V2VpZ2h0KTtcblxuICAgIGxldCB0ZW1wOiBtaW5NYXggPSBjb21wdXRlTWluTWF4V2VpZ2h0V2l0aFRhcmdldChpbnB1dEFyciwgdGFyZ2V0V2VpZ2h0KTtcbiAgICBtaW5XZWlnaHQgPSB0ZW1wLm1pbldlaWdodDtcbiAgICBtYXhXZWlnaHQgPSB0ZW1wLm1heFdlaWdodDtcbiAgfSBlbHNlIHtcbiAgICBsZXQgdGVtcDogbWluTWF4ID0gY29tcHV0ZU1pbk1heFdlaWdodFdpdGhvdXRUYXJnZXQoaW5wdXRBcnIpO1xuICAgIG1pbldlaWdodCA9IHRlbXAubWluV2VpZ2h0O1xuICAgIG1heFdlaWdodCA9IHRlbXAubWF4V2VpZ2h0O1xuICB9XG5cbiAgaWYgKGluaXRXZWlnaHQgPj0gbWluV2VpZ2h0IC0gMyAmJiBpbml0V2VpZ2h0IDw9IG1heFdlaWdodCArIDMgJiYgIWlzUHJlZ25hbnRMYWR5KSB7XG4gICAgc2V0SW5pdExpbmUoaW5pdFdlaWdodCk7XG4gIH1cblxuICBsZXQgc2NhbGVNaW46IG51bWJlciA9IG1pbldlaWdodCAtIDMgPCAwID8gMCA6IG1pbldlaWdodCAtIDM7XG4gIGxldCBzY2FsZU1heDogbnVtYmVyID0gbWF4V2VpZ2h0ICsgMyA8IDMgPyAzIDogbWF4V2VpZ2h0ICsgMztcblxuICBpZiAoaXNQcmVnbmFudExhZHkpIHtcbiAgICAvLyBwaW5rIHJlY3RcbiAgICBpZiAodXBwZXJCb3VuZCA8IHNjYWxlTWF4ICYmIHVwcGVyQm91bmQgPiBzY2FsZU1pbikge1xuICAgICAgc2V0VXBwZXJCb3VuZFJlY3QodXBwZXJCb3VuZCwgc2NhbGVNYXgpO1xuICAgIH0gZWxzZSBpZiAodXBwZXJCb3VuZCA8IHNjYWxlTWF4ICYmIHVwcGVyQm91bmQgPD0gc2NhbGVNaW4pIHtcbiAgICAgIHNldFVwcGVyQm91bmRSZWN0KHNjYWxlTWluLCBzY2FsZU1heCk7IFxuICAgIH1cblxuICAgIC8vIHllbGxvdyByZWN0XG4gICAgaWYgKGxvd2VyQm91bmQgPiBzY2FsZU1pbiAmJiBsb3dlckJvdW5kIDwgc2NhbGVNYXgpIHtcbiAgICAgIHNldExvd2VyQm91bmRSZWN0KHNjYWxlTWluLCBsb3dlckJvdW5kKTtcbiAgICB9IGVsc2UgaWYgKGxvd2VyQm91bmQgPiBzY2FsZU1pbiAmJiBsb3dlckJvdW5kID49IHNjYWxlTWF4KSB7XG4gICAgICBzZXRMb3dlckJvdW5kUmVjdChzY2FsZU1pbiwgc2NhbGVNYXgpO1xuICAgIH1cbiAgICBzZXRSZWN0TGVnZW5kcygpO1xuICB9XG5cbiAgY2hhcnQuc2NhbGUoJ3dlaWdodCcsIHtcbiAgICBtaW46IHNjYWxlTWluLFxuICAgIG1heDogc2NhbGVNYXgsXG4gIH0pO1xuXG4gIGNoYXJ0LnJlbmRlcigpO1xufVxuXG4vLyBjbGVhcnMgYW5kIHJlbG9hZHMgdGhlIGNoYXJ0IHdpdGggZGF0YSBmcm9tIGlucHV0QXJyIGZvciB0aGUgY3Vyck1vbnRoIChtb250aFZpZXcpIFxuZnVuY3Rpb24gcmVuZGVyQ2hhcnRNb250aFZpZXcoaW5wdXRBcnI6IGFueVtdLCBjdXJyTW9udGg6IG51bWJlciwgaW5pdFdlaWdodDogbnVtYmVyLCB0YXJnZXRXZWlnaHQ6IG51bWJlciwgaXNQcmVnbmFudExhZHk6IGJvb2xlYW4sIHVwcGVyQm91bmQ6IG51bWJlciwgbG93ZXJCb3VuZDogbnVtYmVyKTogdm9pZCB7XG4gIGxldCBtYXhXZWlnaHQgPSAtMTtcbiAgbGV0IG1pbldlaWdodCA9IE51bWJlci5NQVhfU0FGRV9JTlRFR0VSO1xuXG4gIC8vIHVwZGF0ZSBjaGFydCBkYXRhIGFuZCByZWxldmFudCBsaW5lcyBhbmQgY29tcG9uZW50c1xuICBjaGFydC5jbGVhcigpO1xuICBjaGFydC5zb3VyY2UoaW5wdXRBcnIpO1xuXG4gIGxldCBtb250aEFyciA9IFtdO1xuICBmb3IgKGxldCBpID0gMTsgaSA8PSBtb21lbnQoKS5tb250aChjdXJyTW9udGgpLmRheXNJbk1vbnRoKCk7IGkrKykge1xuICAgIGxldCB0ZW1wRGF5ID0gbW9tZW50KCkubW9udGgoY3Vyck1vbnRoKS5kYXRlKGkpLmZvcm1hdCgnWVlZWS1NTS1ERCcpO1xuICAgIG1vbnRoQXJyLnB1c2godGVtcERheSk7XG4gIH1cblxuICBsZXQgdGlja1N0YXJ0OiBzdHJpbmcgPSBtb250aEFyclswXTtcbiAgbGV0IHRpY2tFbmQ6IHN0cmluZyA9IG1vbnRoQXJyW21vbnRoQXJyLmxlbmd0aCAtIDFdO1xuICBjaGFydC5zY2FsZSgnZGF0ZScsIHtcbiAgICB0eXBlOiAnY2F0JyxcbiAgICB2YWx1ZXM6IG1vbnRoQXJyLFxuICAgIHRpY2tzOiBbdGlja1N0YXJ0LCB0aWNrRW5kXSxcbiAgICBmb3JtYXR0ZXI6IGZ1bmN0aW9uIChkYXRlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgbGV0IGRhdGVUb2tlbkFyciA9IGRhdGUuc3BsaXQoXCItXCIpO1xuICAgICAgcmV0dXJuIGRhdGVUb2tlbkFyclsyXTtcbiAgICB9XG4gIH0pO1xuXG4gIHNldFdlaWdodExpbmVBbmRQb2ludHMoKTtcbiAgc2V0VG9vbHRpcHMoKTtcblxuICAvLyB0YXJnZXQgaGFzIGJlZW4gc2V0XG4gIGlmICh0YXJnZXRXZWlnaHQgIT0gMCAmJiAhaXNQcmVnbmFudExhZHkpIHtcbiAgICBzZXRUYXJnZXRMaW5lKHRhcmdldFdlaWdodCk7XG5cbiAgICBsZXQgdGVtcDogbWluTWF4ID0gY29tcHV0ZU1pbk1heFdlaWdodFdpdGhUYXJnZXQoaW5wdXRBcnIsIHRhcmdldFdlaWdodCk7XG4gICAgbWluV2VpZ2h0ID0gdGVtcC5taW5XZWlnaHQ7XG4gICAgbWF4V2VpZ2h0ID0gdGVtcC5tYXhXZWlnaHQ7XG4gIH0gZWxzZSB7XG4gICAgbGV0IHRlbXA6IG1pbk1heCA9IGNvbXB1dGVNaW5NYXhXZWlnaHRXaXRob3V0VGFyZ2V0KGlucHV0QXJyKTtcbiAgICBtaW5XZWlnaHQgPSB0ZW1wLm1pbldlaWdodDtcbiAgICBtYXhXZWlnaHQgPSB0ZW1wLm1heFdlaWdodDtcbiAgfVxuXG4gIGlmIChpbml0V2VpZ2h0ID49IG1pbldlaWdodCAtIDMgJiYgaW5pdFdlaWdodCA8PSBtYXhXZWlnaHQgKyAzICYmICFpc1ByZWduYW50TGFkeSkge1xuICAgIHNldEluaXRMaW5lKGluaXRXZWlnaHQpO1xuICB9XG5cbiAgbGV0IHNjYWxlTWluOiBudW1iZXIgPSBtaW5XZWlnaHQgLSAzIDwgMCA/IDAgOiBtaW5XZWlnaHQgLSAzO1xuICBsZXQgc2NhbGVNYXg6IG51bWJlciA9IG1heFdlaWdodCArIDMgPCAzID8gMyA6IG1heFdlaWdodCArIDM7XG5cbiAgaWYgKGlzUHJlZ25hbnRMYWR5KSB7XG4gICAgLy8gcGluayByZWN0XG4gICAgaWYgKHVwcGVyQm91bmQgPCBzY2FsZU1heCAmJiB1cHBlckJvdW5kID4gc2NhbGVNaW4pIHtcbiAgICAgIHNldFVwcGVyQm91bmRSZWN0KHVwcGVyQm91bmQsIHNjYWxlTWF4KTtcbiAgICB9IGVsc2UgaWYgKHVwcGVyQm91bmQgPCBzY2FsZU1heCAmJiB1cHBlckJvdW5kIDwgc2NhbGVNaW4pIHtcbiAgICAgIHNldFVwcGVyQm91bmRSZWN0KHNjYWxlTWluLCBzY2FsZU1heCk7XG4gICAgfVxuXG4gICAgLy8geWVsbG93IHJlY3RcbiAgICBpZiAobG93ZXJCb3VuZCA+IHNjYWxlTWluICYmIGxvd2VyQm91bmQgPCBzY2FsZU1heCkge1xuICAgICAgc2V0TG93ZXJCb3VuZFJlY3Qoc2NhbGVNaW4sIGxvd2VyQm91bmQpO1xuICAgIH0gZWxzZSBpZiAobG93ZXJCb3VuZCA+IHNjYWxlTWluICYmIGxvd2VyQm91bmQgPiBzY2FsZU1heCkge1xuICAgICAgc2V0TG93ZXJCb3VuZFJlY3Qoc2NhbGVNaW4sIHNjYWxlTWF4KTtcbiAgICB9XG4gICAgc2V0UmVjdExlZ2VuZHMoKTtcbiAgfVxuXG4gIGNoYXJ0LnNjYWxlKCd3ZWlnaHQnLCB7XG4gICAgbWluOiBzY2FsZU1pbixcbiAgICBtYXg6IHNjYWxlTWF4LFxuICB9KTtcblxuICBjaGFydC5yZW5kZXIoKTtcbn1cblxuLy8gY2FsbGVkIHdoZW5ldmVyIHRhYlR3byBpcyBkaXNwbGF5ZWQsIGxvYWRzIGRlZmF1bHQgZGF0YSAod2VpZ2h0IHJlY29yZHMgZnJvbSB0aGlzIHdlZWspXG5mdW5jdGlvbiBpbml0Q2hhcnQoY2FudmFzLCB3aWR0aCwgaGVpZ2h0LCBGMik6IGFueSB7XG4gIEYyLkdsb2JhbC5zZXRUaGVtZSh7XG4gICAgY29sb3JzOiBbJyNGMzQ2NUEnLCAnI0Q2NkJDQScsICcjODU0M0UwJywgJyM4RTc3RUQnLCAnIzM0MzZDNycsICcjNzM3RUU2JywgJyMyMjMyNzMnLCAnIzdFQTJFNiddLFxuICAgIHBpeGVsUmF0aW86IDIsXG4gICAgZ3VpZGU6IHtcbiAgICAgIGxpbmU6IHsgc3Ryb2tlOiAnI0YzNDY1QScsIGxpbmVXaWR0aDogMiB9XG4gICAgfVxuICB9KTtcblxuICBjaGFydCA9IG5ldyBGMi5DaGFydCh7IGVsOiBjYW52YXMsIHdpZHRoLCBoZWlnaHQsIGFuaW1hdGU6IHRydWUsIHBhZGRpbmc6IFs1MCwgNTAsIDUwLCA1MF0gfSk7XG5cbiAgLy8gc2V0IGRlZmF1bHQgd2Vla3ZpZXcgaW50ZXJ2YWxcbiAgbGV0IGN1cnJXZWVrOiBudW1iZXIgPSBtb21lbnQoKS53ZWVrKCk7XG4gIGxldCB3ZWVrQXJyID0gW107XG5cbiAgZm9yKGxldCBpPTA7IGk8NzsgaSsrKSB7XG4gICAgbGV0IHRlbXBEYXkgPSBtb21lbnQoKS53ZWVrKGN1cnJXZWVrKS5kYXkoaSkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG4gICAgd2Vla0Fyci5wdXNoKHRlbXBEYXkpO1xuICB9XG5cbiAgbGV0IGVtcHR5SW5wdXRBcnIgPSBbe1xuICAgIFwiZGF0ZVwiOiBcIjIwMTktMDYtMDFcIixcbiAgICBcIndlaWdodFwiOiA1MFxuICB9XTtcblxuICAvLyB3aXRob3V0IHRoaXMgdGhlIGNoYXJ0IHdvbid0IHJlbmRlciBwcm9wZXJseVxuICBjaGFydC5zb3VyY2UoZW1wdHlJbnB1dEFyciwge1xuICAgIGRhdGU6IHtcbiAgICAgIHR5cGU6ICdjYXQnLFxuICAgICAgdmFsdWVzOiB3ZWVrQXJyLFxuICAgICAgZm9ybWF0dGVyOiBmdW5jdGlvbihkYXRlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgICAgICBsZXQgZGF0ZVRva2VuQXJyID0gZGF0ZS5zcGxpdChcIi1cIik7XG4gICAgICAgIHJldHVybiBkYXRlVG9rZW5BcnJbMl07XG4gICAgICB9XG4gICAgfVxuICB9KTtcblxuICBzZXRXZWlnaHRMaW5lQW5kUG9pbnRzKCk7XG4gIGNoYXJ0LnJlbmRlcigpO1xuXG4gIC8vIHNldCB3ZWVrdmlldyBpbnRlcnZhbCBhbmQgd2VlayBudW14YmVyXG4gIGxldCBmaXJzdERheU9mV2VlazogbnVtYmVyID0gbW9tZW50KCkud2VlayhjdXJyV2VlaykuZGF5KDApLmhvdXIoMCkubWludXRlKDApLnNlY29uZCgwKS51bml4KCk7XG4gIGxldCBsYXN0RGF5T2ZXZWVrOiBudW1iZXIgPSBtb21lbnQoKS53ZWVrKGN1cnJXZWVrKS5kYXkoNikuaG91cigwKS5taW51dGUoMCkuc2Vjb25kKDApLnVuaXgoKTtcbiAgY29uc29sZS5sb2coXCJGaXJzdCBkYXkgb2Ygd2VlayB1bml4IFwiICsgZmlyc3REYXlPZldlZWsgKyBcIiBsYXN0IGRheSBvZiB3ZWVrIHVuaXggXCIgKyBsYXN0RGF5T2ZXZWVrKTtcblxuICAvLyBnZXRDaGFydFdlZWtWaWV3RGF0YShjdXJyV2VlaywgZmlyc3REYXlPZldlZWssIGxhc3REYXlPZldlZWspO1xuICB3ZWlnaHRSZWNvcmRQYWdlLmdldFdlZWtWaWV3RGF0YShjdXJyV2VlaywgZmlyc3REYXlPZldlZWspO1xuXG4gIHJldHVybiBjaGFydDtcbn1cblxuY2xhc3Mgd2VpZ2h0UmVjb3JkUGFnZSB7IFxuICBwdWJsaWMgZGF0YSA9IHtcbiAgICBpc1ByZWduYW50TGFkeTogdHJ1ZSxcbiAgICBkYXRlT2ZEZWxpdmVyeTogeyBkYXRlOiB1bmRlZmluZWQsIHllYXI6ICcnLCBtb250aDogJycsIGRheTogJycgfSxcbiAgICBudW1XZWVrc1ByZWc6IDAsXG4gICAgZGF0ZVJlY29yZDoge1xuICAgICAgZGF0ZTogbW9tZW50KCkuZm9ybWF0KCdZWVlZLU1NLUREJyksXG4gICAgICB5ZWFyOiBtb21lbnQoKS5mb3JtYXQoJ1lZWVknKSxcbiAgICAgIG1vbnRoOiBtb21lbnQoKS5mb3JtYXQoJ01NJyksXG4gICAgICBkYXk6IG1vbWVudCgpLmZvcm1hdCgnREQnKSxcbiAgICB9LFxuICAgIHdlaWdodFJlY29yZDogJzcwJyxcbiAgICB3ZWlnaHRzOiBbXSxcbiAgICBkYXRlc1dpdGhSZWNvcmRzOiB1bmRlZmluZWQsXG4gICAgZGF0ZU9mQ29uY2VwdGlvbjogeyBkYXRlOiAnJywgeWVhcjogJycsIG1vbnRoOiAnJywgZGF5OiAnJyB9LFxuICAgIGluaXRXZWlnaHQ6ICc5OS4wJyxcbiAgICBpbml0RGF0ZTogeyBkYXRlOiAnMTk3MC0wMS0wMScsIHllYXI6ICcxOTcwJywgbW9udGg6ICcwMScsIGRheTogJzAxJyB9LFxuICAgIGxhdGVzdFdlaWdodDogJzk5LjAnLFxuICAgIGxhdGVzdERhdGU6IHsgZGF0ZTogJzE5NzAtMDEtMDEnLCB5ZWFyOiAnMTk3MCcsIG1vbnRoOiAnMDEnLCBkYXk6ICcwMScgfSxcbiAgICB0YXJnZXRXZWlnaHQ6ICc5OS4wJyxcbiAgICB0YXJnZXREYXRlOiB7IGRhdGU6ICcxOTcwLTAxLTAxJywgeWVhcjogJzE5NzAnLCBtb250aDogJzAxJywgZGF5OiAnMDEnIH0sXG4gICAgaXNUYXJnZXRTZXQ6IGZhbHNlLFxuICAgIHByZWdVcHBlcldlaWdodExpbWl0OiAwLFxuICAgIHByZWdMb3dlcldlaWdodExpbWl0OiAwLFxuICAgIHdlZWtseVdlaWdodENoYW5nZUxvd2VyOiAwLjMsXG4gICAgd2Vla2x5V2VpZ2h0Q2hhbmdlVXBwZXI6IDAuNSxcbiAgICBjdXJyTWF4SWR4OiA2LFxuICAgIG9wdHM6IHtcbiAgICAgIG9uSW5pdDogaW5pdENoYXJ0LFxuICAgIH0sXG4gICAgY2hhcnRWaWV3SWR4OiAnMCcsXG4gICAgY2hhcnRWaWV3OiBbJ+WRqCcsICfmnIgnXSxcbiAgICBjaGFydFdlZWtWaWV3U3RhcnQ6IHsgZGF0ZTogbW9tZW50KCksIHllYXI6ICcyMDE5JywgbW9udGg6ICcwMScsIGRheTogJzAxJyB9LFxuICAgIGNoYXJ0V2Vla1ZpZXdFbmQ6IHsgZGF0ZTogbW9tZW50KCksIHllYXI6ICcyMDE5JywgbW9udGg6ICcwMScsIGRheTogJzA3JyB9LFxuICAgIGlzUHJldldlZWtBbGxvd2VkOiB0cnVlLFxuICAgIGlzTmV4dFdlZWtBbGxvd2VkOiBmYWxzZSxcbiAgICBjaGFydE1vbnRoVmlld1N0YXJ0OiB7IGRhdGU6IG1vbWVudCgpLCB5ZWFyOiAnMjAxOScsIG1vbnRoOiAnMDEnLCBkYXk6ICcwMScgfSxcbiAgICBjaGFydE1vbnRoVmlld0VuZDogeyBkYXRlOiBtb21lbnQoKSwgeWVhcjogJzIwMTknLCBtb250aDogJzAxJywgZGF5OiAnMzEnIH0sXG4gICAgaXNQcmV2TW9udGhBbGxvd2VkOiB0cnVlLFxuICAgIGlzTmV4dE1vbnRoQWxsb3dlZDogZmFsc2UsXG4gICAgaXNUYWJPbmVTZWxlY3RlZDogdHJ1ZSxcbiAgICB0YWJPbmVTdHlsZUNsYXNzOiBcIndldWktbmF2YmFyX19pdGVtIHdldWktYmFyX19pdGVtX29uXCIsXG4gICAgdGFiVHdvU3R5bGVDbGFzczogXCJ3ZXVpLW5hdmJhcl9faXRlbVwiLFxuICB9O1xuXG4gIHB1YmxpYyBzdGF0aWMgaW5pdFdlaWdodDogbnVtYmVyO1xuICBwdWJsaWMgc3RhdGljIHRhcmdldFdlaWdodDogbnVtYmVyO1xuICBwdWJsaWMgc3RhdGljIGlzUHJlZ25hbnRMYWR5OiBib29sZWFuO1xuICBwdWJsaWMgc3RhdGljIHByZWdVcHBlckJvdW5kOiBudW1iZXI7XG4gIHB1YmxpYyBzdGF0aWMgcHJlZ0xvd2VyQm91bmQ6IG51bWJlcjtcbiAgcHVibGljIHN0YXRpYyB0aW1lc3RhbXBXZWlnaHRNYXA6IE1hcDxudW1iZXIsIG51bWJlcj47XG5cbiAgcHVibGljIHN0YXRpYyBnZXRXZWVrVmlld0RhdGEoY3VycldlZWs6IG51bWJlciwgc3RhcnRUaW1lU3RhbXA6IG51bWJlcikge1xuICAgIHZhciB0ZW1wVGltZXN0YW1wOiBudW1iZXI7XG4gICAgdmFyIGlucHV0QXJyID0gW107XG5cbiAgICBmb3IgKGxldCBpPTA7IGkgPCA3OyBpKyspIHtcbiAgICAgIHRlbXBUaW1lc3RhbXAgPSBzdGFydFRpbWVTdGFtcCArIChpICogMzYwMCAqIDI0KTtcbiAgICAgIGxldCB0ZW1wRGF0ZTogc3RyaW5nID0gbW9tZW50LnVuaXgodGVtcFRpbWVzdGFtcCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG5cbiAgICAgIGxldCB0ZW1wV2VpZ2h0ID0gd2VpZ2h0UmVjb3JkUGFnZS50aW1lc3RhbXBXZWlnaHRNYXAuZ2V0KHRlbXBUaW1lc3RhbXApO1xuICAgICAgaWYgKHRlbXBXZWlnaHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciB0ZW1wID0ge1xuICAgICAgICAgIFwiZGF0ZVwiOiB0ZW1wRGF0ZSxcbiAgICAgICAgICBcIndlaWdodFwiOiB0ZW1wV2VpZ2h0XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXRBcnIucHVzaCh0ZW1wKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmVuZGVyQ2hhcnRXZWVrVmlldyhpbnB1dEFyciwgY3VycldlZWssIHdlaWdodFJlY29yZFBhZ2UuaW5pdFdlaWdodCwgd2VpZ2h0UmVjb3JkUGFnZS50YXJnZXRXZWlnaHQsIHdlaWdodFJlY29yZFBhZ2UuaXNQcmVnbmFudExhZHksIHdlaWdodFJlY29yZFBhZ2UucHJlZ1VwcGVyQm91bmQsIHdlaWdodFJlY29yZFBhZ2UucHJlZ0xvd2VyQm91bmQpO1xuICB9XG5cbiAgcHVibGljIHN0YXRpYyBnZXRNb250aFZpZXdEYXRhKGN1cnJNb250aDogbnVtYmVyLCBzdGFydFRpbWVTdGFtcDogbnVtYmVyKSB7XG4gICAgdmFyIHRlbXBUaW1lc3RhbXA6IG51bWJlcjtcbiAgICB2YXIgaW5wdXRBcnIgPSBbXTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbW9tZW50KCkubW9udGgoY3Vyck1vbnRoKS5kYXlzSW5Nb250aCgpOyBpKyspIHtcbiAgICAgIHRlbXBUaW1lc3RhbXAgPSBzdGFydFRpbWVTdGFtcCArIChpICogMzYwMCAqIDI0KTtcbiAgICAgIGxldCB0ZW1wRGF0ZTogc3RyaW5nID0gbW9tZW50LnVuaXgodGVtcFRpbWVzdGFtcCkuZm9ybWF0KCdZWVlZLU1NLUREJyk7XG5cbiAgICAgIGxldCB0ZW1wV2VpZ2h0ID0gd2VpZ2h0UmVjb3JkUGFnZS50aW1lc3RhbXBXZWlnaHRNYXAuZ2V0KHRlbXBUaW1lc3RhbXApO1xuICAgICAgaWYgKHRlbXBXZWlnaHQgIT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciB0ZW1wID0ge1xuICAgICAgICAgIFwiZGF0ZVwiOiB0ZW1wRGF0ZSxcbiAgICAgICAgICBcIndlaWdodFwiOiB0ZW1wV2VpZ2h0XG4gICAgICAgIH1cbiAgICAgICAgaW5wdXRBcnIucHVzaCh0ZW1wKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZW5kZXJDaGFydE1vbnRoVmlldyhpbnB1dEFyciwgY3Vyck1vbnRoLCB3ZWlnaHRSZWNvcmRQYWdlLmluaXRXZWlnaHQsIHdlaWdodFJlY29yZFBhZ2UudGFyZ2V0V2VpZ2h0LCB3ZWlnaHRSZWNvcmRQYWdlLmlzUHJlZ25hbnRMYWR5LCB3ZWlnaHRSZWNvcmRQYWdlLnByZWdVcHBlckJvdW5kLCB3ZWlnaHRSZWNvcmRQYWdlLnByZWdMb3dlckJvdW5kKTtcbiAgfVxuXG4gIHB1YmxpYyBvbk5hdmJhclNlbGVjdDEoKTogdm9pZCB7XG4gICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgIGlzVGFiT25lU2VsZWN0ZWQ6IHRydWUsXG4gICAgICB0YWJPbmVTdHlsZUNsYXNzOiBcIndldWktbmF2YmFyX19pdGVtIHdldWktYmFyX19pdGVtX29uXCIsXG4gICAgICB0YWJUd29TdHlsZUNsYXNzOiBcIndldWktbmF2YmFyX19pdGVtXCJcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbk5hdmJhclNlbGVjdDIoKTogdm9pZCB7XG4gICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgIGlzVGFiT25lU2VsZWN0ZWQ6IGZhbHNlLFxuICAgICAgdGFiT25lU3R5bGVDbGFzczogXCJ3ZXVpLW5hdmJhcl9faXRlbVwiLFxuICAgICAgdGFiVHdvU3R5bGVDbGFzczogXCJ3ZXVpLW5hdmJhcl9faXRlbSB3ZXVpLWJhcl9faXRlbV9vblwiXG4gICAgfSk7XG5cbiAgICB0aGlzLmNvbXB1dGVJbml0Q2hhcnRWaWV3SW50ZXJ2YWwoKTtcbiAgfVxuXG4gIHB1YmxpYyBuYXZpZ2F0ZVRvV2VpZ2h0SW5wdXRQYWdlKCk6IHZvaWQge1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiBcIi9wYWdlcy93ZWlnaHRSZWNvcmQvd2VpZ2h0SW5wdXRcIlxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG5hdmlnYXRlVG9UYXJnZXRJbnB1dFBhZ2UoKTogdm9pZCB7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6IFwiL3BhZ2VzL3dlaWdodFJlY29yZC90YXJnZXRJbnB1dFwiXG4gICAgfSk7XG4gIH1cblxuICAvLyBjaGVja3MgaWYgd2Vla0ludGVydmFsIHNlbGVjdGVkIGlzIHRoZSBwcmVzZW50IHdlZWsgb3IgYSBwYXN0IHdlZWsgKGZ1dHVyZSB3ZWVrcyBhcmUgbm90IGFsbG93ZWQpXG4gIHB1YmxpYyBjaGVja1dlZWtJbnRlcnZhbChuZXdXZWVrU3RhcnQ6IG1vbWVudCk6IGJvb2xlYW4ge1xuICAgIGxldCBwcmVzZW50V2VlazogbW9tZW50ID0gbW9tZW50KCk7XG4gICAgbGV0IG5ld1dlZWs6IG1vbWVudCA9IG5ld1dlZWtTdGFydDtcblxuICAgIGlmIChuZXdXZWVrLmlzQWZ0ZXIocHJlc2VudFdlZWssICd3ZWVrJykpIHtcbiAgICAgIHRoaXMuc2V0V2Vla1ZpZXdGbGFncyh0cnVlLCBmYWxzZSk7XG4gICAgICByZXR1cm4gZmFsc2U7IC8vIE5vdCBhbGxvd2VkIHRvIGNoYW5nZSBpbnRlcnZhbFxuXG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChuZXdXZWVrLmlzU2FtZShwcmVzZW50V2VlaywgJ3dlZWsnKSkge1xuICAgICAgICB0aGlzLnNldFdlZWtWaWV3RmxhZ3ModHJ1ZSwgZmFsc2UpO1xuXG4gICAgICAgIC8vIG5ld1dlZWsgaXMgYmVmb3JlIHByZXNlbnRXZWVrXG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLnNldFdlZWtWaWV3RmxhZ3ModHJ1ZSwgdHJ1ZSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdHJ1ZTsgIC8vIEFsbG93ZWQgdG8gY2hhbmdlIGludGVydmFsXG4gICAgfVxuICB9XG5cbiAgLy8gY2hlY2tzIGlmIG1vbnRoSW50ZXJ2YWwgc2VsZWN0ZWQgaXMgdGhlIHByZXNlbnQgbW9udGggb3IgYSBwYXN0IG1vbnRoIChmdXR1cmUgbW9udGhzIGFyZSBub3QgYWxsb3dlZClcbiAgcHVibGljIGNoZWNrTW9udGhJbnRlcnZhbChuZXdNb250aFN0YXJ0OiBtb21lbnQpOiBib29sZWFuIHtcbiAgICBsZXQgcHJlc2VudE1vbnRoOiBtb21lbnQgPSBtb21lbnQoKTtcbiAgICBsZXQgbmV3TW9udGg6IG1vbWVudCA9IG5ld01vbnRoU3RhcnQ7XG5cbiAgICBpZiAobmV3TW9udGguaXNBZnRlcihwcmVzZW50TW9udGgsICdtb250aCcpKSB7XG4gICAgICB0aGlzLnNldE1vbnRoVmlld0ZsYWdzKHRydWUsIGZhbHNlKTtcbiAgICAgIHJldHVybiBmYWxzZTsgLy8gTm90IGFsbG93ZWQgdG8gY2hhbmdlIGludGVydmFsXG5cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKG5ld01vbnRoLmlzU2FtZShwcmVzZW50TW9udGgsICdtb250aCcpKSB7XG4gICAgICAgIHRoaXMuc2V0TW9udGhWaWV3RmxhZ3ModHJ1ZSwgZmFsc2UpO1xuICAgICAgICAvLyBuZXdNb250aCBpcyBiZWZvcmUgcHJlc2VudE1vbnRoXG4gICAgICB9IGVsc2UgeyBcbiAgICAgICAgdGhpcy5zZXRNb250aFZpZXdGbGFncyh0cnVlLCB0cnVlKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0cnVlOyAgLy8gQWxsb3dlZCB0byBjaGFuZ2UgaW50ZXJ2YWxcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHNldFdlZWtWaWV3RmxhZ3MocHJldldlZWtGbGFnOiBib29sZWFuLCBuZXh0V2Vla0ZsYWc6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgaXNQcmV2V2Vla0FsbG93ZWQ6IHByZXZXZWVrRmxhZyxcbiAgICAgIGlzTmV4dFdlZWtBbGxvd2VkOiBuZXh0V2Vla0ZsYWdcbiAgICB9KTtcbiAgfVxuXG4gIHByaXZhdGUgc2V0TW9udGhWaWV3RmxhZ3MocHJldk1vbnRoRmxhZzogYm9vbGVhbiwgbmV4dE1vbnRoRmxhZzogYm9vbGVhbik6IHZvaWQge1xuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICBpc1ByZXZNb250aEFsbG93ZWQ6IHByZXZNb250aEZsYWcsXG4gICAgICBpc05leHRNb250aEFsbG93ZWQ6IG5leHRNb250aEZsYWdcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHNoaWZ0IGludGVydmFsIDEgd2VlayBpbnRvIHBhc3RcbiAgcHVibGljIHByZXZXZWVrSW50ZXJ2YWwoKTogdm9pZCB7XG4gICAgbGV0IG5ld1dlZWtTdGFydCA9IHRoaXMuZGF0YS5jaGFydFdlZWtWaWV3U3RhcnQuZGF0ZS5zdWJ0cmFjdCgxLCAndycpO1xuICAgIGxldCBuZXdXZWVrRW5kID0gdGhpcy5kYXRhLmNoYXJ0V2Vla1ZpZXdFbmQuZGF0ZS5zdWJ0cmFjdCgxLCAndycpO1xuXG4gICAgaWYodGhpcy5jaGVja1dlZWtJbnRlcnZhbChuZXdXZWVrU3RhcnQpKSB7XG4gICAgICB0aGlzLnNldFdlZWtWaWV3SW50ZXJ2YWwobmV3V2Vla1N0YXJ0LCBuZXdXZWVrRW5kKTtcblxuICAgICAgY29uc29sZS5sb2coXCJVbml4OiBcIiArIG5ld1dlZWtTdGFydC51bml4KCkgKyBcIiB0aWxsIFwiICsgbmV3V2Vla0VuZC51bml4KCkpO1xuICAgICAgbGV0IHdlZWtOdW06IG51bWJlciA9IG5ld1dlZWtTdGFydC53ZWVrKCk7XG4gICAgICB3ZWlnaHRSZWNvcmRQYWdlLmdldFdlZWtWaWV3RGF0YSh3ZWVrTnVtLCBuZXdXZWVrU3RhcnQudW5peCgpKTtcbiAgICB9XG4gIH1cblxuICAvLyBzaGlmdCBpbnRlcnZhbCAxIG1vbnRoIGludG8gcGFzdFxuICBwdWJsaWMgcHJldk1vbnRoSW50ZXJ2YWwoKTogdm9pZCB7XG4gICAgbGV0IG5ld01vbnRoU3RhcnQgPSB0aGlzLmRhdGEuY2hhcnRNb250aFZpZXdTdGFydC5kYXRlLnN1YnRyYWN0KDEsICdNJyk7XG4gICAgbGV0IG5ld01vbnRoRW5kID0gdGhpcy5kYXRhLmNoYXJ0TW9udGhWaWV3RW5kLmRhdGUuc3VidHJhY3QoMSwgJ00nKTtcblxuICAgIGlmICh0aGlzLmNoZWNrTW9udGhJbnRlcnZhbChuZXdNb250aFN0YXJ0KSkge1xuICAgICAgdGhpcy5zZXRNb250aFZpZXdJbnRlcnZhbChuZXdNb250aFN0YXJ0LCBuZXdNb250aEVuZCk7XG5cbiAgICAgIGNvbnNvbGUubG9nKFwiVW5peDogXCIgKyBuZXdNb250aFN0YXJ0LnVuaXgoKSArIFwiIHRpbGwgXCIgKyBuZXdNb250aEVuZC51bml4KCkpO1xuICAgICAgbGV0IG1vbnRoTnVtOiBudW1iZXIgPSBuZXdNb250aFN0YXJ0Lm1vbnRoKCk7XG4gICAgICB3ZWlnaHRSZWNvcmRQYWdlLmdldE1vbnRoVmlld0RhdGEobW9udGhOdW0sIG5ld01vbnRoU3RhcnQudW5peCgpKTtcbiAgICB9XG4gIH1cblxuICAvLyBzaGlmdCBpbnRlcnZhbCAxIHdlZWsgaW50byBmdXR1cmVcbiAgcHVibGljIG5leHRXZWVrSW50ZXJ2YWwoKTogdm9pZCB7XG4gICAgbGV0IG5ld1dlZWtTdGFydCA9IHRoaXMuZGF0YS5jaGFydFdlZWtWaWV3U3RhcnQuZGF0ZS5hZGQoMSwgJ3cnKTtcbiAgICBsZXQgbmV3V2Vla0VuZCA9IHRoaXMuZGF0YS5jaGFydFdlZWtWaWV3RW5kLmRhdGUuYWRkKDEsICd3Jyk7XG5cbiAgICBpZiAodGhpcy5jaGVja1dlZWtJbnRlcnZhbChuZXdXZWVrU3RhcnQpKSB7XG4gICAgICB0aGlzLnNldFdlZWtWaWV3SW50ZXJ2YWwobmV3V2Vla1N0YXJ0LCBuZXdXZWVrRW5kKTtcblxuICAgICAgY29uc29sZS5sb2coXCJVbml4OiBcIiArIG5ld1dlZWtTdGFydC51bml4KCkgKyBcIiB0aWxsIFwiICsgbmV3V2Vla0VuZC51bml4KCkpO1xuICAgICAgbGV0IHdlZWtOdW06IG51bWJlciA9IG5ld1dlZWtTdGFydC53ZWVrKCk7XG4gICAgICB3ZWlnaHRSZWNvcmRQYWdlLmdldFdlZWtWaWV3RGF0YSh3ZWVrTnVtLCBuZXdXZWVrU3RhcnQudW5peCgpKTtcbiAgICB9XG4gIH1cblxuICAvLyBzaGlmdCBpbnRlcnZhbCAxIG1vbnRoIGludG8gZnV0dXJlXG4gIHB1YmxpYyBuZXh0TW9udGhJbnRlcnZhbChlKTogdm9pZCB7XG4gICAgbGV0IG5ld01vbnRoU3RhcnQgPSB0aGlzLmRhdGEuY2hhcnRNb250aFZpZXdTdGFydC5kYXRlLmFkZCgxLCAnTScpO1xuICAgIGxldCBuZXdNb250aEVuZCA9IHRoaXMuZGF0YS5jaGFydE1vbnRoVmlld0VuZC5kYXRlLmFkZCgxLCAnTScpO1xuXG4gICAgaWYgKHRoaXMuY2hlY2tNb250aEludGVydmFsKG5ld01vbnRoU3RhcnQpKSB7XG4gICAgICB0aGlzLnNldE1vbnRoVmlld0ludGVydmFsKG5ld01vbnRoU3RhcnQsIG5ld01vbnRoRW5kKTtcblxuICAgICAgY29uc29sZS5sb2coXCJVbml4OiBcIiArIG5ld01vbnRoU3RhcnQudW5peCgpICsgXCIgdGlsbCBcIiArIG5ld01vbnRoRW5kLnVuaXgoKSk7XG4gICAgICBsZXQgbW9udGhOdW06IG51bWJlciA9IG5ld01vbnRoU3RhcnQubW9udGgoKTtcbiAgICAgIHdlaWdodFJlY29yZFBhZ2UuZ2V0TW9udGhWaWV3RGF0YShtb250aE51bSwgbmV3TW9udGhTdGFydC51bml4KCkpO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgc2V0V2Vla1ZpZXdJbnRlcnZhbChuZXdXZWVrU3RhcnQ6IG1vbWVudCwgbmV3V2Vla0VuZDogbW9tZW50KTogdm9pZCB7XG4gICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgIGNoYXJ0V2Vla1ZpZXdTdGFydDoge1xuICAgICAgICBkYXRlOiBuZXdXZWVrU3RhcnQsXG4gICAgICAgIHllYXI6IG5ld1dlZWtTdGFydC5mb3JtYXQoXCJZWVlZXCIpLFxuICAgICAgICBtb250aDogbmV3V2Vla1N0YXJ0LmZvcm1hdChcIk1NXCIpLFxuICAgICAgICBkYXk6IG5ld1dlZWtTdGFydC5mb3JtYXQoXCJERFwiKVxuICAgICAgfSxcbiAgICAgIGNoYXJ0V2Vla1ZpZXdFbmQ6IHtcbiAgICAgICAgZGF0ZTogbmV3V2Vla0VuZCxcbiAgICAgICAgeWVhcjogbmV3V2Vla0VuZC5mb3JtYXQoXCJZWVlZXCIpLFxuICAgICAgICBtb250aDogbmV3V2Vla0VuZC5mb3JtYXQoXCJNTVwiKSxcbiAgICAgICAgZGF5OiBuZXdXZWVrRW5kLmZvcm1hdChcIkREXCIpXG4gICAgICB9XG4gICAgfSk7XG4gIH1cblxuICBwcml2YXRlIHNldE1vbnRoVmlld0ludGVydmFsKG5ld01vbnRoU3RhcnQ6IG1vbWVudCwgbmV3TW9udGhFbmQ6IG1vbWVudCk6IHZvaWQge1xuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICBjaGFydE1vbnRoVmlld1N0YXJ0OiB7XG4gICAgICAgIGRhdGU6IG5ld01vbnRoU3RhcnQsXG4gICAgICAgIHllYXI6IG5ld01vbnRoU3RhcnQuZm9ybWF0KFwiWVlZWVwiKSxcbiAgICAgICAgbW9udGg6IG5ld01vbnRoU3RhcnQuZm9ybWF0KFwiTU1cIiksXG4gICAgICAgIGRheTogbmV3TW9udGhTdGFydC5mb3JtYXQoXCJERFwiKVxuICAgICAgfSxcbiAgICAgIGNoYXJ0TW9udGhWaWV3RW5kOiB7XG4gICAgICAgIGRhdGU6IG5ld01vbnRoRW5kLFxuICAgICAgICB5ZWFyOiBuZXdNb250aEVuZC5mb3JtYXQoXCJZWVlZXCIpLFxuICAgICAgICBtb250aDogbmV3TW9udGhFbmQuZm9ybWF0KFwiTU1cIiksXG4gICAgICAgIGRheTogbmV3TW9udGhFbmQuZm9ybWF0KFwiRERcIilcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBiaW5kQ2hhcnRWaWV3Q2hhbmdlKGU6IGFueSk6IHZvaWQge1xuICAgIC8vIGNoYW5nZSB0byBkZWZhdWx0IG1vbnRodmlldyBpbnRlcnZhbFxuICAgIGlmICh0aGlzLmRhdGEuY2hhcnRWaWV3SWR4ID09PSAnMCcgJiYgZS5kZXRhaWwudmFsdWUgPT09ICcxJykge1xuICAgICAgbGV0IGN1cnJNb250aDogbnVtYmVyID0gbW9tZW50KCkubW9udGgoKTtcbiAgICAgIGxldCBmaXJzdERheU9mTW9udGg6IG1vbWVudCA9IG1vbWVudCgpLm1vbnRoKGN1cnJNb250aCkuc3RhcnRPZihcIm1vbnRoXCIpO1xuICAgICAgbGV0IGxhc3REYXlPZk1vbnRoOiBtb21lbnQgPSBtb21lbnQoKS5tb250aChjdXJyTW9udGgpLmVuZE9mKFwibW9udGhcIik7IC8vIDIzOjU5OjU5IE5PVCAwMDowMDowMFxuICAgICAgY29uc29sZS5sb2coXCJGaXJzdCBkYXkgb2YgbW9udGggXCIgKyBmaXJzdERheU9mTW9udGguZm9ybWF0KFwiTU0tREQtSEgtTU0tU1NcIikgKyBcImxhc3QgZGF5IG9mIG1vbnRoXCIgKyBsYXN0RGF5T2ZNb250aC5mb3JtYXQoXCJNTS1ERC1ISC1NTS1TU1wiKSk7XG5cbiAgICAgIHRoaXMuc2V0TW9udGhWaWV3SW50ZXJ2YWwoZmlyc3REYXlPZk1vbnRoLCBsYXN0RGF5T2ZNb250aCk7XG5cbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICAgIGNoYXJ0Vmlld0lkeDogZS5kZXRhaWwudmFsdWUsXG4gICAgICB9KTtcblxuICAgICAgY29uc29sZS5sb2coXCJHcmFwaGhoaCBmaXJzdCBkYXkgb2YgbW9udGggdW5peCBcIiArIGZpcnN0RGF5T2ZNb250aC51bml4KCkgKyBcIiBsYXN0IGRheSBvZiBtb250aCB1bml4IFwiICsgbGFzdERheU9mTW9udGgudW5peCgpKTtcbiAgICAgIHdlaWdodFJlY29yZFBhZ2UuZ2V0TW9udGhWaWV3RGF0YShjdXJyTW9udGgsIGZpcnN0RGF5T2ZNb250aC51bml4KCkpO1xuICAgIH1cblxuICAgIC8vIGNoYW5nZSB0byBkZWZhdWx0IHdlZWt2aWV3IGludGVydmFsXG4gICAgaWYgKHRoaXMuZGF0YS5jaGFydFZpZXdJZHggPT09ICcxJyAmJiBlLmRldGFpbC52YWx1ZSA9PT0gJzAnKSB7XG4gICAgICBsZXQgY3VycldlZWs6IG51bWJlciA9IG1vbWVudCgpLndlZWsoKTtcbiAgICAgIGxldCBmaXJzdERheU9mV2VlazogbW9tZW50ID0gbW9tZW50KCkud2VlayhjdXJyV2VlaykuZGF5KDApLmhvdXIoMCkubWludXRlKDApLnNlY29uZCgwKTtcbiAgICAgIGxldCBsYXN0RGF5T2ZXZWVrOiBtb21lbnQgPSBtb21lbnQoKS53ZWVrKGN1cnJXZWVrKS5kYXkoNikuaG91cigwKS5taW51dGUoMCkuc2Vjb25kKDApO1xuXG4gICAgICB0aGlzLnNldFdlZWtWaWV3SW50ZXJ2YWwoZmlyc3REYXlPZldlZWssIGxhc3REYXlPZldlZWspO1xuXG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgICBjaGFydFZpZXdJZHg6IGUuZGV0YWlsLnZhbHVlLFxuICAgICAgfSk7XG4gICAgICBjb25zb2xlLmxvZyhcIkdyYXBoaGhoIGZpcnN0IGRheSBvZiB3ZWVrIHVuaXggXCIgKyBmaXJzdERheU9mV2Vlay51bml4KCkgKyBcIiBsYXN0IGRheSBvZiB3ZWVrIHVuaXggXCIgKyBsYXN0RGF5T2ZXZWVrLnVuaXgoKSk7XG4gICAgICB3ZWlnaHRSZWNvcmRQYWdlLmdldFdlZWtWaWV3RGF0YShjdXJyV2VlaywgZmlyc3REYXlPZldlZWsudW5peCgpKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgY29tcHV0ZVByZWdJbmZvKGRhdGVPZkRlbGl2ZXJ5OiBtb21lbnQpOiB2b2lkIHtcbiAgICAvLyBsZXQgbm93TW9tZW50ID0gbW9tZW50KCk7XG4gICAgLy8gbGV0IHRlbXAgPSBkYXRlT2ZEZWxpdmVyeS5kaWZmKG5vd01vbWVudCwgJ3dlZWtzJyk7XG5cbiAgICBsZXQgZGF0ZU9mQ29uY2VwdGlvbk1vbWVudCA9IGRhdGVPZkRlbGl2ZXJ5LnN1YnRyYWN0KDQwLCAndycpO1xuICAgIGxldCB0ZW1wRGF0ZSA9IHtcbiAgICAgIGRhdGU6IGRhdGVPZkNvbmNlcHRpb25Nb21lbnQuZm9ybWF0KFwiWVlZWS1NTS1ERFwiKSxcbiAgICAgIHllYXI6IGRhdGVPZkNvbmNlcHRpb25Nb21lbnQuZm9ybWF0KFwiWVlZWVwiKSxcbiAgICAgIG1vbnRoOiBkYXRlT2ZDb25jZXB0aW9uTW9tZW50LmZvcm1hdChcIk1NXCIpLFxuICAgICAgZGF5OiBkYXRlT2ZDb25jZXB0aW9uTW9tZW50LmZvcm1hdChcIkREXCIpXG4gICAgfTtcblxuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICAvLyBudW1XZWVrc1ByZWc6IHRlbXAsXG4gICAgICBkYXRlT2ZDb25jZXB0aW9uOiB0ZW1wRGF0ZVxuICAgIH0pO1xuICB9XG5cbiAgLy8gc2V0cyBjaGFydFdlZWtWaWV3IGFuZCBjaGFydE1vbnRoVmlldyB0byB0aGUgcHJlc2VudCB3ZWVrIGFuZCBtb250aCwgdGhlIGRlZmF1bHQgY2hhcnQgdmlld1xuICBwdWJsaWMgY29tcHV0ZUluaXRDaGFydFZpZXdJbnRlcnZhbCgpOiB2b2lkIHtcbiAgICBsZXQgY3VycldlZWs6IG51bWJlciA9IG1vbWVudCgpLndlZWsoKTtcbiAgICBsZXQgY3Vyck1vbnRoOiBudW1iZXIgPSBtb21lbnQoKS5tb250aCgpO1xuXG4gICAgbGV0IGZpcnN0RGF5T2ZXZWVrOiBtb21lbnQgPSBtb21lbnQoKS53ZWVrKGN1cnJXZWVrKS5kYXkoMCkuaG91cigwKS5taW51dGUoMCkuc2Vjb25kKDApO1xuICAgIGxldCBsYXN0RGF5T2ZXZWVrOiBtb21lbnQgPSBtb21lbnQoKS53ZWVrKGN1cnJXZWVrKS5kYXkoNikuaG91cigwKS5taW51dGUoMCkuc2Vjb25kKDApO1xuXG4gICAgdGhpcy5zZXRXZWVrVmlld0ludGVydmFsKGZpcnN0RGF5T2ZXZWVrLCBsYXN0RGF5T2ZXZWVrKTtcblxuICAgIGxldCBmaXJzdERheU9mTW9udGggPSBtb21lbnQoKS5tb250aChjdXJyTW9udGgpLnN0YXJ0T2YoXCJtb250aFwiKTtcbiAgICBsZXQgbGFzdERheU9mTW9udGggPSBtb21lbnQoKS5tb250aChjdXJyTW9udGgpLmVuZE9mKFwibW9udGhcIik7XG5cbiAgICB0aGlzLnNldE1vbnRoVmlld0ludGVydmFsKGZpcnN0RGF5T2ZNb250aCwgbGFzdERheU9mTW9udGgpO1xuXG4gICAgLy8gcmV0dXJuIGxlZnQsIHJpZ2h0IGFycm93cyBhbmQgdmlld1BpY2tlciB0byBkZWZhdWx0IHN0YXRlICh3aGljaCBpcyB3aGVuIHByZXNlbnQgd2VlayBpcyBzZWxlY3RlZClcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgaXNQcmV2V2Vla0FsbG93ZWQ6IHRydWUsXG4gICAgICBpc05leHRXZWVrQWxsb3dlZDogZmFsc2UsXG4gICAgICBpc1ByZXZNb250aEFsbG93ZWQ6IHRydWUsXG4gICAgICBpc05leHRNb250aEFsbG93ZWQ6IGZhbHNlLFxuICAgICAgY2hhcnRWaWV3SWR4OiAnMCdcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyByZXRyaWV2ZURhdGEoKTogdm9pZCB7XG4gICAgbGV0IHRva2VuID0gd3guZ2V0U3RvcmFnZVN5bmMoZ2xvYmFsRW51bS5nbG9iYWxLZXlfdG9rZW4pO1xuICAgIHdlYkFQSS5TZXRBdXRoVG9rZW4odG9rZW4pO1xuICAgIGxldCB0aGF0ID0gdGhpcztcblxuICAgIGxldCBjdXJyV2VlazogbnVtYmVyID0gbW9tZW50KCkud2VlaygpO1xuICAgIGxldCBmaXJzdERheU9mV2VlazogbnVtYmVyID0gbW9tZW50KCkud2VlayhjdXJyV2VlaykuZGF5KDApLnVuaXgoKTtcbiAgICBsZXQgbGFzdERheU9mV2VlazogbnVtYmVyID0gbW9tZW50KCkud2VlayhjdXJyV2VlaykuZGF5KDYpLnVuaXgoKTtcblxuICAgIHd4LnNob3dMb2FkaW5nKHtcbiAgICAgIHRpdGxlOiAn5q2j5Zyo5Yqg6L29JyxcbiAgICB9KTtcblxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgbGV0IHJlcSA9IHtcbiAgICAgICAgZGF0ZV9mcm9tOiAwLFxuICAgICAgICBkYXRlX3RvOiBsYXN0RGF5T2ZXZWVrXG4gICAgICB9O1xuXG4gICAgICB3ZWJBUEkuUmV0cmlldmVXZWlnaHRMb2cocmVxKS50aGVuKHJlc3AgPT4ge1xuICAgICAgICBjb25zb2xlLmxvZyhyZXNwKTtcblxuICAgICAgICAvLyBjb252ZXJ0IGRhdGVzIHRvIG1vbWVudHMgdGhlbiB0byBkYXRlIG9iamVjdHMgZm9yIGZsZXhpYmlsaXR5XG4gICAgICAgIGxldCB0ZW1wRGF0ZU9mRGVsaXZlcnkgPSB0aGF0LmNyZWF0ZUxvY2FsRGF0ZU9iamVjdChtb21lbnQudW5peChyZXNwLmV4cGVjdGVkX2JpcnRoX2RhdGUpKTtcbiAgICAgICAgbGV0IHRlbXBJbml0RGF0ZSA9IHRoYXQuY3JlYXRlTG9jYWxEYXRlT2JqZWN0KG1vbWVudC51bml4KHJlc3AuaW5pdGlhbF93ZWlnaHQuZGF0ZSkpO1xuICAgICAgICBsZXQgdGVtcExhdGVzdERhdGUgPSB0aGF0LmNyZWF0ZUxvY2FsRGF0ZU9iamVjdChtb21lbnQudW5peChyZXNwLmxhdGVzdF93ZWlnaHQuZGF0ZSkpO1xuICAgICAgICBsZXQgdGVtcFRhcmdldERhdGUgPSB0aGF0LmNyZWF0ZUxvY2FsRGF0ZU9iamVjdChtb21lbnQudW5peChyZXNwLnRhcmdldF93ZWlnaHQuZGF0ZSkpO1xuXG4gICAgICAgIGxldCB0ZW1wRGF0ZXNXaXRoUmVjb3JkcyA9IFtdO1xuICAgICAgICBsZXQgdGVtcFdlaWdodHMgPSBbXTtcbiAgICAgICAgbGV0IHRlbXBNYXAgPSBuZXcgTWFwKCk7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgcmVzcC53ZWlnaHRfbG9ncy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIGxldCB0ZW1wTW9tZW50ID0gbW9tZW50LnVuaXgocmVzcC53ZWlnaHRfbG9nc1tpXS5kYXRlKTtcbiAgICAgICAgICB0ZW1wRGF0ZXNXaXRoUmVjb3Jkcy5wdXNoKHtcbiAgICAgICAgICAgIGRhdGU6IHRlbXBNb21lbnQuZm9ybWF0KCdZWVlZLU1NLUREJyksXG4gICAgICAgICAgICB5ZWFyOiB0ZW1wTW9tZW50LmZvcm1hdChcIllZWVlcIiksXG4gICAgICAgICAgICBtb250aDogdGVtcE1vbWVudC5mb3JtYXQoXCJNTVwiKSxcbiAgICAgICAgICAgIGRheTogdGVtcE1vbWVudC5mb3JtYXQoXCJERFwiKVxuICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgdGVtcE1hcC5zZXQocmVzcC53ZWlnaHRfbG9nc1tpXS5kYXRlLCByZXNwLndlaWdodF9sb2dzW2ldLnZhbHVlKTsgLy8gY3JlYXRlICh0aW1lc3RhbXAgLT4gd2VpZ2h0KSBtYXBcbiAgICAgICAgICB0ZW1wV2VpZ2h0cy5wdXNoKHJlc3Aud2VpZ2h0X2xvZ3NbaV0udmFsdWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgKHRoYXQgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgICBpbml0V2VpZ2h0OiByZXNwLmluaXRpYWxfd2VpZ2h0LnZhbHVlLFxuICAgICAgICAgIGxhdGVzdFdlaWdodDogcmVzcC5sYXRlc3Rfd2VpZ2h0LnZhbHVlLFxuICAgICAgICAgIHRhcmdldFdlaWdodDogcmVzcC50YXJnZXRfd2VpZ2h0LnZhbHVlLFxuICAgICAgICAgIGluaXREYXRlOiB0ZW1wSW5pdERhdGUsXG4gICAgICAgICAgbGF0ZXN0RGF0ZTogdGVtcExhdGVzdERhdGUsXG4gICAgICAgICAgdGFyZ2V0RGF0ZTogdGVtcFRhcmdldERhdGUsXG4gICAgICAgICAgaXNUYXJnZXRTZXQ6IHRydWUsXG4gICAgICAgICAgY3Vyck1heElkeDogcmVzcC53ZWlnaHRfbG9ncy5sZW5ndGgsXG4gICAgICAgICAgcHJlZ1VwcGVyV2VpZ2h0TGltaXQ6IHJlc3Aud2VpZ2h0X3VwcGVyX2JvdW5kLFxuICAgICAgICAgIHByZWdMb3dlcldlaWdodExpbWl0OiByZXNwLndlaWdodF9sb3dlcl9ib3VuZCxcbiAgICAgICAgICBpc1ByZWduYW50TGFkeTogcmVzcC5pc19wcmVnbmFudF9sYWR5LFxuICAgICAgICAgIGRhdGVPZkRlbGl2ZXJ5OiB0ZW1wRGF0ZU9mRGVsaXZlcnksXG4gICAgICAgICAgbnVtV2Vla3NQcmVnOiByZXNwLm51bWJlcl9vZl9wcmVnbmFudF93ZWVrcyxcbiAgICAgICAgICB3ZWVrbHlXZWlnaHRDaGFuZ2VMb3dlcjogcmVzcC53ZWlnaHRfY2hhbmdlX3JhbmdlLmxvd2VyLzEwMCxcbiAgICAgICAgICB3ZWVrbHlXZWlnaHRDaGFuZ2VVcHBlcjogcmVzcC53ZWlnaHRfY2hhbmdlX3JhbmdlLnVwcGVyLzEwMFxuICAgICAgICB9KTtcblxuICAgICAgICB3ZWlnaHRSZWNvcmRQYWdlLmluaXRXZWlnaHQgPSByZXNwLmluaXRpYWxfd2VpZ2h0LnZhbHVlO1xuICAgICAgICB3ZWlnaHRSZWNvcmRQYWdlLnRhcmdldFdlaWdodCA9IHJlc3AudGFyZ2V0X3dlaWdodC52YWx1ZTtcbiAgICAgICAgd2VpZ2h0UmVjb3JkUGFnZS5pc1ByZWduYW50TGFkeSA9IHJlc3AuaXNfcHJlZ25hbnRfbGFkeTtcbiAgICAgICAgd2VpZ2h0UmVjb3JkUGFnZS5wcmVnVXBwZXJCb3VuZCA9IHJlc3Aud2VpZ2h0X3VwcGVyX2JvdW5kO1xuICAgICAgICB3ZWlnaHRSZWNvcmRQYWdlLnByZWdMb3dlckJvdW5kID0gcmVzcC53ZWlnaHRfbG93ZXJfYm91bmQ7XG4gICAgICAgIHdlaWdodFJlY29yZFBhZ2UudGltZXN0YW1wV2VpZ2h0TWFwID0gdGVtcE1hcDtcblxuICAgICAgICAvLyBoYW5kbGUgY2FzZSB3aGVyZSB1c2VyIGhhcyBub3Qgc2V0IHRhcmdldFxuICAgICAgICBpZiAocmVzcC50YXJnZXRfd2VpZ2h0LnZhbHVlID09IDApIHtcbiAgICAgICAgICAodGhhdCBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgICAgICAgaXNUYXJnZXRTZXQ6IGZhbHNlXG4gICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAodGhhdCBhcyBhbnkpLmNvbXB1dGVQcmVnSW5mbyhtb21lbnQudW5peChyZXNwLmV4cGVjdGVkX2JpcnRoX2RhdGUpKTtcbiAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgIGNvbnRlbnQ6ICfojrflj5bkvZPph43mlbDmja7lpLHotKUnLFxuICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB3eC5oaWRlTG9hZGluZyh7fSk7XG4gICAgfSwgMCk7XG4gIH1cblxuICBwcml2YXRlIGNyZWF0ZUxvY2FsRGF0ZU9iamVjdChkYXRlTW9tZW50OiBtb21lbnQpOiBhbnkge1xuICAgIHJldHVybiB7XG4gICAgICBkYXRlOiBkYXRlTW9tZW50LFxuICAgICAgeWVhcjogZGF0ZU1vbWVudC5mb3JtYXQoJ1lZWVknKSxcbiAgICAgIG1vbnRoOiBkYXRlTW9tZW50LmZvcm1hdCgnTU0nKSxcbiAgICAgIGRheTogZGF0ZU1vbWVudC5mb3JtYXQoJ0REJylcbiAgICB9O1xuICB9XG5cbiAgcHVibGljIG9uU2hvdyhlKSB7XG4gICAgdGhpcy5yZXRyaWV2ZURhdGEoKTtcbiAgfVxuXG4gIHB1YmxpYyBvbkxvYWQoKTogdm9pZCB7XG4gICAgdGhpcy5yZXRyaWV2ZURhdGEoKTtcbiAgICB0aGlzLmNvbXB1dGVJbml0Q2hhcnRWaWV3SW50ZXJ2YWwoKTtcblxuICAgIHd4LnNldE5hdmlnYXRpb25CYXJUaXRsZSh7XG4gICAgICB0aXRsZTogXCLkvZPph43orrDlvZVcIlxuICAgIH0pO1xuXG4gICAgdmFyIHdpbmRvd1dpZHRoID0gMTYwO1xuICAgIHRyeSB7XG4gICAgICB2YXIgcmVzID0gd3guZ2V0U3lzdGVtSW5mb1N5bmMoKTtcbiAgICAgIHdpbmRvd1dpZHRoID0gcmVzLndpbmRvd1dpZHRoO1xuICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJ2dldFN5c3RlbUluZm9TeW5jIGZhaWxlZCEnKTtcbiAgICB9XG4gICAgLy8gdGhpcy5nZW5lcmF0ZVdlaWdodExvZ0RhdGEoKTtcbiAgfVxuXG4gIC8vIHVzZWQgdG8gY3JlYXRlIGR1bW15IGRhdGFcbiAgLy8gcHVibGljIGdlbmVyYXRlV2VpZ2h0TG9nRGF0YSgpIHtcbiAgLy8gICBsZXQgdG9rZW4gPSB3eC5nZXRTdG9yYWdlU3luYyhnbG9iYWxFbnVtLmdsb2JhbEtleV90b2tlbik7XG4gIC8vICAgd2ViQVBJLlNldEF1dGhUb2tlbih0b2tlbik7XG4gIC8vICAgbGV0IHdlaWdodEZsb2F0ID0gNjU7XG4gIC8vICAgbGV0IHdlaWdodEludCA9IDY1O1xuICAvLyAgIGxldCBkYXRlID0gMTU1NjY0MDAwMDtcblxuICAvLyAgIGZvcih2YXIgaT0wOyBpPDY0OyBpKyspIHtcbiAgLy8gICAgIGxldCByZXEgPSB7XG4gIC8vICAgICAgIFwid2VpZ2h0X3ZhbHVlXCI6IHdlaWdodEludCxcbiAgLy8gICAgICAgXCJkYXRlXCI6IGRhdGVcbiAgLy8gICAgIH1cblxuICAvLyAgICAgY29uc29sZS5sb2coXCJDYWxsIFwiICsgaSk7XG4gIC8vICAgICBjb25zb2xlLmxvZyh3ZWlnaHRJbnQpO1xuICAvLyAgICAgY29uc29sZS5sb2cobW9tZW50LnVuaXgoZGF0ZSkuZm9ybWF0KCdZWVlZLU1NLUREJykpO1xuICAvLyAgICAgLy8gY2FsbFxuICAvLyAgICAgd2ViQVBJLkNyZWF0ZVdlaWdodExvZyhyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgIFxuICAvLyAgICAgfSkuY2F0Y2goZXJyID0+IHd4LmhpZGVMb2FkaW5nKCkpO1xuXG4gIC8vICAgICB3ZWlnaHRGbG9hdCArPSAwLjE7XG4gIC8vICAgICB3ZWlnaHRJbnQgPSBNYXRoLmZsb29yKHdlaWdodEZsb2F0KTtcbiAgLy8gICAgIGRhdGUgKz0gODY0MDA7XG4gIC8vICAgfSBcbiAgLy8gfVxufVxuXG5QYWdlKG5ldyB3ZWlnaHRSZWNvcmRQYWdlKCkpOyJdfQ==