var app = getApp()

Component({
  properties: {
    filterShow: {
      type: Boolean,
      value: false
    },
    chooseCateId: {
      type: String,
      value: ''
    },
    form: {
      type: String,
      value: 'goods',
      observer: function (newVal, oldVal) {
        this.setData({
          newVal: 'goods',
          goodsType: this.getGoodsType(newVal)
        })
      }
    }
  },
  ready: function(){
    // this.getLocation();
    this.getCategory();
  },
  data: {
    filterShow: false,
    category: {},
    chooseCateId: '',
    location: '',
    myAddress: false,
    myAddressList: [],
    myAddressIndex: '',
    chooseArea: false,
    areaList: [],
    province: {},
    city: {},
    town: {},
    areaType: 'province', // type值为province、city、town
    areaId: '',
    leastPrice: '',
    mostPrice: '',
    currentRegionId: '',
    form: 'goods',
    goodsType: 0
  },
  methods: {
    // 获取定位
    getGoodsType: function (form) {
      let type = 0;
      switch (form) {
        case 'goods':
          type = 0;
          break;
        case 'appointment':
          type = 1;
          break;
        case 'tostore':
          type = 3;
          break;
        default:
          type = 0;
          break;
      }
      return type;
    },
    getLocation: function () {
      let that = this;

      app.getLocation({
        success: function (res) {
          app.sendRequest({
            url: '/index.php?r=Map/getAreaInfoByLatAndLng',
            data: {
              longitude: res.longitude,
              latitude: res.latitude
            },
            success: function (data) {
              let province = data.data.address_component.province;
              let city = data.data.address_component.city;
              let district = data.data.address_component.district;

              that.setData({
                location: province + city + district,
                currentRegionId: data.data.region_id
              });
            }
          });

          that.setData({
            longitude: res.longitude,
            latitude: res.latitude
          });
        },
        fail: function (res) {
          console.log(res);
        }
      });
    },
    // 获取商品分类
    getCategory: function () {
      let that = this;
      app.sendRequest({
        url: '/index.php?r=appData/listCategory',
        data: {
          form: 'goods',
          goods_type: that.data.goodsType
        },
        success: function (res) {
          let data = res.data;
          let newdata = {};

          for(let i = 0; i < data.length; i++){
            let subclass = data[i].subclass;
            if (subclass && subclass.length > 0){
              let h = Math.ceil((subclass.length + 1) / 2) * 99 + 15;
              data[i].height = h;
              if(i == 0 || i == 1){
                data[i].isOpen = true;
              }
            }
          }

          newdata['category'] = data;
          that.setData(newdata);
        }
      });
    },
    // 选择分类
    chooseCategory: function(e){
      let id = e.currentTarget.dataset.id;


      let detail = {
        leastPrice: this.data.leastPrice,
        mostPrice: this.data.mostPrice,
        chooseCateId : id,
        currentRegionId: this.data.currentRegionId
      }
      this.setData(detail);
      this.triggerEvent('confirm', detail);
    },
    // 展开、隐藏二级分类
    openCate : function(e){
      let index = e.currentTarget.dataset.index;
      let newdata = {};

      newdata['category[' + index + '].isOpen'] = !this.data.category[index].isOpen;
      this.setData(newdata);
    },
    // 展示我的地址
    showMyAddress: function(){
      this.setData({
        myAddress: true
      });
      this.getMyAddress();
    },
    // 隐藏我的地址
    hideMyAddress: function(){
      this.setData({
        myAddress: false
      });
    },
    // 获取我的地址
    getMyAddress: function(){
      let that = this;
      app.sendRequest({
        url: '/index.php?r=AppShop/addressList',
        data: {},
        success: function (res) {
          let list = res.data;
          let newdata = {};

          newdata['myAddressList'] = list;
          that.setData(newdata);
        }
      });
    },
    // 选择我的地址
    chooseMyAddress: function(e){
      let index = e.currentTarget.dataset.index;
      let ad = this.data.myAddressList[index];
      let region = e.currentTarget.dataset.region;

      this.setData({
        myAddressIndex: index,
        myAddress: false,
        location: ad.address_info.province.text + ad.address_info.city.text + ad.address_info.district.text,
        currentRegionId: region
      });
    },
    // 展示选择地区
    showChooseArea: function () {
      this.setData({
        chooseArea: true,
        areaType : 'province',
        province: {},
        city: {},
        town: {}
      });
      this.getArea();
    },
    // 隐藏选择地区
    hideChooseArea: function () {
      this.setData({
        chooseArea: false
      });
    },
    // 获取地区
    allAreaList: [],
    getArea: function () {
      let that = this;

      app.sendRequest({
        url: '/index.php?r=AppShop/getAllRegionInfo',
        data: {},
        success: function (res) {
          let list = res.data;
          let provinceArr = [];
          let newdata = {};

          that.allAreaList = list;

          newdata['areaList'] = list;

          that.setData(newdata);
        }
      });
    },
    // 选择地区
    chooseArea: function(e){
      let newdata = {};
      let that = this;
      let id = e.currentTarget.dataset.id;
      let areaType = that.data.areaType;
      let areaList = that.data.areaList;

      if (areaType == 'province'){
        for (let i in areaList) {
          if(id == areaList[i].id){
            newdata[that.data.areaType] = areaList[i];
            newdata['areaList'] = areaList[i].cities;
          }
        }
        newdata['areaType'] = 'city';
      } else if (areaType == 'city'){
        for (let i in areaList) {
          if (id == areaList[i].id) {
            newdata[that.data.areaType] = areaList[i];
            newdata['areaList'] = areaList[i].towns;
          }
        }
        newdata['areaType'] = 'town'; 
      } else if (areaType == 'town'){
        for (let i in areaList) {
          if (id == areaList[i].id) {
            newdata[that.data.areaType] = areaList[i];
            newdata['currentRegionId'] = id;
          }
        }
        newdata['location'] = that.data.province.name + that.data.city.name + newdata.town.name;
        newdata['myAddress'] = false;
        newdata['chooseArea'] = false;
      }
      newdata['areaId'] = id;
      this.setData(newdata);
    },
    // 重设省份
    resetProvince: function () {
      let that = this;
      that.setData({
        areaType: 'province',
        areaId: '',
        areaList: that.allAreaList,
        province: {},
        city: {},
        town: {}
      });
    },
    // 重设城市
    resetCity: function(){
      let that = this;
      that.setData({
        areaType: 'city',
        areaId: '',
        areaList: that.data.province.cities,
        city: {},
        town: {}
      });
    },
    // 隐藏组件
    filterHide: function(){
      this.setData({
        filterShow: false,
        myAddress: false,
        chooseArea: false
      });
    },
    // 最低价格输入框
    leastPrice: '',
    leastPriceInput: function (e) {
      this.leastPrice = e.detail.value;
    },
    // 最高价格输入框
    mostPrice: '',
    mostPriceInput: function (e) {
      this.mostPrice = e.detail.value;
    },
    // 重置
    filterReset: function () {
      let detail = {
        leastPrice: '',
        mostPrice: '',
        chooseCateId: '',
        location: '',
        currentRegionId: ''
      }
      this.leastPrice = '';
      this.mostPrice = '';
      this.setData(detail);
      this.triggerEvent('confirm', detail);
    },
    // 确定
    filterConfirm: function () {
      let that = this;
      if (that.leastPrice || that.mostPrice){
        if ((!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(that.leastPrice)) || (!/(^[1-9]\d*(\.\d{1,2})?$)|(^0(\.\d{1,2})?$)/.test(that.mostPrice))){
          app.showModal({
            content: '价格区间填写有误'
          });
          return;
        }
        if (that.leastPrice > that.mostPrice){
          app.showModal({
            content: '价格区间中设置的最大值需大于最小值'
          });
          return;
        }
      }
      let detail = {
        leastPrice: that.leastPrice || '',
        mostPrice: that.mostPrice || '',
        chooseCateId: that.data.chooseCateId,
        currentRegionId: that.data.currentRegionId
      }
      that.setData(detail);
      that.triggerEvent('confirm', detail);
      that.filterHide();
    }
  }
})