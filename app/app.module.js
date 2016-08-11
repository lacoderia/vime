'use strict';

// Declare app level module which depends on views, and components
angular.module('vime', [
    'ngMaterial'
]);

angular.module('vime')
    .constant('API_URL', 'http://localhost/vime')
    .constant('OPENPAY_DASHBOARD_URL', 'https://sandbox-dashboard.openpay.mx')
    .constant('MERCHAND_ID', 'mlttma1g0lusxgmm9kst');