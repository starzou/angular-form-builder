/**
 * Created by kui.liu on 2014/06/23 12:34.
 * @author kui.liu
 */
(function (angular) {
    "use strict";

    Content.app.controller("CouponPreviewCtrl", ["$scope", function ($scope) {

        $scope.getCouponColor = function (discountAmount) {
            if (discountAmount >= 100) {
                return "pink";
            } else if (discountAmount >= 50) {
                return "yellow";
            } else if (discountAmount >= 20) {
                return "blue";
            } else if (discountAmount >= 10) {
                return "green";
            } else if (discountAmount >= 5) {
                return "orange";
            } else {
                return "grey";
            }
        }

    }]);

})(window.angular);
