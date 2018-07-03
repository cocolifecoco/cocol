var app = getApp();
Component({
  properties: {
    backToHomePage: {
      type: Object,
      value: {
        showButton: false
      }
    }
  },
  data: {
    backToHomePage: {
      showButton: true
    }
  },
  methods: {
    backToHomePage:function() {
      app.turnToPage('/pages/' + app.globalData.homepageRouter + '/' + app.globalData.homepageRouter)
    },
  }
})