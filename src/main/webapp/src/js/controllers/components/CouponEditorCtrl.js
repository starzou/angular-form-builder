/**
 * Created by xiahui.zhang on 2014/05/30 16:35.
 * @author xiahui.zhang
 */
(function (window) {
    "use strict";

    Content.app.controller("CouponEditorCtrl", ["$scope", "app", "$http", "$fileUploader" , function ($scope, app, $http, $fileUploader) {

        var PopUp = app.utils.popUp;
        $scope.couponComponent = {};

        $scope.imgIsError = false;

        // 监听当前选中的优惠券组件变化，更新组件数据
        $scope.$watchCollection("$parent.selectedComponent", function (newVal) {
            if (newVal.name === "coupon") {
                $scope.couponComponent.type || ($scope.couponComponent.type = "list"); // 初始化优惠券展示方式
                $scope.$emit("couponClicked", newVal);
            }
        });

        // 监听优惠券点击事件更新数据
        $scope.$on("couponClicked", function (event, component) {
            $scope.couponComponent = component;
            $scope.coupons = component.values || (component.values = []);
            $scope.showCoupon = false;
        });

        $scope.couponInfo = {};

        $scope.addCoupon = function (couponInfo) {
            if ($scope.coupons.length >= 6) {
                PopUp.alertPop("一个优惠券组件最多添加六张优惠券!");
            } else {
                if (app.validate($scope)) {
                    $scope.coupons.push(angular.copy(couponInfo));
                    app.utils.resetObj(couponInfo);
                    uploader.queue.length = 0;
                    $scope.showCoupon = false;
                    $scope.imgIsError = false;
                }
            }

        };

        $scope.cancelCoupon = function (couponInfo) {
            $scope.showCoupon = false;
            app.utils.resetForm("#couponForm");
            app.utils.resetObj(couponInfo);
            uploader.queue.length = 0;
            app.validate($scope, true);
            $scope.imgIsError = false;
        };

        $scope.remove = function (index) {
            $scope.coupons.splice(index, 1);
            if ($scope.coupons.length == 0) {
                $scope.showCoupon = false;
            }
        };

        $scope.resolveUrl = function () {
            if ($scope.couponInfo.link != null) {
                var content = encodeURIComponent($scope.couponInfo.link);
                $http.get(app.webRoot + "/component/getCouponDescription?url=" + content + "&shopId="+app.sharedData.userInfo.userId).success(function (result) {
                    if (result.data != null) {
                        $scope.couponInfo = result.data;
                    }
                }).error(function () {
                    
                });
            }
        };

        $scope.showClass = function (boo) {
            return boo ? "formPart couponAdded oddRow" : "formPart couponAdded";
        };

        $scope.validateDiscount = function (value, num) {
            if (value && !/^[1-9]\d{0,3}$/.test(value)) {
                return false;
            } else if (value < 1 || value > num) {
                return false;
            }
            return true;
        };
        $scope.validateCondition = function (value, num) {
            if (value && !/^[1-9]\d{0,5}(\.\d{0,2})?$/.test(value)) {
                return false;
            } else if (value < 1 || value > num) {
                return false;
            }
            return true;
        };

        $scope.validateLink = function (value) {
            var filterStr = ".taobao.com";
            var index = value.indexOf(filterStr);
            if (index < 0) {
                $scope.couponInfo = {};
                $scope.couponInfo.link = value;
                return false;
            }
            return true;
        };

        // create a uploader with options
        var uploader = $scope.uploader = $fileUploader.create({
            scope     : $scope,                          // to automatically update the html. Default: $rootScope
            url       : app.webRoot + '/fileUpload/imageUpload',
            formData  : [
                { key: 'value' }
            ],
            filters   : [
                function (item) {                    // first user filter
                    console.info('filter1');
                    return true;
                }
            ]
            //autoUpload: true
        });

        var item = {
            file      : {
                name: 'Previously uploaded file',
                size: 1e6
            },
            progress  : 100,
            isUploaded: true,
            isSuccess : true
        };

        uploader.bind('success', function (event, xhr, item, response) {
            $scope.couponInfo.image = response;
        });
        uploader.bind('afteraddingfile', function (event, item) {
            if((item.file.size/1024/1024)<2){
                item.upload();
            }else{
                item.remove();
                $scope.imgIsError = true;
            }
        });

    }]);

})(window);
