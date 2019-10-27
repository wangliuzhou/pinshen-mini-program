import * as webAPI from '../../api/app/AppService';
import {
  RetrieveFoodDiaryReq, RetrieveFoodDiaryResp,
  RetrieveOrCreateUserReportReq, RetrieveOrCreateUserReportResp,
  RetrieveMealLogReq, MealLogResp, FoodLogInfo, MealInfo
} from "../../api/app/AppServiceObjs"
import * as globalEnum from '../../api/GlobalEnum'
import * as moment from 'moment';
import * as uploadFile from '../../api/uploader.js';


type NutritionInfo = {
  nutrient_name: string;
  intaken_percentage: number;
  progress_color: string;
  intaken_num: number;
  total_num: number;
  unit: string;
}

type Meal = {
  mealId: number;
  mealName: string;
  mealEngry: number;
  suggestedIntake: number;
  mealPercentage: number;
  meals: MealInfo[];
  mealSummary: Food[]
}
type Food = {
  foodName: string;
  energy: number;
  unitName: string;
  weight: number
}

class FoodDiaryPage {

  public data = {
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
  public mealType = 0;
  public mealDate = 0;
  public path = '';

  public onLoad() {
    //set token into webAPI
    webAPI.SetAuthToken(wx.getStorageSync(globalEnum.globalKey_token));
    // let currentTimeStamp = Date.parse(String(new Date()));
    // this.retrieveFoodDiaryData(currentTimeStamp/1000);
  }

  public onShow() {
    if (this.mealDate !== 0) {
      this.retrieveFoodDiaryData(this.mealDate);
    }
    // this.loadReportBadge();
  }

  public loadReportBadge() {
    let token = wx.getStorageSync(globalEnum.globalKey_token);
    console.log(token);
    if (token) {
      let currentDate = moment().startOf('day');
      let firstDayOfWeek = currentDate.week(currentDate.week()).day(1).unix();
      let lastDayOfWeek = currentDate.week(currentDate.week()).day(7).unix();
      let req = {
        date_from: firstDayOfWeek,
        date_to: lastDayOfWeek
      };
      webAPI.RetrieveUserReports(req).then(resp => {
        wx.hideLoading({});
        this.countReportBadge(resp);
      }).catch(err => {
        console.log(err);
      });
    }
  }

  public countReportBadge(resp: any) {
    console.log(resp);
    let reportNum = 0;
    let reports = resp.daily_report;
    for (let index in reports) {
      let report = reports[index];
      if (!report.is_report_generated && !report.is_food_log_empty) {
        let todayTime = moment().startOf('day').unix();
        console.log(todayTime);
        if (report.date < todayTime || (report.date == todayTime && moment(new Date()).hours > 22)) {   //count today reports status after 19
          reportNum++;
        }
      }
    }
    if (reportNum != 0) {
      wx.setTabBarBadge({
        index: 2,
        text: String(reportNum)
      });
    } else {
      wx.removeTabBarBadge({
        index: 2
      });
    }
  }

  public retrieveFoodDiaryData(currentTimeStamp: number) {
    let req: RetrieveFoodDiaryReq = { date: currentTimeStamp };
    webAPI.RetrieveFoodDiary(req).then(resp => this.foodDiaryDataParsing(resp)).catch(err =>

      wx.showModal({
        title: '',
        content: '获取日志失败',
        showCancel: false
      })
    );
  }

  public retrieveMealLog(mealId: number) {
    let req: RetrieveMealLogReq = { meal_id: mealId }
    return webAPI.RetrieveMealLog(req).then(resp => {
      return this.parseMealLog(resp);
    }).catch(err => {
      console.log(err);
      wx.showModal({
        title: '',
        content: '获取食物数据失败',
        showCancel: false
      })
    }
    );
  }
  public parseMealLog(resp: MealLogResp) {
    let foodList: Food[] = [];
    for (let index in resp.food_log) {
      let foodLog: FoodLogInfo = resp.food_log[index];
      let unitObj = foodLog.unit_option.find(o => o.unit_id === foodLog.unit_id);
      let unitName = "份"
      if (unitObj) {
        unitName = unitObj.unit_name;
      }
      let food: Food = {
        foodName: foodLog.food_name,
        energy: Math.floor(foodLog.energy / 100),
        unitName: unitName,
        weight: Math.round(foodLog.amount) / 100

      }
      foodList.push(food)
    }
    return foodList
  }
  public loadMealSummary(resp: RetrieveFoodDiaryResp) {
    let breakfast: Meal;
    let breakfastSummary: Food[] = [];
    let breakfastIds: number[] = []
    resp.breakfast.forEach((item =>
      breakfastIds.push(item.meal_id)
    ))
    const breakfastProms = Promise.all(breakfastIds.map(id => this.retrieveMealLog(id))).then(
      result => {
        result.map(list => breakfastSummary.push(...list));
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
    //lunch
    let lunch: Meal;
    let lunchSummary: Food[] = [];
    let lunchIds: number[] = []
    resp.lunch.forEach((item =>
      lunchIds.push(item.meal_id)
    ));
    const lunchProms = Promise.all(lunchIds.map(id => this.retrieveMealLog(id))).then(
      result => {
        result.map(list => lunchSummary.push(...list));
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
    //dinner
    let dinner: Meal;
    let dinnerSummary: Food[] = [];
    let dinnerIds: number[] = []
    resp.dinner.forEach((item =>
      dinnerIds.push(item.meal_id)
    ));
    const dinnerProms = Promise.all(dinnerIds.map(id => this.retrieveMealLog(id))).then(
      result => {
        result.map(list => dinnerSummary.push(...list));
        return dinner = {
          mealId: 2,
          mealName: '晚餐', mealEngry: Math.floor(resp.dinner_suggestion.energy_intake / 100),
          suggestedIntake: Math.floor(resp.dinner_suggestion.suggested_intake / 100),
          mealPercentage: resp.dinner_suggestion.percentage,
          meals: resp.dinner,
          mealSummary: dinnerSummary
        };

      });
    //additional
    let addition: Meal;
    let additionSummary: Food[] = [];
    let additionIds: number[] = []
    resp.addition.forEach((item =>
      dinnerIds.push(item.meal_id)
    ));
    const additionProms = Promise.all(additionIds.map(id => this.retrieveMealLog(id))).then(
      result => {
        result.map(list => additionSummary.push(...list));
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
    let mealList: Meal[] = []
    Promise.all([breakfastProms, lunchProms, dinnerProms]).then(
      result => {
        result.map(meal => mealList.push(meal));
        (this as any).setData({
          mealList: mealList,
        })
        console.log(mealList)
      }
    );

  }

  public foodDiaryDataParsing(resp: RetrieveFoodDiaryResp) {
    console.log("summary", resp);
    let score = resp.score;
    let energy = resp.daily_intake.energy;
    let protein = resp.daily_intake.protein;
    let carbohydrate = resp.daily_intake.carbohydrate;
    let fat = resp.daily_intake.fat;
    let nutrientSummary = [
      { nutrient_name: "热量", intaken_percentage: energy.percentage, intaken_num: Math.floor(energy.intake / 100), total_num: Math.floor(energy.suggested_intake / 100), unit: "千卡" },
      { nutrient_name: "脂肪", intaken_percentage: fat.percentage, intaken_num: Math.floor(fat.intake / 100), total_num: Math.floor(fat.suggested_intake / 100), unit: "克" },
      { nutrient_name: "碳水化合物", intaken_percentage: carbohydrate.percentage, intaken_num: Math.floor(carbohydrate.intake / 100), total_num: Math.floor(carbohydrate.suggested_intake / 100), unit: "克" },
      { nutrient_name: "蛋白质", intaken_percentage: protein.percentage, intaken_num: Math.floor(protein.intake / 100), total_num: Math.floor(protein.suggested_intake / 100), unit: "克" }
    ]

    this.loadMealSummary(resp);
    // let mealList = [breakfast, lunch, dinner, additional];
    (this as any).setData({
      nutrientSummary: nutrientSummary,
      score: score
    });


  }

  public bindNaviToOtherMiniApp() {
    //test on navigate miniProgram
    wx.navigateToMiniProgram({
      appId: 'wx4b74228baa15489a',
      path: '',
      envVersion: 'develop',
      success(res: any) {
        // 打开成功
        console.log("succcess navigate");
      },
      fail(err: any) {
        console.log(err);
      }
    })
  }

  //when openning the calendar
  public bindselect(event: any) {
    console.log(event);
  }

  //when user select date
  public bindgetdate(event: any) {
    //Convert date to unix timestamp
    let time = event.detail;
    let date = moment([time.year, time.month - 1, time.date]); // Moment month is shifted left by 1
    //get current timestamp
    this.mealDate = date.unix();
    console.log(this.mealDate);
    //request API
    this.retrieveFoodDiaryData(this.mealDate);
    //let timeData = time.year + "-" + time.month + "-" + time.date;
  }
  public onDailyReportClick(event: any) {
    console.log(event);
    this.retrieveDailyReport(this.mealDate);
  }
  public retrieveDailyReport(currentTimeStamp: number) {
    let req: RetrieveOrCreateUserReportReq = { date: currentTimeStamp };
    webAPI.RetrieveOrCreateUserReport(req).then(resp => {
      let reportUrl: string = resp.report_url;
      if (reportUrl && reportUrl != "") {
        wx.navigateTo({ url: "/pages/reportPage/reportPage?url=" + reportUrl });
      } else {
        wx.showModal({
          title: "",
          content: "请添加当天食物记录",
          showCancel: false
        })
      }
    }).catch(err => console.log(err))
  }



  public addFoodImage(event: any) {
    let mealIndex = event.currentTarget.dataset.mealIndex;
    var that = this;
    this.mealType = mealIndex + 1;
    console.log("mealIndex:" + mealIndex);
    wx.showActionSheet({
      itemList: ['拍照记录', '相册', '文字搜索'],
      success(res: any) {
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
  }

  public chooseImage(sourceType: string) {
    var that = this;
    wx.chooseImage({
      count: 1,
      sizeType: ['original', 'compressed'],
      sourceType: [sourceType],
      success: function (res: any) {
        wx.showLoading({ title: "上传中...", mask: true });
        let imagePath = res.tempFilePaths[0];
        that.path = imagePath
        //crop image then upload, follow by tagging process
        // wx.navigateTo({
        //   url: "/pages/weCropperPage/upload?imageUrl=" + imagePath + "&mealType=" + that.mealType + "&mealDate=" + that.mealDate

          // url: "/pages/imageTag/index?imageUrl=" + imagePath + "&mealType=" + that.mealType + "&mealDate=" + that.mealDate
            
        // });
        console.log(999, uploadFile)
        uploadFile(imagePath, that.onImageUploadSuccess, that.onImageUploadFailed, that.onUploadProgressing, 0, 0);
      },
      fail: function (err: any) {
        console.log(err);
      }
    });
  }

  public onImageUploadSuccess(event: any){
    console.log("uploadSucess" + this.mealType + "," + this.mealDate);
    wx.hideLoading();
    console.log('=====path====',this.path)
    wx.navigateTo({
      url: '/pages/imageTag/index?imageUrl=' + this.path + "&mealType=" + this.mealType + "&mealDate=" + this.mealDate,
    });
  }

  public onImageUploadFailed(event:any){
    console.log("uploadfailed");
    wx.hideLoading();
  }

  public onUploadProgressing(event: any){
    console.log("progress:");
  }


  public naviToFoodDetail(event: any) {
    const defaultImageUrl = "https://dietlens-1258665547.cos.ap-shanghai.myqcloud.com/mini-app-image/defaultImage/textsearch-default-image.png";
    let mealIndex = event.currentTarget.dataset.mealIndex;
    let imageIndex = event.currentTarget.dataset.imageIndex;
    let mealId = this.data.mealList[mealIndex].meals[imageIndex].meal_id;
    let imageKey = this.data.mealList[mealIndex].meals[imageIndex].img_key;
    let imageUrl = imageKey == "" ? defaultImageUrl : "https://dietlens-1258665547.cos.ap-shanghai.myqcloud.com/food-image/" + this.data.mealList[mealIndex].meals[imageIndex].img_key;
    let param = {};
    param.mealId = mealId;
    param.imageUrl = imageUrl;
    param.showDeleteBtn = true;
    param.showShareBtn = imageKey != "";
    let paramJson = JSON.stringify(param);
    wx.navigateTo({
      url: "/pages/foodDetail/index?paramJson=" + paramJson
    });
  }
}

Page(new FoodDiaryPage())
