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
        var _this = this;
        var req = { meal_id: this.mealId };
        webAPI.ConfirmMealLog(req).then(function (resp) {
            wx.navigateTo({
                url: "/pages/foodShare/index?mealId=" + _this.data.mealLogId
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyJpbmRleC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOztBQUFBLGlEQUFtRDtBQUNuRCxpREFBbUQ7QUFnQ25EO0lBQUE7UUFDUyxtQkFBYyxHQUFHLFNBQVMsQ0FBQztRQUMzQixhQUFRLEdBQUcsQ0FBQyxDQUFDO1FBQ2IseUJBQW9CLEdBQUcsQ0FBQyxDQUFDO1FBQ3pCLFdBQU0sR0FBRyxDQUFDLENBQUM7UUFFWCxTQUFJLEdBQUc7WUFDWixTQUFTLEVBQUUsQ0FBQztZQUNaLFlBQVksRUFBRSxJQUFJO1lBQ2xCLGFBQWEsRUFBRSxLQUFLO1lBQ3BCLFFBQVEsRUFBRSxFQUFFO1lBQ1osV0FBVyxFQUFFLEVBQUU7WUFDZixRQUFRLEVBQUUsRUFBRTtTQUNiLENBQUE7SUFnVkgsQ0FBQztJQTlVUSx5Q0FBb0IsR0FBM0I7UUFDRSxFQUFFLENBQUMsVUFBVSxDQUFDO1lBQ1osR0FBRyxFQUFFLGdDQUFnQyxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsU0FBUztTQUM1RCxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRU0sMkJBQU0sR0FBYixVQUFjLE1BQVc7UUFDdkIsRUFBRSxDQUFDLGFBQWEsQ0FBQyxFQUFDLGVBQWUsRUFBRSxJQUFJLEVBQUMsQ0FBQyxDQUFDO1FBQzFDLEVBQUUsQ0FBQyxxQkFBcUIsQ0FBQztZQUN2QixLQUFLLEVBQUUsTUFBTTtTQUNkLENBQUMsQ0FBQztRQUdILE1BQU0sQ0FBQyxZQUFZLENBQUMsRUFBRSxDQUFDLGNBQWMsQ0FBQyxVQUFVLENBQUMsZUFBZSxDQUFDLENBQUMsQ0FBQztRQUVuRSxJQUFJLE1BQU0sQ0FBQyxTQUFTLEVBQUU7WUFDcEIsSUFBSSxLQUFLLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsU0FBUyxDQUFDLENBQUM7WUFDekMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztZQUNuQixJQUFJLFFBQVEsR0FB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QWlCLENBQUM7UUFDNUMsSUFBSSxNQUFNLEdBQUcsVUFBVSxDQUFDLFdBQVcsQ0FBQyxVQUFVLENBQUMsb0JBQW9CLENBQUMsQ0FBQyxPQUFPLENBQUM7UUFDN0UsSUFBSSxHQUFHLEdBQUcsRUFBRSxjQUFjLEVBQUUsUUFBUSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxDQUFDO1FBQzdFLE1BQU0sQ0FBQyxnQkFBZ0IsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsVUFBQSxJQUFJLElBQU0sS0FBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFBLEdBQUc7WUFDaEYsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNqQixFQUFFLENBQUMsU0FBUyxDQUFDO2dCQUNYLEtBQUssRUFBRSxFQUFFO2dCQUNULE9BQU8sRUFBRSxNQUFNO2dCQUNmLFVBQVUsRUFBRSxLQUFLO2FBQ2xCLENBQUMsQ0FBQztRQUNMLENBQUMsQ0FBQyxDQUFDO0lBQ0wsQ0FBQztJQUVILGlCQUFDO0FBQUQsQ0FBQyxBQTdWRCxJQTZWQztBQUVELElBQUksQ0FBQyxJQUFJLFVBQVUsRUFBRSxDQUFDLENBQUEiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyB3ZWJBUEkgZnJvbSAnLi4vLi4vYXBpL2FwcC9BcHBTZXJ2aWNlJztcbmltcG9ydCAqIGFzIGdsb2JhbEVudW0gZnJvbSAnLi4vLi4vYXBpL0dsb2JhbEVudW0nO1xuaW1wb3J0IHsgUmV0cmlldmVNZWFsTG9nUmVxLCBNZWFsTG9nUmVzcCB9IGZyb20gXCIvYXBpL2FwcC9BcHBTZXJ2aWNlT2Jqc1wiO1xuXG5cbnR5cGUgRm9vZCA9IHtcbiAgZm9vZE5hbWU6IHN0cmluZztcbiAgZW5ncnk6IG51bWJlcjtcbiAgdW5pdDogc3RyaW5nO1xuICBwb3J0aW9uTGlzdDogUG9ydGlvbltdO1xuICBwb3J0aW9uU3RyQXJyOiBzdHJpbmdbXTtcbiAgaW5ncmVkaWVudExpc3Q6IFtdO1xuICBzZWxlY3RlZFBvcnRpb25JZDogbnVtYmVyO1xufVxuXG50eXBlIFBvcnRpb24gPSB7XG4gIHBvcnRpb25OYW1lOiBzdHJpbmc7XG4gIHdlaWdodDogbnVtYmVyO1xufVxuXG50eXBlIERhdGEgPSB7XG4gIGltYWdlVXJsOiBzdHJpbmc7XG4gIHRvdGFsSW50YWtlOiBOdXRyaWVudDtcbiAgZm9vZExpc3Q6IEZvb2RbXTtcbn1cblxudHlwZSBOdXRyaWVudCA9IHtcbiAgZW5lcmd5OiBudW1iZXIsXG4gIHByb3RlaW46IG51bWJlcixcbiAgY2FyYm9oeWRyYXRlOiBudW1iZXIsXG4gIGZhdDogbnVtYmVyXG59XG5cbmNsYXNzIEZvb2REZXRhaWwge1xuICBwdWJsaWMgdGV4dFNlYXJjaEZvb2QgPSB1bmRlZmluZWQ7XG4gIHB1YmxpYyBtZWFsVHlwZSA9IDA7XG4gIHB1YmxpYyBjdXJyZW50RWRpdEZvb2RJbmRleCA9IDA7XG4gIHB1YmxpYyBtZWFsSWQgPSAwO1xuXG4gIHB1YmxpYyBkYXRhID0ge1xuICAgIG1lYWxMb2dJZDogMCxcbiAgICBzaG93U2hhcmVCdG46IHRydWUsXG4gICAgc2hvd0RlbGV0ZUJ0bjogZmFsc2UsXG4gICAgaW1hZ2VVcmw6IFwiXCIsXG4gICAgdG90YWxJbnRha2U6IHt9LFxuICAgIGZvb2RMaXN0OiBbXVxuICB9XG5cbiAgcHVibGljIG9uUHJldmlld1NoYXJlZEltYWdlKCl7XG4gICAgd3gubmF2aWdhdGVUbyh7XG4gICAgICB1cmw6IFwiL3BhZ2VzL2Zvb2RTaGFyZS9pbmRleD9tZWFsSWQ9XCIgKyB0aGlzLmRhdGEubWVhbExvZ0lkXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25Mb2FkKG9wdGlvbjogYW55KSB7XG4gICAgd3guc2hvd1NoYXJlTWVudSh7d2l0aFNoYXJlVGlja2V0OiB0cnVlfSk7XG4gICAgd3guc2V0TmF2aWdhdGlvbkJhclRpdGxlKHtcbiAgICAgIHRpdGxlOiBcIuehruiupOWIhumHj1wiXG4gICAgfSk7XG5cbiAgICAvL3NldCBBUEkgdG8gbWVhbExvZ1xuICAgIHdlYkFQSS5TZXRBdXRoVG9rZW4od3guZ2V0U3RvcmFnZVN5bmMoZ2xvYmFsRW51bS5nbG9iYWxLZXlfdG9rZW4pKTtcbiAgICAvL29wdGlvbiBwYXJhbSBqc29uXG4gICAgaWYgKG9wdGlvbi5wYXJhbUpzb24pIHtcbiAgICAgIGxldCBwYXJhbSA9IEpTT04ucGFyc2Uob3B0aW9uLnBhcmFtSnNvbik7XG4gICAgICBjb25zb2xlLmxvZyhwYXJhbSk7XG4gICAgICBsZXQgaW1hZ2VVcmwgPSBwYXJhbS5pbWFnZVVybDtcbiAgICAgIHRoaXMubWVhbElkID0gcGFyYW0ubWVhbElkO1xuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgaW1hZ2VVcmw6IGltYWdlVXJsLFxuICAgICAgICBzaG93RGVsZXRlQnRuOiBwYXJhbS5zaG93RGVsZXRlQnRuLFxuICAgICAgICBzaG93U2hhcmVCdG46IHBhcmFtLnNob3dTaGFyZUJ0blxuICAgICAgfSk7XG4gICAgICB0aGlzLnJldHJpZXZlTWVhbExvZyh0aGlzLm1lYWxJZCk7XG4gICAgICAvLyB0aGlzLmxvYWRTaW5nbGVTZWFyY2hEYXRhKHBhcmFtLnRleHRTZWFyY2hJdGVtKTtcbiAgICB9XG4gIH1cblxuICBwdWJsaWMgb25TaG93KCkge1xuICAgIC8vYWRkIGluZ3JlZGllbnRcbiAgICBpZiAodGhpcy50ZXh0U2VhcmNoRm9vZCkge1xuICAgICAgbGV0IHJlcSA9IHsgZm9vZF9sb2dfaWQ6IHRoaXMuZGF0YS5mb29kTGlzdFt0aGlzLmN1cnJlbnRFZGl0Rm9vZEluZGV4XS5mb29kX2xvZ19pZCwgaW5ncmVkaWVudF9pZDogdGhpcy50ZXh0U2VhcmNoRm9vZC5mb29kX2lkIH07XG4gICAgICB3ZWJBUEkuQWRkUmVjaXBlSXRlbShyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICAgIHRoaXMucGFyc2VNZWFsRGF0YShyZXNwKTtcbiAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgIGNvbnNvbGUubG9nKGVycik7XG4gICAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgIGNvbnRlbnQ6ICfmt7vliqDpo5/mnZDlpLHotKUnLFxuICAgICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICAgIH0pO1xuICAgICAgfSk7XG4gICAgICB0aGlzLnRleHRTZWFyY2hGb29kID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgfVxuXG4gIHB1YmxpYyByZXRyaWV2ZU1lYWxMb2cobWVhbElkOiBudW1iZXIpIHtcbiAgICBsZXQgcmVxOiBSZXRyaWV2ZU1lYWxMb2dSZXEgPSB7IG1lYWxfaWQ6IG1lYWxJZCB9XG4gICAgd2ViQVBJLlJldHJpZXZlTWVhbExvZyhyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICB0aGlzLnBhcnNlTWVhbERhdGEocmVzcCk7XG4gICAgfSkuY2F0Y2goZXJyID0+XG4gICAgICB3eC5zaG93TW9kYWwoe1xuICAgICAgICB0aXRsZTogJycsXG4gICAgICAgIGNvbnRlbnQ6ICfojrflj5bpo5/nianmlbDmja7lpLHotKUnLFxuICAgICAgICBzaG93Q2FuY2VsOiBmYWxzZVxuICAgICAgfSlcbiAgICApO1xuICB9XG5cbiAgcHVibGljIHBhcnNlTWVhbERhdGEocmVzcDogTWVhbExvZ1Jlc3ApIHtcbiAgICBjb25zb2xlLmxvZyhyZXNwKTtcbiAgICBsZXQgbWVhbExvZ0lkID0gcmVzcC5tZWFsX2lkO1xuICAgIGxldCB0b3RhbEludGFrZSA9IHJlc3AudG90YWxfaW50YWtlO1xuICAgIGxldCBmb29kTGlzdCA9IFtdO1xuICAgIGZvciAobGV0IGluZGV4IGluIHJlc3AuZm9vZF9sb2cpIHtcbiAgICAgIGxldCBmb29kTG9nID0gcmVzcC5mb29kX2xvZ1tpbmRleF07XG4gICAgICBsZXQgcG9ydGlvblN0ckFyciA9IFtdO1xuICAgICAgZm9yIChsZXQgdW5pdEluZGV4IGluIGZvb2RMb2cudW5pdF9vcHRpb24pIHtcbiAgICAgICAgbGV0IHVuaXROYW1lID0gZm9vZExvZy51bml0X29wdGlvblt1bml0SW5kZXhdLnVuaXRfbmFtZTtcbiAgICAgICAgY29uc29sZS5sb2coZm9vZExvZy5hbW91bnQpO1xuICAgICAgICAvLyBmb29kTG9nLmFtb3VudCA9IE1hdGguZmxvb3IoZm9vZExvZy5hbW91bnQvMTAwKTtcbiAgICAgICAgZm9vZExvZy51bml0X29wdGlvblt1bml0SW5kZXhdLndlaWdodCA9IE1hdGguZmxvb3IoZm9vZExvZy51bml0X29wdGlvblt1bml0SW5kZXhdLndlaWdodCAvIDEwMCk7XG5cbiAgICAgICAgcG9ydGlvblN0ckFyci5wdXNoKHVuaXROYW1lICsgXCIgKFwiICsgZm9vZExvZy51bml0X29wdGlvblt1bml0SW5kZXhdLndlaWdodCArIFwi5YWLKSBcIik7XG4gICAgICAgIGlmIChmb29kTG9nLnVuaXRfaWQgPT09IGZvb2RMb2cudW5pdF9vcHRpb25bdW5pdEluZGV4XS51bml0X2lkKSB7XG4gICAgICAgICAgZm9vZExvZy5zZWxlY3RlZFBvcnRpb25JbmRleCA9IHVuaXRJbmRleDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgZm9vZExvZy5wb3J0aW9uU3RyQXJyID0gcG9ydGlvblN0ckFycjtcbiAgICAgIGZvb2RMb2cuYW1vdW50ID0gZm9vZExvZy5hbW91bnQgLyAxMDA7XG4gICAgICBmb29kTG9nLmVuZXJneSA9IE1hdGguZmxvb3IoZm9vZExvZy5lbmVyZ3kgLyAxMDApO1xuICAgICAgZm9vZExvZy53ZWlnaHQgPSBNYXRoLmZsb29yKGZvb2RMb2cud2VpZ2h0IC8gMTAwKTtcbiAgICAgIGlmICh0aGlzLmRhdGEuZm9vZExpc3RbaW5kZXhdKSB7XG4gICAgICAgIGZvb2RMb2cuc2hvd0luZ3JlZGllbnRzID0gdGhpcy5kYXRhLmZvb2RMaXN0W2luZGV4XS5zaG93SW5ncmVkaWVudHM7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpbmdyZWRpZW50SW5kZXggaW4gZm9vZExvZy5pbmdyZWRpZW50X2xpc3QpIHtcbiAgICAgICAgbGV0IGluZ3JlZGllbnRQb3J0aW9uU3RyQXJyID0gW107XG4gICAgICAgIGxldCBpbmdyZWRpZW50ID0gZm9vZExvZy5pbmdyZWRpZW50X2xpc3RbaW5ncmVkaWVudEluZGV4XTtcbiAgICAgICAgaW5ncmVkaWVudC5hbW91bnQgPSBpbmdyZWRpZW50LmFtb3VudCAvIDEwMDtcbiAgICAgICAgZm9yIChsZXQgdW5pdEluZGV4IGluIGluZ3JlZGllbnQudW5pdF9vcHRpb24pIHtcbiAgICAgICAgICBsZXQgaW5ncmVkaWVudFVuaXROYW1lID0gaW5ncmVkaWVudC51bml0X29wdGlvblt1bml0SW5kZXhdLnVuaXRfbmFtZTtcbiAgICAgICAgICBpbmdyZWRpZW50LnVuaXRfb3B0aW9uW3VuaXRJbmRleF0ud2VpZ2h0ID0gaW5ncmVkaWVudC51bml0X29wdGlvblt1bml0SW5kZXhdLndlaWdodCAvIDEwMDtcbiAgICAgICAgICBpbmdyZWRpZW50UG9ydGlvblN0ckFyci5wdXNoKGluZ3JlZGllbnRVbml0TmFtZSArIFwiIChcIiArIGluZ3JlZGllbnQudW5pdF9vcHRpb25bdW5pdEluZGV4XS53ZWlnaHQgKyBcIuWFiykgXCIpO1xuXG4gICAgICAgICAgaWYgKGluZ3JlZGllbnQudW5pdF9pZCA9PT0gaW5ncmVkaWVudC51bml0X29wdGlvblt1bml0SW5kZXhdLnVuaXRfaWQpIHtcbiAgICAgICAgICAgIGluZ3JlZGllbnQuc2VsZWN0ZWRQb3J0aW9uSW5kZXggPSB1bml0SW5kZXg7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIGNvbnNvbGUubG9nKGluZ3JlZGllbnRQb3J0aW9uU3RyQXJyKTtcbiAgICAgICAgaW5ncmVkaWVudC5wb3J0aW9uU3RyQXJyID0gaW5ncmVkaWVudFBvcnRpb25TdHJBcnI7XG4gICAgICB9XG4gICAgICBmb29kTGlzdC5wdXNoKGZvb2RMb2cpO1xuICAgIH1cbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgbWVhbExvZ0lkOiBtZWFsTG9nSWQsXG4gICAgICB0b3RhbEVuZ3J5OiBNYXRoLmZsb29yKHRvdGFsSW50YWtlLmVuZXJneS5pbnRha2UgLyAxMDApLFxuICAgICAgZm9vZExpc3Q6IGZvb2RMaXN0XG4gICAgfSlcbiAgfVxuXG4gIHB1YmxpYyBsb2FkU2luZ2xlU2VhcmNoRGF0YShmb29kTmFtZTogc3RyaW5nKSB7XG4gICAgbGV0IGZvb2RzID0gW1xuICAgICAgeyBmb29kTmFtZTogZm9vZE5hbWUsIGVuZ3J5OiAyMDAsIHVuaXQ6IFwi56KXXCIsIGFtb3VudDogMSwgc2VsZWN0ZWRQb3J0aW9uSWQ6IDAsIHBvcnRpb25MaXN0OiBbeyBwb3J0aW9uTmFtZTogXCLnopdcIiwgd2VpZ2h0OiAyMDAgfV0sIHNob3dJbmdyZWRpZW50czogZmFsc2UsIGluZ3JlZGllbnRMaXN0OiBbXSB9XG4gICAgXTtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgdG90YWxFbmdyeTogMjAwLFxuICAgICAgZm9vZExpc3Q6IGZvb2RzXG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgdG9nZ2xlU2hvd0luZ3JlZGllbnRzKGV2ZW50OiBhbnkpIHtcbiAgICBsZXQgZm9vZEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmZvb2RJbmRleDtcbiAgICBsZXQgb3BlcmF0aW9uID0gXCJmb29kTGlzdFtcIiArIGZvb2RJbmRleCArIFwiXS5zaG93SW5ncmVkaWVudHNcIjtcbiAgICAodGhpcyBhcyBhbnkpLnNldERhdGEoe1xuICAgICAgW29wZXJhdGlvbl06ICF0aGlzLmRhdGEuZm9vZExpc3RbZm9vZEluZGV4XS5zaG93SW5ncmVkaWVudHNcbiAgICB9KVxuICB9XG5cbiAgcHVibGljIG9uQ29uZmlybVByZXNzZWQoKSB7XG4gICAgbGV0IHJlcSA9IHsgbWVhbF9pZDogdGhpcy5tZWFsSWQgfTtcbiAgICB3ZWJBUEkuQ29uZmlybU1lYWxMb2cocmVxKS50aGVuKHJlc3AgPT4ge1xuICAgICAgLy8gd3gubmF2aWdhdGVCYWNrKHtcbiAgICAgIC8vICAgZGVsdGE6IDEwMFxuICAgICAgLy8gfSlcbiAgICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgICB1cmw6IFwiL3BhZ2VzL2Zvb2RTaGFyZS9pbmRleD9tZWFsSWQ9XCIgKyB0aGlzLmRhdGEubWVhbExvZ0lkXG4gICAgICB9KVxuICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICBjb250ZW50OiAn5o+Q5Lqk6aOf54mp6K6w5b2V5aSx6LSlJyxcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGFkZE1vcmVJbmdyZWRpZW50KGV2ZW50OiBhbnkpIHtcbiAgICBsZXQgZm9vZEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmZvb2RJbmRleDtcbiAgICB0aGlzLmN1cnJlbnRFZGl0Rm9vZEluZGV4ID0gZm9vZEluZGV4O1xuICAgIHd4Lm5hdmlnYXRlVG8oe1xuICAgICAgdXJsOiBcIi9wYWdlcy90ZXh0U2VhcmNoL2luZGV4P3RpdGxlPemjn+adkCZtZWFsVHlwZT1cIiArIHRoaXMubWVhbFR5cGUgKyBcIiZuYXZpVHlwZT0yXCIgKyBcIiZmaWx0ZXJUeXBlPTJcIlxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGRlbGV0ZU1lYWwoKSB7XG4gICAgdmFyIHRoYXQgPSB0aGlzO1xuICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIGNvbnRlbnQ6IFwi56Gu5a6a5Yig6Zmk5ZCXP1wiLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICBsZXQgcmVxID0geyBtZWFsX2lkOiB0aGF0Lm1lYWxJZCB9XG4gICAgICAgICAgd2ViQVBJLkRlc3Ryb3lNZWFsTG9nKHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgICAgICAgIC8v5Zue6YCA5Yiw5Li76aG1XG4gICAgICAgICAgICB3eC5uYXZpZ2F0ZUJhY2soe1xuICAgICAgICAgICAgICBkZWx0YTogMTAwXG4gICAgICAgICAgICB9KVxuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgICBjb250ZW50OiAn5Yig6Zmk5aSx6LSlJyxcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHJlcy5jYW5jZWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye75Y+W5raIJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGRlbGV0ZUZvb2QoZXZlbnQ6IGFueSkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBsZXQgZm9vZEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmZvb2RJbmRleDtcbiAgICBsZXQgZm9vZExvZ0lkID0gdGhpcy5kYXRhLmZvb2RMaXN0W2Zvb2RJbmRleF0uZm9vZF9sb2dfaWQ7XG4gICAgbGV0IGZvb2ROYW1lID0gdGhpcy5kYXRhLmZvb2RMaXN0W2Zvb2RJbmRleF0uZm9vZF9uYW1lO1xuICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIGNvbnRlbnQ6IFwi56Gu5a6a5Yig6ZmkXCIgKyBmb29kTmFtZSArIFwi5ZCXP1wiLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye756Gu5a6aJylcbiAgICAgICAgICBsZXQgcmVxID0geyBmb29kX2xvZ19pZDogZm9vZExvZ0lkIH07XG4gICAgICAgICAgd2ViQVBJLkRlc3Ryb3lGb29kTG9nKHJlcSkudGhlbihyZXNwID0+IHtcbiAgICAgICAgICAgIHRoYXQucmV0cmlldmVNZWFsTG9nKHRoYXQubWVhbElkKTtcbiAgICAgICAgICB9KS5jYXRjaChlcnIgPT57XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgICBjb250ZW50OiAn5Yig6Zmk5aSx6LSlJyxcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHJlcy5jYW5jZWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye75Y+W5raIJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIGRlbGV0ZUluZ3JlZGllbnQoZXZlbnQ6IGFueSkge1xuICAgIHZhciB0aGF0ID0gdGhpcztcbiAgICBsZXQgZm9vZEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmZvb2RJbmRleDtcbiAgICBsZXQgaW5ncmVkaWVudEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZ3JlZGllbnRJbmRleDtcbiAgICBsZXQgaW5ncmVkaWVudElkID0gdGhpcy5kYXRhLmZvb2RMaXN0W2Zvb2RJbmRleF0uaW5ncmVkaWVudF9saXN0W2luZ3JlZGllbnRJbmRleF0ucmVjaXBlX2RldGFpbHNfaWQ7XG4gICAgbGV0IGluZ3JlZGllbnROYW1lID0gdGhpcy5kYXRhLmZvb2RMaXN0W2Zvb2RJbmRleF0uaW5ncmVkaWVudF9saXN0W2luZ3JlZGllbnRJbmRleF0uaW5ncmVkaWVudF9uYW1lO1xuICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICB0aXRsZTogXCJcIixcbiAgICAgIGNvbnRlbnQ6IFwi56Gu5a6a5Yig6ZmkXCIgKyBpbmdyZWRpZW50TmFtZSArIFwi5ZCXP1wiLFxuICAgICAgc3VjY2VzczogZnVuY3Rpb24gKHJlcykge1xuICAgICAgICBpZiAocmVzLmNvbmZpcm0pIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye756Gu5a6aJylcbiAgICAgICAgICBsZXQgcmVxID0geyByZWNpcGVfaXRlbV9pZDogaW5ncmVkaWVudElkIH1cbiAgICAgICAgICB3ZWJBUEkuRGVzdHJveVJlY2lwZUl0ZW0ocmVxKS50aGVuKHJlc3AgPT4ge1xuICAgICAgICAgICAgdGhhdC5yZXRyaWV2ZU1lYWxMb2codGhhdC5tZWFsSWQpO1xuICAgICAgICAgIH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICAgICAgICBjb250ZW50OiAn5Yig6Zmk5aSx6LSlJyxcbiAgICAgICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgIH0pO1xuICAgICAgICB9IGVsc2UgaWYgKHJlcy5jYW5jZWwpIHtcbiAgICAgICAgICBjb25zb2xlLmxvZygn55So5oi354K55Ye75Y+W5raIJylcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uRm9vZFBvcnRpb25TZWxlY3QoZXZlbnQ6IGFueSkge1xuICAgIGNvbnNvbGUubG9nKFwib25Gb29kUG9ydGlvblNlbGVjdFwiICsgTnVtYmVyKGV2ZW50LmRldGFpbC52YWx1ZSkpO1xuICAgIGxldCBmb29kSW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuZm9vZEluZGV4O1xuICAgIGxldCBzZWxlY3RlZFBvcyA9IE51bWJlcihldmVudC5kZXRhaWwudmFsdWUpO1xuICAgIC8vcmVmcmVzaCBmb29kIGxvZyBkYXRhXG4gICAgbGV0IGZvb2RMb2cgPSB0aGlzLmRhdGEuZm9vZExpc3RbZm9vZEluZGV4XTtcbiAgICBsZXQgZm9vZExvZ0lkID0gZm9vZExvZy5mb29kX2xvZ19pZDtcbiAgICBsZXQgdW5pdElkID0gZm9vZExvZy51bml0X29wdGlvbltzZWxlY3RlZFBvc10udW5pdF9pZDtcbiAgICBsZXQgYW1vdW50VmFsdWUgPSBmb29kTG9nLmFtb3VudCAqIDEwMDtcbiAgICBsZXQgcmVxID0geyBmb29kX2xvZ19pZDogZm9vZExvZ0lkLCB1bml0X2lkOiB1bml0SWQsIGFtb3VudDogYW1vdW50VmFsdWUgfTtcbiAgICB3ZWJBUEkuVXBkYXRlRm9vZExvZyhyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICB0aGlzLnBhcnNlTWVhbERhdGEocmVzcCk7XG4gICAgICBsZXQgb3BlcmF0aW9uID0gXCJmb29kTGlzdFtcIiArIGZvb2RJbmRleCArIFwiXS5zZWxlY3RlZFBvcnRpb25JbmRleFwiO1xuICAgICAgKHRoaXMgYXMgYW55KS5zZXREYXRhKHtcbiAgICAgICAgW29wZXJhdGlvbl06IHNlbGVjdGVkUG9zXG4gICAgICB9KTtcbiAgICB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgY29udGVudDogJ+abtOaWsOWksei0pScsXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBvbkluZ3JlZGllbnRQb3J0aW9uU2VsZWN0KGV2ZW50OiBhbnkpIHtcbiAgICBjb25zb2xlLmxvZyhcIm9uSW5ncmVkaWVudFBvcnRpb25TZWxlY3RcIiArIE51bWJlcihldmVudC5kZXRhaWwudmFsdWUpKTtcbiAgICBsZXQgZm9vZExvZ0luZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmZvb2RJbmRleDtcbiAgICBsZXQgaW5ncmVkaWVudEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZ3JlZGllbnRJbmRleDtcbiAgICBsZXQgc2VsZWN0ZWRQb3MgPSBOdW1iZXIoZXZlbnQuZGV0YWlsLnZhbHVlKTtcbiAgICAvL3JlZnJlc2ggaW5ncmVkaWVudCBsaXN0IGRhdGFcbiAgICBsZXQgaW5ncmVkaWVudCA9IHRoaXMuZGF0YS5mb29kTGlzdFtmb29kTG9nSW5kZXhdLmluZ3JlZGllbnRfbGlzdFtpbmdyZWRpZW50SW5kZXhdO1xuICAgIGxldCByZWNpcGVJZCA9IGluZ3JlZGllbnQucmVjaXBlX2RldGFpbHNfaWQ7XG4gICAgbGV0IHVuaXRJZCA9IGluZ3JlZGllbnQudW5pdF9vcHRpb25bc2VsZWN0ZWRQb3NdLnVuaXRfaWQ7XG4gICAgbGV0IGFtb3VudFZhbHVlID0gaW5ncmVkaWVudC5hbW91bnQgKiAxMDA7XG4gICAgbGV0IHJlcSA9IHsgcmVjaXBlX2l0ZW1faWQ6IHJlY2lwZUlkLCB1bml0X2lkOiB1bml0SWQsIGFtb3VudDogYW1vdW50VmFsdWUgfTtcbiAgICB3ZWJBUEkuVXBkYXRlUmVjaXBlSXRlbShyZXEpLnRoZW4ocmVzcCA9PiB7XG4gICAgICB0aGlzLnBhcnNlTWVhbERhdGEocmVzcCk7XG4gICAgICBsZXQgb3BlcmF0aW9uID0gXCJmb29kTGlzdFtcIiArIGZvb2RMb2dJbmRleCArIFwiXS5pbmdyZWRpZW50X2xpc3RbXCIgKyBpbmdyZWRpZW50SW5kZXggKyBcIl0uc2VsZWN0ZWRQb3J0aW9uSW5kZXhcIjtcbiAgICAgICh0aGlzIGFzIGFueSkuc2V0RGF0YSh7XG4gICAgICAgIFtvcGVyYXRpb25dOiBzZWxlY3RlZFBvc1xuICAgICAgfSk7XG4gICAgfSkuY2F0Y2goZXJyID0+IHtcbiAgICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgICB0aXRsZTogJycsXG4gICAgICAgICAgY29udGVudDogJ+abtOaWsOWksei0pScsXG4gICAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBwdWJsaWMgb25Gb29kQW1vdW50Q2hhbmdlKGV2ZW50OiBhbnkpIHtcbiAgICBsZXQgYW1vdW50VmFsdWUgPSBwYXJzZUludChldmVudC5kZXRhaWwudmFsdWUgKiAxMDApO1xuICAgIGxldCBmb29kTG9nSW5kZXggPSBldmVudC5jdXJyZW50VGFyZ2V0LmRhdGFzZXQuZm9vZEluZGV4O1xuICAgIGxldCBmb29kTG9nID0gdGhpcy5kYXRhLmZvb2RMaXN0W2Zvb2RMb2dJbmRleF07XG4gICAgY29uc29sZS5sb2coZm9vZExvZ0luZGV4KTtcbiAgICBsZXQgZm9vZExvZ0lkID0gZm9vZExvZy5mb29kX2xvZ19pZDtcbiAgICBsZXQgdW5pdElkID0gZm9vZExvZy51bml0X29wdGlvbltmb29kTG9nLnNlbGVjdGVkUG9ydGlvbkluZGV4XS51bml0X2lkO1xuICAgIGxldCByZXEgPSB7IGZvb2RfbG9nX2lkOiBmb29kTG9nSWQsIHVuaXRfaWQ6IHVuaXRJZCwgYW1vdW50OiBhbW91bnRWYWx1ZSB9O1xuICAgIGNvbnNvbGUubG9nKHJlcSk7XG4gICAgd2ViQVBJLlVwZGF0ZUZvb2RMb2cocmVxKS50aGVuKHJlc3AgPT4geyB0aGlzLnBhcnNlTWVhbERhdGEocmVzcCk7IH0pLmNhdGNoKGVyciA9PiB7XG4gICAgICBjb25zb2xlLmxvZyhlcnIpO1xuICAgICAgd3guc2hvd01vZGFsKHtcbiAgICAgICAgdGl0bGU6ICcnLFxuICAgICAgICBjb250ZW50OiAn5pu05paw5aSx6LSlJyxcbiAgICAgICAgc2hvd0NhbmNlbDogZmFsc2VcbiAgICAgIH0pO1xuICAgIH0pO1xuICB9XG5cbiAgcHVibGljIG9uSW5ncmVkaWVudEFtb3VudENoYW5nZShldmVudDogYW55KSB7XG4gICAgbGV0IGFtb3VudFZhbHVlID0gcGFyc2VJbnQoZXZlbnQuZGV0YWlsLnZhbHVlICogMTAwKTtcbiAgICBsZXQgZm9vZExvZ0luZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmZvb2RJbmRleDtcbiAgICBsZXQgaW5ncmVkaWVudEluZGV4ID0gZXZlbnQuY3VycmVudFRhcmdldC5kYXRhc2V0LmluZ3JlZGllbnRJbmRleDtcbiAgICBsZXQgaW5ncmVkaWVudCA9IHRoaXMuZGF0YS5mb29kTGlzdFtmb29kTG9nSW5kZXhdLmluZ3JlZGllbnRfbGlzdFtpbmdyZWRpZW50SW5kZXhdO1xuICAgIGxldCByZWNpcGVJZCA9IGluZ3JlZGllbnQucmVjaXBlX2RldGFpbHNfaWQ7XG4gICAgbGV0IHVuaXRJZCA9IGluZ3JlZGllbnQudW5pdF9vcHRpb25baW5ncmVkaWVudC5zZWxlY3RlZFBvcnRpb25JbmRleF0udW5pdF9pZDtcbiAgICBsZXQgcmVxID0geyByZWNpcGVfaXRlbV9pZDogcmVjaXBlSWQsIHVuaXRfaWQ6IHVuaXRJZCwgYW1vdW50OiBhbW91bnRWYWx1ZSB9O1xuICAgIHdlYkFQSS5VcGRhdGVSZWNpcGVJdGVtKHJlcSkudGhlbihyZXNwID0+IHsgdGhpcy5wYXJzZU1lYWxEYXRhKHJlc3ApOyB9KS5jYXRjaChlcnIgPT4ge1xuICAgICAgY29uc29sZS5sb2coZXJyKTtcbiAgICAgIHd4LnNob3dNb2RhbCh7XG4gICAgICAgIHRpdGxlOiAnJyxcbiAgICAgICAgY29udGVudDogJ+abtOaWsOWksei0pScsXG4gICAgICAgIHNob3dDYW5jZWw6IGZhbHNlXG4gICAgICB9KTtcbiAgICB9KTtcbiAgfVxuXG59XG5cblBhZ2UobmV3IEZvb2REZXRhaWwoKSkiXX0=