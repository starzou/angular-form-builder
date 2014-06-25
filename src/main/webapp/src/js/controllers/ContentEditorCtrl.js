/**
 * 内容管理编辑主controller，所有内容管理最上层的操作均使用此controller，包括表单、邮件、mobile
 */
(function () {
    "use strict";

    Content.app.controller("ContentEditorCtrl", ["$scope", "app", "$routeParams", function ($scope, app, $routeParams) {

        var Resource = app.restAPI.content,
            PopUp = app.utils.popUp;

        if ($routeParams.op == 'edit') {
            Resource.get({cid: $routeParams.info}, function (result) {
                if (result.code == 1) {
                    $scope.content = result.data;
                }
            });
        } else {
            $scope.content = {
                cid       : null,
                title     : $routeParams.info,
                subTitle  : "移动端页面",
                type      : "mobile",
                components: [],
                userName  : app.sharedData.userInfo.userName,
                userId    : app.sharedData.userInfo.userId,
                status    : 0
            };
        }

        // 保存
        $scope.savePage = function (content) {
            if (content.components.length) {
                Resource.save($scope.content, function (result) {
                    if (result.code == 1) {
                        content.cid = result.cid;
                    }
                    PopUp.alertPop(result.msg);
                });
            } else {
                PopUp.alertPop("不能保存空白页面");
            }
        };

        // 发布页面
        $scope.publishPage = function (content) {
            if (content.components.length) {
                Resource.save($scope.content, function (result) {
                    // 保存成功
                    if (result.code == 1) {
                        content.cid = result.cid;
                        // 发布页面
                        Resource.publish({cid: content.cid}, function (res) {
                            if (res.code == 1) {
                                app.location.path("/mobilePublish/" + content.cid + "/" + res.url);
                            } else {
                                PopUp.alertPop(res.msg);
                            }
                        });
                    } else {
                        PopUp.alertPop(result.msg);
                    }
                });
            } else {
                PopUp.alertPop("不能发布空白页面");
            }
        };
    }]);

})(window.angular);
