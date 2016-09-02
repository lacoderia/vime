(function(angular) {
    'use strict';

    angular.module('vime').directive('maxvalue', function() {
        return {
            require : 'ngModel',
            scope: {
            },
            link : function(scope, element, attrs, ngModel) {

                function setValidity(bool) {
                    ngModel.$setValidity('maxvalue', bool);
                }

                ngModel.$parsers.push(function(value) {

                    if(value <= 5000){
                        setValidity(true);
                    } else {
                        setValidity(false);
                    }
                    return value;
                })

            }
        }
    });

})(window.angular);

