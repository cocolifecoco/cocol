var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    history: [],
    inputContent: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({
      form: options.form || '',
      comeSearch: options.search ? true : false,
      inputContent: options.search || ''
    });
    var _this = this;
    app.getStorage({
      key: 'history',
      success: function (res) {
        _this.setData({ history: res.data });
      }
    })
  },

  /**
   * 搜索方法
   */
  searchList: function () {
    let history = this.data.history;
    let content = this.data.inputContent;

    let index = history.indexOf(content);
    if (index > -1){
      history.splice(index, 1);
    }
    history.unshift(content);
    this.setData({ history: history });
    app.setStorage({
      key: "history",
      data: history
    });

    if(this.data.comeSearch){
      app.setStorage({
        key: "current-search",
        data: content
      });
      app.turnBack();
      app.globalData.classifyGoodsListPageRefresh = true;
    }else{
      app.turnToPage('/pages/classifyGoodsListPage/classifyGoodsListPage?form='+this.data.form+'&search=' + content, true);
    }
  },

  /**
   * 快速搜索方法
   */
  quickSearch: function (e) {
    let tag = e.target.dataset.tag;

    this.setData({ inputContent: tag });

    if (this.data.comeSearch) {
      app.setStorage({
        key: "current-search",
        data: tag
      });
      app.turnBack();
      app.globalData.classifyGoodsListPageRefresh = true;
    }else{
      app.turnToPage('/pages/classifyGoodsListPage/classifyGoodsListPage?form=' + this.data.form +'&search=' + tag, true);
    }
  },


  /**
   * 获取搜索关键词
   */
  bindChange: function (e) {
    this.setData({ inputContent: e.detail.value });
  },

  /**
   * 清空搜索框内容
   */
  clearSearch: function () {
    this.setData({ 
      inputContent: '',
      showResult: false
    });
  },

  /**
   * 清空历史搜索记录
   */
  clearHistory: function () {
    let _this = this;
    app.removeStorage({
      key: 'history',
      success: function (res) {
        _this.setData({ history: [] });
      }
    })
  },

  /**
   * 返回前一页
   */
  navigateBack: function () {
    app.turnBack();
  },

})