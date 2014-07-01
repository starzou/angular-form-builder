/**
 * Created by kui.liu on 2014/06/23 15:39.
 * @author kui.liu
 * 发布页面controller
 */
(function (window, Content, angular) {
    "use strict";

    Content.app.controller("PublishCtrl", ["$scope", "app", "$routeParams", function ($scope, app, $routeParams) {

        $scope.url = "http://vcrm.me/" + $routeParams.randomCode;
        $scope.cid = $routeParams.cid;

        $scope.qrcodeConfig = {
            text: $scope.url
        };

        /* ********************** jiathis配置 ********************** */
        var jiathis_config = {
            url     : $scope.url,
            summary : "",
            title   : "我用数云CRM制作了一个移动端页面，快来看看吧~！",
            shortUrl: true,
            hideMore: false
        };

        window.jiathis_config = jiathis_config;
    }]);

})(window, window.Content, window.angular);