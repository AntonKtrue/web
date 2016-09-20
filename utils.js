/**
 * Created by Anton on 18.09.2016.
 */


function prepareFlat() {
    $('header').empty();
    $("#content").empty();
    navBar = generateNavigationBar();
    $(navBar).appendTo($("header"));
    show_usermenu();
}

function prepareData(prData) {
    return encodeURIComponent(JSON.stringify(prData))
}

function logout() {
    $.ajax({
        type: 'POST',
        url: 'login.php',
        dataType: 'text',
        data: 'logout',
        success: function () {
            show_usermenu();
            //generateSignMenu();
        }
    });
}

function activateLeanModal() {
    $('#modaltrigger').leanModal({top: 175, overlay: 0.45, closeButton: ".hidemodal"});
    $('#regmodaltrigger').leanModal({top: 175, overlay: 0.45, closeButton: ".hidemodal"});
    $('#accmodaltrigger').leanModal({top: 175, overlay: 0.45});
}