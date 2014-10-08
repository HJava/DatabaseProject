var Book = (function() {
    var async = require('async');
    var mongoClient = require('mongodb').MongoClient;

    function objectId(id) {
        var mongo = require('mongodb');
        var BSON = mongo.BSONPure;
        return new BSON.ObjectID(id);
    }

    function countArrear(start, end, extension, broken, price) {
        if(broken === true) {
            return price * 3;
        } else {
            var deadLine = 10;
            var time = Math.floor((end - start) / (60 * 60 * 24 * 1000));
            if(extension === true) {
                deadLine += 10;
            }
            if(time <= deadLine) {
                return 0;
            }
            return time - deadLine;
        }
    }


    function addBook(name, price, succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var books = arg1.collection('books');
            books.find({name: name}).toArray(function(err, results) {
                callback(err, results, books);
            });
        }, function(arg1, arg2, callback) {
            if(arg1.length === 0) {
                arg2.insert({name: name, price: price, reader_id: null, start: null, continue: false, broken: false}, {w: 1}, function(err, docs) {
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

    function deleteBook(name, succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var books = arg1.collection('books');
            books.find({name: name}).toArray(function(err, results) {
                callback(err, results, books);
            });
        }, function(arg1, arg2, callback) {
            if(arg1.length !== 0) {
                arg2.update({name: name}, {$set: {broken: true}}, function(err) {
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

    function borrowBook(name, reader_id, succ, fail) {
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
            var books = arg1.collection('books');
            readers.find({_id: objectId(reader_id)}).toArray(function(err, results) {
                callback(err, results, books, readers);
            });
        }, function(arg1, arg2, arg3, callback) {
            arg2.find({name: name}).toArray(function(err, results) {
                callback(err, arg1, arg2, arg3, results);
            });
        }, function(arg1, arg2, arg3, arg4, callback) {
            if(arg1[0].number > 0 && arg1[0].arrear === 0 && arg4[0].reader_id === null) {
                async.series([function(callback2) {
                    arg3.update({_id: objectId(reader_id)}, {$set: {number: arg1[0].number - 1}}, {w: 1}, function(err) {
                        callback2(null);
                    });
                }, function(callback2) {
                    arg2.update({name: name}, {$set: {reader_id: reader_id, start: new Date()}}, {w: 1}, function(err) {
                        callback2(null);
                    });
                }], function(err) {
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

    function renew(name, succ, fail) {
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
            var books = arg1.collection('books');
            books.find({name: name}).toArray(function(err, results) {
                callback(err, books, results);
            });
        }, function(arg1, arg2, callback) {
            if(arg2[0].continue === false && arg2[0].reader_id !== null) {
                arg1.update({name: name}, {$set: {continue: true}}, {w: 1}, function(err) {
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

    function returnBook(name, broken, succ, fail) {
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
            var books = arg1.collection('books');
            var records = arg1.collection('records');
            books.find({name: name}).toArray(function(err, results) {
                callback(err, books, readers, records, results);
            });
        }, function(arg1, arg2, arg3, arg4, callback) {
            var reader_id = arg4[0].reader_id;
            var arrear = countArrear(new Date(arg4[0].start), new Date(), arg4[0].continue, broken, arg4[0].price);
            async.series([function(callback2) {
                arg1.update({name: name}, {$set: {reader_id: null, start: null, continue: false, broken: broken}}, {w: 1}, function(err) {
                    callback2(null);
                });
            }, function(callback2) {
                async.waterfall([function(callback3) {
                    arg2.find({_id: objectId(reader_id)}).toArray(function(err, results) {
                        callback3(err, results);
                    });
                }, function(arg01, callback3) {
                    arg2.update({_id: objectId(reader_id)}, {$set: {number: arg01[0].number + 1, arrear: arg01[0].arrear + arrear}}, {w: 1}, function(err) {
                        callback3(err, true);
                    });
                }], function(err, results) {
                    if(results === true) {
                        callback2(null);
                    }
                });
            }, function(callback2) {
                arg1.update({name: name}, {$set: {reader_id: null, start: null, continue: false, broken: broken}}, {w: 1}, function(err) {
                    callback2(null);
                });
            }, function(callback2) {
                arg3.insert({reader: reader_id, book: arg4[0].name, start: arg4[0].start, end: new Date(), broken: broken, money: arrear}, {w: 1}, function(err, objcts) {
                    callback2(null);
                });
            }], function(err) {
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

    function getBooks(succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var books = arg1.collection('books');
            books.find({broken: false}).toArray(function(err, results) {
                callback(err, results);
            });
        }], function(err, results) {
            succ(results);
        });
    }

    return {
        addBook: addBook,
        deleteBook: deleteBook,
        borrowBook: borrowBook,
        renew: renew,
        returnBook: returnBook,
        getBooks: getBooks
    }
})();