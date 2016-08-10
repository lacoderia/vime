(function(angular) {
    'use strict';

    angular.module('vime').factory('paymentsService', [function () {

        var test = function(){
            return true;
        };

        var service = {
            test: test
        };

        return service;

    }]);
})(window.angular);
