// form behaviour
$(document).ready(function() {
    // reset value when in focus
    $('#url').focus(function() {
        $(this).val('');
    });

    // submit when enter key is pressed
    $('#url').keypress(function(e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            $('#submit_button').click();
        }
    });

});
