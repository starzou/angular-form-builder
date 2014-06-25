<%@ page language="java" contentType="text/html;charset=utf-8"%>
<%@ page isELIgnored="false" %>
<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN">
<html id="ng-app" ng-app="app">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
    <script src="src/js/lib/angular/angular.js"></script>
    <script src="Test.js"></script>
</head>
<body ng-controller="TestController">
<p>系统端口号：<%=request.getServerPort()%></p>
<br/>
toabao_256485,何建伟的店铺|71677914,朱渺的店铺|toabao_256483,刘奎的店铺|toabao_256482,满刚的店铺|toabao_256481,小也中山店|toabao_256454,张正彦的店铺
<br/>
用户名：<input type="text" ng-model="opt_name"/>
版本号：<input type="text" ng-model="set_id"/>
店铺数据：<input type="text" ng-model="data"/>
<input type="button" ng-click="test()" value="生成链接"/>

<div ng-show="url">
    带签名进入页面
    <a ng-href="{{url}}">
        <input type="button" value="点击进入系统"/>
    </a>
</div>

</body>
</html>