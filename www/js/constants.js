angular.module('neeTax.constants', [])
    .constant("priceData", {
        "fixed": {
            "start": 500,
            "epidural": 1800,
            "n2o": 250,
            "paragin": 8,
            "oxytocin": 200,
            "fluids": 300,
            "sucction": 250,
            "tub": 200,
            "acupuncture": 150,
            "ctg": 400
        },
        "multi": {
            "night": 0.5,
            "weekend": 1,
            "msecperkr": 620
        }
    });