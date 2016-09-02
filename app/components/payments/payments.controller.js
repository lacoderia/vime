(function(angular) {
    'use strict';

    angular.module('vime').controller('paymentsController', ['$scope', '$window', 'paymentsService', 'OPENPAY_DASHBOARD_URL', 'MERCHAND_ID', function($scope, $window, paymentsService, OPENPAY_DASHBOARD_URL, MERCHAND_ID){

        var ctrl = this;

        var tokenId = undefined;

        ctrl.radioButtons = {
            'productOption': 'consultation',
            'paymentOption': 'card'
        };

        ctrl.paymentData = {
            'amount': '200.00',
            'description': 'Apartado de consulta inicial'
        };

        ctrl.customer = {
            'name': '',
            'lastName': '',
            'email': '',
            'phone': ''
        };

        ctrl.card = {
            'cardNumber': '',
            'holderName': '',
            'expirationYear': '',
            'expirationMonth': '',
            'cvv2': ''
        };

        ctrl.reference = '';

        ctrl.selectedPaymentTab = 0;

        ctrl.submitted = false;
        ctrl.loading = false;
        ctrl.showSuccess = false;

        ctrl.updatePaymentDescription = function(){
            if(ctrl.radioButtons.productOption == 'consultation'){
                ctrl.paymentData.amount = '200.00';
                ctrl.paymentData.description = 'Apartado de consulta inicial';
            } else {
                ctrl.paymentData.amount = '';
                ctrl.paymentData.description = '';
            }
        };

        ctrl.disablePaymentDescription = function(){
            if(ctrl.radioButtons.productOption == 'consultation'){
                return true;
            }

            return false;
        };

        ctrl.updatePaymentOption = function(){
            ctrl.submitted = false;

            if(ctrl.radioButtons.paymentOption == 'card'){
                ctrl.selectedPaymentTab = 0;
            } else {
                ctrl.selectedPaymentTab = 1;
            }
        };

        ctrl.processPayment = function() {
            ctrl.submitted = true;

            if(ctrl.radioButtons.paymentOption == 'card'){
                processCardPayment();
            } else {
                processStorePayment();
            }
        };

        var processCardPayment = function(){

            if(ctrl.customerForm.$valid && ctrl.paymentForm.$valid){
                ctrl.loading = true;

                var deviceSessionId = OpenPay.deviceData.setup();

                OpenPay.token.create({
                        "card_number": ctrl.card.cardNumber,
                        "holder_name": ctrl.card.holderName,
                        "expiration_year": ctrl.card.expirationYear,
                        "expiration_month": ctrl.card.expirationMonth,
                        "cvv2": ctrl.card.cvv2
                    },
                    function(response){
                        tokenId = response.data.id;

                        var formData = {
                            'method': 'card',
                            'name': ctrl.customer.name,
                            'last_name': ctrl.customer.lastName,
                            'phone_number': ctrl.customer.phone,
                            'email': ctrl.customer.email,
                            'amount': ctrl.paymentData.amount,
                            'description': ctrl.paymentData.description,
                            'source_id': tokenId,
                            'device_session_id': deviceSessionId
                        };

                        paymentsService.processPayment(formData)
                            .then(function(data) {
                                if(data.id){
                                    ctrl.reference = data.id;
                                    ctrl.showSuccess = true;
                                }
                            }, function(error) {
                                alert(error.message);
                            })
                            .finally(function(){
                                ctrl.loading = false;
                            });
                    },
                    function(response){
                        ctrl.loading = false;
                        $scope.$apply();

                        var desc = response.data.description != undefined ? response.data.description : response.message;
                        alert(desc);
                    });
            } else {
                alert('Completa todos los datos antes de continuar.')
            }

        };

        var processStorePayment = function(){

            if(ctrl.customerForm.$valid){
                ctrl.loading = true;

                var formData = {
                    'method': 'store',
                    'name': ctrl.customer.name,
                    'last_name': ctrl.customer.lastName,
                    'phone_number': ctrl.customer.phone,
                    'email': ctrl.customer.email,
                    'amount': ctrl.paymentData.amount,
                    'description': ctrl.paymentData.description
                };

                paymentsService.processPayment(formData)
                    .then(function(data) {
                        if(data.id){
                            $window.open(OPENPAY_DASHBOARD_URL + '/paynet-pdf/' + MERCHAND_ID + '/' + data.serializableData.payment_method.reference);
                        }
                    }, function(error) {
                        var desc = error.status == 420 ? error.message : 'Ocurrió un error al generar la ficha de pago. Intenta más tarde.';
                        alert(desc);
                    })
                    .finally(function(){
                        ctrl.loading = false;
                    });
            } else {
                alert('Completa todos los datos antes de continuar.')
            }

        };

    }]);

})(window.angular);