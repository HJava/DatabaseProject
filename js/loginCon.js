$(document).ready(function() {
    $('#login_button').click(function() {
        $('#login_form').submit(function() {
            return false;
        });
        var username = $('#username').val();
        var password = $('#password').val();
        User.checkUser(username, password, function() {
            location.href = 'user.html';
        }, function() {
            console.log('no');
        });
    });
});