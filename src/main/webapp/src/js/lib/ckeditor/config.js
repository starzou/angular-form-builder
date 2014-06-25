/**
 * @license Copyright (c) 2003-2013, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function (config) {
    // Define changes to default configuration here.
    // For the complete reference:
    // http://docs.ckeditor.com/#!/api/CKEDITOR.config

    // The toolbar groups arrangement, optimized for two toolbar rows.

    config.toolbar = [
        ['Bold', 'Italic'],
        ['TextColor', 'BGColor'],
        ['Font', 'FontSize', 'lineheight', 'yunvariable'],
        ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        // ['PasteFromWord'],
        ['Link', 'Unlink']
    ];

    // Remove some buttons, provided by the standard plugins, which we don't
    // need to have in the Standard(s) toolbar.
    config.removeButtons = 'Cut,Copy,Paste,Undo,Redo,Anchor,Underline,Strike,Subscript,Superscript,Format,Styles,Scayt,JustifyBlock';

    // Se the most common block elements.
    config.format_tags = 'p;h1;h2;h3;pre';
    config.removePlugins = 'elementspath';
    config.removePlugins = 'magicline';
    // Make dialogs simpler.
    config.removeDialogTabs = 'image:advanced;link:advanced';

    config.enterMode = CKEDITOR.ENTER_BR;
    config.coreStyles_bold = {
        element: 'b'
        // 	attributes : { 'style' : 'font-weight:bold;' }
    };
    CKEDITOR.config.coreStyles_italic = {
        element: 'i'
        // 	attributes : { 'style' : 'font-style:italic;' }
    };

    config.tabIndex = 1;
    config.tabSpaces = 4;

    config.extraPlugins = 'lineheight,yunvariable';
    config.minimumChangeMilliseconds = 110; // 100 milliseconds (default value)
    config.lineheight_sizes = '普通/normal;100%/1;120%/1.2;130%/1.3;150%/1.5;170%/1.7;200%/2;220%/2.2;250%/2.5';
    config.yunvariable_val = '联系人姓名/%%联系人姓名%%;联系人公司/%%联系人公司%%';
    config.font_names = '宋体/宋体;黑体/黑体;仿宋/仿宋;楷体/楷体;隶书/\\96B6\\4E66;幼圆/\\5E7C\\5706;微软雅黑/微软雅黑;' + config.font_names;
    config.fontSize_sizes = '12/12px;14/14px;16/16px;18/18px;20/20px;22/22px;24/24px;26/26px;28/28px;36/36px;48/48px;72/72px;';

    for (var i = 0, length = arguments.length; i < length; i++) {
      var obj = arguments[i];
      
    }
};
