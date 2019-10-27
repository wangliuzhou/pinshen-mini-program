"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var webAPI = require("../../api/app/AppService");
var globalEnum = require("../../api/GlobalEnum");
var FoodDetail = (function () {
    function FoodDetail() {
        this.textSearchFood = undefined;
        this.mealType = 0;
        this.currentEditFoodIndex = 0;
        this.mealId = 0;
        this.data = {
            mealLogId: 0,
            showShareBtn: true,
            showDeleteBtn: false,
            imageUrl: "",
            totalIntake: {},
            foodList: []
        };
    }
    FoodDetail.prototype.onPreviewSharedImage = function () {
        wx.navigateTo({
            url: "/pages/foodShare/index?mealId=" + this.data.mealLogId
        });
    };
    FoodDetail.prototype.onLoad = function (option) {
        wx.showShareMenu({ withShareTicket: true });
        wx.setNavigationBarTitle({
            title: "确认分量"
        });
        webAPI.SetAuthToken(wx.getStorageSync(globalEnum.globalKey_token));
        if (option.paramJson) {
            var param = JSON.parse(option.paramJson);
            console.log(param);
            var imageUrl = param.imageUrl;
            this.mealId = param.mealId;
            this.setData({
                imageUrl: imageUrl,
                showDeleteBtn: param.showDeleteBtn,
                showShareBtn: param.showShareBtn
            });
            this.retrieveMealLog(this.mealId);
        }
    };
    FoodDetail.prototype.onShow = function () {
        var _this = this;
        if (this.textSearchFood) {
            var req = { food_log_id: this.data.foodList[this.currentEditFoodIndex].food_log_id, ingredient_id: this.textSearchFood.food_id };
            webAPI.AddRecipeItem(req).then(function (resp) {
                _this.parseMealData(resp);
            }).catch(function (err) {
                console.log(err);
                wx.showModal({
                    title: '',
                    content: '添加食材失败',
                    showCancel: false
                });
            });
            this.textSearchFood = undefined;
        }
    };
    FoodDetail.prototype.retrieveMealLog = function (mealId) {
        var _this = this;
        var req = { meal_id: mealId };
        webAPI.RetrieveMealLog(req).then(function (resp) {
            _this.parseMealData(resp);
        }).catch(function (err) {
            return wx.showModal({
                title: '',
                content: '获取食物数据失败',
                showCancel: false
            });
        });
    };
    FoodDetail.prototype.parseMealData = function (resp) {
        console.log(resp);
        var mealLogId = resp.meal_id;
        var totalIntake = resp.total_intake;
        var foodList = [];
        for (var index in resp.food_log) {
            var foodLog = resp.food_log[index];
            var portionStrArr = [];
            for (var unitIndex in foodLog.unit_option) {
                var unitName = foodLog.unit_option[unitIndex].unit_name;
                console.log(foodLog.amount);
                foodLog.unit_option[unitIndex].weight = Math.floor(foodLog.unit_option[unitIndex].weight / 100);
                portionStrArr.push(unitName + " (" + foodLog.unit_option[unitIndex].weight + "克) ");
                if (foodLog.unit_id === foodLog.unit_option[unitIndex].unit_id) {
                    foodLog.selectedPortionIndex = unitIndex;
                }
            }
            foodLog.portionStrArr = portionStrArr;
            foodLog.amount = foodLog.amount / 100;
            foodLog.energy = Math.floor(foodLog.energy / 100);
            foodLog.weight = Math.floor(foodLog.weight / 100);
            if (this.data.foodList[index]) {
                foodLog.showIngredients = this.data.foodList[index].showIngredients;
            }
            for (var ingredientIndex in foodLog.ingredient_list) {
                var ingredientPortionStrArr = [];
                var ingredient = foodLog.ingredient_list[ingredientIndex];
                ingredient.amount = ingredient.amount / 100;
                for (var unitIndex in ingredient.unit_option) {
                    var ingredientUnitName = ingredient.unit_option[unitIndex].unit_name;
                    ingredient.unit_option[unitIndex].weight = ingredient.unit_option[unitIndex].weight / 100;
                    ingredientPortionStrArr.push(ingredientUnitName + " (" + ingredient.unit_option[unitIndex].weight + "克) ");
                    if (ingredient.unit_id === ingredient.unit_option[unitIndex].unit_id) {
                        ingredient.selectedPortionIndex = unitIndex;
                    }
                }
                console.log(ingredientPortionStrArr);
                ingredient.portionStrArr = ingredientPortionStrArr;
            }
            foodList.push(foodLog);
        }
        this.setData({
            mealLogId: mealLogId,
            totalEngry: Math.floor(totalIntake.energy.intake / 100),
            foodList: foodList
        });
    };
    FoodDetail.prototype.loadSingleSearchData = function (foodName) {
        var foods = [
            { foodName: foodName, engry: 200, unit: "碗", amount: 1, selectedPortionId: 0, portionList: [{ portionName: "碗", weight: 200 }], showIngredients: false, ingredientList: [] }
        ];
        this.setData({
            totalEngry: 200,
            foodList: foods
        });
    };
    FoodDetail.prototype.toggleShowIngredients = function (event) {
        var _a;
        var foodIndex = event.currentTarget.dataset.foodIndex;
        var operation = "foodList[" + foodIndex + "].showIngredients";
        this.setData((_a = {},
            _a[operation] = !this.data.foodList[foodIndex].showIngredients,
            _a));
    };
    FoodDetail.prototype.onConfirmPressed = function () {
        var req = { meal_id: this.mealId };
        webAPI.ConfirmMealLog(req).then(function (resp) {
            wx.navigateBack({
                delta: 100
            });
        }).catch(function (err) {
            console.log(err);
            wx.showModal({
                title: '',
                content: '提交食物记录失败',
                showCancel: false
            });
        });
    };
    FoodDetail.prototype.addMoreIngredient = function (event) {
        var foodIndex = event.currentTarget.dataset.foodIndex;
        this.currentEditFoodIndex = foodIndex;
        wx.navigateTo({
            url: "/pages/textSearch/index?title=食材&mealType=" + this.mealType + "&naviType=2" + "&filterType=2"
        });
    };
    FoodDetail.prototype.deleteMeal = function () {
        var that = this;
        wx.showModal({
            title: "",
            content: "确定删除吗?",
            success: function (res) {
                if (res.confirm) {
                    var req = { meal_id: that.mealId };
                    webAPI.DestroyMealLog(req).then(function (resp) {
                        wx.navigateBack({
                            delta: 100
                        });
                    }).catch(function (err) {
                        console.log(err);
                        wx.showModal({
                            title: '',
                            content: '删除失败',
                            showCancel: false
                        });
                    });
                }
                else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    };
    FoodDetail.prototype.deleteFood = function (event) {
        var that = this;
        var foodIndex = event.currentTarget.dataset.foodIndex;
        var foodLogId = this.data.foodList[foodIndex].food_log_id;
        var foodName = this.data.foodList[foodIndex].food_name;
        wx.showModal({
            title: "",
            content: "确定删除" + foodName + "吗?",
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                    var req = { food_log_id: foodLogId };
                    webAPI.DestroyFoodLog(req).then(function (resp) {
                        that.retrieveMealLog(that.mealId);
                    }).catch(function (err) {
                        console.log(err);
                        wx.showModal({
                            title: '',
                            content: '删除失败',
                            showCancel: false
                        });
                    });
                }
                else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    };
    FoodDetail.prototype.deleteIngredient = function (event) {
        var that = this;
        var foodIndex = event.currentTarget.dataset.foodIndex;
        var ingredientIndex = event.currentTarget.dataset.ingredientIndex;
        var ingredientId = this.data.foodList[foodIndex].ingredient_list[ingredientIndex].recipe_details_id;
        var ingredientName = this.data.foodList[foodIndex].ingredient_list[ingredientIndex].ingredient_name;
        wx.showModal({
            title: "",
            content: "确定删除" + ingredientName + "吗?",
            success: function (res) {
                if (res.confirm) {
                    console.log('用户点击确定');
                    var req = { recipe_item_id: ingredientId };
                    webAPI.DestroyRecipeItem(req).then(function (resp) {
                        that.retrieveMealLog(that.mealId);
                    }).catch(function (err) {
                        console.log(err);
                        wx.showModal({
                            title: '',
                            content: '删除失败',
                            showCancel: false
                        });
                    });
                }
                else if (res.cancel) {
                    console.log('用户点击取消');
                }
            }
        });
    };
    FoodDetail.prototype.onFoodPortionSelect = function (event) {
        var _this = this;
        console.log("onFoodPortionSelect" + Number(event.detail.value));
        var foodIndex = event.currentTarget.dataset.foodIndex;
        var selectedPos = Number(event.detail.value);
        var foodLog = this.data.foodList[foodIndex];
        var foodLogId = foodLog.food_log_id;
        var unitId = foodLog.unit_option[selectedPos].unit_id;
        var amountValue = foodLog.amount * 100;
        var req = { food_log_id: foodLogId, unit_id: unitId, amount: amountValue };
        webAPI.UpdateFoodLog(req).then(function (resp) {
            var _a;
            _this.parseMealData(resp);
            var operation = "foodList[" + foodIndex + "].selectedPortionIndex";
            _this.setData((_a = {},
                _a[operation] = selectedPos,
                _a));
        }).catch(function (err) {
            console.log(err);
            wx.showModal({
                title: '',
                content: '更新失败',
                showCancel: false
            });
        });
    };
    FoodDetail.prototype.onIngredientPortionSelect = function (event) {
        var _this = this;
        console.log("onIngredientPortionSelect" + Number(event.detail.value));
        var foodLogIndex = event.currentTarget.dataset.foodIndex;
        var ingredientIndex = event.currentTarget.dataset.ingredientIndex;
        var selectedPos = Number(event.detail.value);
        var ingredient = this.data.foodList[foodLogIndex].ingredient_list[ingredientIndex];
        var recipeId = ingredient.recipe_details_id;
        var unitId = ingredient.unit_option[selectedPos].unit_id;
        var amountValue = ingredient.amount * 100;
        var req = { recipe_item_id: recipeId, unit_id: unitId, amount: amountValue };
        webAPI.UpdateRecipeItem(req).then(function (resp) {
            var _a;
            _this.parseMealData(resp);
            var operation = "foodList[" + foodLogIndex + "].ingredient_list[" + ingredientIndex + "].selectedPortionIndex";
            _this.setData((_a = {},
                _a[operation] = selectedPos,
                _a));
        }).catch(function (err) {
            console.log(err);
            wx.showModal({
                title: '',
                content: '更新失败',
                showCancel: false
            });
        });
    };
    FoodDetail.prototype.onFoodAmountChange = function (event) {
        var _this = this;
        var amountValue = parseInt(event.detail.value * 100);
        var foodLogIndex = event.currentTarget.dataset.foodIndex;
        var foodLog = this.data.foodList[foodLogIndex];
        console.log(foodLogIndex);
        var foodLogId = foodLog.food_log_id;
        var unitId = foodLog.unit_option[foodLog.selectedPortionIndex].unit_id;
        var req = { food_log_id: foodLogId, unit_id: unitId, amount: amountValue };
        console.log(req);
        webAPI.UpdateFoodLog(req).then(function (resp) { _this.parseMealData(resp); }).catch(function (err) {
            console.log(err);
            wx.showModal({
                title: '',
                content: '更新失败',
                showCancel: false
            });
        });
    };
    FoodDetail.prototype.onIngredientAmountChange = function (event) {
        var _this = this;
        var amountValue = parseInt(event.detail.value * 100);
        var foodLogIndex = event.currentTarget.dataset.foodIndex;
        var ingredientIndex = event.currentTarget.dataset.ingredientIndex;
        var ingredient = this.data.foodList[foodLogIndex].ingredient_list[ingredientIndex];
        var recipeId = ingredient.recipe_details_id;
        var unitId = ingredient.unit_option[ingredient.selectedPortionIndex].unit_id;
        var req = { recipe_item_id: recipeId, unit_id: unitId, amount: amountValue };
        webAPI.UpdateRecipeItem(req).then(function (resp) { _this.parseMealData(resp); }).catch(function (err) {
            console.log(err);
            wx.showModal({
                title: '',
                content: '更新失败',
                showCancel: false
            });
        });
    };
    return FoodDetail;
}());
Page(new FoodDetail());
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFtRDtBQUNuRCxpREFBbUQ7QUFnQ25EO0lBQUE7UUFDUyxtQkFBYyxHQUFHLFNBQVMsQ0FBQztRQUMzQixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2IseUJBQW9CLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFFWCxTQUFJLEdBQUc7WUFDWixTQUFTLEVBQUUsQ0FBQztZQUNaLFlBQVksRUFBRSxJQUFJO1lBQ2xCLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLFFBQVEsRUFBRSxFQUFFO1lBQ1osV0FBVyxFQUFFLEVBQUU7WUFDZixRQUFRLEVBQUUsRUFBRTtTQUNiLENBQUE7SUE2VUgsQ0FBQztJQTNVUSx5Q0FBb0IsR0FBM0I7UUFDRSxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osR0FBRyxFQUFFLGdDQUFnQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztTQUM1RCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sMkJBQU0sR0FBYixVQUFjLE1BQVc7UUFDdkIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztZQUN2QixLQUFLLEVBQUUsTUFBTTtTQUNkLENBQUMsQ0FBQztRQUdILE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUVuRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDcEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixJQUFJLFFBQVEsR0FB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QUFDLFVBQVUsQ0FBQyxvQkFBb0IsQ0FBQyxDQUFDLE9BQU8sQ0FBQztRQUM3RSxJQUFJLEdBQUcsR0FBRyxFQUFFLGNBQWMsRUFBRSxRQUFRLEVBQUUsT0FBTyxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLENBQUM7UUFDN0UsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFBLElBQUksSUFBTSxLQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQUEsR0FBRztZQUNoRixPQUFPLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQ2pCLEVBQUUsQ0FBQyxTQUFTLENBQUM7Z0JBQ1gsS0FBSyxFQUFFLEVBQUU7Z0JBQ1QsT0FBTyxFQUFFLE1BQU07Z0JBQ2YsVUFBVSxFQUFFLEtBQUs7YUFDbEIsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRUgsaUJBQUM7QUFBRCxDQUFDLEFBMVZELElBMFZDO0FBRUQsSUFBSSxDQUFDLElBQUksVUFBVSxFQUFFLENBQUMsQ0FBQSIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIHdlYkFQSSBmcm9tICcuLi8uLi9hcGkvYXBwL0FwcFNlcnZpY2UnO1xuaW1wb3J0ICogYXMgZ2xvYmFsRW51bSBmcm9tICcuLi8uLi9hcGkvR2xvYmFsRW51bSc7XG5pbXBvcnQgeyBSZXRyaWV2ZU1lYWxMb2dSZXEsIE1lYWxMb2dSZXNwIH0gZnJvbSBcIi9hcGkvYXBwL0FwcFNlcnZpY2VPYmpzXCI7XG5cblxudHlwZSBGb29kID0ge1xuICBmb29kTmFtZTogc3RyaW5nO1xuICBlbmdyeTogbnVtYmVyO1xuICB1bml0OiBzdHJpbmc7XG4gIHBvcnRpb25MaXN0OiBQb3J0aW9uW107XG4gIHBvcnRpb25TdHJBcnI6IHN0cmluZ1tdO1xuICBpbmdyZWRpZW50TGlzdDogW107XG4gIHNlbGVjdGVkUG9ydGlvbklkOiBudW1iZXI7XG59XG5cbnR5cGUgUG9ydGlvbiA9IHtcbiAgcG9ydGlvbk5hbWU6IHN0cmluZztcbiAgd2VpZ2h0OiBudW1iZXI7XG59XG5cbnR5cGUgRGF0YSA9IHtcbiAgaW1hZ2VVcmw6IHN0cmluZztcbiAgdG90YWxJbnRha2U6IE51dHJpZW50O1xuICBmb29kTGlzdDogRm9vZFtdO1xufVxuXG50eXBlIE51dHJpZW50ID0ge1xuICBlbmVyZ3k6IG51bWJlcixcbiAgcHJvdGVpbjogbnVtYmVyLFxuICBjYXJib2h5ZHJhdGU6IG51bWJlcixcbiAgZmF0OiBudW1iZXJcbn1cblxuY2xhc3MgRm9vZERldGFpbCB7XG4gIHB1YmxpYyB0ZXh0U2VhcmNoRm9vZCA9IHVuZGVmaW5lZDtcbiAgcHVibGljIG1lYWxUeXBlID0gMDtcbiAgcHVibGljIGN1cnJlbnRFZGl0Rm9vZEluZGV4ID0gMDtcbiAgcHVibGljIG1lYWxJZCA9IDA7XG5cbiAgcHVibGljIGRhdGEgPSB7XG4gICAgbWVhbExvZ0lkOiAwLFxuICAgIHNob3dTaGFyZUJ0bjogdHJ1ZSxcbiAgICBzaG93RGVsZXRlQnRuOiBmYWxzZSxcbiAgICBpbWFnZVVybDogXCJcIixcbiAgICB0b3RhbEludGFrZToge30sXG4gICAgZm9vZExpc3Q6IFtdXG4gIH1cblxuICBwdWJsaWMgb25QcmV2aWV3U2hhcmVkSW1hZ2UoKXtcbiAgICB3eC5uYXZpZ2F0ZVRvKHtcbiAgICAgIHVybDogXCIvcGFnZXMvZm9vZFNoYXJlL2luZGV4P21lYWxJZD1cIiArIHRoaXMuZGF0YS5tZWFsTG9nSWRcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkxvYWQob3B0aW9uOiBhbnkpIHtcbiAgICB3eC5zaG93U2hhcmVNZW51KHt3aXRoU2hhcmVUaWNrZXQ6IHRydWV9KTtcbiAgICB3eC5zZXROYXZpZ2F0aW9uQmFyVGl0bGUoe1xuICAgICAgdGl0bGU6IFwi56Gu6K6k5YiG6YePXCJcbiAgICB9KTtcblxuICAgIC8vc2V0IEFQSSB0byBtZWFsTG9nXG4gICAgd2ViQVBJLlNldEF1dGhUb2tlbih3eC5nZXRTdG9yYWdlU3luYyhnbG9iYWxFbnVtLmdsb2JhbEtleV90b2tlbikpO1xuICAgIC8vb3B0aW9uIHBhcmFtIGpzb25cbiAgICBpZiAob3B0aW9uLnBhcmFtSnNvbikge1xuICAgICAgbGV0IHBhcmFtID0gSlNPTi5wYXJzZShvcHRpb24ucGFyYW1Kc29uKTtcbiAgICAgIGNvbnNvbGUubG9nKHBhcmFtKTtcbiAgICAgIGxldCBpbWFnZVVybCA9IHBhcmFtLmltYWdlVXJsO1xuICAgICAgdGhpcy5tZWFsSWQgPSBwYXJhbS5tZWFsSWQ7XG4gICAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgICBpbWFnZVVybDogaW1hZ2VVcmwsXG4gICAgICAgIHNob3dEZWxldGVCdG46IHBhcmFtLnNob3dEZWxldGVCdG4sXG4gICAgICAgIHNob3dTaGFyZUJ0bjogcGFyYW0uc2hvd1NoYXJlQnRuXG4gICAgICB9KTtcbiAgICAgIHRoaXMucmV0cmlldmVNZWFsTG9nKHRoaXMubWVhbElkKTtcbiAgICAgIC8vIHRoaXMubG9hZFNpbmdsZVNlYXJjaERhdGEocGFyYW0udGV4dFNlYXJjaEl0ZW0pO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyBvblNob3coKSB7XG4gICAgLy9hZGQgaW5ncmVkaWVudFxuICAgIGlmICh0aGlzLnRleHRTZWFyY2hGb29kKSB7XG4gICAgICBsZXQgcmVxID0geyBmb29kX2xvZ19pZDogdGhpcy5kYXRhLmZvb2RMaXN0W3RoaXMuY3VycmVudEVkaXRGb29kSW5kZXhdLmZvb2RfbG9nX2lkLCBpbmdyZWRpZW50X2lkOiB0aGlzLnRleHRTZWFyY2hGb29kLmZvb2RfaWQgfTtcbiAgICAgIHdlYkFQSS5BZGRSZWNpcGVJdGVtKHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgICAgdGhpcy5wYXJzZU1lYWxEYXRhKHJlc3ApO1xuICAgICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgY29udGVudDogJ+a3u+WKoOmjn+adkOWksei0pScsXG4gICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgICB9KTtcbiAgICAgIHRoaXMudGV4dFNlYXJjaEZvb2QgPSB1bmRlZmluZWQ7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIHJldHJpZXZlTWVhbExvZyhtZWFsSWQ6IG51bWJlcikge1xuICAgIGxldCByZXE6IFJldHJpZXZlTWVhbExvZ1JlcSA9IHsgbWVhbF9pZDogbWVhbElkIH1cbiAgICB3ZWJBUEkuUmV0cmlldmVNZWFsTG9nKHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgIHRoaXMucGFyc2VNZWFsRGF0YShyZXNwKTtcbiAgICB9KS5jYXRjaChlcnIgPT5cbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgY29udGVudDogJ+iOt+WPlumjn+eJqeaVsOaNruWksei0pScsXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICB9KVxuICAgICk7XG4gIH1cblxuICBwdWJsaWMgcGFyc2VNZWFsRGF0YShyZXNwOiBNZWFsTG9nUmVzcCkge1xuICAgIGNvbnNvbGUubG9nKHJlc3ApO1xuICAgIGxldCBtZWFsTG9nSWQgPSByZXNwLm1lYWxfaWQ7XG4gICAgbGV0IHRvdGFsSW50YWtlID0gcmVzcC50b3RhbF9pbnRha2U7XG4gICAgbGV0IGZvb2RMaXN0ID0gW107XG4gICAgZm9yIChsZXQgaW5kZXggaW4gcmVzcC5mb29kX2xvZykge1xuICAgICAgbGV0IGZvb2RMb2cgPSByZXNwLmZvb2RfbG9nW2luZGV4XTtcbiAgICAgIGxldCBwb3J0aW9uU3RyQXJyID0gW107XG4gICAgICBmb3IgKGxldCB1bml0SW5kZXggaW4gZm9vZExvZy51bml0X29wdGlvbikge1xuICAgICAgICBsZXQgdW5pdE5hbWUgPSBmb29kTG9nLnVuaXRfb3B0aW9uW3VuaXRJbmRleF0udW5pdF9uYW1lO1xuICAgICAgICBjb25zb2xlLmxvZyhmb29kTG9nLmFtb3VudCk7XG4gICAgICAgIC8vIGZvb2RMb2cuYW1vdW50ID0gTWF0aC5mbG9vcihmb29kTG9nLmFtb3VudC8xMDApO1xuICAgICAgICBmb29kTG9nLnVuaXRfb3B0aW9uW3VuaXRJbmRleF0ud2VpZ2h0ID0gTWF0aC5mbG9vcihmb29kTG9nLnVuaXRfb3B0aW9uW3VuaXRJbmRleF0ud2VpZ2h0IC8gMTAwKTtcblxuICAgICAgICBwb3J0aW9uU3RyQXJyLnB1c2godW5pdE5hbWUgKyBcIiAoXCIgKyBmb29kTG9nLnVuaXRfb3B0aW9uW3VuaXRJbmRleF0ud2VpZ2h0ICsgXCLlhYspIFwiKTtcbiAgICAgICAgaWYgKGZvb2RMb2cudW5pdF9pZCA9PT0gZm9vZExvZy51bml0X29wdGlvblt1bml0SW5kZXhdLnVuaXRfaWQpIHtcbiAgICAgICAgICBmb29kTG9nLnNlbGVjdGVkUG9ydGlvbkluZGV4ID0gdW5pdEluZGV4O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBmb29kTG9nLnBvcnRpb25TdHJBcnIgPSBwb3J0aW9uU3RyQXJyO1xuICAgICAgZm9vZExvZy5hbW91bnQgPSBmb29kTG9nLmFtb3VudCAvIDEwMDtcbiAgICAgIGZvb2RMb2cuZW5lcmd5ID0gTWF0aC5mbG9vcihmb29kTG9nLmVuZXJneSAvIDEwMCk7XG4gICAgICBmb29kTG9nLndlaWdodCA9IE1hdGguZmxvb3IoZm9vZExvZy53ZWlnaHQgLyAxMDApO1xuICAgICAgaWYgKHRoaXMuZGF0YS5mb29kTGlzdFtpbmRleF0pIHtcbiAgICAgICAgZm9vZExvZy5zaG93SW5ncmVkaWVudHMgPSB0aGlzLmRhdGEuZm9vZExpc3RbaW5kZXhdLnNob3dJbmdyZWRpZW50cztcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGluZ3JlZGllbnRJbmRleCBpbiBmb29kTG9nLmluZ3JlZGllbnRfbGlzdCkge1xuICAgICAgICBsZXQgaW5ncmVkaWVudFBvcnRpb25TdHJBcnIgPSBbXTtcbiAgICAgICAgbGV0IGluZ3JlZGllbnQgPSBmb29kTG9nLmluZ3JlZGllbnRfbGlzdFtpbmdyZWRpZW50SW5kZXhdO1xuICAgICAgICBpbmdyZWRpZW50LmFtb3VudCA9IGluZ3JlZGllbnQuYW1vdW50IC8gMTAwO1xuICAgICAgICBmb3IgKGxldCB1bml0SW5kZXggaW4gaW5ncmVkaWVudC51bml0X29wdGlvbikge1xuICAgICAgICAgIGxldCBpbmdyZWRpZW50VW5pdE5hbWUgPSBpbmdyZWRpZW50LnVuaXRfb3B0aW9uW3VuaXRJbmRleF0udW5pdF9uYW1lO1xuICAgICAgICAgIGluZ3JlZGllbnQudW5pdF9vcHRpb25bdW5pdEluZGV4XS53ZWlnaHQgPSBpbmdyZWRpZW50LnVuaXRfb3B0aW9uW3VuaXRJbmRleF0ud2VpZ2h0IC8gMTAwO1xuICAgICAgICAgIGluZ3JlZGllbnRQb3J0aW9uU3RyQXJyLnB1c2goaW5ncmVkaWVudFVuaXROYW1lICsgXCIgKFwiICsgaW5ncmVkaWVudC51bml0X29wdGlvblt1bml0SW5kZXhdLndlaWdodCArIFwi5YWLKSBcIik7XG5cbiAgICAgICAgICBpZiAoaW5ncmVkaWVudC51bml0X2lkID09PSBpbmdyZWRpZW50LnVuaXRfb3B0aW9uW3VuaXRJbmRleF0udW5pdF9pZCkge1xuICAgICAgICAgICAgaW5ncmVkaWVudC5zZWxlY3RlZFBvcnRpb25JbmRleCA9IHVuaXRJbmRleDtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgY29uc29sZS5sb2coaW5ncmVkaWVudFBvcnRpb25TdHJBcnIpO1xuICAgICAgICBpbmdyZWRpZW50LnBvcnRpb25TdHJBcnIgPSBpbmdyZWRpZW50UG9ydGlvblN0ckFycjtcbiAgICAgIH1cbiAgICAgIGZvb2RMaXN0LnB1c2goZm9vZExvZyk7XG4gICAgfVxuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICBtZWFsTG9nSWQ6IG1lYWxMb2dJZCxcbiAgICAgIHRvdGFsRW5ncnk6IE1hdGguZmxvb3IodG90YWxJbnRha2UuZW5lcmd5LmludGFrZSAvIDEwMCksXG4gICAgICBmb29kTGlzdDogZm9vZExpc3RcbiAgICB9KVxuICB9XG5cbiAgcHVibGljIGxvYWRTaW5nbGVTZWFyY2hEYXRhKGZvb2ROYW1lOiBzdHJpbmcpIHtcbiAgICBsZXQgZm9vZHMgPSBbXG4gICAgICB7IGZvb2ROYW1lOiBmb29kTmFtZSwgZW5ncnk6IDIwMCwgdW5pdDogXCLnopdcIiwgYW1vdW50OiAxLCBzZWxlY3RlZFBvcnRpb25JZDogMCwgcG9ydGlvbkxpc3Q6IFt7IHBvcnRpb25OYW1lOiBcIueil1wiLCB3ZWlnaHQ6IDIwMCB9XSwgc2hvd0luZ3JlZGllbnRzOiBmYWxzZSwgaW5ncmVkaWVudExpc3Q6IFtdIH1cbiAgICBdO1xuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICB0b3RhbEVuZ3J5OiAyMDAsXG4gICAgICBmb29kTGlzdDogZm9vZHNcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyB0b2dnbGVTaG93SW5ncmVkaWVudHMoZXZlbnQ6IGFueSkge1xuICAgIGxldCBmb29kSW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuZm9vZEluZGV4O1xuICAgIGxldCBvcGVyYXRpb24gPSBcImZvb2RMaXN0W1wiICsgZm9vZEluZGV4ICsgXCJdLnNob3dJbmdyZWRpZW50c1wiO1xuICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICBbb3BlcmF0aW9uXTogIXRoaXMuZGF0YS5mb29kTGlzdFtmb29kSW5kZXhdLnNob3dJbmdyZWRpZW50c1xuICAgIH0pXG4gIH1cblxuICBwdWJsaWMgb25Db25maXJtUHJlc3NlZCgpIHtcbiAgICBsZXQgcmVxID0geyBtZWFsX2lkOiB0aGlzLm1lYWxJZCB9O1xuICAgIHdlYkFQSS5Db25maXJtTWVhbExvZyhyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICBkZWx0YTogMTAwXG4gICAgICB9KVxuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICBjb250ZW50OiAn5o+Q5Lqk6aOf54mp6K6w5b2V5aSx6LSlJyxcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFkZE1vcmVJbmdyZWRpZW50KGV2ZW50OiBhbnkpIHtcbiAgICBsZXQgZm9vZEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmZvb2RJbmRleDtcbiAgICB0aGlzLmN1cnJlbnRFZGl0Rm9vZEluZGV4ID0gZm9vZEluZGV4O1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiBcIi9wYWdlcy90ZXh0U2VhcmNoL2luZGV4P3RpdGxlPemjn+adkCZtZWFsVHlwZT1cIiArIHRoaXMubWVhbFR5cGUgKyBcIiZuYXZpVHlwZT0yXCIgKyBcIiZmaWx0ZXJUeXBlPTJcIlxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGRlbGV0ZU1lYWwoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIGNvbnRlbnQ6IFwi56Gu5a6a5Yig6Zmk5ZCXP1wiLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICBsZXQgcmVxID0geyBtZWFsX2lkOiB0aGF0Lm1lYWxJZCB9XG4gICAgICAgICAgd2ViQVBJLkRlc3Ryb3lNZWFsTG9nKHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgICAgICAgIC8v5Zue6YCA5Yiw5Li76aG1XG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICAgICAgICBkZWx0YTogMTAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgICBjb250ZW50OiAn5Yig6Zmk5aSx6LSlJyxcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHJlcy5jYW5jZWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye75Y+W5raIJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGRlbGV0ZUZvb2QoZXZlbnQ6IGFueSkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBsZXQgZm9vZEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmZvb2RJbmRleDtcbiAgICBsZXQgZm9vZExvZ0lkID0gdGhpcy5kYXRhLmZvb2RMaXN0W2Zvb2RJbmRleF0uZm9vZF9sb2dfaWQ7XG4gICAgbGV0IGZvb2ROYW1lID0gdGhpcy5kYXRhLmZvb2RMaXN0W2Zvb2RJbmRleF0uZm9vZF9uYW1lO1xuICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIGNvbnRlbnQ6IFwi56Gu5a6a5Yig6ZmkXCIgKyBmb29kTmFtZSArIFwi5ZCXP1wiLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye756Gu5a6aJylcbiAgICAgICAgICBsZXQgcmVxID0geyBmb29kX2xvZ19pZDogZm9vZExvZ0lkIH07XG4gICAgICAgICAgd2ViQVBJLkRlc3Ryb3lGb29kTG9nKHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgICAgICAgIHRoYXQucmV0cmlldmVNZWFsTG9nKHRoYXQubWVhbElkKTtcbiAgICAgICAgICB9KS5jYXRjaChlcnIgPT57XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgICBjb250ZW50OiAn5Yig6Zmk5aSx6LSlJyxcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHJlcy5jYW5jZWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye75Y+W5raIJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGRlbGV0ZUluZ3JlZGllbnQoZXZlbnQ6IGFueSkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBsZXQgZm9vZEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmZvb2RJbmRleDtcbiAgICBsZXQgaW5ncmVkaWVudEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZ3JlZGllbnRJbmRleDtcbiAgICBsZXQgaW5ncmVkaWVudElkID0gdGhpcy5kYXRhLmZvb2RMaXN0W2Zvb2RJbmRleF0uaW5ncmVkaWVudF9saXN0W2luZ3JlZGllbnRJbmRleF0ucmVjaXBlX2RldGFpbHNfaWQ7XG4gICAgbGV0IGluZ3JlZGllbnROYW1lID0gdGhpcy5kYXRhLmZvb2RMaXN0W2Zvb2RJbmRleF0uaW5ncmVkaWVudF9saXN0W2luZ3JlZGllbnRJbmRleF0uaW5ncmVkaWVudF9uYW1lO1xuICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIGNvbnRlbnQ6IFwi56Gu5a6a5Yig6ZmkXCIgKyBpbmdyZWRpZW50TmFtZSArIFwi5ZCXP1wiLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye756Gu5a6aJylcbiAgICAgICAgICBsZXQgcmVxID0geyByZWNpcGVfaXRlbV9pZDogaW5ncmVkaWVudElkIH1cbiAgICAgICAgICB3ZWJBUEkuRGVzdHJveVJlY2lwZUl0ZW0ocmVxKS50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgICAgdGhhdC5yZXRyaWV2ZU1lYWxMb2codGhhdC5tZWFsSWQpO1xuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgICBjb250ZW50OiAn5Yig6Zmk5aSx6LSlJyxcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHJlcy5jYW5jZWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye75Y+W5raIJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uRm9vZFBvcnRpb25TZWxlY3QoZXZlbnQ6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKFwib25Gb29kUG9ydGlvblNlbGVjdFwiICsgTnVtYmVyKGV2ZW50LmRldGFpbC52YWx1ZSkpO1xuICAgIGxldCBmb29kSW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuZm9vZEluZGV4O1xuICAgIGxldCBzZWxlY3RlZFBvcyA9IE51bWJlcihldmVudC5kZXRhaWwudmFsdWUpO1xuICAgIC8vcmVmcmVzaCBmb29kIGxvZyBkYXRhXG4gICAgbGV0IGZvb2RMb2cgPSB0aGlzLmRhdGEuZm9vZExpc3RbZm9vZEluZGV4XTtcbiAgICBsZXQgZm9vZExvZ0lkID0gZm9vZExvZy5mb29kX2xvZ19pZDtcbiAgICBsZXQgdW5pdElkID0gZm9vZExvZy51bml0X29wdGlvbltzZWxlY3RlZFBvc10udW5pdF9pZDtcbiAgICBsZXQgYW1vdW50VmFsdWUgPSBmb29kTG9nLmFtb3VudCAqIDEwMDtcbiAgICBsZXQgcmVxID0geyBmb29kX2xvZ19pZDogZm9vZExvZ0lkLCB1bml0X2lkOiB1bml0SWQsIGFtb3VudDogYW1vdW50VmFsdWUgfTtcbiAgICB3ZWJBUEkuVXBkYXRlRm9vZExvZyhyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICB0aGlzLnBhcnNlTWVhbERhdGEocmVzcCk7XG4gICAgICBsZXQgb3BlcmF0aW9uID0gXCJmb29kTGlzdFtcIiArIGZvb2RJbmRleCArIFwiXS5zZWxlY3RlZFBvcnRpb25JbmRleFwiO1xuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgW29wZXJhdGlvbl06IHNlbGVjdGVkUG9zXG4gICAgICB9KTtcbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgY29udGVudDogJ+abtOaWsOWksei0pScsXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkluZ3JlZGllbnRQb3J0aW9uU2VsZWN0KGV2ZW50OiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhcIm9uSW5ncmVkaWVudFBvcnRpb25TZWxlY3RcIiArIE51bWJlcihldmVudC5kZXRhaWwudmFsdWUpKTtcbiAgICBsZXQgZm9vZExvZ0luZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmZvb2RJbmRleDtcbiAgICBsZXQgaW5ncmVkaWVudEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZ3JlZGllbnRJbmRleDtcbiAgICBsZXQgc2VsZWN0ZWRQb3MgPSBOdW1iZXIoZXZlbnQuZGV0YWlsLnZhbHVlKTtcbiAgICAvL3JlZnJlc2ggaW5ncmVkaWVudCBsaXN0IGRhdGFcbiAgICBsZXQgaW5ncmVkaWVudCA9IHRoaXMuZGF0YS5mb29kTGlzdFtmb29kTG9nSW5kZXhdLmluZ3JlZGllbnRfbGlzdFtpbmdyZWRpZW50SW5kZXhdO1xuICAgIGxldCByZWNpcGVJZCA9IGluZ3JlZGllbnQucmVjaXBlX2RldGFpbHNfaWQ7XG4gICAgbGV0IHVuaXRJZCA9IGluZ3JlZGllbnQudW5pdF9vcHRpb25bc2VsZWN0ZWRQb3NdLnVuaXRfaWQ7XG4gICAgbGV0IGFtb3VudFZhbHVlID0gaW5ncmVkaWVudC5hbW91bnQgKiAxMDA7XG4gICAgbGV0IHJlcSA9IHsgcmVjaXBlX2l0ZW1faWQ6IHJlY2lwZUlkLCB1bml0X2lkOiB1bml0SWQsIGFtb3VudDogYW1vdW50VmFsdWUgfTtcbiAgICB3ZWJBUEkuVXBkYXRlUmVjaXBlSXRlbShyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICB0aGlzLnBhcnNlTWVhbERhdGEocmVzcCk7XG4gICAgICBsZXQgb3BlcmF0aW9uID0gXCJmb29kTGlzdFtcIiArIGZvb2RMb2dJbmRleCArIFwiXS5pbmdyZWRpZW50X2xpc3RbXCIgKyBpbmdyZWRpZW50SW5kZXggKyBcIl0uc2VsZWN0ZWRQb3J0aW9uSW5kZXhcIjtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICAgIFtvcGVyYXRpb25dOiBzZWxlY3RlZFBvc1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgY29udGVudDogJ+abtOaWsOWksei0pScsXG4gICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25Gb29kQW1vdW50Q2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICBsZXQgYW1vdW50VmFsdWUgPSBwYXJzZUludChldmVudC5kZXRhaWwudmFsdWUgKiAxMDApO1xuICAgIGxldCBmb29kTG9nSW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuZm9vZEluZGV4O1xuICAgIGxldCBmb29kTG9nID0gdGhpcy5kYXRhLmZvb2RMaXN0W2Zvb2RMb2dJbmRleF07XG4gICAgY29uc29sZS5sb2coZm9vZExvZ0luZGV4KTtcbiAgICBsZXQgZm9vZExvZ0lkID0gZm9vZExvZy5mb29kX2xvZ19pZDtcbiAgICBsZXQgdW5pdElkID0gZm9vZExvZy51bml0X29wdGlvbltmb29kTG9nLnNlbGVjdGVkUG9ydGlvbkluZGV4XS51bml0X2lkO1xuICAgIGxldCByZXEgPSB7IGZvb2RfbG9nX2lkOiBmb29kTG9nSWQsIHVuaXRfaWQ6IHVuaXRJZCwgYW1vdW50OiBhbW91bnRWYWx1ZSB9O1xuICAgIGNvbnNvbGUubG9nKHJlcSk7XG4gICAgd2ViQVBJLlVwZGF0ZUZvb2RMb2cocmVxKS50aGVuKHJlc3AgPT4geyB0aGlzLnBhcnNlTWVhbERhdGEocmVzcCk7IH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICBjb250ZW50OiAn5pu05paw5aSx6LSlJyxcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uSW5ncmVkaWVudEFtb3VudENoYW5nZShldmVudDogYW55KSB7XG4gICAgbGV0IGFtb3VudFZhbHVlID0gcGFyc2VJbnQoZXZlbnQuZGV0YWlsLnZhbHVlICogMTAwKTtcbiAgICBsZXQgZm9vZExvZ0luZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmZvb2RJbmRleDtcbiAgICBsZXQgaW5ncmVkaWVudEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZ3JlZGllbnRJbmRleDtcbiAgICBsZXQgaW5ncmVkaWVudCA9IHRoaXMuZGF0YS5mb29kTGlzdFtmb29kTG9nSW5kZXhdLmluZ3JlZGllbnRfbGlzdFtpbmdyZWRpZW50SW5kZXhdO1xuICAgIGxldCByZWNpcGVJZCA9IGluZ3JlZGllbnQucmVjaXBlX2RldGFpbHNfaWQ7XG4gICAgbGV0IHVuaXRJZCA9IGluZ3JlZGllbnQudW5pdF9vcHRpb25baW5ncmVkaWVudC5zZWxlY3RlZFBvcnRpb25JbmRleF0udW5pdF9pZDtcbiAgICBsZXQgcmVxID0geyByZWNpcGVfaXRlbV9pZDogcmVjaXBlSWQsIHVuaXRfaWQ6IHVuaXRJZCwgYW1vdW50OiBhbW91bnRWYWx1ZSB9O1xuICAgIHdlYkFQSS5VcGRhdGVSZWNpcGVJdGVtKHJlcSkudGhlbihyZXNwID0+IHsgdGhpcy5wYXJzZU1lYWxEYXRhKHJlc3ApOyB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgY29udGVudDogJ+abtOaWsOWksei0pScsXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59XG5cblBhZ2UobmV3IEZvb2REZXRhaWwoKSkiXX0=