
import { IMyApp } from '../../app'
import { epoch } from '../../utils/util'

const app = getApp<IMyApp>()
import * as webAPI from '../../api/app/AppService';
import { MiniProgramLogin } from '../../api/login/LoginService';
import * as globalEnum from '../../api/GlobalEnum';
import * as moment from 'moment';
import { RetrieveUserReportsReq, WeeklyReportCard, RetrieveUserReportsResp } from '../../api/app/AppServiceObjs'

enum DAY {
  MONDAY = "星期一",
  TUESDAY = "星期二",
  WED = "星期三",
  THURS = "星期四",
  FRI = "星期五",
  SAT = "星期六",
  SUN = "星期日"
}

interface Report {
  report_url: string;
  date: number;
  is_read: boolean;
  first_day: string;
  last_day: string;
  is_sample: boolean
}

class reportPage {
  public data = {
    year: "",
    month: "",
    week: "",
    date: "30",
    countMonth: 0,
    checkReportGenerated: true,
    reportBoxClass: "checked-box",
    isPrevMonthAllowed: true,
    isNextMonthAllowed: false,

    weekly_isReadArr: [],
    weeklyBadge: 0,

    weeklyReportArr: [],
    currentDate: 0
  }

  public onLoad(): void {
    let token = wx.getStorageSync(globalEnum.globalKey_token);
    webAPI.SetAuthToken(token);
  }

  public onShow() {
    //load default data of the whole week
    this.loadReportData();
  }

  public loadReportData() {
    let currentDate = moment();
    currentDate = currentDate.add(this.data.countMonth, 'month');
    if (currentDate.isAfter(moment(), 'month')) {
      // Doesn't allow to go future month
      (this as any).setData({ isPrevMonthAllowed: true, isNextMonthAllowed: false });

    } else {
      // Allow to go previous month
      if (currentDate.isSame(moment(), 'month')) {
        (this as any).setData({ isPrevMonthAllowed: true, isNextMonthAllowed: false });
      } else {
        (this as any).setData({ isPrevMonthAllowed: true, isNextMonthAllowed: true });
      }
    }

    let firstDayOfMonth = moment(currentDate).startOf('month').unix();
    let lastDayOfMonth = moment(currentDate).endOf('month').unix();
    let req = {
      date_from: firstDayOfMonth,
      date_to: lastDayOfMonth
    };
    console.log(firstDayOfMonth, lastDayOfMonth);
    wx.showLoading({ title: "加载中..." });
    webAPI.RetrieveUserReports(req).then(resp => {
      wx.hideLoading({});
      this.parseReportData(currentDate, resp);

    }).catch(err => {
      console.log(err);
      wx.hideLoading({});
    });
    (this as any).setData({
      year: currentDate.format('YYYY'),
      month: currentDate.format('MM'),
      date: currentDate.format('DD'),
      week: currentDate.week()
    });
  }

  public parseReportData(currentDate: moment, resp: any) {
    console.log(currentDate);
    console.log(resp);
    let reportResp: WeeklyReportCard[] = resp.weekly_report;
    let weeklyReport: Report[] = [];
    for (let index in reportResp) {
      let report: WeeklyReportCard = reportResp[index];
      let firstDayOfWeek: string = moment.unix(report.date_from).format('DD');
      let lastDayOfWeek: string = moment.unix(report.date_to).format('DD');
      let weekly_report: Report = {
        date: report.date,
        is_read: report.is_read,
        report_url: report.report_url,
        first_day: firstDayOfWeek,
        last_day: lastDayOfWeek,
        is_sample: false
      }
      weeklyReport.push(weekly_report)
    }

    if (currentDate.isSame(moment(), 'month') && reportResp.length == 0) {
      let firstDayOfWeek: string = currentDate.week(currentDate.week()).day(1).format('DD');
      let lastDayOfWeek: string = currentDate.week(currentDate.week()).day(7).format('DD');
      let weekly_report: Report = {
        date: currentDate.unix(),
        first_day: firstDayOfWeek,
        last_day: lastDayOfWeek,
        report_url: "https://report.icmoto.cn/userweeklyreport/584",
        is_read: false,
        is_sample: true,
      }
      weeklyReport.push(weekly_report)
    }



    (this as any).setData({
      weeklyReportArr: weeklyReport,
      // weeklyBadge: numNewWeeklyReport
    });

    console.log(this.data.weeklyReportArr)
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

  public nextMonth(event: any): void {
    (this as any).setData({ countMonth: this.data.countMonth + 1 });
    this.loadReportData();
  }

  public prevMonth(event: any): void {
    (this as any).setData({ countMonth: this.data.countMonth - 1 });
    this.loadReportData();
  }



  public onWeeklyReportClick(event: any): void {
    let reportIndex: number = event.currentTarget.dataset.reportIndex;
    let report: Report = this.data.weeklyReportArr[reportIndex];
    let reportUrl: string = report.report_url;
    if (reportUrl) {
      if (report.is_sample) {
        wx.showModal({
          title: '提示',
          content: '这是一个样例报告',
          cancelText: '取消',
          confirmText: "查看",
          success: function (res) {
            if (res.confirm) {
              wx.navigateTo({ url: "/pages/reportPage/reportPage?url=" + reportUrl });
            }

          }
        })
      } else {
        wx.navigateTo({ url: "/pages/reportPage/reportPage?url=" + reportUrl });
      }
    }




    // TO DO: Update badge when report read
  }
}

Page(new reportPage());