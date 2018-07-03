var app = getApp()
var util = require('../../../utils/util.js')

Page({
  data: {
    hideVerifyPhone: true,
    hideBindNewPhone: true,
    oldCode: '',
    oldCodeBtnDisabled: false,
    oldCodeStatus: '获取验证码',
    nextStepDisabled: false,
    newPhone: '',
    newCode: '',
    newCodeBtnDisabled: false,
    newCodeStatus: '获取验证码',
    bindNewPhoneBtnDisabled: false,
    codeInterval: 60,
    oldPhonePicCodeUrl: '',
    newPhonePicCodeUrl: '',
    hasMerged: false,
    accountList: []
  },
  oldPhonePicCode: '',
  newPhonePicCode: '',
  formerPageRouter: '',
  onLoad: function (options) {
    var userInfo = app.getUserInfo();

    this.formerPageRouter = options.r || '';
    if (userInfo.phone) {
      this.setData({
        hideVerifyPhone: false
      })
      this.refreshOldPhonePicCode();
      this.getAccountInfo();
    } else {
      this.setData({
        hideBindNewPhone: false
      })
      this.refreshNewPhonePicCode();
    };
    this.dataInitial();
  },
  dataInitial: function () {
    this.getXcxUserInfo();
  },
  getXcxUserInfo: function () {
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppData/GetXcxUserInfo',
      data: {},
      success: function (res) {
        that.setData({
          hasMerged: res.data.has_merged == 0
        });
      }
    })
  },
  getAccountInfo: function (callback) {
    var that = this;
    app.sendRequest({
      url: '/index.php?r=AppShop/GetAccountIfCouldMerge',
      data: {},
      success: function (res) {
        that.setData({
          accountList: res.data.list || []
        });

        typeof callback === 'function' && callback(res);
      }
    })
  },
  sendCodeToOldPhone: function () {
    var that = this;
    if (this.data.oldCodeBtnDisabled) {
      return;
    }
    if (!this.oldPhonePicCode) {
      app.showModal({
        content: '请输入图形验证码'
      });
      return;
    }

    this.setData({
      oldCodeStatus: '正在发送...',
      oldCodeBtnDisabled: true
    })
    app.sendRequest({
      url: '/index.php?r=AppData/PhoneCode',
      data: {
        pic_code: this.oldPhonePicCode
      },
      success: function () {
        var second = that.data.codeInterval,
          interval;

        interval = setInterval(function () {
          if (second < 0) {
            clearInterval(interval);
            that.setData({
              oldCodeStatus: '获取验证码',
              oldCodeBtnDisabled: false
            })
          } else {
            that.setData({
              oldCodeStatus: second + 's',
            })
            second--;
          }
        }, 1000);
      },
      complete: function () {
        that.setData({
          oldCodeStatus: '获取验证码',
          oldCodeBtnDisabled: false
        })
      }
    })

  },
  inputOldCode: function (e) {
    this.setData({
      oldCode: e.detail.value
    })
  },
  nextStep: function () {
    var that = this;
    if (!this.data.oldCode) {
      app.showModal({
        content: '请输入验证码'
      })
      return;
    }
    if (this.data.nextStepDisabled) {
      return;
    }

    this.setData({
      nextStepDisabled: true
    })
    app.sendRequest({
      url: '/index.php?r=AppData/VerifyPhone',
      method: 'post',
      data: {
        code: this.data.oldCode
      },
      success: function () {
        that.setData({
          hideVerifyPhone: true,
          hideBindNewPhone: false
        })
        that.refreshNewPhonePicCode();
      },
      complete: function () {
        that.setData({
          nextStepDisabled: false
        })
      }
    })
  },
  inputPhone: function (e) {
    this.setData({
      newPhone: e.detail.value
    })
  },
  inputNewCode: function (e) {
    this.setData({
      newCode: e.detail.value
    })
  },
  sendCodeToNewPhone: function () {
    var that = this,
      newPhone = this.data.newPhone;

    app.getStorage({
      key: 'session_key',
      success: function (res) {
        console.log(res);
        if (res.data == '') {
          app.showModal({
            content: '未获取授权，验证码获取失败'
          })
          return;
        };
      }
    })

    if (!this.newPhonePicCode) {
      app.showModal({
        content: '请输入图形验证码'
      });
      return;
    }
    if (!util.isPhoneNumber(newPhone)) {
      app.showModal({
        content: '请输入正确的手机号码'
      })
      return;
    }
    if (this.data.newCodeBtnDisabled) {
      return;
    }

    this.setData({
      newCodeStatus: '正在发送...',
      newCodeBtnDisabled: true
    })
    app.sendRequest({
      url: '/index.php?r=AppData/NewPhoneCode',
      method: 'post',
      data: {
        phone: newPhone,
        pic_code: this.newPhonePicCode
      },
      success: function (res) {
        var second = that.data.codeInterval,
          interval;

        interval = setInterval(function () {
          if (second < 0) {
            clearInterval(interval);
            that.setData({
              newCodeStatus: '获取验证码',
              newCodeBtnDisabled: false
            })
          } else {
            that.setData({
              newCodeStatus: second + 's',
            })
            second--;
          }
        }, 1000);
      },
      complete: function () {
        that.setData({
          newCodeStatus: '获取验证码',
          newCodeBtnDisabled: false
        })
      }
    })
  },
  bindNewPhone: function () {
    var that = this,
      newPhone = this.data.newPhone,
      newCode = this.data.newCode;

    if (!newPhone || !newCode) {
      return;
    }
    if (!util.isPhoneNumber(newPhone)) {
      app.showModal({
        content: '请输入正确的手机号码'
      })
      return;
    }

    if (this.data.bindNewPhoneBtnDisabled) {
      return;
    }
    this.setData({
      bindNewPhoneBtnDisabled: true
    })

    app.sendRequest({
      url: '/index.php?r=AppData/XcxVerifyNewPhone',
      mehtod: 'post',
      data: {
        phone: newPhone,
        code: newCode
      },
      success: function (res) {
        app.setUserInfoStorage({
          phone: newPhone
        });
        app.showToast({
          title: '绑定成功',
          icon: 'success',
          success: function () {
            that.getAccountInfo(function(){
              if (that.data.hasMerged && that.data.accountList.length > 0) {
                app.turnToPage('/default/pages/userCollect/userCollect',1);
              } else {
                app.turnToPage('/pages/' + that.formerPageRouter + '/' + that.formerPageRouter, 1);
              }
            })
          }
        })
      },
      fail: function (res) {
        app.showModal({
          content: '绑定失败' + res.data
        })
      },
      complete: function () {
        that.setData({
          bindNewPhoneBtnDisabled: false
        })
      }
    })
  },
  getPhoneNumber: function (e) {
    let that = this;
    app.sendRequest({
      hideLoading: true,
      url: '/index.php?r=AppUser/GetPhoneNumber',
      data: {
        encryptedData: e.detail.encryptedData,
        iv: e.detail.iv
      },
      success: function (res) {
        app.setUserInfoStorage({
          phone: res.data
        })
        app.showToast({
          title: '授权成功',
          icon: 'success',
          success: function () {
            that.getAccountInfo(function(){
              if (that.data.hasMerged && that.data.accountList.length > 0) {
                app.turnToPage('/default/pages/userCollect/userCollect',1);
              } else {
                app.turnToPage('/pages/' + that.formerPageRouter + '/' + that.formerPageRouter, 1);
              }
            })
          }
        })
      }
    })
  },
  inputOldPhonePicCode: function (e) {
    var value = e.detail.value;
    this.oldPhonePicCode = value;
  },
  inputNewPhonePicCode: function (e) {
    var value = e.detail.value;
    this.newPhonePicCode = value;
  },
  refreshOldPhonePicCode: function () {
    this.setData({
      oldPhonePicCodeUrl: app.getSiteBaseUrl() + '/index.php?r=Login/GetIdentifyCode&i=' + parseInt(Math.random() * 10000000) + '&session_key=' + app.getSessionKey()
    });
  },
  refreshNewPhonePicCode: function () {
    this.setData({
      newPhonePicCodeUrl: app.getSiteBaseUrl() + '/index.php?r=Login/GetIdentifyCode&i=' + parseInt(Math.random() * 10000000) + '&session_key=' + app.getSessionKey()
    });
  }

})
