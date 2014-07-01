/**
 * Created by kui.liu on 2014/05/29 16:11.
 * @author kui.liu
 * 移动端模板编辑区controller
 */
(function () {
    "use strict";

    Content.app.controller("MobileEditorCtrl", ["$scope", "app", function ($scope, app) {

        var editorTplUrl = app.components.client.editorTplUrl;

        // 给父controller新增一个监听模板编辑器变化事件
        $scope.$parent.$on("editorChange", function (event, component) {

            // 查找模板编辑页面，如果不存在则使用默认页面
            var tplUrl = editorTplUrl[component.name] || editorTplUrl.default;
            // 组件编辑模板变更
            $scope.comTplUrl = app.fileRoot + tplUrl;
            // 更新组件信息
            $scope.selectedComponent = component;
            // 当前编辑组件中文名
            $scope.currentComNameCn = app.components.nameCnMapper[component.name];
            // 通知后代controller哪个组件被点击
            $scope.$broadcast(component.name + "Clicked", component);
        });

    }]);

})(window, window.angular);
