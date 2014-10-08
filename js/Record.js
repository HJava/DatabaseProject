var Record = (function() {
    var async = require('async');
    var mongoClient = require('mongodb').MongoClient;

    function getRecords(succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var records = arg1.collection('records');
            records.find().toArray(function(err, results) {
                callback(err, results);
            });
        }], function(err, results) {
            succ(results);
        });
    }

    return {
        getRecords: getRecords
    }
})();