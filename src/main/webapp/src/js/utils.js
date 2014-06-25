/**
 * Created by kui.liu on 2014/06/09 19:37.
 * @author kui.liu
 *
 */
(function (angular) {
    "use strict";

    var resetObj = function (object) {
            for (var key in object) {
                delete object[key];
            }
        },

        resetForm = function (selector) {
            $(selector).get(0).reset();
        },

        getUrlVars = function () {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },

        /* ******************************* 通用弹出框 ******************************* */
        getUrlVar = function (name) {
            return getUrlVars()[name];
        },

        alertPop = function (tips, opts) {

            var options = {
                title: "提示",
                str  : tips,
                mark : true
            };
            angular.extend(options, opts);
            $().Alert(options);
        },

        confirmPop = function (opts, confirmCallback, cancelCallback) {

            var options = {
                title: "提示",
                mark : true
            };
            angular.extend(options, opts);
            $().Confirm(options, confirmCallback, cancelCallback);
        },

        pop = function (selector, title, opts) {

            var options = {
                magTitle: title,
                mark    : true,
                drag    : true,
                position: "fixed"
            };
            angular.extend(options, opts);
            $(selector).addInteractivePop(options);
        },

        closePopup = function () {
            $(".close").click();
        },

        /* ***************************cookies util*************************** */
        getCookie = function (key) {
            var cookieArray = document.cookie.split(";");
            var cookie = {};

            for (var i in cookieArray) {
                var c = cookieArray[i];
                var cKey = (c.split("=")[0]).trim();
                var cValue = decodeURI(c.split("=")[1]);
                cookie[cKey] = cValue;
            }

            return cookie[key];
        };

    /**
     * 工具集
     */
    angular.module("content.utils", [])

        .constant("utils", {
            resetObj  : resetObj,   // 重置对象
            resetForm : resetForm,  // 重置表单
            getUrlVars: getUrlVars,
            getUrlVar : getUrlVar,
            popUp     : {
                alertPop  : alertPop,   // alert弹出框
                confirmPop: confirmPop, // 二次确认弹出框
                pop       : pop,        // 通用弹出框
                close     : closePopup  // 关闭弹出框
            },
            getCookie : getCookie   // 根据key获取相应cookie
        });

})(window.angular);
