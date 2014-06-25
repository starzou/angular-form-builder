/**
 * Created by kui.liu on 2014/06/09 15:24.
 * @author kui.liu
 *
 * 组件信息模块
 */
(function (angular) {
    "use strict";

    /* ***************************************** 组件模板 *************************************** */
    // pc端组件预览模板url（拖拽容器的预览页面）
    var previewTplUrl = {
            coupon: "tpl/component/client/couponPreview.html",
            share : "tpl/component/client/sharePreview.html"
        },

        // 组件编辑模板url（右侧组件编辑页面）
        editorTplUrl = {
            default: "tpl/component/client/defaultEditor.html",
            coupon : "tpl/component/client/couponEditor.html",
            share  : "tpl/component/client/shareEditor.html"
        },

        // 组件对应样式表(左侧组件列表)
        classMapper = {
            coupon: "cccoupon",
            text  : "cctext",
            image : "ccimage",
            share : "ccshare"
        },

        // 移动端组件预览模板url（发布成功面向客户的页面）
        mobilePreviewTplUrl = {
            coupon: "tpl/component/mobile/coupon.html",
            share : "tpl/component/mobile/share.html"
        },

        // 组件name对应的中文名
        nameCnMapper = {};

    /**
     * component模块
     */
    angular.module("content.components", [])

        .constant("components", {
            // pc客户端
            client      : {
                previewTplUrl: previewTplUrl,
                editorTplUrl : editorTplUrl,
                classMapper  : classMapper
            },

            // 移动端
            mobile      : {
                previewTplUrl: mobilePreviewTplUrl
            },

            // 组件名中文映射
            nameCnMapper: nameCnMapper
        });

})(window.angular);
