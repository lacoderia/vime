(function(angular) {
    'use strict';

    angular.module('vime').controller('paymentsController', ['$window', 'paymentsService', 'OPENPAY_DASHBOARD_URL', 'MERCHAND_ID', function($window, paymentsService, OPENPAY_DASHBOARD_URL, MERCHAND_ID){

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
            'name': 'Juan',
            'lastName': 'Pérez',
            'email': 'juan@perez.com',
            'phone': '4423456723'
        };

        ctrl.card = {
            'cardNumber': '4242424242424242',
            'holderName': 'Ricardo Rosas',
            'expirationYear': '17',
            'expirationMonth': '03',
            'cvv2': '123'
        };

        ctrl.reference = '';

        ctrl.selectedPaymentTab = 0;
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
            if(ctrl.radioButtons.paymentOption == 'card'){
                ctrl.selectedPaymentTab = 0;
            } else {
                ctrl.selectedPaymentTab = 1;
            }
        };

        ctrl.processCardPayment = function(){

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
                        'method': 'store',
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
                                ctrl.reference = data.serializableData.payment_method.reference;
                                ctrl.showSuccess = true;
                            }
                        }, function(error) {
                            console.log('error');
                        })
                        .finally(function(){
                            ctrl.loading = false;
                        });
                },
                function(response){
                    var desc = response.data.description != undefined ? response.data.description : response.message;
                    alert('ERROR [' + response.status + ']'  + desc);
                });

        };

        ctrl.processStorePayment = function(){

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
                    console.log('Error');
                })
                .finally(function(){
                    ctrl.loading = false;
                });
        };

    }]);

})(window.angular);