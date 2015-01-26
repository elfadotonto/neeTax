angular.module('neeTax.filters', [])
    .filter('utc', [
    function() {
        return function(date) {
            if (angular.isNumber(date)) {
                date = new Date(date);
            }
            return new Date(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate(), date.getUTCHours(), date.getUTCMinutes(), date.getUTCSeconds());
        }
    }])
    .filter('html', ['$sce', function ($sce) {
        return function (input) {
            return $sce.trustAsHtml(input);
        }
    }])
    .filter("customCurrency", function(numberFilter) {
    function isNumeric(value) { return (!isNaN(parseFloat(value)) && isFinite(value)); }

    return function(inputNumber, currencySymbol, decimalSeparator, thousandsSeparator, decimalDigits) {
        if (isNumeric(inputNumber)) {
            // Default values for the optional arguments
            currencySymbol = (typeof currencySymbol === "undefined") ? "$" : currencySymbol;
            decimalSeparator = (typeof decimalSeparator === "undefined") ? "." : decimalSeparator;
            thousandsSeparator = (typeof thousandsSeparator === "undefined") ? "," : thousandsSeparator;
            decimalDigits = (typeof decimalDigits === "undefined" || !isNumeric(decimalDigits)) ? 2 : decimalDigits;

            if (decimalDigits < 0) decimalDigits = 0;
            var formattedNumber = numberFilter(inputNumber, decimalDigits);
            var numberParts = formattedNumber.split(".");
            numberParts[0] = numberParts[0].split(",").join(thousandsSeparator);
            var result = currencySymbol + numberParts[0];

            if (numberParts.length == 2) {
                result += decimalSeparator + numberParts[1];
            }
            if (numberParts.length == 1) {
                result += decimalSeparator + '-';
            }

            return result;
        } else {
            return inputNumber;
        }
    };
});
