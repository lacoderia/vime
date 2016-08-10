(function(angular) {
    'use strict';

    angular.module('vime').controller('paymentsController', ['paymentsService', function(paymentsService){

        var ctrl = this;

        ctrl.radioButtons = {
            'description': 'consultation',
            'paymentOption': 'card',

        };

        ctrl.paymentData = {
            'amount': '200.00',
            'concept': 'Prepago de consulta'
        };

        ctrl.selectedPaymentTab = 0;

        ctrl.updatePaymentDescription = function(){
            if(ctrl.radioButtons.description == 'consultation'){
                ctrl.paymentData.amount = '200.00';
                ctrl.paymentData.concept = 'Prepago de consulta';
            } else {
                ctrl.paymentData.amount = '';
                ctrl.paymentData.concept = '';
            }
        };

        ctrl.disablePaymentDescription = function(){
            if(ctrl.radioButtons.description == 'consultation'){
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

    }]);

})(window.angular);