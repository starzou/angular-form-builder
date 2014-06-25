// JavaScript Document
(function ($) {
    $('a').focus(function(){$(this).blur();});
    var yunatPop = {
        position : function (w, h) { //窗口尺寸
            var winWidth = $(window).width();
            var winHeight = $(window).height();
            var docWidth = $(document).width();
            var docHeight = $(document).height();
            var scrollTop = $(document).scrollTop();
            var scrollLeft = $(document).scrollLeft();
            var a = (winWidth - w) / 2;
            var b = (winHeight - h) / 2;
            if (a < 0) {
                a = 0
            }
            if (b < 0) {
                b = 0
            }
            return posiXY = {
                winW   : winWidth,
                winH   : winHeight,
                docW   : docWidth,
                docH   : docHeight,
                scrTop : scrollTop,
                scrLeft: scrollLeft,
                x      : a + scrollLeft, //absolute定位
                y      : b + scrollTop,
                x1     : a, //fixed定位
                y1     : b
            }
        },
        maskLayer: function (opts) { //遮蔽层
            var off = yunatPop.position(); //定位对象
            var attr = {};
            if (!opts) {
                attr.markZindex = 1000;
            } else {
                attr.markZindex = opts.markZindex;
            }
            ;
            var $div = $("<div>", {
                "class": "yunat_maskLayer"
            }).css({
                background: "#000",
                display   : "none",
                position  : "absolute",
                left      : 0,
                top       : 0,
                height    : off.docH,
                width     : off.docW,
                zIndex    : attr.markZindex
            }).appendTo($("body"));
            $div.fadeTo(200, 0.3);
            $(window).resize(function () {
                off = yunatPop.position();
                $div.css({
                    height: off.docH,
                    width : off.docW
                });
            });
            return $div;
        },
        tips     : {
            show: function (str) {
                var mask = yunatPop.maskLayer();
                var $divBg = $("<div>", {
                    "class": "ccmsPublicPopBg",
                    "id"   : "ccmsTips"
                }).appendTo($('body'));
                var $div = $("<div>", {
                    "class": "Confirm ccmsPublicPop"
                }).appendTo($divBg);
                $('<div class="title">&nbsp;</div>').appendTo($div);
                var $content = $("<div>", {
                    "class": "contentP"
                }).appendTo($div);
                $("<p>", {
                    "class": "text"
                }).appendTo($content).html(str);
                var offset = yunatPop.position($div.width(), $div.height());
                $divBg.css({
                    position: "absolute",
                    left    : offset.x,
                    top     : offset.y,
                    zIndex  : 1001
                });
                return mask;
            },
            hide: function (obj) {
                $('#ccmsTips').remove();
                obj.remove();
            }
        },
        drag     : function (obj) { //拖拽功能  obj是jQuery对象
            var b = false;
            obj.mouseenter(function () {
                $(this).css("cursor", "all-scroll");
            }).mouseleave(function () {
                $(this).css("cursor", "auto");
            });
            obj.mousedown(function (e) {
                var off = yunatPop.position();
                var m = e.pageX - obj.offset().left; //鼠标与原始的差距
                var n = e.pageY - obj.offset().top;
                var w = obj.parent().outerWidth(true);
                var h = obj.parent().outerHeight(true);
                var minCriticalX = off.scrLeft;
                var minCriticalY = off.scrTop;
                //alert(minCriticalX+"|"+minCriticalY);
                var maxCriticalX = off.scrLeft + off.winW - w - 10;
                var maxCriticalY = off.scrTop + off.winH - h - 10;
                b = true;
                $(document).mousemove(function (e) {
                    if (b) {
                        move(e, m, n, minCriticalX, minCriticalY, maxCriticalX, maxCriticalY);
                    }
                });
                $(document).mouseup(function () {
                    mouseup(obj)
                });
                $(document).live("selectstart", function () { //ie中拖拽时禁止文本选取
                    return false;
                });
                $("body").css("-moz-user-select", "none"); //ff中拖拽时禁止文本选取
                obj.parent().css("-moz-user-select", "none"); //ff中拖拽时禁止文本选取
            });

            function move(e, m, n, minCriticalX, minCriticalY, maxCriticalX, maxCriticalY) {
                var x = e.pageX - m;
                var y = e.pageY - n;
                if (x <= minCriticalX) {
                    x = minCriticalX;
                }
                if (y <= 0) {
                    y = 0;
                }
                if (x >= maxCriticalX) {
                    x = maxCriticalX;
                }
                if (y >= maxCriticalY) {
                    y = maxCriticalY;
                }
                obj.parent().css({
                    left: x,
                    top : y
                });
                //console.log(e.pageX);
            }

            function mouseup(obj) {
                b = false;
                $("body").css("-moz-user-select", "");
                obj.parent().css("-moz-user-select", "");
            }

        }
    };
    $.fn.Alert = function (opts, fn) {
        var $this = $(this);
        var p = $.extend({
            title     : "",
            str       : "",
            mark      : false,
            width     : "330px",
            eleZindex : 1001,
            markZindex: 1000
        }, opts);
        var maxWidth = $(window).width() * 0.6;
        //var context=str?str:"";
        var mask = null;
        var $divBg = $("<div>", {
            "class": "ccmsPublicPopBg"
        }).appendTo($('body'));
        var $div = $("<div>", {
            "class": "Alert ccmsPublicPop"
        }).appendTo($divBg);
        $('<div class="title">' + p.title + '<a href="javascript:void(0);" class="close"></a></div>').appendTo($div);
        var $content = $("<div>", {
            "class": "contentP"
        }).css("width", p.width).appendTo($div);
        $("<div>", {
            "class": "text"
        }).appendTo($content).html(p.str);
        $('<p class="p2"><button href="javascript:void(0);" class="btn btnBlue sure">确定</button></p>').appendTo($content);
        //$content.find('.btnBlue').focus();
        //if($div.width()>maxWidth){$div.width(maxWidth)}
        var offset = yunatPop.position($div.width(), $div.height());
        $divBg.css({
            position: "absolute",
            left    : offset.x,
            top     : offset.y,
            zIndex  : p.eleZindex
        });
        if (p.mark) {
            mask = yunatPop.maskLayer(p);
        }
        $div.find(".sure").click(function () {
            $(this).css("backgroundPosition", "0 -127px");
            if (p.mark) {
                mask.remove()
            }
            $divBg.remove();
            if (fn) {
                fn();
            }
            return false;
        });
        $div.find(".close,.closeButton").click(function () {
            if (p.mark) {
                mask.remove()
            }
            $divBg.remove();
            return false;
        });

    };
    $.fn.Confirm = function (opts, fn, fn2) {
        var $this = $(this);
        var p = $.extend({
            title     : "",
            str       : "",
            mark      : false,
            eleZindex : 1001,
            markZindex: 1000
        }, opts);
        var $divBg = $("<div>", {
            "class": "ccmsPublicPopBg"
        }).appendTo($('body'));
        var $div = $("<div>", {
            "class": "Confirm ccmsPublicPop"
        }).appendTo($divBg);
        $('<div class="title">' + p.title + '<a href="javascript:void(0);" class="close"></a></div>').appendTo($div);
        var $content = $("<div>", {
            "class": "contentP"
        }).appendTo($div);
        $("<div>", {
            "class": "text"
        }).appendTo($content).html(p.str);
        $('<p class="p2"><button href="javascript:void(0);" class="sure btn btnBlue">确定</button><button href="javascript:void(0);" class="cancel btn">取消</button></p>').appendTo($content);
        //if($div.width()>maxWidth){$div.width(maxWidth)}
        var offset = yunatPop.position($div.width(), $div.height());
        $divBg.css({
            position: "absolute",
            left    : offset.x,
            top     : offset.y,
            zIndex  : p.eleZindex
        });
        if (p.mark) {
            mask = yunatPop.maskLayer(p);
        }
        $div.find(".sure").click(function () {
            $(this).css("backgroundPosition", "0 -127px");
            if (p.mark) {
                mask.remove();
            }
            $divBg.remove();
            if (fn) {
                fn();
            }
            return false;
        });
        $div.find(".cancel").click(function () {
            $(this).css("backgroundPosition", "-107px -127px");
            if (p.mark) {
                mask.remove();
            }
            $divBg.remove();
            if (fn2) {
                fn2();
            }
            return false;
        });
        $div.find(".close,.closeButton").click(function () {
            if (p.mark) {
                mask.remove()
            }
            $divBg.remove();

            if (fn2) {
                fn2();
            }

            return false;
        });
    };
    $.fn.autoVanishTips = function (opts) {
        var $this = $(this);
        var p = $.extend({
            left : 0,
            top  : 0,
            timer: 2000,
            str  : ""
        }, opts);
        var $div = $("<div>", {
            "class": "huaat_tips",
            "text" : p.str
        }).css({
            left: p.left,
            top : p.top
        });
        if ($(".huaat_tips").length == 0) { //判断是否存在
            $div.appendTo($this);
        }
        $div.append("<span></span>");
        window.setTimeout(function () {
            $div.fadeOut(1000, function () {
                $(this).remove();
            });
        }, p.timer);
    };
    $.fn.Tips = function () {
        var $this = $(this);
        $this.hover(function () {
            $this.find(".ccms_tipsContent").show();
        }, function () {
            $this.find(".ccms_tipsContent").hide();
        });
    };
    $.fn.addInteractivePop = function (opts) {
        var mark = null;
        var $this = $(this);
        var p = $.extend({
            position  : "absolute",
            width     : "auto",
            height    : "auto",
            mark      : false,
            title     : true,
            magTitle  : "",
            drag      : true,
            eleZindex : 1001,
            markZindex: 1000
        }, opts);
        $this.addClass("ccmsPublicPop");
        if (p.title && $this.find("div.title").length == 0) {
            $this.wrapInner('<div class="ccmsPublicPopMain"></div>');
            $this.prepend($('<div class="title">' + p.magTitle + '<a href="javascript:void(0);" class="close"></a></div>'));
            //$this.find(".title").append($("<span>",{text:p.magTitle}));
            if (p.drag) {
                yunatPop.drag($this.find("div.title"));
            }
            if (p.height != "auto") {
                p.height = p.height + 32;
            }
        } else {
            if ($this.find(".close").length == 0) {
                $this.prepend($('<a href="javascript:void(0);" class="close" style="right:8px;top:8px;"></a>'));
            }
        }
        var w, h;
        if (p.width == "auto") {
            w = $this.innerWidth();

        } else {
            w = p.width;
        }
        if (p.height == "auto") {
            h = $this.innerHeight();
        } else {
            h = p.height;
        }
        //$this.css({width:w,height:h});
        var offset = yunatPop.position(w, h);
        if (p.position == "fixed") {
            $this.css({
                position: p.position,
                top     : offset.y,
                left    : offset.x,
                display : "block",
                zIndex  : p.eleZindex
            });
        } else {
            $this.css({
                position: p.position,
                top     : offset.y1,
                left    : offset.x1,
                display : "block",
                zIndex  : p.eleZindex
            });
        }
        ;

        function setWinH() {
            var _main = $this.find('.ccmsPublicPopMain'),
                mainH = _main.children().outerHeight(true),
                mainT = _main.offset().top,
                winH = $(window).height();
            if (mainH + mainT > winH) {
                _main.css({
                    'height'    : winH - mainT,
                    'overflow-y': 'auto'
                });
            } else {
                _main.removeAttr('style');
            }
        }

        setWinH();
        $(window).resize(function () {
            if ($this.length) {
                if ($this.is(':visible')) setWinH();
            } else {
                $(window).unbind(setWinH);
            }
        });
        if (p.mark) {
            mark = yunatPop.maskLayer(p);
        }
        $this.find(".close,.closeButton").click(function () {
            if (p.mark) {
                mark.remove();
            }
            $this.hide();
            if (p.closeFn) {
                var scope = $this.scope();
                scope.$apply(function () {
                    p.closeFn(scope);
                });
                //$this.scope().$apply(p.closeFn);
                //p.closeFn($this.scope());
            }
        });
    };
    //重置弹出层位置
    $.fn.resetPostion = function () {
        var $this = $(this),
            w = $this.innerWidth(),
            h = $this.innerHeight(),
            offset = yunatPop.position(w, h);
        $this.css({'left': offset.x, 'top': offset.y});
    };

    window.yunatPop = yunatPop;
    $.fn.yAlert = function (content, fn) {
        var p = $.extend({
            "text": "",
            "mark": true
        }, content)
        var maxWidth = $(window).width() * 0.6;
        var mask = null;
        var $divBg = $("<div>", {
            "class": "ccmsPublicPopBg"
        }).appendTo($('body'));
        var $div = $("<div>", {
            "class": "Alert ccmsPublicPop yAlert"
        }).appendTo($divBg);
        //$('<div class="title">'+p.title+'<a href="javascript:void(0);" class="close"></a></div>').appendTo($div);
        var $content = $("<div>", {
            "class": "plugContent"
        }).appendTo($div);
        $("<p>", {
            "class": "plugText",
            "text" : p.text
        }).appendTo($content);
        //if($div.width()>maxWidth){$div.width(maxWidth)}
        var offset = yunatPop.position($div.width(), $div.height());
        $divBg.css({
            position: "fixed",
            left    : offset.x,
            top     : offset.y,
            zIndex  : 1001
        });
        if (p.mark) {
            mask = yunatPop.maskLayer();
        }
        $div.find(".sure").click(function () {
            $(this).css("backgroundPosition", "0 -127px");
            if (p.mark) {
                mask.remove()
            }
            $divBg.remove();
            if (fn) {
                fn();
            }
            return false;
        });
        $div.find(".close,.closeButton").click(function () {
            if (p.mark) {
                mask.remove()
            }
            $divBg.remove();
            return false;
        });
    };

    window.removeAlert = function () {
        setTimeout(function () {
            $(".yAlert").parents(".ccmsPublicPopBg").remove();
            $(".yunat_maskLayer").remove();
        }, 1000);
    }
})(jQuery);