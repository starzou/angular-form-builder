/**
 * Created by kui.liu on 2014/05/20 17:25.
 * @author kui.liu
 */
(function (angular) {


    angular.module("sortableApp", ["content.directives"]).controller("SortableListCtrl", ["$scope", function ($scope) {

        $scope.sortList1 = [{id:1, name:1},{id:2, name:2},{id:3, name:3},{id:4, name:4},{id:5, name:5}];

        $scope.sortList2 = [2];

        $scope.draggableOptions = {
            connectToSortable: ".container"
        };

    }]);
})(angular);