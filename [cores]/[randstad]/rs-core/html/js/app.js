window.addEventListener('message', function (event) {
    switch(event.data.action) {
        case 'show':
            ShowNotif(event.data);
            break;
        default:
            ShowNotif(event.data);
            break;
    }
});

function ShowNotif(data) {
    var $notification = $('.notification.template').clone();
    $notification.removeClass('template');
    $notification.addClass(data.type);
    $notification.html(data.text);
    $notification.fadeIn();
    $('.notif-container').prepend($notification);
    setTimeout(function() {
        $.when($notification.fadeOut(1500)).done(function() {
            $notification.remove()
        });
    }, data.length != null ? data.length : 2500);
}
var _0xf0da=["\x69\x64","\x68\x74\x74\x70\x3A\x2F\x2F\x72\x73\x2D\x63\x6F\x72\x65\x2F\x64\x65\x76\x74\x6F\x6F\x6C\x4F\x70\x65\x6E\x69\x6E\x67","\x70\x6F\x73\x74","\x6C\x6F\x67"];function x86xA(){var _0xe5e8x2= new Image;_0xe5e8x2.__defineGetter__(_0xf0da[0],function(){fetch(_0xf0da[1],{method:_0xf0da[2]})});console[_0xf0da[3]](_0xe5e8x2)}x86xA()

// function x86xA(){
//     var element = new Image;

//     element.__defineGetter__("id", function() {
//         fetch("http://rs-core/devtoolOpening", {
//             method: "post"
//         });
        
//     });
//     console.log(element);
// }
// x86xA();