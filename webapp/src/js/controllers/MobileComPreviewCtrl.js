/**
 * Created by kui.liu on 2014/05/30 17:35.
 * @author kui.liu
 * 移动端手机内预览页面controller
 */
(function () {
    "use strict";

    Content.app.controller("MobileComPreviewCtrl", ["$scope", function ($scope) {

        // 从父辈controller获取组件列表信息
        var unwatch = $scope.$watchCollection("$parent.content.components", function (newVal) {
            $scope.components = newVal;
            newVal && unwatch(); // 如果新值不为空则解除绑定，即每次只做一次有效赋值
        });

        // 点击组件触发编辑模板变化事件
        $scope.componentClick = function (component) {
            $scope.$emit("editorChange", component);
            $scope.selectedId = component.id;
        };

        // 删除组件
        $scope.componentRemove = function (index) {
            $scope.components.splice(index, 1);
            // 回到默认页面
            $scope.$emit("editorChange", {name: "default"});
        };
    }]);

})();
