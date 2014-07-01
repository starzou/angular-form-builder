/**
 * Created by xiahui.zhang on 2014/06/16 12:51.
 * @author xiahui.zhang
 */
(function () {
    "use strict";

    Content.app.controller("ContentListCtrl", ["$scope", "app" , function ($scope, app) {
        var Resource = app.restAPI.content,
            PopUp = app.utils.popUp,
            shops = app.getShopsFromCookie(),
            userInfo = app.sharedData.userInfo;

        if (userInfo.userId) {
            $scope.userName = userInfo.userName;
            $scope.shops = shops;
            Resource.query({userId: userInfo.userId, type: 'mobile'}, function (result) {
                if (result.code == 1) {
                    $scope.contentes = result.data;
                }
            });
        } else {
            if (shops) {
                $scope.shops = shops;
                userInfo.userName = $scope.shops[0].userName;
                $scope.userName = $scope.shops[0].userName;
                userInfo.userId = $scope.shops[0].userId;
                Resource.query({userId: $scope.shops[0].userId, type: 'mobile'}, function (result) {
                    if (result.code == 1) {
                        $scope.contentes = result.data;
                    }
                });
            }
        }

        $scope.changeShop = function (shopInfo) {
            $scope.userName = shopInfo.userName;
            // 更新service的UserInfo数据
            app.sharedData.userInfo = shopInfo;
            Resource.query({userId: shopInfo.userId, type: 'mobile'}, function (result) {
                if (result.code == 1) {
                    $scope.contentes = result.data;
                }
            });
        };

        // 删除列表
        $scope.remove = function (cid, index) {

            PopUp.confirmPop({"title": "删除提示", "str": "确认删除该页面吗？"}, function () {
                Resource.delete({cid: cid}, function () {
                    $scope.contentes.splice(index, 1);
                });
            });
        };

        // 添加页面
        $scope.addContent = function () {
            PopUp.pop(".pop", "创建移动端页面");
        };

        // 创建页面
        $scope.createContent = function (title) {
            if (app.validate($scope) && title) {
                PopUp.close();
                $scope.content.title = title;

                app.location.path("/editor/mobile/create/" + title);
            }
        };

        // 取消创建
        $scope.cancelContent = function (content) {
            app.utils.resetForm("#newContent");
            app.utils.resetObj(content);
            app.validate($scope, true);
        };
    }]);

})();
