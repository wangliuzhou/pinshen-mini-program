"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webAPI = require("../../api/app/AppService");
var globalEnum = require("../../api/GlobalEnum");
var ImageTagPage = (function () {
    function ImageTagPage() {
        this.mealId = -1;
        this.incrementalId = 0;
        this.textSearchFood = undefined;
        this.mealDate = 0;
        this.mealType = 0;
        this.divideproportion = 0;
        this.data = {
            currentTagIndex: 0,
            taggs: [],
            imageUrl: "",
            pixelRatio: 2,
            hideBanner: false,
            imageWidth: 0,
            screenWidth: 0
        };
    }
    ImageTagPage.prototype.onLoad = function (option) {
        var that = this;
        webAPI.SetAuthToken(wx.getStorageSync(globalEnum.globalKey_token));
        this.setData({
            imageUrl: option.imageUrl
        });
        console.log(option.mealType + "," + option.mealDate);
        wx.getImageInfo({
            src: option.imageUrl,
            success: function (res) {
                console.log(11111, res.width);
                console.log(22222, res.height);
                that.divideproportion = res.height / 720;
                that.setData({
                    imageWidth: res.width * 720 / res.height
                });
                console.log(3333, that.divideproportion);
            }
        });
        this.mealType = parseInt(option.mealType);
        this.mealDate = parseInt(option.mealDate);
        wx.getSystemInfo({
            success: function (res) {
                that.setData({
                    screenWidth: res.windowWidth
                });
                console.log("convert rate:" + 750 / res.windowWidth);
                console.log("pixel ratio:" + res.pixelRatio);
                that.setData({
                    pixelRatio: res.pixelRatio
                });
            }
        });
        var imagePath = option.imageUrl.split("/").pop();
        console.log(imagePath);
        this.getRecognitionResult(imagePath);
        this.getBannerStatus();
    };
    ImageTagPage.prototype.onShow = function () {
        var _a;
        if (this.textSearchFood) {
            console.log(this.textSearchFood);
            var operation = "taggs[" + this.data.currentTagIndex + "]";
            var foodName = this.textSearchFood.food_name.split("[")[0];
            var result = [{ food_id: this.textSearchFood.food_id, food_name: foodName, food_type: this.textSearchFood.food_type }];
            var tagY = this.data.taggs[this.data.currentTagIndex].tag_y;
            var tagX = this.data.taggs[this.data.currentTagIndex].tag_x;
            var tag = { food_id: this.textSearchFood.food_id, food_name: this.textSearchFood.food_name, food_type: this.textSearchFood.food_type, isDeleted: false, selectedPos: 0, showDeleteBtn: false, tag_x: tagX, tag_y: tagY, tag_height: 65, result_list: result };
            this.setData((_a = {},
                _a[operation] = tag,
                _a));
            this.textSearchFood = undefined;
        }
        else if (this.data.taggs[this.data.currentTagIndex] && this.data.taggs[this.data.currentTagIndex].result_list[0].food_id === 0) {
            this.data.taggs.splice(this.data.currentTagIndex, 1);
            console.log(this.data.taggs);
            this.setData({
                taggs: this.data.taggs,
                currentTagIndex: 0
            });
        }
    };
    ImageTagPage.prototype.getBannerStatus = function () {
        var hideBanner = wx.getStorageSync(globalEnum.globalkey_hideBanner);
        console.log(hideBanner);
        this.setData({
            hideBanner: hideBanner
        });
    };
    ImageTagPage.prototype.dismissBanner = function () {
        var that = this;
        wx.showModal({
            title: "",
            content: "确定不再展示此提示?",
            success: function (res) {
                if (res.confirm) {
                    wx.setStorageSync(globalEnum.globalkey_hideBanner, true);
                    that.setData({
                        hideBanner: true
                    });
                }
            }
        });
    };
    ImageTagPage.prototype.getRecognitionResult = function (imageKey) {
        var that = this;
        wx.showLoading({ title: "识别中...", mask: true });
        var req = { img_key: imageKey, meal_date: this.mealDate, meal_type: this.mealType };
        webAPI.RetrieveRecognition(req).then(function (resp) {
            console.log(resp);
            that.parseRecognitionData(resp);
            wx.hideLoading({});
        }).catch(function (err) {
            wx.hideLoading({});
            console.log(err);
            wx.showModal({
                title: '获取识别结果失败',
                content: JSON.stringify(err),
                showCancel: false
            });
        });
    };
    ImageTagPage.prototype.parseRecognitionData = function (resp) {
        var taggs = [];
        for (var index in resp.prediction) {
            var predictionItem = resp.prediction[index];
            var resultList = resp.prediction[index].result_list;
            var item = {
                tag_x: predictionItem.tag_x / (this.divideproportion * 2) - 15,
                tag_y: predictionItem.tag_y / (this.divideproportion * 2),
                bbox_x: predictionItem.bbox_x,
                bbox_y: predictionItem.bbox_y,
                bbox_w: predictionItem.bbox_w,
                bbox_h: predictionItem.bbox_h,
                food_id: predictionItem.food_id,
                food_type: predictionItem.food_type,
                food_name: predictionItem.food_name,
                tag_height: 65,
                selectedPos: 0,
                isDeleted: false,
                showDeleteBtn: false,
                result_list: resultList
            };
            taggs.push(item);
        }
        this.mealId = resp.meal_id;
        this.setData({
            taggs: taggs
        });
    };
    ImageTagPage.prototype.loadDummyData = function () {
        var taggs = [
            {
                tagType: 1,
                isDeleted: false,
                selectedPos: 0,
                result_list: [
                    { food_id: 0, food_name: "西兰花炒腊肉" }, { food_id: 0, food_name: "水煮青菜" }, { food_id: 0, food_name: "木须肉" }, { food_id: 0, food_name: "番茄炒鸡蛋" }, { food_id: 0, food_name: "麻婆豆腐" },
                ],
                showDeleteBtn: false,
                food_id: 0,
                food_name: "西兰花炒腊肉",
                tag_x: 50,
                tag_y: 50
            },
            {
                tagType: 1,
                isDeleted: false,
                selectedPos: 0,
                result_list: [
                    { food_id: 0, food_name: "米饭" }, { food_id: 0, food_name: "花卷" }, { food_id: 0, food_name: "牛奶" }, { food_id: 0, food_name: "白巧克力" }
                ],
                showDeleteBtn: false,
                food_id: 0,
                food_name: "米饭",
                tag_x: 300,
                tag_y: 50
            },
            {
                tagType: 1,
                isDeleted: false,
                selectedPos: 0,
                result_list: [
                    { food_id: 0, food_name: "炒油麦菜" }, { food_id: 0, food_name: "炒小白菜" }, { food_id: 0, food_name: "炒地瓜叶" }, { food_id: 0, food_name: "炒空心菜" }
                ],
                showDeleteBtn: false,
                food_id: 0,
                food_name: "炒油麦菜",
                tag_x: 100,
                tag_y: 200
            }
        ];
        this.setData({ taggs: taggs });
    };
    ImageTagPage.prototype.onChangeTagPosition = function (event) {
        var _a;
        var index = event.currentTarget.dataset.candidatesIndex;
        var operation = "taggs[" + this.data.currentTagIndex + "].selectedPos";
        var changeIdOperation = "taggs[" + this.data.currentTagIndex + "].food_id";
        var changeNameOperation = "taggs[" + this.data.currentTagIndex + "].food_name";
        var changeFoodTypeOperation = "taggs[" + this.data.currentTagIndex + "].food_type";
        this.setData((_a = {},
            _a[operation] = index,
            _a[changeIdOperation] = this.data.taggs[this.data.currentTagIndex].result_list[index].food_id,
            _a[changeNameOperation] = this.data.taggs[this.data.currentTagIndex].result_list[index].food_name,
            _a[changeFoodTypeOperation] = this.data.taggs[this.data.currentTagIndex].result_list[index].food_type,
            _a));
    };
    ImageTagPage.prototype.createTag = function (event) {
        console.log(event);
        var touchX = event.changedTouches[0].clientX - 40;
        var touchY = event.changedTouches[0].clientY - 18;
        console.log("x:" + touchX + ",y:" + touchY);
        var tag = {
            tagType: 3,
            isDeleted: false,
            tag_x: touchX,
            tag_y: touchY,
            tag_height: 65,
            selectedPos: 0,
            result_list: [{ food_id: 0, food_name: "这是什么?" }],
            showDeleteBtn: false
        };
        this.data.taggs.push(tag);
        this.setData({
            taggs: this.data.taggs,
            currentTagIndex: this.data.taggs.length - 1
        });
        this.incrementalId++;
        setTimeout(function () {
            wx.navigateTo({
                url: "/pages/textSearch/index?title=食物"
            });
        }, 500);
    };
    ImageTagPage.prototype.onTagMove = function (event) {
        var _a;
        var index = event.currentTarget.dataset.tagIndex;
        console.log(event.detail.x);
        console.log(event.detail.y);
        var xOperation = "taggs[" + index + "].tag_x";
        var yOperation = "taggs[" + index + "].tag_y";
        this.setData((_a = {},
            _a[xOperation] = event.detail.x,
            _a[yOperation] = event.detail.y,
            _a));
    };
    ImageTagPage.prototype.onStartTouchTag = function (event) {
        console.log("on touch start");
        var index = event.currentTarget.dataset.tagIndex;
        this.setData({
            currentTagIndex: index
        });
    };
    ImageTagPage.prototype.onToggleDeleteTag = function (event) {
        var _a;
        var index = event.currentTarget.dataset.tagIndex;
        var operation = "taggs[" + index + "].showDeleteBtn";
        var tagHeightOperation = "taggs[" + index + "].tag_height";
        var flag = this.data.taggs[index].showDeleteBtn;
        var height = flag ? 65 : 95;
        this.setData((_a = {},
            _a[operation] = !flag,
            _a[tagHeightOperation] = height,
            _a));
    };
    ImageTagPage.prototype.deleteTag = function (event) {
        var _a;
        var index = event.currentTarget.dataset.tagIndex;
        console.log("enter on delete " + index);
        var operation = "taggs[" + index + "].isDeleted";
        this.setData((_a = {},
            _a[operation] = true,
            _a.currentTagIndex = 0,
            _a));
        this.incrementalId++;
    };
    ImageTagPage.prototype.onAddTextSearchTag = function () {
        wx.navigateTo({
            url: "/pages/textSearch/index?title=更多食物"
        });
    };
    ImageTagPage.prototype.naviToFoodDetailPage = function () {
        var that = this;
        wx.getImageInfo({
            src: this.data.imageUrl,
            success: function (img) {
                var param = { imageUrl: that.data.imageUrl, mealId: 0, showShareBtn: true };
                var picRatio = img.width / that.data.screenWidth;
                console.log(img);
                console.log("picRatio:" + picRatio);
                var food_list = [];
                for (var index in that.data.taggs) {
                    var tag = that.data.taggs[index];
                    if (tag.isDeleted) {
                        continue;
                    }
                    ;
                    var tagX = Math.floor(tag.tag_x * that.data.pixelRatio * picRatio);
                    var tagY = Math.floor(tag.tag_y * that.data.pixelRatio * picRatio);
                    var bbox_x = tag.bbox_x;
                    var bbox_y = tag.bbox_y;
                    var bbox_w = tag.bbox_w;
                    var bbox_h = tag.bbox_h;
                    var foodId = tag.result_list[tag.selectedPos].food_id;
                    var foodType = tag.result_list[tag.selectedPos].food_type;
                    var results = tag.result_list;
                    var food = { food_id: foodId, input_type: 1, food_type: foodType, tag_x: tagX, tag_y: tagY, bbox_x: bbox_x, bbox_y: bbox_y, bbox_w: bbox_w, bbox_h: bbox_h, recognition_results: results };
                    food_list.push(food);
                }
                var req = { meal_id: that.mealId, meal_type: that.mealType, meal_date: that.mealDate, food_list: food_list };
                console.log(req);
                wx.showLoading({ title: "加载中..." });
                webAPI.CreateOrUpdateMealLog(req).then(function (resp) {
                    wx.hideLoading({});
                    that.mealId = resp.meal_id;
                    param.mealId = that.mealId;
                    param.imageUrl = that.data.imageUrl;
                    var paramJson = JSON.stringify(param);
                    wx.navigateTo({
                        url: "/pages/foodDetail/index?paramJson=" + paramJson
                    });
                }).catch(function (err) {
                    console.log(err);
                    wx.showModal({
                        title: '',
                        content: '获取食物信息失败',
                        showCancel: false
                    });
                });
            },
            fail: function (err) { console.log(err); }
        });
    };
    return ImageTagPage;
}());
Page(new ImageTagPage());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFtRDtBQUVuRCxpREFBbUQ7QUFpQ25EO0lBQUE7UUFDUyxXQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDWixrQkFBYSxHQUFHLENBQUMsQ0FBQztRQUNsQixtQkFBYyxHQUFXLFNBQVMsQ0FBQztRQUNuQyxhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2IsYUFBUSxHQUFHLENBQUMsQ0FBQztRQUViLHFCQUFnQixHQUFDLENBQUMsQ0FBQztRQUNuQixTQUFJLEdBQVM7WUFFbEIsZUFBZSxFQUFFLENBQUM7WUFDbEIsS0FBSyxFQUFFLEVBQUU7WUFDVCxRQUFRLEVBQUUsRUFBRTtZQUNaLFVBQVUsRUFBRSxDQUFDO1lBQ2IsVUFBVSxFQUFFLEtBQUs7WUFDakIsVUFBVSxFQUFDLENBQUM7WUFDWixXQUFXLEVBQUMsQ0FBQztTQUNkLENBQUE7SUEyWEgsQ0FBQztJQXpYUSw2QkFBTSxHQUFiLFVBQWMsTUFBVztRQUN2QixJQUFJLElBQUksR0FBRyxJQUFJLENBQUM7UUFFaEIsTUFBTSxDQUFDLFlBQVksQ0FBQyxFQUFFLENBQUMsY0FBYyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsQ0FBQyxDQUFDO1FBRWxFLElBQVksQ0FBQyxPQUFPLENBQUM7WUFDcEIsUUFBUSxFQUFFLE1BQU0sQ0FBQyxRQUFRO1NBQzFCLENBQUMsQ0FBQztRQUNILE9BQU8sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDLFFBQVEsR0FBRyxHQUFHLEdBQUcsTUFBTSxDQUFDLFFBQVEsQ0FBQyxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxZQUFZLENBQUM7WUFDZCxHQUFHLEVBQUUsTUFBTSxDQUFDLFFBQVE7WUFDcEIsT0FBTyxZQUFDLEdBQUc7Z0JBQ1QsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFBO2dC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QUUsQ0FBQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgd2ViQVBJIGZyb20gJy4uLy4uL2FwaS9hcHAvQXBwU2VydmljZSc7XG5pbXBvcnQgeyBSZXRyaWV2ZVJlY29nbml0aW9uUmVxLCBSZXRyaWV2ZVJlY29nbml0aW9uUmVzcCB9IGZyb20gXCIvYXBpL2FwcC9BcHBTZXJ2aWNlT2Jqc1wiO1xuaW1wb3J0ICogYXMgZ2xvYmFsRW51bSBmcm9tICcuLi8uLi9hcGkvR2xvYmFsRW51bSc7XG5cblxudHlwZSBEYXRhID0ge1xuICBjdXJyZW50VGFnSW5kZXg6IG51bWJlcjtcbiAgdGFnZ3M6IFRhZ1tdO1xuICBpbWFnZVVybDogc3RyaW5nO1xuICBwaXhlbFJhdGlvOiBudW1iZXI7XG4gIGhpZGVCYW5uZXI6IGJvb2xlYW47XG4gIGltYWdlV2lkdGg6bnVtYmVyO1xufVxudHlwZSBUYWcgPSB7XG4gIGlzRGVsZXRlZDogYm9vbGVhbjtcbiAgdGFnX3g6IG51bWJlcjtcbiAgdGFnX3k6IG51bWJlcjtcbiAgYmJveF94Om51bWJlcjtcbiAgYmJveF95OiBudW1iZXI7XG4gIGJib3hfdzogbnVtYmVyO1xuICBiYm94X2g6IG51bWJlcjtcbiAgdGFnX2hlaWdodDogbnVtYmVyO1xuICBmb29kX3R5cGU6IG51bWJlcjsgIC8vMS5yZWNlaXBlIDIuIHJlY2VpcGVcbiAgdGFnVHlwZTogbnVtYmVyOyAvLzEgcmVjb2duaXRpb24sIDIgdGV4dFNlYXJjaCAzLmFkZGl0aW9uYWxTZWFyY2hcbiAgc2hvd0RlbGV0ZUJ0bjogZmFsc2U7XG4gIHNlbGVjdGVkUG9zOiBudW1iZXI7XG4gIHJlc3VsdF9saXN0OiBSZXN1bHRbXTtcbn1cblxudHlwZSBSZXN1bHQgPSB7XG4gIGZvb2RfaWQ6IG51bWJlcjtcbiAgZm9vZF9uYW1lOiBzdHJpbmc7XG4gIGZvb2RfdHlwZTogbnVtYmVyO1xufVxuXG5jbGFzcyBJbWFnZVRhZ1BhZ2Uge1xuICBwdWJsaWMgbWVhbElkID0gLTE7XG4gIHB1YmxpYyBpbmNyZW1lbnRhbElkID0gMDtcbiAgcHVibGljIHRleHRTZWFyY2hGb29kOiBSZXN1bHQgPSB1bmRlZmluZWQ7XG4gIHB1YmxpYyBtZWFsRGF0ZSA9IDA7XG4gIHB1YmxpYyBtZWFsVHlwZSA9IDA7XG4gIC8vIHB1YmxpYyBzY3JlZW5XaWR0aCA9IDA7XG4gIHB1YmxpYyBkaXZpZGVwcm9wb3J0aW9uPTA7Ly/nnJ/lrp7lrr3luqbpmaTku6U3MjBycHjvvJtcbiAgcHVibGljIGRhdGE6IERhdGEgPSB7XG4gICAgLy9tb2NrdXAgdGFnIGxpc3RcbiAgICBjdXJyZW50VGFnSW5kZXg6IDAsXG4gICAgdGFnZ3M6IFtdLFxuICAgIGltYWdlVXJsOiBcIlwiLFxuICAgIHBpeGVsUmF0aW86IDIsXG4gICAgaGlkZUJhbm5lcjogZmFsc2UsXG4gICAgaW1hZ2VXaWR0aDowLFxuICAgIHNjcmVlbldpZHRoOjBcbiAgfVxuXG4gIHB1YmxpYyBvbkxvYWQob3B0aW9uOiBhbnkpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgLy9zZXQgdG9rZW4gaW50byB3ZWJBUElcbiAgICB3ZWJBUEkuU2V0QXV0aFRva2VuKHd4LmdldFN0b3JhZ2VTeW5jKGdsb2JhbEVudW0uZ2xvYmFsS2V5X3Rva2VuKSk7IFxuICAgIC8vbG9hZCBuZWNlc3NhcnkgZGF0YSBpbnRvIHBhZ2VcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgaW1hZ2VVcmw6IG9wdGlvbi5pbWFnZVVybFxuICAgIH0pO1xuICAgIGNvbnNvbGUubG9nKG9wdGlvbi5tZWFsVHlwZSArIFwiLFwiICsgb3B0aW9uLm1lYWxEYXRlKTtcbiAgICB3eC5nZXRJbWFnZUluZm8oe1xuICAgICAgc3JjOiBvcHRpb24uaW1hZ2VVcmwsXG4gICAgICBzdWNjZXNzKHJlcykge1xuICAgICAgICBjb25zb2xlLmxvZygxMTExMSxyZXMud2lkdGgpXG4gICAgICAgIGNvbnNvbGUubG9nKDIyMjIyLHJlcy5oZWlnaHQpXG4gICAgICAgIHRoYXQuZGl2aWRlcHJvcG9ydGlvbiA9IHJlcy5oZWlnaHQvNzIwXG4gICAgICAgIHRoYXQuc2V0RGF0YSh7XG4gICAgICAgICAgaW1hZ2VXaWR0aDpyZXMud2lkdGgqNzIwL3Jlcy5oZWlnaHRcbiAgICAgICAgfSlcbiAgICAgICAgY29uc29sZS5sb2coMzMzMyx0aGF0LmRpdmlkZXByb3BvcnRpb24pXG4gICAgICB9XG4gICAgfSlcbiAgICB0aGlzLm1lYWxUeXBlID0gcGFyc2VJbnQob3B0aW9uLm1lYWxUeXBlKTtcbiAgICB0aGlzLm1lYWxEYXRlID0gcGFyc2VJbnQob3B0aW9uLm1lYWxEYXRlKTtcbiAgICB3eC5nZXRTeXN0ZW1JbmZvKHtcbiAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uIChyZXMpIHtcbiAgICAgICAgLy8gdGhhdC5zY3JlZW5XaWR0aCA9IHJlcy53aW5kb3dXaWR0aDtcbiAgICAgICAgKHRoYXQgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgICBzY3JlZW5XaWR0aDogcmVzLndpbmRvd1dpZHRoXG4gICAgICAgIH0pXG4gICAgICAgIGNvbnNvbGUubG9nKFwiY29udmVydCByYXRlOlwiICsgNzUwIC8gcmVzLndpbmRvd1dpZHRoKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJwaXhlbCByYXRpbzpcIiArIHJlcy5waXhlbFJhdGlvKTtcbiAgICAgICAgKHRoYXQgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgICBwaXhlbFJhdGlvOiByZXMucGl4ZWxSYXRpb1xuICAgICAgICB9KVxuICAgICAgfVxuICAgIH0pO1xuICAgIC8vIHRoaXMubG9hZER1bW15RGF0YSgpO1xuICAgIHZhciBpbWFnZVBhdGggPSBvcHRpb24uaW1hZ2VVcmwuc3BsaXQoXCIvXCIpLnBvcCgpO1xuICAgIGNvbnNvbGUubG9nKGltYWdlUGF0aCk7XG4gICAgdGhpcy5nZXRSZWNvZ25pdGlvblJlc3VsdChpbWFnZVBhdGgpO1xuICAgIHRoaXMuZ2V0QmFubmVyU3RhdHVzKCk7XG4gIH1cblxuICBwdWJsaWMgb25TaG93KCkge1xuICAgIGlmICh0aGlzLnRleHRTZWFyY2hGb29kKSB7XG4gICAgICBjb25zb2xlLmxvZyh0aGlzLnRleHRTZWFyY2hGb29kKTtcbiAgICAgIGxldCBvcGVyYXRpb24gPSBcInRhZ2dzW1wiICsgdGhpcy5kYXRhLmN1cnJlbnRUYWdJbmRleCArIFwiXVwiO1xuICAgICAgbGV0IGZvb2ROYW1lID0gdGhpcy50ZXh0U2VhcmNoRm9vZC5mb29kX25hbWUuc3BsaXQoXCJbXCIpWzBdO1xuICAgICAgbGV0IHJlc3VsdCA9IFt7IGZvb2RfaWQ6IHRoaXMudGV4dFNlYXJjaEZvb2QuZm9vZF9pZCwgZm9vZF9uYW1lOiBmb29kTmFtZSwgZm9vZF90eXBlOiB0aGlzLnRleHRTZWFyY2hGb29kLmZvb2RfdHlwZSB9XTtcbiAgICAgIGxldCB0YWdZID0gdGhpcy5kYXRhLnRhZ2dzW3RoaXMuZGF0YS5jdXJyZW50VGFnSW5kZXhdLnRhZ195O1xuICAgICAgbGV0IHRhZ1ggPSB0aGlzLmRhdGEudGFnZ3NbdGhpcy5kYXRhLmN1cnJlbnRUYWdJbmRleF0udGFnX3g7XG4gICAgICBsZXQgdGFnID0geyBmb29kX2lkOiB0aGlzLnRleHRTZWFyY2hGb29kLmZvb2RfaWQsIGZvb2RfbmFtZTogdGhpcy50ZXh0U2VhcmNoRm9vZC5mb29kX25hbWUsIGZvb2RfdHlwZTogdGhpcy50ZXh0U2VhcmNoRm9vZC5mb29kX3R5cGUsIGlzRGVsZXRlZDogZmFsc2UsIHNlbGVjdGVkUG9zOiAwLCBzaG93RGVsZXRlQnRuOiBmYWxzZSwgdGFnX3g6IHRhZ1gsIHRhZ195OiB0YWdZLCB0YWdfaGVpZ2h0OiA2NSwgcmVzdWx0X2xpc3Q6IHJlc3VsdCB9O1xuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgW29wZXJhdGlvbl06IHRhZyxcbiAgICAgIH0pO1xuICAgICAgdGhpcy50ZXh0U2VhcmNoRm9vZCA9IHVuZGVmaW5lZDtcbiAgICB9IGVsc2UgaWYgKHRoaXMuZGF0YS50YWdnc1t0aGlzLmRhdGEuY3VycmVudFRhZ0luZGV4XSAmJiB0aGlzLmRhdGEudGFnZ3NbdGhpcy5kYXRhLmN1cnJlbnRUYWdJbmRleF0ucmVzdWx0X2xpc3RbMF0uZm9vZF9pZCA9PT0gMCkge1xuICAgICAgLy9yZW1vdmUgdGV4dCBzZWFyY2ggaXRlbVxuICAgICAgdGhpcy5kYXRhLnRhZ2dzLnNwbGljZSh0aGlzLmRhdGEuY3VycmVudFRhZ0luZGV4LCAxKTtcbiAgICAgIGNvbnNvbGUubG9nKHRoaXMuZGF0YS50YWdncyk7XG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgICB0YWdnczogdGhpcy5kYXRhLnRhZ2dzLFxuICAgICAgICBjdXJyZW50VGFnSW5kZXg6IDBcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxuXG4gIC8vIHB1YmxpYyBvblJlYWR5KCl7XG4gIC8vICAgY29uc29sZS5sb2coNzc3NzcrJz09PT09PT09PT09PT09PT09PT09PT09PT09PScpXG4gIC8vICAgY29uc3QgdGhhdCA9IHRoaXNcbiAgLy8gICBjb25zdCBxdWVyeSA9IHd4LmNyZWF0ZVNlbGVjdG9yUXVlcnkoKVxuICAvLyAgIHF1ZXJ5LnNlbGVjdCgnLmFubm90YXRlZC1pbWFnZScpLmJvdW5kaW5nQ2xpZW50UmVjdChmdW5jdGlvbiAocmVzKSB7XG4gIC8vICAgICBjb25zb2xlLmxvZygnYm91bmRpbmdDbGllbnRSZWN0JyxyZXMpXG4gIC8vICAgICB0aGF0LnNldERhdGEoe1xuICAvLyAgICAgICBpbWFnZVdpZHRoOnJlcy53aWR0aFxuICAvLyAgICAgfSlcbiAgLy8gICB9KVxuICAvLyAgIHF1ZXJ5LmV4ZWMoKVxuICAvLyB9XG5cbiAgcHVibGljIGdldEJhbm5lclN0YXR1cygpIHtcbiAgICBsZXQgaGlkZUJhbm5lciA9IHd4LmdldFN0b3JhZ2VTeW5jKGdsb2JhbEVudW0uZ2xvYmFsa2V5X2hpZGVCYW5uZXIpO1xuICAgIGNvbnNvbGUubG9nKGhpZGVCYW5uZXIpO1xuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICBoaWRlQmFubmVyOiBoaWRlQmFubmVyXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgZGlzbWlzc0Jhbm5lcigpe1xuICAgIHZhciB0aGF0PSB0aGlzO1xuICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICB0aXRsZTpcIlwiLFxuICAgICAgY29udGVudDpcIuehruWumuS4jeWGjeWxleekuuatpOaPkOekuj9cIixcbiAgICAgIHN1Y2Nlc3MocmVzKSB7XG4gICAgICAgIGlmIChyZXMuY29uZmlybSkge1xuICAgICAgICAgIC8vc2V0dGluZyBnbG9iYWwgdmlyYWJsZVxuICAgICAgICAgIHd4LnNldFN0b3JhZ2VTeW5jKGdsb2JhbEVudW0uZ2xvYmFsa2V5X2hpZGVCYW5uZXIsdHJ1ZSk7XG4gICAgICAgICAgKHRoYXQgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgICAgIGhpZGVCYW5uZXI6IHRydWVcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGdldFJlY29nbml0aW9uUmVzdWx0KGltYWdlS2V5OiBTdHJpbmcpIHtcbiAgICB2YXIgdGhhdCA9IHRoaXM7XG4gICAgd3guc2hvd0xvYWRpbmcoeyB0aXRsZTogXCLor4bliKvkuK0uLi5cIiwgbWFzazogdHJ1ZSB9KTtcbiAgICBsZXQgcmVxOiBSZXRyaWV2ZVJlY29nbml0aW9uUmVxID0geyBpbWdfa2V5OiBpbWFnZUtleSwgbWVhbF9kYXRlOiB0aGlzLm1lYWxEYXRlLCBtZWFsX3R5cGU6IHRoaXMubWVhbFR5cGUgfTtcbiAgICB3ZWJBUEkuUmV0cmlldmVSZWNvZ25pdGlvbihyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhyZXNwKTtcbiAgICAgIHRoYXQucGFyc2VSZWNvZ25pdGlvbkRhdGEocmVzcCk7XG4gICAgICB3eC5oaWRlTG9hZGluZyh7fSk7XG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgIHd4LmhpZGVMb2FkaW5nKHt9KTtcbiAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgIHRpdGxlOiAn6I635Y+W6K+G5Yir57uT5p6c5aSx6LSlJyxcbiAgICAgICAgICBjb250ZW50OiBKU09OLnN0cmluZ2lmeShlcnIpLFxuICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBwYXJzZVJlY29nbml0aW9uRGF0YShyZXNwOiBSZXRyaWV2ZVJlY29nbml0aW9uUmVzcCkge1xuICAgIGxldCB0YWdncyA9IFtdO1xuICAgIGZvciAobGV0IGluZGV4IGluIHJlc3AucHJlZGljdGlvbikge1xuICAgICAgbGV0IHByZWRpY3Rpb25JdGVtID0gcmVzcC5wcmVkaWN0aW9uW2luZGV4XTtcbiAgICAgIGxldCByZXN1bHRMaXN0ID0gcmVzcC5wcmVkaWN0aW9uW2luZGV4XS5yZXN1bHRfbGlzdDtcbiAgICAgIGxldCBpdGVtID0ge1xuICAgICAgICAvLyB0YWdfeDogcHJlZGljdGlvbkl0ZW0udGFnX3ggLyAodGhpcy5kaXZpZGVwcm9wb3J0aW9uICogdGhpcy5kYXRhLnBpeGVsUmF0aW8pLFxuICAgICAgICAvLyB0YWdfeTogcHJlZGljdGlvbkl0ZW0udGFnX3kgLyAodGhpcy5kaXZpZGVwcm9wb3J0aW9uICogdGhpcy5kYXRhLnBpeGVsUmF0aW8pLFxuICAgICAgICB0YWdfeDogcHJlZGljdGlvbkl0ZW0udGFnX3ggLyAodGhpcy5kaXZpZGVwcm9wb3J0aW9uICogMiktMTUsXG4gICAgICAgIHRhZ195OiBwcmVkaWN0aW9uSXRlbS50YWdfeSAvICh0aGlzLmRpdmlkZXByb3BvcnRpb24gKiAyKSxcbiAgICAgICAgLy8gdGFnX3g6IHByZWRpY3Rpb25JdGVtLnRhZ194IC8gKHRoaXMuZGF0YS5waXhlbFJhdGlvKSxcbiAgICAgICAgLy8gdGFnX3k6IHByZWRpY3Rpb25JdGVtLnRhZ195IC8gKHRoaXMuZGF0YS5waXhlbFJhdGlvKSxcbiAgICAgICAgYmJveF94OiBwcmVkaWN0aW9uSXRlbS5iYm94X3gsXG4gICAgICAgIGJib3hfeTogcHJlZGljdGlvbkl0ZW0uYmJveF95LFxuICAgICAgICBiYm94X3c6IHByZWRpY3Rpb25JdGVtLmJib3hfdyxcbiAgICAgICAgYmJveF9oOiBwcmVkaWN0aW9uSXRlbS5iYm94X2gsXG4gICAgICAgIGZvb2RfaWQ6IHByZWRpY3Rpb25JdGVtLmZvb2RfaWQsXG4gICAgICAgIGZvb2RfdHlwZTogcHJlZGljdGlvbkl0ZW0uZm9vZF90eXBlLFxuICAgICAgICBmb29kX25hbWU6IHByZWRpY3Rpb25JdGVtLmZvb2RfbmFtZSxcbiAgICAgICAgdGFnX2hlaWdodDogNjUsXG4gICAgICAgIHNlbGVjdGVkUG9zOiAwLFxuICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICBzaG93RGVsZXRlQnRuOiBmYWxzZSxcbiAgICAgICAgcmVzdWx0X2xpc3Q6IHJlc3VsdExpc3RcbiAgICAgIH07XG4gICAgICB0YWdncy5wdXNoKGl0ZW0pO1xuICAgIH1cbiAgICB0aGlzLm1lYWxJZCA9IHJlc3AubWVhbF9pZDtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgdGFnZ3M6IHRhZ2dzXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbG9hZER1bW15RGF0YSgpIHtcbiAgICBsZXQgdGFnZ3MgPSBbXG4gICAgICB7XG4gICAgICAgIHRhZ1R5cGU6IDEsXG4gICAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICAgIHNlbGVjdGVkUG9zOiAwLFxuICAgICAgICByZXN1bHRfbGlzdDogW1xuICAgICAgICAgIHsgZm9vZF9pZDogMCwgZm9vZF9uYW1lOiBcIuilv+WFsOiKseeCkuiFiuiCiVwiIH0sIHsgZm9vZF9pZDogMCwgZm9vZF9uYW1lOiBcIuawtOeFrumdkuiPnFwiIH0sIHsgZm9vZF9pZDogMCwgZm9vZF9uYW1lOiBcIuacqOmhu+iCiVwiIH0sIHsgZm9vZF9pZDogMCwgZm9vZF9uYW1lOiBcIueVquiMhOeCkum4oeibi1wiIH0sIHsgZm9vZF9pZDogMCwgZm9vZF9uYW1lOiBcIum6u+WphuixhuiFkFwiIH0sXG4gICAgICAgIF0sXG4gICAgICAgIHNob3dEZWxldGVCdG46IGZhbHNlLFxuICAgICAgICBmb29kX2lkOiAwLFxuICAgICAgICBmb29kX25hbWU6IFwi6KW/5YWw6Iqx54KS6IWK6IKJXCIsXG4gICAgICAgIHRhZ194OiA1MCxcbiAgICAgICAgdGFnX3k6IDUwXG4gICAgICB9LFxuICAgICAge1xuICAgICAgICB0YWdUeXBlOiAxLFxuICAgICAgICBpc0RlbGV0ZWQ6IGZhbHNlLFxuICAgICAgICBzZWxlY3RlZFBvczogMCxcbiAgICAgICAgcmVzdWx0X2xpc3Q6IFtcbiAgICAgICAgICB7IGZvb2RfaWQ6IDAsIGZvb2RfbmFtZTogXCLnsbPppa1cIiB9LCB7IGZvb2RfaWQ6IDAsIGZvb2RfbmFtZTogXCLoirHljbdcIiB9LCB7IGZvb2RfaWQ6IDAsIGZvb2RfbmFtZTogXCLniZvlpbZcIiB9LCB7IGZvb2RfaWQ6IDAsIGZvb2RfbmFtZTogXCLnmb3lt6flhYvliptcIiB9XG4gICAgICAgIF0sXG4gICAgICAgIHNob3dEZWxldGVCdG46IGZhbHNlLFxuICAgICAgICBmb29kX2lkOiAwLFxuICAgICAgICBmb29kX25hbWU6IFwi57Gz6aWtXCIsXG4gICAgICAgIHRhZ194OiAzMDAsXG4gICAgICAgIHRhZ195OiA1MFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgdGFnVHlwZTogMSxcbiAgICAgICAgaXNEZWxldGVkOiBmYWxzZSxcbiAgICAgICAgc2VsZWN0ZWRQb3M6IDAsXG4gICAgICAgIHJlc3VsdF9saXN0OiBbXG4gICAgICAgICAgeyBmb29kX2lkOiAwLCBmb29kX25hbWU6IFwi54KS5rK56bqm6I+cXCIgfSwgeyBmb29kX2lkOiAwLCBmb29kX25hbWU6IFwi54KS5bCP55m96I+cXCIgfSwgeyBmb29kX2lkOiAwLCBmb29kX25hbWU6IFwi54KS5Zyw55Oc5Y+2XCIgfSwgeyBmb29kX2lkOiAwLCBmb29kX25hbWU6IFwi54KS56m65b+D6I+cXCIgfVxuICAgICAgICBdLFxuICAgICAgICBzaG93RGVsZXRlQnRuOiBmYWxzZSxcbiAgICAgICAgZm9vZF9pZDogMCxcbiAgICAgICAgZm9vZF9uYW1lOiBcIueCkuayuem6puiPnFwiLFxuICAgICAgICB0YWdfeDogMTAwLFxuICAgICAgICB0YWdfeTogMjAwXG4gICAgICB9XG4gICAgXTtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoeyB0YWdnczogdGFnZ3MgfSk7XG4gIH1cblxuICBwdWJsaWMgb25DaGFuZ2VUYWdQb3NpdGlvbihldmVudDogYW55KSB7XG4gICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmNhbmRpZGF0ZXNJbmRleDtcbiAgICBsZXQgb3BlcmF0aW9uID0gXCJ0YWdnc1tcIiArIHRoaXMuZGF0YS5jdXJyZW50VGFnSW5kZXggKyBcIl0uc2VsZWN0ZWRQb3NcIjtcbiAgICBsZXQgY2hhbmdlSWRPcGVyYXRpb24gPSBcInRhZ2dzW1wiICsgdGhpcy5kYXRhLmN1cnJlbnRUYWdJbmRleCArIFwiXS5mb29kX2lkXCI7XG4gICAgbGV0IGNoYW5nZU5hbWVPcGVyYXRpb24gPSBcInRhZ2dzW1wiICsgdGhpcy5kYXRhLmN1cnJlbnRUYWdJbmRleCArIFwiXS5mb29kX25hbWVcIjtcbiAgICBsZXQgY2hhbmdlRm9vZFR5cGVPcGVyYXRpb24gPSBcInRhZ2dzW1wiICsgdGhpcy5kYXRhLmN1cnJlbnRUYWdJbmRleCArIFwiXS5mb29kX3R5cGVcIjtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgW29wZXJhdGlvbl06IGluZGV4LFxuICAgICAgW2NoYW5nZUlkT3BlcmF0aW9uXTogdGhpcy5kYXRhLnRhZ2dzW3RoaXMuZGF0YS5jdXJyZW50VGFnSW5kZXhdLnJlc3VsdF9saXN0W2luZGV4XS5mb29kX2lkLFxuICAgICAgW2NoYW5nZU5hbWVPcGVyYXRpb25dOiB0aGlzLmRhdGEudGFnZ3NbdGhpcy5kYXRhLmN1cnJlbnRUYWdJbmRleF0ucmVzdWx0X2xpc3RbaW5kZXhdLmZvb2RfbmFtZSxcbiAgICAgIFtjaGFuZ2VGb29kVHlwZU9wZXJhdGlvbl06IHRoaXMuZGF0YS50YWdnc1t0aGlzLmRhdGEuY3VycmVudFRhZ0luZGV4XS5yZXN1bHRfbGlzdFtpbmRleF0uZm9vZF90eXBlXG4gICAgfSk7XG4gIH1cblxuICAvL2NoZWNrIHRoZSB0YWcgYXJlYSwgZ2VuZXJhdGUgZG90IGNvdmVyLWltYWdlXG4gIHB1YmxpYyBjcmVhdGVUYWcoZXZlbnQ6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKGV2ZW50KTtcbiAgICBsZXQgdG91Y2hYID0gZXZlbnQuY2hhbmdlZFRvdWNoZXNbMF0uY2xpZW50WCAtIDQwO1xuICAgIGxldCB0b3VjaFkgPSBldmVudC5jaGFuZ2VkVG91Y2hlc1swXS5jbGllbnRZIC0gMTg7XG4gICAgY29uc29sZS5sb2coXCJ4OlwiICsgdG91Y2hYICsgXCIseTpcIiArIHRvdWNoWSk7XG4gICAgbGV0IHRhZzogVGFnID0ge1xuICAgICAgdGFnVHlwZTogMyxcbiAgICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gICAgICB0YWdfeDogdG91Y2hYLFxuICAgICAgdGFnX3k6IHRvdWNoWSxcbiAgICAgIHRhZ19oZWlnaHQ6IDY1LFxuICAgICAgc2VsZWN0ZWRQb3M6IDAsXG4gICAgICByZXN1bHRfbGlzdDogW3sgZm9vZF9pZDogMCwgZm9vZF9uYW1lOiBcIui/meaYr+S7gOS5iD9cIiB9XSxcbiAgICAgIHNob3dEZWxldGVCdG46IGZhbHNlXG4gICAgfTtcbiAgICAvL2FkZCBpbnRvIHRhZ2dzIGFuZCByZWZyZXNoXG4gICAgdGhpcy5kYXRhLnRhZ2dzLnB1c2godGFnKTtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgdGFnZ3M6IHRoaXMuZGF0YS50YWdncyxcbiAgICAgIGN1cnJlbnRUYWdJbmRleDogdGhpcy5kYXRhLnRhZ2dzLmxlbmd0aCAtIDFcbiAgICB9KTtcbiAgICB0aGlzLmluY3JlbWVudGFsSWQrKztcbiAgICAvL25hdmkgdG8gdGV4dFNlYXJjaFxuICAgIHNldFRpbWVvdXQoZnVuY3Rpb24gKCkge1xuICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgIHVybDogXCIvcGFnZXMvdGV4dFNlYXJjaC9pbmRleD90aXRsZT3po5/nialcIlxuICAgICAgfSk7XG4gICAgfSwgNTAwKVxuICB9XG5cbiAgcHVibGljIG9uVGFnTW92ZShldmVudDogYW55KSB7XG4gICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnRhZ0luZGV4O1xuICAgIGNvbnNvbGUubG9nKGV2ZW50LmRldGFpbC54KTtcbiAgICBjb25zb2xlLmxvZyhldmVudC5kZXRhaWwueSk7XG4gICAgbGV0IHhPcGVyYXRpb24gPSBcInRhZ2dzW1wiICsgaW5kZXggKyBcIl0udGFnX3hcIjtcbiAgICBsZXQgeU9wZXJhdGlvbiA9IFwidGFnZ3NbXCIgKyBpbmRleCArIFwiXS50YWdfeVwiO1xuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICBbeE9wZXJhdGlvbl06IGV2ZW50LmRldGFpbC54LFxuICAgICAgW3lPcGVyYXRpb25dOiBldmVudC5kZXRhaWwueVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uU3RhcnRUb3VjaFRhZyhldmVudDogYW55KSB7XG4gICAgY29uc29sZS5sb2coXCJvbiB0b3VjaCBzdGFydFwiKTtcbiAgICBsZXQgaW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQudGFnSW5kZXg7XG4gICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgIGN1cnJlbnRUYWdJbmRleDogaW5kZXhcbiAgICB9KTtcbiAgfVxuXG4gIC8vIHB1YmxpYyBvbkFkZENhbmRpZGF0ZXNUYWcoZXZlbnQ6IGFueSkge1xuICAvLyAgIGxldCBpbmRleCA9IGV2ZW50LmN1cnJlbnRUYXJnZXQuZGF0YXNldC5jYW5kaWRhdGVzSW5kZXg7XG4gIC8vICAgbGV0IHRhZ05hbWUgPSB0aGlzLmRhdGEuY2FuZGlkYXRlc1RhZ0xpc3RbaW5kZXhdLnRhZ05hbWVcbiAgLy8gICAvL2dldCBpbWFnZSBjZW50ZXJcbiAgLy8gICBsZXQgdG91Y2hYID0gMTA7XG4gIC8vICAgbGV0IHRvdWNoWSA9IDEwO1xuICAvLyAgIGxldCB0YWc6IFRhZyA9IHtcbiAgLy8gICAgIGlzRGVsZXRlZDogZmFsc2UsXG4gIC8vICAgICB4OiB0b3VjaFgsXG4gIC8vICAgICB5OiB0b3VjaFksXG4gIC8vICAgICBkb3RDb2xvcjogJyNlMDE1ZmEnLFxuICAvLyAgICAgZGlzcGFseU1lc3NhZ2U6IHRhZ05hbWUsXG4gIC8vICAgICBzaG93RGVsZXRlQnRuOiBmYWxzZSxcbiAgLy8gICAgIHJlYWx0ZWRJbmZvOiB7fVxuICAvLyAgIH07XG4gIC8vICAgLy9hZGQgaW50byB0YWdncyBhbmQgcmVmcmVzaFxuICAvLyAgIHRoaXMuZGF0YS50YWdncy5wdXNoKHRhZyk7XG4gIC8vICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgLy8gICAgIHRhZ2dzOiB0aGlzLmRhdGEudGFnZ3NcbiAgLy8gICB9KTtcbiAgLy8gICB0aGlzLmluY3JlbWVudGFsSWQrKztcbiAgLy8gfVxuXG4gIHB1YmxpYyBvblRvZ2dsZURlbGV0ZVRhZyhldmVudDogYW55KSB7XG4gICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnRhZ0luZGV4O1xuICAgIGxldCBvcGVyYXRpb24gPSBcInRhZ2dzW1wiICsgaW5kZXggKyBcIl0uc2hvd0RlbGV0ZUJ0blwiO1xuICAgIGxldCB0YWdIZWlnaHRPcGVyYXRpb24gPSBcInRhZ2dzW1wiICsgaW5kZXggKyBcIl0udGFnX2hlaWdodFwiO1xuICAgIGxldCBmbGFnID0gdGhpcy5kYXRhLnRhZ2dzW2luZGV4XS5zaG93RGVsZXRlQnRuO1xuICAgIGxldCBoZWlnaHQgPSBmbGFnID8gNjUgOiA5NTtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgW29wZXJhdGlvbl06ICFmbGFnLFxuICAgICAgW3RhZ0hlaWdodE9wZXJhdGlvbl06IGhlaWdodFxuICAgIH0pO1xuICB9XG5cblxuICBwdWJsaWMgZGVsZXRlVGFnKGV2ZW50OiBhbnkpIHsvL2V4Y2hhbmdlIGxpc3Qgb3JkZXIgdG8gYXZvaWQgYW5pbWF0aW9uXG4gICAgbGV0IGluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LnRhZ0luZGV4O1xuICAgIC8vZGVsZXRlIHRhZ2dzIGFuZCByZWZyZXNoXG4gICAgY29uc29sZS5sb2coXCJlbnRlciBvbiBkZWxldGUgXCIgKyBpbmRleCk7XG4gICAgLy8gdGhpcy5kYXRhLnRhZ2dzLnNwbGljZShpbmRleCwgMSk7XG4gICAgbGV0IG9wZXJhdGlvbiA9IFwidGFnZ3NbXCIgKyBpbmRleCArIFwiXS5pc0RlbGV0ZWRcIjtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgW29wZXJhdGlvbl06IHRydWUsXG4gICAgICBjdXJyZW50VGFnSW5kZXg6IDBcbiAgICB9KTtcbiAgICB0aGlzLmluY3JlbWVudGFsSWQrKztcbiAgfVxuXG4gIHB1YmxpYyBvbkFkZFRleHRTZWFyY2hUYWcoKSB7XG4gICAgLy91c2UgbmF2aWdhdGUgYmFjayB0byBnZXQgc2VhcmNoIHJlc3VsdFxuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiBcIi9wYWdlcy90ZXh0U2VhcmNoL2luZGV4P3RpdGxlPeabtOWkmumjn+eJqVwiXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgbmF2aVRvRm9vZERldGFpbFBhZ2UoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHd4LmdldEltYWdlSW5mbyh7XG4gICAgICBzcmM6IHRoaXMuZGF0YS5pbWFnZVVybCxcbiAgICAgIHN1Y2Nlc3MoaW1nOiBhbnkpIHtcbiAgICAgICAgbGV0IHBhcmFtID0geyBpbWFnZVVybDogdGhhdC5kYXRhLmltYWdlVXJsLCBtZWFsSWQ6IDAsIHNob3dTaGFyZUJ0bjogdHJ1ZSB9O1xuICAgICAgICBsZXQgcGljUmF0aW8gPSBpbWcud2lkdGggLyB0aGF0LmRhdGEuc2NyZWVuV2lkdGhcbiAgICAgICAgY29uc29sZS5sb2coaW1nKTtcbiAgICAgICAgY29uc29sZS5sb2coXCJwaWNSYXRpbzpcIitwaWNSYXRpbyk7XG4gICAgICAgIC8vZ2V0IGZvb2REZXRhaWwgZnJvbSBiYWNrZW5kXG4gICAgICAgIGxldCBmb29kX2xpc3QgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgaW5kZXggaW4gdGhhdC5kYXRhLnRhZ2dzKSB7XG4gICAgICAgICAgbGV0IHRhZyA9IHRoYXQuZGF0YS50YWdnc1tpbmRleF07XG4gICAgICAgICAgaWYgKHRhZy5pc0RlbGV0ZWQpIHsgY29udGludWUgfTtcbiAgICAgICAgICBsZXQgdGFnWCA9IE1hdGguZmxvb3IodGFnLnRhZ194ICogdGhhdC5kYXRhLnBpeGVsUmF0aW8gKiBwaWNSYXRpbyk7XG4gICAgICAgICAgbGV0IHRhZ1kgPSBNYXRoLmZsb29yKHRhZy50YWdfeSAqIHRoYXQuZGF0YS5waXhlbFJhdGlvICogcGljUmF0aW8pO1xuICAgICAgICAgIC8vIGNvbnNvbGUubG9nKHRhZ1ggK1wiLFwiK3RhZ1kpO1xuICAgICAgICAgIGxldCBiYm94X3ggPSB0YWcuYmJveF94O1xuICAgICAgICAgIGxldCBiYm94X3kgPSB0YWcuYmJveF95O1xuICAgICAgICAgIGxldCBiYm94X3cgPSB0YWcuYmJveF93O1xuICAgICAgICAgIGxldCBiYm94X2ggPSB0YWcuYmJveF9oO1xuICAgICAgICAgIGxldCBmb29kSWQgPSB0YWcucmVzdWx0X2xpc3RbdGFnLnNlbGVjdGVkUG9zXS5mb29kX2lkO1xuICAgICAgICAgIGxldCBmb29kVHlwZSA9IHRhZy5yZXN1bHRfbGlzdFt0YWcuc2VsZWN0ZWRQb3NdLmZvb2RfdHlwZTtcbiAgICAgICAgICBsZXQgcmVzdWx0cyA9IHRhZy5yZXN1bHRfbGlzdDtcbiAgICAgICAgICBsZXQgZm9vZCA9IHsgZm9vZF9pZDogZm9vZElkLCBpbnB1dF90eXBlOiAxLCBmb29kX3R5cGU6IGZvb2RUeXBlLCB0YWdfeDogdGFnWCwgdGFnX3k6IHRhZ1ksIGJib3hfeDogYmJveF94LCBiYm94X3k6IGJib3hfeSwgYmJveF93OiBiYm94X3csIGJib3hfaDogYmJveF9oLCByZWNvZ25pdGlvbl9yZXN1bHRzOiByZXN1bHRzIH07XG4gICAgICAgICAgZm9vZF9saXN0LnB1c2goZm9vZCk7XG4gICAgICAgIH1cbiAgICAgICAgbGV0IHJlcSA9IHsgbWVhbF9pZDogdGhhdC5tZWFsSWQsIG1lYWxfdHlwZTogdGhhdC5tZWFsVHlwZSwgbWVhbF9kYXRlOiB0aGF0Lm1lYWxEYXRlLCBmb29kX2xpc3Q6IGZvb2RfbGlzdCB9O1xuICAgICAgICBjb25zb2xlLmxvZyhyZXEpO1xuICAgICAgICB3eC5zaG93TG9hZGluZyh7IHRpdGxlOiBcIuWKoOi9veS4rS4uLlwiIH0pO1xuICAgICAgICB3ZWJBUEkuQ3JlYXRlT3JVcGRhdGVNZWFsTG9nKHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgICAgICB3eC5oaWRlTG9hZGluZyh7fSk7XG4gICAgICAgICAgdGhhdC5tZWFsSWQgPSByZXNwLm1lYWxfaWQ7XG4gICAgICAgICAgcGFyYW0ubWVhbElkID0gdGhhdC5tZWFsSWRcbiAgICAgICAgICBwYXJhbS5pbWFnZVVybCA9IHRoYXQuZGF0YS5pbWFnZVVybFxuICAgICAgICAgIGxldCBwYXJhbUpzb24gPSBKU09OLnN0cmluZ2lmeShwYXJhbSk7XG4gICAgICAgICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICAgICAgICB1cmw6IFwiL3BhZ2VzL2Zvb2REZXRhaWwvaW5kZXg/cGFyYW1Kc29uPVwiICsgcGFyYW1Kc29uXG4gICAgICAgICAgfSk7XG4gICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgY29udGVudDogJ+iOt+WPlumjn+eJqeS/oeaBr+Wksei0pScsXG4gICAgICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgICAgIH0pXG4gICAgICAgIH0pO1xuICAgICAgfSxcbiAgICAgIGZhaWwoZXJyKSB7IGNvbnNvbGUubG9nKGVycik7IH1cbiAgICB9KTtcbiAgICBcbiAgfVxuXG5cbn1cblxuUGFnZShuZXcgSW1hZ2VUYWdQYWdlKCkpOyJdfQ==