(function(angular) {
    'use strict';

    angular.module('vime').factory('paymentsService', ['$http', '$q', 'API_URL', function ($http, $q, API_URL) {

        var processPayment = function(formData){
            var openpayServiceURL = API_URL + '/services/pago.php';
            return $http.post(openpayServiceURL, { formData: formData })
                .then(function(response) {
                    var data = response.data.message;
                    if (typeof data === 'object') {
                        return data;
                    } else {
                        return $q.reject(data);
                    }

                }, function(error){
                    return $q.reject(error.data);
                });
        };

        var service = {
            processPayment: processPayment
        };

        return service;

    }]);
})(window.angular);
