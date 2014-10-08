//|-------------------------------------------------------------|
//| Database |          |           |       |          |        |
//|----------|----------|-----------|-------|----------|--------|
//| users                                                       |
//|----------|----------|-----------|-------|----------|--------|
//| username | password |           |       |          |        |
//|----------|----------|-----------|-------|----------|--------|
//| readers                                                     |
//|----------|----------|-----------|-------|----------|--------|
//| name     | number   | arrear    |       |          |        |
//|----------|----------|-----------|-------|----------|--------|
//| books                                                       |
//|----------|----------|-----------|-------|----------|--------|
//| name     | price    | reader_id | start | continue | broken |
//|----------|----------|-----------|-------|----------|--------|
//| fines                                                       |
//|----------|----------|-----------|-------|----------|--------|
//| reader   | book     | money     |       |          |        |
//|----------|----------|-----------|-------|----------|--------|
//| records                                                     |
//|----------|----------|-----------|-------|----------|--------|
//| reader   | book     | start     | end   | broken   | money  |
//|------------------------------------------------------------
$(document).ready(function() {
    //init
    refreshUsers();

    //User Event
    $('a[href="#user"]').click(function() {
        refreshUsers();
    });
    $('#userData').click(function(event) {
        if(event.target.nodeName = 'BUTTON') {
            var username = $(event.target).data('username');
            if(confirm('Ready to delete user:' + username + '?') === true) {
                User.deleteUser(username, refreshUsers);
            }
        }
    });

    $('#addUserButton').click(function() {
        $('#addUserForm').submit(function() {
            return false;
        });
        var username = $('#username').val();
        var password = $('#password').val();
        User.addUser(username, password, function() {
            refreshUsers();
            $('#addUser').modal('hide');
        });
    });

    $('#changePasswordButton').click(function() {
        $('#changePasswordForm').submit(function() {
            return false;
        });
        var username = $('#changePasswordUsername').val();
        var oldPassword = $('#oldPassword').val();
        var newPassword = $('#newPassword').val();
        User.changePassword(username, oldPassword, newPassword, function() {
            alert('succ');
            location.href = 'index.html';
        }, function() {
            alert('username or password error');
            $('#changePassword').modal('hide');
        })
    });

    //Reader Event

    $('a[href="#reader"]').click(function() {
        refreshReaders();
    });

    $('#readerData').click(function(event) {
        if(event.target.nodeName = 'BUTTON') {
            var name = $(event.target).data('name');
            var id = $(event.target).data('id');
            if(confirm('Ready to delete Reader:' + name + '?') === true) {
                Reader.deleteReader(id, refreshReaders);
            }
        }
    });

    $('#addReaderButton').click(function() {
        $('#addUserForm').submit(function() {
            return false;
        });
        var name = $('#readerName').val();
        Reader.addReader(name, function() {
            refreshReaders();
            $('#addReader').modal('hide');
        });
    });

    $('button[data-target="#pay"]').click(function() {
        Reader.getReaders(function(results) {
            var DOM = [];
            var html = '';
            for(i in results) {
                html = '<option value="' + results[i].name + '">' + results[i].name + '</option>';
                DOM.push(html);
            }
            $('#payReader').html(DOM.join(''));
        })
    });

    $('#payButton').click(function() {
        var name = $('#payReader').val();
        Reader.payFees(name, function() {
            $('#pay').modal('hide');
            refreshReaders();
        })
    })

    //Book Event
    $('a[href="#book"]').click(function() {
        refreshBooks();
    });

    $('#addBookButton').click(function() {
        $('#addBookForm').submit(function() {
            return false;
        });
        var bookName = $('#bookName').val();
        var price = $('#bookPrice').val();
        Book.addBook(bookName, price, function() {
            $('#addBook').modal('hide');
            refreshBooks();
        }, function() {
            alert('name error');
            $('#addBook').modal('hide');
        });
    });

    $('#bookData').click(function(event) {
        if(event.target.nodeName === 'BUTTON') {
            var name = $(event.target).data('name');
            if(confirm('Ready to delete Book' + name + '?') === true) {
                Book.deleteBook(name, refreshBooks);
            }
        }
    });

    $('button[data-target="#borrowBook"]').click(function() {
        Book.getBooks(function(results) {
            var DOM = [];
            var html = '';
            for(i in results) {
                html = '<option value="' + results[i].name + '">' + results[i].name + '</option>';
                DOM.push(html);
            }
            $('#borrowBookName').html(DOM.join(''));
        });
        Reader.getReaders(function(results) {
            var DOM = [];
            var html = '';
            for(i in results) {
                html = '<option value="' + results[i]._id + '">' + results[i].name + '</option>';
                DOM.push(html);
            }
            $('#borrowBookReader').html(DOM.join(''));
        });
    });

    $('button[data-target="#renewBook"]').click(function() {
        Book.getBooks(function(results) {
            var DOM = [];
            var html = '';
            for(i in results) {
                html = '<option value="' + results[i].name + '">' + results[i].name + '</option>';
                DOM.push(html);
            }
            $('#renewBookName').html(DOM.join(''));
        });
    });

    $('button[data-target="#returnBook"]').click(function() {
        Book.getBooks(function(results) {
            var DOM = [];
            var html = '';
            for(i in results) {
                html = '<option value="' + results[i].name + '">' + results[i].name + '</option>';
                DOM.push(html);
            }
            $('#returnBookName').html(DOM.join(''));
        });
    });

    $('#borrowBookButton').click(function() {
        var name = $('#borrowBookName').val();
        var reader = $('#borrowBookReader').val();
        Book.borrowBook(name, reader, function() {
            $('#borrowBook').modal('hide');
            refreshBooks();
        }, function() {
            alert('error');
            $('#borrowBook').modal('hide');
        })
    });

    $('#renewBookButton').click(function() {
        var name = $('#renewBookName').val();
        Book.renew(name, function() {
            $('#renewBook').modal('hide');
            refreshBooks();
        }, function() {
            alert('error');
            $('#renewBook').modal('hide');
        });
    });

    $('#returnBookButton').click(function() {
        var name = $('#returnBookName').val();
        var broken = $('#returnBookBroken').prop('checked');
        Book.returnBook(name, broken, function() {
            $('#returnBook').modal('hide');
            refreshBooks();
        });
    });

    //Fine Event
    $('a[href="#fine"]').click(function() {
        refreshFines();
    });

    //Record Event
    $('a[href="#record"]').click(function() {
        refreshRecords();
    });

    //Define Functions
    function refreshUsers() {
        User.getUsers(function(results) {
            var DOM = [];
            var html = '';
            for(i in results) {
                html = '<tr><td>' + results[i].username + '</td><td><button class="btn" data-username="' + results[i].username + '">Delete</button></td></tr>';
                DOM.push(html);
            }
            $('#userData').html(DOM.join(''));
        });
    }

    function refreshReaders() {
        Reader.getReaders(function(results) {
            var DOM = [];
            var html = '';
            for(i in results) {
                html = '<tr><td>' + results[i].name + '</td><td>' + results[i].number + '</td><td>' + results[i].arrear + '</td><td><button class="btn" data-id="' + results[i]._id + '" data-name = "' + results[i].name + '">Delete</button></td></tr>';
                DOM.push(html);
            }
            $('#readerData').html(DOM.join(''));
        });
    }

    function refreshBooks() {
        Book.getBooks(function(results) {
            var DOM = [];
            var html = '';
            for(i in results) {
                var end = '';
                if(results[i].start !== null) {
                    end = getDateString(results[i].start, 10 * (1 + (results[i].continue ? 1 : 0)));
                }
                html = '<tr><td>' + results[i].name + '</td><td>' + results[i].price + '</td><td>' + (results[i].reader_id ? 'no' : 'yes') + '</td><td>' + end + '</td><td><button class="btn" data-name = "' + results[i].name + '">Delete</button></td></tr>';
                DOM.push(html);
            }
            $('#bookData').html(DOM.join(''));
        });
    }

    function refreshFines() {
        Fine.getFines(function(results) {
            var DOM = [];
            var html = '';
            for(i in results) {
                html = '<tr><td>' + results[i].name + '</td><td>' + results[i].money + '</td><td>' + (new Date(results[i].date)).toLocaleDateString() + '</td></tr>';
                DOM.push(html);
            }
            $('#fineData').html(DOM.join(''));
        });
    }

    function refreshRecords() {
        Record.getRecords(function(results) {
            var DOM = [];
            var html = '';
            for(i in results) {
                html = '<tr><td>' + results[i].book + '</td><td>' + (new Date(results[i].start)).toLocaleDateString() + '</td><td>' + (new Date(results[i].end)).toLocaleDateString() + '</td>' +
                    '<td>' + (results[i].broken ? 'yes' : 'no') + '</td><td>' + results[i].money + '</td></tr>';
                DOM.push(html);
            }
            $('#recordData').html(DOM.join(''));
        })
    }

    function getDateString(start, time) {
        var startTime = Date.parse(new Date(start).toDateString());
        return (new Date(startTime + time * 24 * 60 * 60 * 1000)).toLocaleDateString();
    }
});