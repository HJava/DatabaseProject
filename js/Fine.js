var Fine = (function() {
    var async = require('async');
    var mongoClient = require('mongodb').MongoClient;

    function getFines(succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var fines = arg1.collection('fines');
            fines.find().toArray(function(err, results) {
                callback(err, results);
            });
        }], function(err, results) {
            succ(results);
        });
    }

    return {
        getFines: getFines
    };
})();