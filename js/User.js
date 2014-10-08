var User = (function() {
    var async = require('async');
    var crypto = require('crypto');
    var mongoClient = require('mongodb').MongoClient;

    function md5(text) {
        return crypto.createHash('md5').update(text).digest('hex');
    }

    function checkUser(username, password, succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var users = arg1.collection('users');
            users.find({username: username}).toArray(function(err, results) {
                callback(err, results);
            });
        }], function(err, results) {
            if(results.length !== 0 && results[0].password === md5(password)) {
                succ();
            } else {
                fail();
            }
        });
    }

    function addUser(username, password, succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var users = arg1.collection('users');
            users.find({username: username}).toArray(function(err, results) {
                callback(err, results, users);
            });
        }, function(arg1, arg2, callback) {
            if(arg1.length === 0) {
                arg2.insert({username: username, password: md5(password)}, {w: 1}, function(err, docs) {
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

    function changePassword(username, old, replace, succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var users = arg1.collection('users');
            users.find({username: username}).toArray(function(err, results) {
                callback(err, results, users);
            });
        }, function(arg1, arg2, callback) {
            if(arg1[0].password === md5(old)) {
                arg2.update({username: username}, {$set: {password: md5(replace)}}, {w: 1}, function(err) {
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

    function getUsers(succ) {
        var succ = succ || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var users = arg1.collection('users');
            users.find().toArray(function(err, results) {
                callback(err, results);
            });
        }], function(err, results) {
            succ(results);
        })
    }

    function deleteUser(username, succ, fail) {
        var succ = succ || function() {
        };
        var fail = fail || function() {
        };
        async.waterfall([function(callback) {
            mongoClient.connect('mongodb://127.0.0.1/first', function(err, db) {
                callback(err, db);
            });
        }, function(arg1, callback) {
            var users = arg1.collection('users');
            users.find({username: username}).toArray(function(err, results) {
                callback(err, users, results);
            });
        }, function(arg1, arg2, callback) {
            arg1.remove({username: username}, function(err, results) {
                callback(err, true);
            });
        }], function(err, results) {
            if(results === true) {
                succ();
            }
        });
    }

    return {
        addUser: addUser,
        checkUser: checkUser,
        changePassword: changePassword,
        getUsers: getUsers,
        deleteUser: deleteUser
    };
})();
//User.addUser('b','b');