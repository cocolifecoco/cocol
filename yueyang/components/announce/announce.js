var app = getApp()

Component({
  properties: {
    // 这里定义了传进来的对象属性，属性值可以在组件使用时指定
    announce: {
      type: Object,
      observer: function(){
        this.initialAnnounce();
      }
    }
  },
  ready: function(){
    
  },
  data: {
    // 这里是一些组件内部数据
    interval:'',
    topFlag: true,
    scrollContentHeight: 0,
    isIconFlag: true
  },
  methods: {
    // 这里是一个自定义方法
    initialAnnounce: function(){
      if (this.properties.announce.customFeature.mode === 1 && this.properties.announce.content.length > 1){
        clearInterval(this.data.interval);
        this.scrollTopInterval();
      }
      if (this.properties.announce.customFeature.selectImg.indexOf('announce') >= 0){
        this.setData({
          isIconFlag: true
        })
      }else{
        this.setData({
          isIconFlag: false
        })
      }
    },
    scrollTopInterval: function() {
      this.data.interval = setInterval(() => {
        if (this.data.topFlag) {
          this.scrollTop();
        } else {
          this.scrollBottom();
        }
      }, 4000)
    },
    scrollTop: function() {
      let scrollContentHeight = +this.data.scrollContentHeight - +this.properties.announce.customFeature.height;
      let topFlag = '';
      if (scrollContentHeight == -this.properties.announce.customFeature.height * (this.properties.announce.content.length - 1)) {
        topFlag = false;
      }else{
        topFlag = true;
      }
      this.setData({
        scrollContentHeight: scrollContentHeight,
        topFlag: topFlag
      })
    },
    scrollBottom: function() {
      let scrollContentHeight = +this.data.scrollContentHeight + +this.properties.announce.customFeature.height;
      let topFlag = '';
      if (scrollContentHeight == 0) {
        topFlag = true;
      }else{
        topFlag = false;
      }
      this.setData({
        scrollContentHeight: scrollContentHeight,
        topFlag: topFlag
      })
    },
    tapPhoneCallHandler: function (e) {
      app.tapPhoneCallHandler(e);
    },
    tapInnerLinkHandler: function (e) {
      app.tapInnerLinkHandler(e);
    },
    tapToPluginHandler: function (e) {
      app.tapToPluginHandler(e);
    },
    turnToCommunityPage: function (e) {
      app.turnToCommunityPage(e);
    },
    tapToFranchiseeHandler: function (e) {
      app.tapToFranchiseeHandler(e);
    },
    tapToTransferPageHandler: function () {
      app.tapToTransferPageHandler();
    },
    tapToSeckillHandler: function (e) {
      app.tapToSeckillHandler(e);
    },
    tapToPromotionHandler: function () {
      app.tapToPromotionHandler();
    },
    tapToLuckyWheel: function (e) {
      app.tapToLuckyWheel(e);
    },
    tapToGoldenEggs: function (e) {
      app.tapToGoldenEggs(e);
    },
    tapToScratchCard: function (e) {
      app.tapToScratchCard(e);
    },
    popupWindowControlHandler: function (e) {
      app.popupWindowControlHandler(e);
    },
    tapGetCouponHandler: function (e) {
      app.tapGetCouponHandler(e);
    },
    franchiseeCooperationHandler: function (e){
      app.franchiseeCooperationHandler(e);
    },
    tapToXcx: function(e){
      app.tapToXcx(e);
    },
    tapCommunityHandler: function(e){
      app.tapCommunityHandler(e);
    },
    connectWifiHandler: function(e){
      app.connectWifiHandler(e);
    },
    franchiseeEnterHandler: function(e){
      app.franchiseeEnterHandler(e);
    },
    tapToCouponReceiveListHandler: function(e){
      app.tapToCouponReceiveListHandler(e);
    },
    tapGoodsTradeHandler: function(e){
      app.tapGoodsTradeHandler(e);
    },
    tapRefreshListHandler: function(e){
      app.tapRefreshListHandler(e);
    },
    tapToRechargeHandler: function(e){
      app.tapToRechargeHandler(e);
    },
    tapVideoHandler: function(e){
      app.tapVideoHandler(e);
    },
    animationEnd: function(e){
      app.animationEnd(e);
    }
  }
})