// 提交表单对象
var Form = {
    title        : "客户满意度调查",
    logo         : "",
    subtitle     : "感谢您填写此处调查问卷",
    startDateTime: "2014-01-01 10:01:01",
    stopDateTime : "2014-11-11 11:11:11",
    // 组件对象
    components   : [
        {name: "com01", title: "文本输入框", required: true},
        {name: "com02", title: "下拉菜单", required: true, values: [
            {name: "选项一", selected: true},
            {name: "选项一", selected: false}
        ]},
        {name: "com03", title: "复选框", required: true, values: [
            {name: "选项一", selected: true},
            {name: "选项一", selected: false}
        ]},
        // 优惠券
        {
            "id"    : "com_01",
            "type"  : "list",
            "name"  : "coupon",
            "values": [
                {
                    "link"          : "",
                    "displayName"   : "淘宝会员专享5元优惠",
                    "discountAmount": 5,
                    "condition"     : 100,
                    "image"         : "",
                    "expire"        : "2014.06.01-2014-06-31"
                },
                {
                    "link"          : "",
                    "displayName"   : "淘宝会员专享5元优惠",
                    "discountAmount": 5,
                    "condition"     : 100,
                    "image"         : "",
                    "expire"        : "2014.06.01-2014-06-31"
                },
                {
                    "link"          : "",
                    "displayName"   : "淘宝会员专享5元优惠",
                    "discountAmount": 5,
                    "condition"     : 100,
                    "image"         : "",
                    "expire"        : "2014.06.01-2014-06-31"
                }
            ]
        }
    ]

};

var coupon = {
    "id"    : "com_01",
    "type"  : "",
    "name"  : "coupon",
    "values": [
        {
            "link"          : "",
            "displayName"   : "淘宝会员专享5元优惠",
            "discountAmount": 5,
            "condition"     : 100,
            "image"         : "",
            "expire"        : "2014.06.01-2014-06-31"
        },
        {
            "link"          : "",
            "displayName"   : "淘宝会员专享5元优惠",
            "discountAmount": 5,
            "condition"     : 100,
            "image"         : "",
            "expire"        : "2014.06.01-2014-06-31"
        },
        {
            "link"          : "",
            "displayName"   : "淘宝会员专享5元优惠",
            "discountAmount": 5,
            "condition"     : 100,
            "image"         : "",
            "expire"        : "2014.06.01-2014-06-31"
        }
    ]
};

// 组件模板对象
var ComponentTemplate = {
    com01: "<div id='com01'>" +
        "    <input type='text' ng-model='component.value'/>" +
        "</div>",
    com02: "<div id='com02'>" +
        "    <select type='text' ng-model='component.value' ng-options='o for o in component.values'/>" +
        "</div>"
};