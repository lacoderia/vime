(function(angular) {
    'use strict';

    angular.module('vime').factory('paymentsService', ['$http', '$q', 'API_URL', function ($http, $q, API_URL) {

        var getPaymentPDF = function(formData){
            var openpayServiceURL = API_URL + '/services/pago_tienda.php';
            return $http.post(openpayServiceURL, { formData: formData, name: 'Ricardo' })
                .then(function(response) {
                    var data = response.data;
                    console.log(response);
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
            getPaymentPDF: getPaymentPDF
        };

        return service;

    }]);
})(window.angular);
