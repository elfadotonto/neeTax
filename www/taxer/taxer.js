'use strict';

angular.module('neeTax.taxer', ['ngRoute'])
.controller('taxerCtrl', ['$scope', '$interval', 'priceData', function ($scope, $interval, data) {
    var prevTime;
    var stopTime;
    var startTime;

    $scope.currentMulti = 1;
    $scope.currentTax = 0;
    $scope.elapsedTime = 0;
    $scope.isStarted = false;
    $scope.priceFlash = "";
    $scope.pid = "050387 15471";
    $scope.tab = {
        totalFixed: 0,
        totalRunning: 0,
        items: []
    };

    var flashPrice = function (toFlash) {
        $scope.priceFlash = toFlash;
        $('#priceFlash').addClass('in');
        window.setTimeout(function () {
            $('#priceFlash').removeClass('in');
        }, 2500);
    }

    var pushButton = function (button) {
        $(button).addClass('down');
        window.setTimeout(function() {
            $(button).removeClass("down");
        }, 500);
    }

    var addToTab = function(item) {
        $scope.tab.items.push(item);
    };

    var addFixed = function(fixed) {
        $scope.currentTax += fixed.price;
        flashPrice("+ " + fixed.price + ",-");
        addToTab({ name: fixed.name, price: fixed.price });
    };

    var lowerMulti = function (factor) {
        if (factor) {
            $scope.currentMulti -= factor;
            flashPrice("* " + $scope.currentMulti);
        }
    };

    var raiseMulti = function (factor) {
        if (factor) {
            $scope.currentMulti += factor;
            flashPrice("* " + $scope.currentMulti);
        }
    };

    $scope.startTax = function () {
        if ($scope.currentTax == 0) {
            $scope.currentTax = data.fixed.start;
            addToTab({ name: "Startpris", price: data.fixed.start });
            startTime = new Date();
        }
        prevTime = new Date();
        stopTime = $interval($scope.getTax, 1234);
        $scope.isStarted = true;
        $scope.print = false;
    };

    $scope.stopTax = function () {
        $interval.cancel(stopTime);
        $scope.isStarted = false;
        $scope.confirm = false;
    };

    $scope.endTax = function () {
        $scope.currentTax = 0;
        $scope.currentMulti = 1;
        $scope.elapsedTime = 0;
        $interval.cancel(stopTime);
        $scope.isStarted = false;
        $scope.epidural = false;
        $scope.acu = false;
        $scope.tub = false;
        $scope.ctg = false;
        $scope.sucction = false;
        $scope.print = false;
        $scope.confirm = false;
        $scope.priceFlash = "";
        $scope.tab = {
            totalFixed: 0,
            totalRunning: 0,
            items: [],
        };
    };
          
    $scope.getTax = function () {
        var currentTime = new Date();
        $scope.currentTax += $scope.currentMulti * ((currentTime - prevTime) / data.multi.msecperkr);
        $scope.elapsedTime = (currentTime - startTime);
        prevTime = currentTime;
    };

    $scope.addHour = function () {
        startTime = startTime - 3600000;
        prevTime = prevTime - 3600000;
    };

    $scope.addEpidural = function () {
        addFixed({name:'Epidural', price: data.fixed.epidural});
        $scope.epidural = true;
    };

    $scope.addN2O = function () {
        addFixed({ name: 'Lystgass', price: data.fixed.n2o });
        pushButton('#btn_n2o');
    };

    $scope.addPara = function () {
        addFixed({ name: 'Paralgin major', price: data.fixed.paragin });
        pushButton('#btn_para');
    };

    $scope.addOxy = function () {
        addFixed({ name: 'Ristimulerende', price: data.fixed.oxytocin });
        pushButton('#btn_oxy');
    };

    $scope.addFluids = function () {
        addFixed({ name: 'V\u00E6sketilf\u00F8rsel', price: data.fixed.fluids });
        pushButton('#btn_fluids');
    };

    $scope.addSucction = function () {
        addFixed({ name: 'Sugekopp', price: data.fixed.sucction });
        $scope.sucction = true;
    };

    $scope.addTub = function () {
        addFixed({ name: 'Badekar', price: data.fixed.tub });
        $scope.tub = true;
    };

    $scope.addAcu = function () {
        addFixed({ name: 'Akupunktur', price: data.fixed.acupuncture });
        $scope.acu = true;
    };

    $scope.addCTG = function () {
        addFixed({ name: 'CTG', price: data.fixed.ctg });
        $scope.ctg = true;
    };

    $scope.toggleNight = function () {
        if ($scope.night) {
            lowerMulti(data.multi.night);
        } else {
            raiseMulti(data.multi.night);
        }
        $scope.night = !$scope.night;
    };

    $scope.toggleWeekend = function () {
        if ($scope.weekend) {
            lowerMulti(data.multi.weekend);
        } else {
            raiseMulti(data.multi.weekend);
        }
        $scope.weekend = !$scope.weekend;
    };

    $scope.printTab = function () {
        var totalFixed = $scope.tab.items.reduce(function (a, b) { return a + b.price; }, 0);
        $scope.totalFixed = totalFixed;
        $scope.totalRunning = $scope.currentTax - totalFixed;
        $scope.tabDate = new Date();
        var extras = [];
        if ($scope.weekend) { extras.push('helg'); };
        if ($scope.night) { extras.push('natt'); };
        $scope.tabExtra = extras.join('/');
        $scope.print = true;
    };

    $scope.closeTab = function() {
        $scope.endTax();
    }

    $scope.confirmEpidural = function () {
        $scope.confirmData = {
            header: "Epidural",
            cost: "Kostnad: " + data.fixed.epidural + "kr",
            question: "Har du innhentet samtykke fra den f\u00F8dende?",
            ok: "Ja",
            cancel: "Nei",
            action: 'epi'
        };
        $scope.confirm = true;
    };

    $scope.confirmSucction = function() {
        $scope.confirmData =
        {
            header: "Sugekopp",
            cost: "Kostnad: " + data.fixed.sucction + "kr",
            msg: "Ekstrakostnad p.g.a. gynekolog-krav",
            question: "Husk \u00E5 informere pasienten",
            ok: "OK",
            action: 'sucction'
        };
        $scope.confirm = true;
    };

    $scope.confirmFluids = function () {
        $scope.confirmData =
        {
            header: "V\u00E6sketilf\u00F8rsel",
            cost: "Kostnad: " + data.fixed.fluids + "kr",
            msg: "Husk \u00E5 informere pasienten",
            ok: "OK",
            action: 'fluids'
        };
        $scope.confirm = true;
    };

    $scope.okConfirm = function () {
        $scope.confirm = false;
        var action = $scope.confirmData.action;
        if (action == 'epi') {
            $scope.addEpidural();
        } else if (action == 'sucction') {
            $scope.addSucction();
        } else if (action == 'fluids') {
            $scope.addFluids();
        }
        $scope.confirmData = {};
    };

    $scope.cancelConfirm = function() {
        $scope.confirm = false;
        $scope.confirmData = {};
    };
}]);