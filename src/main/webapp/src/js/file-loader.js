/**
 * Created by kui.liu on 2014/05/29 13:29.
 * css/js文件加载器
 * @author kui.liu
 */

/**
 * 重要： 使用之前必须设置window.ResourceDir
 */
(function (window) {
    "use strict";

    // dynamically add base tag as well as css and javascript files.
    // we can't add css/js the usual way, because some browsers (FF) eagerly prefetch resources
    // before the base attribute is added, causing 404 and terribly slow loading of the docs app.
    var headEl = document.getElementsByTagName('head')[0],
        pathName = window.document.location.pathname,
        projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1),
        webRoot = projectName + window.ResourceDir,
        libRoot = webRoot + "js/",
        outerHTML = function (node) {
            // if IE, Chrome take the internal method otherwise build one
            return node.outerHTML || (function (n) {
                var div = document.createElement('div'), h;
                div.appendChild(n);
                h = div.innerHTML;
                div = null;
                return h;
            })(node);
        },
        addTag = function (name, attributes, sync) {
            var el = document.createElement(name), attrName;

            for (attrName in attributes) {
                el.setAttribute(attrName, libRoot + attributes[attrName]);
            }

            sync ? document.write(outerHTML(el)) : headEl.appendChild(el);
        },
        FileLoader = {
            addTag: addTag
        };

    window.FileLoader = FileLoader;

})(window);
