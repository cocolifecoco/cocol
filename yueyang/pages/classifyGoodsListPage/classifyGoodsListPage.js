var app = getApp();

Page({
  data: {
    classifyGroupForm: '',
    categoryId: '',
    classifyGoodsList: { 
      "type": "goods-list", 
      "style": "",
      "content": "", 
      "customFeature": { "lineBackgroundColor": "rgb(255, 255, 255)", "lineBackgroundImage": "", "margin": 0, "lineHeight": 75, "imgWidth": 80, "imgHeight": 80, "vesselAutoheight": 0, "height": "300px", "form": "goods", "mode": 0, "name": "\u5546\u54c1\u5217\u8868", "ifUseContact": true, "isIntegral": false, "isHideSales": false, "isHideStock": false, "isShoppingCart": true, "isBuyNow": false, "isShowVirtualPrice": true, "id": "list-323814140496" },
      "animations": [],
      "page_form": "",
      "compId": "goods_list1",
      "parentCompid": "goods_list1",
      "list_style": "",
      "img_style": "",
      "title_width": ""
    },
    tab: 0,
    filterShow: false,
    goodsList: [],
    loadData: {
      loading: false,
      nomore: false,
      page: 1
    },
    leastPrice: '',
    mostPrice: '',
    styleType: 0,
    goods_type: 0,
    sortKey: '',
    sortDirection: '',
    hasFilter: false,
    currentRegionId: ''
  },
  onLoad: function (options) {
    let form = options.form || '';
    let goods_type = this.getGoodsType(form);
    let cate = options.category_id || '';

    this.setData({
      classifyGroupForm: form,
      categoryId: cate,
      search: options.search || '',
      goods_type: goods_type,
      hasFilter: cate ? true : false
    });
    
    this.getClassifyGoodsListData();

    app.globalData.classifyGoodsListPageRefresh = false;
  },
  onShow: function(){
    if (app.globalData.classifyGoodsListPageRefresh){
      let s = wx.getStorageSync('current-search')
      this.setData({
        search : s,
        tab: 0,
        sortKey: '',
        sortDirection: '',
        least_price: '',
        most_price: '',
        loadData: {
          loading: false,
          nomore: false,
          page: 1
        }
      });

      this.getClassifyGoodsListData();
      app.globalData.classifyGoodsListPageRefresh = false;
    }
  },
  getGoodsType: function(form){
    let type = 0;
    switch(form){
      case 'goods':
        type = 0;
        break;
      case 'appointment':
        type = 1;
        break;
      case 'tostore':
        type = 3;
        break;
      default :
        type = 0;
        break;
    }
    return type;
  },
  // 加载数据
  getClassifyGoodsListData: function () {
    let that = this;
    let idx = that.data.categoryId ? {
      idx: 'category',
      idx_value: that.data.categoryId
      } : '';
    let param = {
      form: that.data.classifyGroupForm,
      // goods_type: that.data.goods_type,
      page : that.data.loadData.page,
      page_size: 15,
      least_price: that.data.leastPrice,
      most_price: that.data.mostPrice,
      search_value: that.data.search,
      idx_arr: idx,
      sort_key: that.data.sortKey,
      sort_direction: that.data.sortDirection,
      region_id: that.data.currentRegionId
    };

    if (that.data.loadData.loading || that.data.loadData.nomore){
      return;
    }
    that.data.loadData.loading = false;

    app.sendRequest({
      url: '/index.php?r=AppShop/GetGoodsList',
      method: 'post',
      data: param,
      success: function (res) {
        let newdata = {};
        let oldlist = param.page == 1 ? [] : that.data.goodsList;
        newdata['goodsList'] = oldlist.concat(res.data);
        newdata['loadData.page'] = param.page += 1;
        newdata['loadData.nomore'] = res.is_more == 0;

        that.setData(newdata);
      },
      complete: function(){
        that.data.loadData.loading = false;
      }
    });
  },
  // 滚动加载
  onReachBottom: function (event) {
    this.getClassifyGoodsListData();
  },
  // 跳转商品详情
  turnToGoodsDetail: function (e) {
    app.turnToGoodsDetail(e);
  },
  // 去搜索
  turnToAdvanceSearch: function(){
    app.turnToPage('/default/pages/advanceSearch/advanceSearch?search=' + this.data.search);
  },
  /**
   * 综合排序 tab = 0
   */
  sortByDefault: function (e) {
    this.setData({ 
      tab: 0 ,
      sortKey: '',
      sortDirection: '',
      loadData: {
        loading: false,
        nomore: false,
        page: 1
      }
    });
    this.getClassifyGoodsListData();
  },
  /**
   * 按销量排序 tab = 1
   */
  sortBySales: function () {
    this.setData({
      tab: 1,
      sortKey: 'sales',
      sortDirection: 0,
      loadData: {
        loading: false,
        nomore: false,
        page: 1
      }
    });
    this.getClassifyGoodsListData();
  },

  /**
   * 按价格排序 tab = 2
   */
  sortByPrice: function (e) {
    let that = this;
    let sd = (!that.data.sortDirection || that.data.sortDirection == 0) ? 1 : 0;
    this.setData({
      tab: 2,
      sortKey: 'price',
      sortDirection: sd ,
      loadData: {
        loading: false,
        nomore: false,
        page: 1
      }
    });
    this.getClassifyGoodsListData();
  },
  /**
   * 展示筛选
   */
  filterList: function(e){
    this.setData({
      filterShow: true
    });
  },
  // 更换样式
  switchStyle: function(){
    let type = this.data.styleType == 1 ? 0 : 1;

    this.setData({
      styleType : type,
      "classifyGoodsList.customFeature.mode" : type
    });
  },
  // 筛选侧栏确定
  filterConfirm: function(e){
    let detail = e.detail;
    let hasFilter = (detail.leastPrice || detail.mostPrice || detail.chooseCateId || detail.currentRegionId) ?  true : false;
    this.setData({
      leastPrice: detail.leastPrice || '',
      mostPrice: detail.mostPrice || '',
      categoryId: detail.chooseCateId || '',
      currentRegionId: detail.currentRegionId || '',
      hasFilter: hasFilter,
      loadData: {
        loading: false,
        nomore: false,
        page: 1
      }
    });
    this.getClassifyGoodsListData();
  },
  // 展示购物车
  showAddShoppingcart: function (e) {
    app.showAddShoppingcart(e);
  },
  hideAddShoppingcart: function () {
    app.hideAddShoppingcart();
  },
  selectGoodsSubModel: function (e) {
    app.selectGoodsSubModel(e);
  },
  resetSelectCountPrice: function () {
    app.resetSelectCountPrice();
  },
  inputBuyCount: function (e) {
    app.inputBuyCount(e)
  },
  clickGoodsMinusButton: function (e) {
    app.clickGoodsMinusButton();
  },
  clickGoodsPlusButton: function (e) {
    app.clickGoodsPlusButton();
  },
  sureAddToShoppingCart: function () {
    app.sureAddToShoppingCart();
  },
  sureAddToBuyNow: function () {
    app.sureAddToBuyNow();
  },
  clickTostoreMinusButton: function (e) {
    app.clickTostoreMinusButton(e);
  },
  clickTostorePlusButton: function (e) {
    app.clickTostorePlusButton(e);
  },
  readyToPay: function () {
    app.readyToTostorePay();
  },
  getValidateTostore: function () {
    app.getValidateTostore();
  },
  goToShoppingCart: function () {
    app.goToShoppingCart();
  },
})