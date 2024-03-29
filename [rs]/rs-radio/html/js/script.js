$(function() {
    window.addEventListener('message', function(event) {
        if (event.data.type == "open") {
            RSRadio.SlideUp()
        }

        if (event.data.type == "close") {
            RSRadio.SlideDown()
        }
    });

    document.onkeyup = function (data) {
        if (data.which == 27) { // Escape key
            $.post('http://rs-radio/escape', JSON.stringify({}));
            RSRadio.SlideDown()
        } else if (data.which == 13) { // Escape key
            $.post('http://rs-radio/joinRadio', JSON.stringify({
                channel: $("#channel").val()
            }));
        }
    };
});

RSRadio = {}

$(document).on('click', '#submit', function(e){
    e.preventDefault();

    $.post('http://rs-radio/joinRadio', JSON.stringify({
        channel: $("#channel").val()
    }));
});

$(document).on('click', '#disconnect', function(e){
    e.preventDefault();

    $.post('http://rs-radio/leaveRadio');
});

RSRadio.SlideUp = function() {
    $(".container").css("display", "block");
    $(".radio-container").animate({bottom: "6vh",}, 250);
}

RSRadio.SlideDown = function() {
    $(".radio-container").animate({bottom: "-110vh",}, 400, function(){
        $(".container").css("display", "none");
    });
}