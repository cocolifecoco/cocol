// components/rewardPointModal/rewardPointModal.js
var app = getApp();
Component({
  
  properties: {
    rewardPointObj: {
      type: Object,
      value: {
        showModal: false,
        count: '',
        callback: ''
      }
    }
  },

  data: {
    rewardPointObj: {
      showModal: false,
      count: '',
      callback: ''
    },
    cdnUrl: app.getCdnUrl()
  },

  methods: {
    stopPropagation: function () {},
    closeModal: function () {
      this.setData({
        'rewardPointObj.showModal': false
      });
      app.rewardPointCB(this.data.rewardPointObj.callback);
    }
  }
})
