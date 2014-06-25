/**
 * Created by kui.liu on 2014/05/30 11:43.
 * @author kui.liu
 * 基础组件列表controller
 */
(function (window) {
    "use strict";

    Content.app.controller("BaseComponentCtrl", ["$scope", "$routeParams", "app", "getComponentList", function ($scope, $routeParams, app, getComponentList) {

        // 获取组件列表
        getComponentList("wap").then(function (data) {
            $scope.baseComponentList = data.data;
        }, app.ajaxErrorHandler("获取组件列表失败!"));

        $scope.comClass = app.components.client.classMapper;

        $scope.draggableOptions = {
            connectToSortable: ".mListWrapper .mList"
        };
    }]);

})(window);