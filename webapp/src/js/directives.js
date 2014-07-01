/**
 * Created by kui.liu on 2014/05/20 17:37.
 * @author kui.liu
 */
(function (window, angular, undefined) {
    "use strict";

    angular.module("content.directives", ["content.services"])

        // js加载资源，使用绝对路径
        .directive("getRoot", ["app", function (app) {
            return {
                link: function (scope, element) {
                    if (element.attr('_href')) {
                        element.attr('href', app.fileRoot + element.attr('_href'));
                    }
                    if (element.attr('_src') && !element.attr("noajax")) {
                        if (element.attr("noajax") !== undefined) {
                            element.attr('src', app.fileRoot + element.attr('_src'));
                            element.removeAttr("_src");
                        } else {
                            $.ajax({
                                url     : app.fileRoot + element.attr('_src'),
                                dataType: 'script',
                                async   : false,
                                cache   : element.attr('cache') ? true : false,
                                success : function () {
                                    element.remove();
                                }
                            });
                        }
                    }
                }
            }
        }])

        // 拖拽指令
        .directive("uiDraggable", [function () {

            return {
                link: function (scope, element, attr) {

                    var defaultOptions = {
                            helper: "clone",
                            revert: "false"
                        },
                        draggableOptions = scope.$eval(attr.uiDraggable) || {};

                    angular.extend(draggableOptions, defaultOptions);
                    element.draggable(draggableOptions);
                }
            }
        }])

        // 排序指令
        .value('uiSortableConfig', {})
        .directive('uiSortable', [
            'uiSortableConfig', '$timeout', '$log',
            function (uiSortableConfig, $timeout, $log) {

                var comIndex, // 用于生成组件ID
                    getMaxComId = function (componentArray) { // 获取当前数组中最大的组件id
                        var i, length, maxId = 0;
                        for (i = 0, length = componentArray.length; i < length; i++) {
                            var comId = parseInt(componentArray[i].id.split("_")[1]);
                            (comId >= maxId) && (maxId = comId);
                        }
                        return maxId;
                    };

                return {
                    require: '?ngModel',
                    link   : function (scope, element, attrs, ngModel) {
                        var savedNodes;

                        function combineCallbacks(first, second) {
                            if (second && (typeof second === 'function')) {
                                return function (e, ui) {
                                    first(e, ui);
                                    second(e, ui);
                                };
                            }
                            return first;
                        }

                        function hasSortingHelper(element, ui) {
                            var helperOption = element.sortable('option', 'helper');
                            return helperOption === 'clone' || (typeof helperOption === 'function' && ui.item.sortable.isCustomHelperUsed());
                        }

                        var opts = {};

                        var callbacks = {
                            receive: null,
                            remove : null,
                            start  : null,
                            stop   : null,
                            update : null
                        };

                        var wrappers = {
                            helper: null
                        };

                        angular.extend(opts, uiSortableConfig, scope.$eval(attrs.uiSortable));

                        if (!angular.element.fn || !angular.element.fn.jquery) {
                            $log.error('ui.sortable: jQuery should be included before AngularJS!');
                            return;
                        }

                        if (ngModel) {

                            // When we add or remove elements, we need the sortable to 'refresh'
                            // so it can find the new/removed elements.
                            scope.$watch(attrs.ngModel + '.length', function () {
                                // Timeout to let ng-repeat modify the DOM
                                $timeout(function () {
                                    // ensure that the jquery-ui-sortable widget instance
                                    // is still bound to the directive's element
                                    if (!!element.data('ui-sortable')) {
                                        element.sortable('refresh');
                                    }
                                });
                            });

                            callbacks.start = function (e, ui) {
                                // Save the starting position of dragged item
                                ui.item.sortable = {
                                    index              : ui.item.index(),
                                    cancel             : function () {
                                        ui.item.sortable._isCanceled = true;
                                    },
                                    isCanceled         : function () {
                                        return ui.item.sortable._isCanceled;
                                    },
                                    isCustomHelperUsed : function () {
                                        return !!ui.item.sortable._isCustomHelperUsed;
                                    },
                                    _isCanceled        : false,
                                    _isCustomHelperUsed: ui.item.sortable._isCustomHelperUsed
                                };
                            };

                            callbacks.activate = function (/*e, ui*/) {
                                // We need to make a copy of the current element's contents so
                                // we can restore it after sortable has messed it up.
                                // This is inside activate (instead of start) in order to save
                                // both lists when dragging between connected lists.
                                savedNodes = element.contents();

                                // If this list has a placeholder (the connected lists won't),
                                // don't inlcude it in saved nodes.
                                var placeholder = element.sortable('option', 'placeholder');

                                // placeholder.element will be a function if the placeholder, has
                                // been created (placeholder will be an object).  If it hasn't
                                // been created, either placeholder will be false if no
                                // placeholder class was given or placeholder.element will be
                                // undefined if a class was given (placeholder will be a string)
                                if (placeholder && placeholder.element && typeof placeholder.element === 'function') {
                                    var phElement = placeholder.element();
                                    // workaround for jquery ui 1.9.x,
                                    // not returning jquery collection
                                    phElement = angular.element(phElement);

                                    // exact match with the placeholder's class attribute to handle
                                    // the case that multiple connected sortables exist and
                                    // the placehoilder option equals the class of sortable items
                                    var excludes = element.find('[class="' + phElement.attr('class') + '"]');

                                    savedNodes = savedNodes.not(excludes);
                                }
                            };

                            callbacks.update = function (e, ui) {
                                // Save current drop position but only if this is not a second
                                // update that happens when moving between lists because then
                                // the value will be overwritten with the old value
                                if (!ui.item.sortable.received) {
                                    ui.item.sortable.dropindex = ui.item.index();
                                    ui.item.sortable.droptarget = ui.item.parent();

                                    // Cancel the sort (let ng-repeat do the sort for us)
                                    // Don't cancel if this is the received list because it has
                                    // already been canceled in the other list, and trying to cancel
                                    // here will mess up the DOM.
                                    element.sortable('cancel');
                                }

                                // Put the nodes back exactly the way they started (this is very
                                // important because ng-repeat uses comment elements to delineate
                                // the start and stop of repeat sections and sortable doesn't
                                // respect their order (even if we cancel, the order of the
                                // comments are still messed up).
                                if (hasSortingHelper(element, ui) && !ui.item.sortable.received) {
                                    // restore all the savedNodes except .ui-sortable-helper element
                                    // (which is placed last). That way it will be garbage collected.
                                    savedNodes = savedNodes.not(savedNodes.last());
                                }
                                savedNodes.appendTo(element);

                                /*
                                 * 当元素来自外部容器拖拽过来的，angular.element(ui.item).scope().$index返回undefined,此时不执行append操作
                                 * @author kui.liu
                                 */
                                angular.element(ui.item).scope().$index && savedNodes.appendTo(element);

                                // If received is true (an item was dropped in from another list)
                                // then we add the new item to this list otherwise wait until the
                                // stop event where we will know if it was a sort or item was
                                // moved here from another list
                                if (ui.item.sortable.received && !ui.item.sortable.isCanceled()) {
                                    scope.$apply(function () {
                                        ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0,
                                            ui.item.sortable.moved);
                                    });
                                }
                            };

                            callbacks.stop = function (e, ui) {

                                var sourceIndex = angular.element(ui.item).scope().$index,// 元素来自容器外部拖拽则返回undefined
                                    component; // 组件对象

                                // If the received flag hasn't be set on the item, this is a
                                // normal sort, if dropindex is set, the item was moved, so move
                                // the items in the list.
                                if (!ui.item.sortable.received &&
                                    ('dropindex' in ui.item.sortable) && !ui.item.sortable.isCanceled()) {

                                    scope.$apply(function () {
                                        if (sourceIndex !== undefined) {
                                            ngModel.$modelValue.splice(
                                                ui.item.sortable.dropindex, 0,
                                                ngModel.$modelValue.splice(ui.item.sortable.index, 1)[0]);
                                        } else {

                                            /*
                                             * 当元素来自外部容器拖拽过来的，则在添加时执行定制化操作
                                             * @author kui.liu
                                             */

                                            // 如果当前列表不为空则获取其最大的组件id
                                            ngModel.$modelValue.length && (comIndex = getMaxComId(ngModel.$modelValue) + 1);
                                            component = {
                                                name: $(ui.item.html()).attr("name"),
                                                id  : "com_" + comIndex++
                                            };
                                            // 组件数据里加入组件信息对象
                                            ngModel.$modelValue.splice(ui.item.sortable.dropindex, 0, component);
                                            ui.item.remove();
                                            // 拖入完成后触发组件点击事件
                                            scope.componentClick(component);

                                        }
                                    });
                                } else {
                                    // if the item was not moved, then restore the elements
                                    // so that the ngRepeat's comment are correct.
                                    if ((!('dropindex' in ui.item.sortable) || ui.item.sortable.isCanceled()) && !hasSortingHelper(element, ui)) {
                                        savedNodes.appendTo(element);
                                    }
                                }
                            };

                            callbacks.receive = function (e, ui) {
                                // An item was dropped here from another list, set a flag on the
                                // item.
                                ui.item.sortable.received = true;
                            };

                            callbacks.remove = function (e, ui) {
                                // Workaround for a problem observed in nested connected lists.
                                // There should be an 'update' event before 'remove' when moving
                                // elements. If the event did not fire, cancel sorting.
                                if (!('dropindex' in ui.item.sortable)) {
                                    element.sortable('cancel');
                                    ui.item.sortable.cancel();
                                }

                                // Remove the item from this list's model and copy data into item,
                                // so the next list can retrive it
                                if (!ui.item.sortable.isCanceled()) {
                                    scope.$apply(function () {
                                        ui.item.sortable.moved = ngModel.$modelValue.splice(
                                            ui.item.sortable.index, 1)[0];
                                    });
                                }
                            };

                            wrappers.helper = function (inner) {
                                if (inner && typeof inner === 'function') {
                                    return function (e, item) {
                                        var innerResult = inner(e, item);
                                        item.sortable._isCustomHelperUsed = item !== innerResult;
                                        return innerResult;
                                    };
                                }
                                return inner;
                            };

                            scope.$watch(attrs.uiSortable, function (newVal /*, oldVal*/) {
                                // ensure that the jquery-ui-sortable widget instance
                                // is still bound to the directive's element
                                if (!!element.data('ui-sortable')) {
                                    angular.forEach(newVal, function (value, key) {
                                        if (callbacks[key]) {
                                            if (key === 'stop') {
                                                // call apply after stop
                                                value = combineCallbacks(
                                                    value, function () {
                                                        scope.$apply();
                                                    });
                                            }
                                            // wrap the callback
                                            value = combineCallbacks(callbacks[key], value);
                                        } else if (wrappers[key]) {
                                            value = wrappers[key](value);
                                        }

                                        element.sortable('option', key, value);
                                    });
                                }
                            }, true);

                            angular.forEach(callbacks, function (value, key) {
                                opts[key] = combineCallbacks(value, opts[key]);
                            });

                        } else {
                            $log.info('ui.sortable: ngModel not provided!', element);
                        }

                        // Create sortable
                        element.sortable(opts);
                    }
                };
            }
        ])

        // 鼠标移入移出样式改变，添加移除删除按钮
        .directive("mouseOverLeave", [function () {

            return {
                link: function (scope, element) {

                    element.mouseover(function () {
                        element.addClass("formPartSelected").find("div[name='close']").addClass("closeIcon");
                        element.hasClass("item-state-selected") ? element.removeClass("item-state-default-hover") : element.addClass("item-state-default-hover");
                    }).mouseleave(function () {
                        element.removeClass("formPartSelected item-state-default-hover").find("div[name='close']").removeClass("closeIcon");
                    });
                }
            }
        }])

        // 通用校验指令
        .directive('uiValidate', function () {

            return {
                restrict: 'A',
                require : 'ngModel',
                link    : function (scope, elm, attrs, ctrl) {
                    var validateFn, validators = {},
                        validateExpr = scope.$eval(attrs.uiValidate);

                    if (!validateExpr) {
                        return;
                    }

                    if (angular.isString(validateExpr)) {
                        validateExpr = { validator: validateExpr };
                    }

                    angular.forEach(validateExpr, function (exprssn, key) {
                        validateFn = function (valueToValidate) {
                            var expression = scope.$eval(exprssn, { '$value': valueToValidate });
                            if (angular.isObject(expression) && angular.isFunction(expression.then)) {
                                // expression is a promise
                                expression.then(function () {
                                    ctrl.$setValidity(key, true);
                                }, function () {
                                    ctrl.$setValidity(key, false);
                                });
                                return valueToValidate;
                            } else if (expression) {
                                // expression is true
                                ctrl.$setValidity(key, true);
                                return valueToValidate;
                            } else {
                                // expression is false
                                ctrl.$setValidity(key, false);
                                return valueToValidate;
                            }
                        };
                        validators[key] = validateFn;
                        ctrl.$formatters.push(validateFn);
                        ctrl.$parsers.push(validateFn);
                    });

                    function apply_watch(watch) {
                        //string - update all validators on expression change
                        if (angular.isString(watch)) {
                            scope.$watch(watch, function () {
                                angular.forEach(validators, function (validatorFn) {
                                    validatorFn(ctrl.$modelValue);
                                });
                            });
                            return;
                        }

                        //array - update all validators on change of any expression
                        if (angular.isArray(watch)) {
                            angular.forEach(watch, function (expression) {
                                scope.$watch(expression, function () {
                                    angular.forEach(validators, function (validatorFn) {
                                        validatorFn(ctrl.$modelValue);
                                    });
                                });
                            });
                            return;
                        }

                        //object - update appropriate validator
                        if (angular.isObject(watch)) {
                            angular.forEach(watch, function (expression, validatorKey) {
                                //value is string - look after one expression
                                if (angular.isString(expression)) {
                                    scope.$watch(expression, function () {
                                        validators[validatorKey](ctrl.$modelValue);
                                    });
                                }

                                //value is array - look after all expressions in array
                                if (angular.isArray(expression)) {
                                    angular.forEach(expression, function (intExpression) {
                                        scope.$watch(intExpression, function () {
                                            validators[validatorKey](ctrl.$modelValue);
                                        });
                                    });
                                }
                            });
                        }
                    }

                    // Support for ui-validate-watch
                    if (attrs.uiValidateWatch) {
                        apply_watch(scope.$eval(attrs.uiValidateWatch));
                    }
                }
            };
        })
        // 生成校验提示结果
        .directive('genTooltip', ["$timeout", "isVisible", function ($timeout, isVisible) {

            return {

                require: '?ngModel',
                link   : function (scope, element, attr, ngModel) {

                    var enable = false,
                        options = scope.$eval(attr.genTooltip) || {},

                        showTooltip = function (show, title) {
                            if (attr.dataOriginalTitle != title) {
                                attr.$set('dataOriginalTitle', title ? title : '');
                                element[show ? 'addClass' : 'removeClass']('invalid-error');
                                element.tooltip(show ? 'show' : 'hide');
                            }
                        },

                        invalidMsg = function (invalid) {
                            ngModel.validate = enable && options.validate && isVisible(element);
                            if (ngModel.validate) {
                                var title = attr.showTitle && (ngModel.$name && ngModel.$name + ' ') || '';
                                var msg = scope.$eval(attr.tooltipMsg) || {};
                                if (invalid && options.validateMsg) {
                                    angular.forEach(ngModel.$error, function (value, key) {
                                        // angular.extend(options.validateMsg, msg)
                                        if (attr.msg[key]) {
                                            title += (value && msg[key] && msg[key] + ', ') || '';
                                        } else if (options.validateMsg[key]) {
                                            title += (value && options.validateMsg[key] && options.validateMsg[key] + ', ') || '';
                                        }
                                    });
                                }
                                title = title.slice(0, -2) || '';
                                showTooltip(!!invalid, title);
                            } else {
                                showTooltip(false, '');
                            }
                        },

                        validateFn = function (value) {
                            $timeout(function () {
                                invalidMsg(ngModel.$invalid);
                            });
                            return value;
                        },

                        initTooltip = function () {
                            element.off('.tooltip').removeData('bs.tooltip');
                            element.tooltip(options);
                        };
                    attr.msg = scope.$eval(attr.tooltipMsg) || {};

                    if (options.container === 'inner') {
                        options.container = element;
                    } else if (options.container === 'ngView') {
                        options.container = element.parents('.ng-view')[0] || element.parents('[ng-view]')[0];
                    }
                    // use for AngularJS validation
                    if (options.validate) {
                        options.trigger = 'manual';
                        options.placement = options.placement || 'right';
                        if (ngModel) {
                            ngModel.$formatters.push(validateFn);
                            ngModel.$parsers.push(validateFn);
                        } else {
                            scope.$watch(function () {
                                return attr.dataOriginalTitle || attr.originalTitle;
                            }, showTooltip);
                        }
                        element.bind('focus', function () {
                            element.trigger('input');
                            element.trigger('change');
                        });
                        scope.$on('genTooltipValidate', function (event, collect, turnoff) {
                            enable = !turnoff;
                            if (ngModel) {
                                if (angular.isArray(collect)) {
                                    collect.push(ngModel);
                                }
                                invalidMsg(ngModel.$invalid);
                            }
                        });
                    } else if (options.click) {
                        // option.click will be 'show','hide','toggle', or 'destroy'
                        element.bind('click', function () {
                            element.tooltip(options.click);
                        });
                    }
                    element.bind('hidden.bs.tooltip', initTooltip);
                    initTooltip();
                }
            }
        }])

        // 日历控件
        .directive("datePicker", function () {

            return {
                restrict: "A",
                require : "ngModel",
                link    : function (scope, elem, attr, ngModel) {

                    var dateFormat = attr.dateFormat || "YYYY.MM.DD",
                        singleDate = !!attr.singleDate,
                        timePicker = !!attr.timePicker,
                        startToday = attr.startToday && new Date() || undefined;

                    elem.daterangepicker({
                        timePicker      : timePicker,
                        singleDatePicker: singleDate,
                        format          : dateFormat,
                        startDate       : startToday
                    });
                    elem.on('apply.daterangepicker', function (ev, picker) {
                        singleDate ? ngModel.$setViewValue(picker.startDate.format(dateFormat)) :
                            ngModel.$setViewValue(picker.startDate.format(dateFormat) + '-' + picker.endDate.format(dateFormat));

                        if (!scope.$$phase) {
                            scope.$apply();
                        }
                    });
                }
            }
        })

        // 复制
        .directive("clipCopy", ["app", function (app) {
            window.ZeroClipboard.config({
                swfPath          : app.fileRoot + "images/ZeroClipboard.swf",
                trustedDomains   : ["*"],
                allowScriptAccess: "always",
                forceHandCursor  : true
            });

            return {
                restrict: 'A',
                link    : function (scope, element, attr) {
                    // Create the clip object
                    var client = new ZeroClipboard(element);

                    client.on('ready', function () {

                        client.on('copy', function () {
                            client.setText(scope.$eval(attr.clipCopy));
                        });

                        client.on('aftercopy', function () {
                            app.utils.popUp.alertPop("已成功复制到剪贴板!");
                        });
                    });

                    client.on('error', function () {
                        ZeroClipboard.destroy();
                    });
                }
            };
        }])

        // 生成二维码
        .directive("genQrcode", function () {
            return {
                link: function (scope, element, attr) {

                    var opts = scope.$eval(attr.genQrcode),
                        options = {
                            text        : "http://www.shuyun.com",
                            render      : "canvas",
                            width       : 204,
                            height      : 204,
                            correctLevel: 0
                        };

                    angular.extend(options, opts);
                    element.qrcode(options);
                }
            }
        });

})(window, window.angular);