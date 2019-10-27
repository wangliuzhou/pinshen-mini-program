//index.js
import * as globalEnum from '../../api/GlobalEnum';
import * as webAPI from '../../api/app/AppService';

const app = getApp<IMyApp>();

class nutritionalDatabasePage {
  public data = {
    macroArticleArr: [{
      url: "https://baidu.com/",
      src: '../../images/maxresdefault.jpg',
      title: '标题一亦亿亿一亿',
    }],
    microArticleArr: [{
      url: "https://baidu.com/",
      src: '../../images/maxresdefault.jpg',
      title: '标题一亦亿亿一亿',
      subtitle: '补维生素B1吃什么好？补维生素B1食疗？',
    }],
    macroDisplayArr: [{
      url: '/pages/nutritionalDatabasePage/articlePage',
      src: '../../images/maxresdefault.jpg',
      title: '正在加载...',
    }],
    microDisplayArr: [{
      url: '/pages/nutritionalDatabasePage/articlePage',
      src: '../../images/maxresdefault.jpg',
      title: '正在加载...',
      subtitle: '正在加载...',
    }],
    macroMaxIdx: 3,
    microMaxIdx: 3,
    isTabOneSelected: true,
    tabOneStyleClass: "weui-navbar__item weui-bar__item_on",
    tabTwoStyleClass: "weui-navbar__item",
    isThereMoreMacro: true,
    isThereMoreMicro: true
  }

  public onNavbarSelect1(e): void {
    (this as any).setData({
    isTabOneSelected: true,
    tabOneStyleClass: "weui-navbar__item weui-bar__item_on",
    tabTwoStyleClass: "weui-navbar__item"
    });
  }

  public onNavbarSelect2(e): void {
    (this as any).setData({
      isTabOneSelected: false,
      tabOneStyleClass: "weui-navbar__item",
      tabTwoStyleClass: "weui-navbar__item weui-bar__item_on"
    });
  }

  // copies articles 0 - MaxIdx from ArticleArr to DisplayArr
  public setDisplayArr(): void {
    let macroTemp = this.data.macroArticleArr.slice(0, this.data.macroMaxIdx);
    let microTemp = this.data.microArticleArr.slice(0, this.data.microMaxIdx);

    (this as any).setData({
      macroDisplayArr: macroTemp,
      microDisplayArr: microTemp
    });
  }

  public onLoadMoreMacro(e): void {
    if (this.data.macroMaxIdx < this.data.macroArticleArr.length) {
      (this as any).setData({
        macroMaxIdx: this.data.macroMaxIdx += 3
      });
    }
    
    this.setDisplayArr();
    if (this.data.macroMaxIdx >= this.data.macroArticleArr.length) {
      this.hideMacroButton();
    }
  }

  public onLoadMoreMicro(e): void {
    if (this.data.microMaxIdx < this.data.microArticleArr.length) {
      (this as any).setData({
        microMaxIdx: this.data.microMaxIdx += 3
      });
    }

    this.setDisplayArr();
    if (this.data.microMaxIdx >= this.data.microArticleArr.length) {
      this.hideMicroButton();
    }
  }

  private hideMacroButton(): void {
    (this as any).setData({
      isThereMoreMacro: false
    })
  }

  private hideMicroButton(): void {
    (this as any).setData({
      isThereMoreMicro: false
    })
  }

  public getArticles(): void {
    var that: any = this;

    webAPI.RetrieveNutritionKnowledge({}).then(resp => {

      let tempMacro = [];
      let tempMicro = [];
      let i: number = 0;

      for (i = 0; i < resp.macro.length; i++) {
        let temp = {
          url: resp.macro[i].article_url,
          src: resp.macro[i].img_url,
          title: resp.macro[i].desc,
        }
        tempMacro.push(temp);
      }

      for (i = 0; i < resp.micro.length; i++) {
        let temp = {
          url: resp.micro[i].article_url,
          src: resp.micro[i].img_url,
          title: resp.micro[i].title,
          subtitle: resp.micro[i].desc,
        }
        tempMicro.push(temp);
      }

      (that as any).setData({
        macroArticleArr: tempMacro,
        microArticleArr: tempMicro,
        macroDisplayArr: tempMacro.slice(0, that.data.macroMaxIdx),
        microDisplayArr: tempMicro.slice(0, that.data.microMaxIdx)
      });

      (that as any).setDisplayArr();
      if(tempMacro.length <= 3) {
        that.hideMacroButton();
      }

      if (tempMicro.length <= 3) {
        that.hideMicroButton();
      }

    }).catch(err => wx.hideLoading({}));
  }

  public onLoad(): void {
    webAPI.SetAuthToken(wx.getStorageSync(globalEnum.globalKey_token));
    wx.showLoading({ title: "加载中...", mask: true });
    let that: any = this;

    wx.setNavigationBarTitle({
      title: "营养知识"
    });

    setTimeout(function () {
      that.getArticles();
      wx.hideLoading({});
    });
  }
}

Page(new nutritionalDatabasePage());
