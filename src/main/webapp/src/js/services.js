/**
 * Created by kui.liu on 2014/06/04 11:36.
 * @author kui.liu
 */
(function (window, angular) {
    "use strict";

    var getWebRoot = function () {
        var pathName = window.document.location.pathname,
            projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
        return projectName;
    };

    angular.module("content.services", ["ngResource"])

        /* ******************************** constants & values ******************************** */
        // 定义app
        .constant("app", {
            version   : Date.now(),
            webRoot   : getWebRoot(), // 定义webRoot
            fileRoot  : getWebRoot() + window.ResourceDir, // 定义fileRoot

            // app各controller之间共享数据存储器
            sharedData: {
                componentData: null, // 当前编辑组件数据
                publishLink  : null, // 发布使用的短链
                userInfo     : {
                    userId  : null,
                    userName: null
                }
            }
        })

        /* ******************************** providers ******************************** */
        // 无缓存获取文件
        .provider("getFile", ["app", function (app) {
            this.html = function (fileName) {
                return app.fileRoot + "tpl/" + fileName + '?v=' + app.version;
            };
            this.$get = function () {
                return {
                    html: this.html
                };
            };
        }])

        /* ******************************** factories ******************************** */
        // 元素是否可见
        .factory('isVisible', function () {
            return function (element) {
                var rect = element[0].getBoundingClientRect();
                return Boolean(rect.bottom - rect.top);
            };
        })

        // angularJs级cache
        .factory("cache", ["$cacheFactory", function ($cacheFactory) {
            return {
                component: $cacheFactory("component", {capacity: 20}),
                content  : $cacheFactory("content", {capacity: 100})
            }
        }])

        // 封装$resource的restAPI
        .factory("restAPI", ["$resource", "app", function ($resource, app) {

            return {
                component: $resource(app.webRoot + "/component/:appType", {appType: "wap"}),
                content  : $resource(app.webRoot + "/content/:op/:cid", {}, {
                    get    : {method: "GET", params: {op: "get"}},
                    query  : {method: "GET", params: {op: "query", userId: "@userId", type: "@type"}},
                    save   : {method: "POST", params: {op: "save"}},
                    delete : {method: "DELETE", params: {op: "delete"}},
                    publish: {method: "GET", params: {op: "publish"}}
                })
            }

        }])

        /*
         * 获取restAPI的get请求promise
         * 用于有超过一次回调或者请求结果需要存入缓存的需求
         */
        .factory("getPromise", ["$q",
            function ($q) {
                return function (param, restAPI, cacheId, cache) {
                    var result,
                        defer = $q.defer(),

                        result = cacheId && cache && cache.get(cacheId);
                    if (result) {
                        defer.resolve(result);
                    } else {
                        restAPI.get(param, function (data) {
                            if (cacheId && cache) {
                                cache.put(cacheId, data);
                            }
                            defer.resolve(data);
                        }, function (data) {
                            defer.reject(data.msg);
                        });
                    }
                    return defer.promise;
                };
            }
        ])

        // ajax统一错误处理器
        .factory("ajaxErrorHandler", function () {
            return function (errorMessageHandler) {
                return function (data) {
                    if (!errorMessageHandler) {
                        alert(data.msg);
                    } else if (typeof errorMessageHandler === "string") {
                        alert(errorMessageHandler);
                    } else if (typeof errorMessageHandler === "function") {
                        errorMessageHandler.call(this, data);
                    }
                }
            }
        })

        // 获取组件列表服务,同时填充组件中文名称映射表
        .factory("getComponentList", ["getPromise", "app", "cache", "$q", function (getPromise, app, cache, $q) {

            var defer = $q.defer(),

                refreshNameCnMapper = function (data, collection) {
                    angular.forEach(data, function (value) {
                        collection[value.code] = value.remark;
                    })
                };

            return function (appType) {
                return getPromise({
                    appType: appType
                }, app.restAPI.component, appType, cache.component).then(function (data) {

                    // 更新组件中文名映射
                    refreshNameCnMapper(data.data, app.components.nameCnMapper);

                    defer.resolve(data);
                    return defer.promise;
                });
            };
        }])

        // 从cookie中获取店铺列表
        .factory("getShopsFromCookie", ["utils", function (utils) {
            var shops = utils.getCookie("shops").replace(/%3A/g, ":").replace(/%2C/g, ",");
            return function () {
                return JSON.parse(shops);
            };
        }])
    ;

})(window, window.angular);