/**
 * Created by xiahui.zhang on 2014/06/10 16:44.
 * @author xiahui.zhang
 */
(function (angular) {
    "use strict";

    angular.module("produce", ["content.directives", "content.services", "content.components", "content.utils"])

        .controller("ProduceCtrl", ["$scope", "$http", "app","$resource" , function ($scope, $http, app,$resource) {

            // 获取组建列表
            var url = app.utils.getUrlVar('url');
            $http.get(app.webRoot + "/content/getUrlToContent?url=" + url).success(function (result) {
                $scope.components = result.components;
            }).error(function () {

            });

            $scope.showSharePage = function(){
                window.open(app.fileRoot + "share-page.html?url="+url,'_self', "fullscreen = no , height=100, width=400, top=0, left=0, toolbar=no, menubar=no, scrollbars=no,resizable=no,location=no, status=no");
            };

            $scope.getCouponColor = function (discountAmount) {
                if (discountAmount >= 100) {
                    return "pink";
                } else if (discountAmount >= 50) {
                    return "yellow";
                } else if (discountAmount >= 20) {
                    return "blue";
                } else if (discountAmount >= 10) {
                    return "green";
                } else if (discountAmount >= 5) {
                    return "orange";
                } else {
                    return "grey";
                }
            }
        }])

        .run(["app", "components", "utils", "$rootScope", function (app, components, utils, $rootScope) {

            /** 工具集 **/
            app.utils = utils;

            /** 组件信息 **/
            app.components = components;

            /** 文件根目录 **/
            $rootScope.fileRoot = app.fileRoot;
            /** 初始化组件模板 **/
            $rootScope.initComponent = function (componentName, source) {

                return app.fileRoot + app.components[source].previewTplUrl[componentName];
            }
        }]);

})(window.angular);
