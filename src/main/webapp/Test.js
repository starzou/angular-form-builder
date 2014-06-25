angular.module('app', [])

    // The example of the full functionality
    .controller('TestController', function ($scope,$http) {
        'use strict';



        $scope.test = function () {
            $http.get(getWebRoot() + "/content/getUrl?opt_name="+$scope.opt_name+"&set_id=" + $scope.set_id+"&data=" + $scope.data).success(function (result) {
                $scope.url = result;
            }).error(function () {

            });

        };

        var getWebRoot = function () {
            var pathName = window.document.location.pathname,
                projectName = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            return projectName;
        };



    });