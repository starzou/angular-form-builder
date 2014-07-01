/**
 * Created by kui.liu on 2014/05/29 14:58.
 * 入口程序
 * @author kui.liu
 */
(function (window, angular) {
    "use strict";

    var contentApp = angular.module("contentApp", ["ngRoute", "content.directives", "content.services", "ngCookies", "content.locale", "content.components", "content.utils", "angularFileUpload"]);

    // 入口app
    contentApp

        // 主程序controller
        .controller("AppCtrl", ["$rootScope", "$locale", "app", function ($rootScope, $locale, app) {

        }])

        // 配置路由
        .config(["$routeProvider", "getFileProvider", function ($routeProvider, getFileProvider) {

            var index = {
                    templateUrl: getFileProvider.html("mobile-editor.html"),
                    controller : "ContentEditorCtrl"
                },
                formEditor = {
                    templateUrl: getFileProvider.html("form-editor.html"),
                    controller : 'FormEditorCtrl'
                },
                mobileEditor = {
                    templateUrl: getFileProvider.html("mobile-editor.html"),
                    controller : 'ContentEditorCtrl'
                },
                mobileList = {
                    templateUrl: getFileProvider.html("mobile-list.html"),
                    controller : 'ContentListCtrl'
                },
                mobilePublish = {
                    templateUrl: getFileProvider.html("share-page.html"),
                    controller : 'PublishCtrl'
                };

            $routeProvider.
                when("/", mobileList).
                when("/list", mobileList).
                when("/editor/mobile/:op/:info", mobileEditor).
                when("/mobileList", mobileList).
                when("/mobilePublish/:cid/:randomCode", mobilePublish).
                otherwise({redirectTo: '/'});

        }])

        // 初始化app信息，绑定一些基础工具
        .run(["app", "components", "utils", "restAPI", "ajaxErrorHandler", "$rootScope", "$locale", "$location", "getShopsFromCookie", function (app, components, utils, restAPI, ajaxErrorHandler, $rootScope, $locale, $location, getShopsFromCookie) {

            /** 封装$resource的restAPI **/
            app.restAPI = restAPI;

            /** 工具集 **/
            app.utils = utils;

            /** 组件信息 **/
            app.components = components;

            /** ajax错误处理 **/
            app.ajaxErrorHandler = ajaxErrorHandler;

            /** 从cookie中获取店铺信息 **/
            app.getShopsFromCookie = getShopsFromCookie;

            /** 表单校验通用方法 **/
            app.validate = function (scope, turnoff) {
                var collect = [],
                    error = [];
                scope.$broadcast('genTooltipValidate', collect, turnoff);

                angular.forEach(collect, function (value, index) {
                    if (value.validate && value.$invalid) {
                        error.push(value);
                    }
                });

                if (error.length === 0) {
                    app.validate.errorList = null;
                    scope.$broadcast('genTooltipValidate', collect, true);
                } else {
                    app.validate.errorList = error;
                }
                return !app.validate.errorList;
            };

            /** 手动应用scope **/
            app.applyScope = function (scope) {
                scope.$$phase || scope.$apply();
            };

            /** 路径跳转方法 **/
            app.location = $location;
            app.path = {
                toIndex: function (scope) {
                    $location.path("/");
                    app.applyScope(scope);
                },
                toList : function (scope) {
                    $location.path("/list");
                    app.applyScope(scope);
                }
            };

            /** rootScope全局初始化 **/
            $rootScope.validateTooltip = {
                validate   : true,
                validateMsg: $locale.VALIDATE
            };
            // 文件根目录
            $rootScope.fileRoot = app.fileRoot;
            // 初始化组件模板
            $rootScope.initComponent = function (componentName, source) {
                return app.fileRoot + app.components[source].previewTplUrl[componentName];
            };
            // 返回列表
            $rootScope.return2List = function () {
                app.utils.popUp.confirmPop({"str": "将不对当前编辑页面进行保存,是否确认返回？"}, function () {
                    app.path.toList($rootScope);
                })
            };
        }]);

    // 内容管理全局Content对象，所有的controller都绑定到这个上面
    window.Content = {
        app: contentApp
    };

})(window, window.angular);
