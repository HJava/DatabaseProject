var Reader = (function() {
    var async = require('async');
    var mongoClient = require('mongodb').MongoClient;

    function objectId(id) {
        var mongo = require('mongodb');
        var BSON = mongo.BSONPure;
        return new BSON.ObjectID(id);
    }

    function addReader(name, succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var readers = arg1.collection('readers');
            readers.find({name: name}).toArray(function(err, results) {
                callback(err, readers, results);
            });
        }, function(arg1, arg2, callback) {
            arg1.insert({name: name, number: 2, arrear: 0}, {w: 1}, function(err, docs) {
                callback(err, true);
            });
        }], function(err, results) {
            if(results === true) {
                succ();
            } else {
                fail();
            }
        });
    }

    function getReaderByName(name, succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var readers = arg1.collection('readers');
            readers.find({name: name}).toArray(function(err, results) {
                callback(err, results);
            });
        }], function(err, results) {
            succ(results);
        });
    }

    function deleteReader(reader_id, succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var readers = arg1.collection('readers');
            readers.find({_id: objectId(reader_id)}).toArray(function(err, results) {
                callback(err, readers, results);
            });
        }, function(arg1, arg2, callback) {
            if(arg2[0].number === 2 && arg2[0].arrear === 0) {
                arg1.remove({_id: objectId(reader_id)}, function(err, results) {
                    callback(err, true);
                });
            } else {
                callback(null, false);
            }
        }], function(err, results) {
            if(results === true) {
                succ();
            } else {
                fail();
            }
        });
    }

    function getReaders(succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var readers = arg1.collection('readers');
            readers.find().toArray(function(err, results) {
                callback(err, results);
            });
        }], function(err, results) {
            succ(results);
        });
    }

    function payFees(name, succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var readers = arg1.collection('readers');
            var fines = arg1.collection('fines');
            readers.find({name: name}).toArray(function(err, results) {
                callback(err, readers, fines, results);
            });
        }, function(arg1, arg2, arg3, callback) {
            async.series([function(callback2) {
                arg2.insert({name: name, money: arg3[0].arrear, date: new Date()}, {w: 1}, function(err, docs) {
                    callback2(null);
                });
            }, function(callback2) {
                arg1.update({name: name}, {$set: {arrear: 0}}, {w: 1}, function(err) {
                    callback2(null);
                })
            }], function(err) {
                callback(err, true);
            });
        }], function(err, results) {
            if(results === true) {
                succ();
            }
        });
    }

    return {
        addReader: addReader,
        getReaderByName: getReaderByName,
        deleteReader: deleteReader,
        getReaders: getReaders,
        payFees: payFees
    };
})();
