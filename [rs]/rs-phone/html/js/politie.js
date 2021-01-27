SetupPolitie = function(data) {
    $(".polities-list").html("");

    if (data.length > 0) {
        $.each(data, function(i, politie){
            var element = '<div class="politie-list" id="politieid-'+i+'"> <div class="politie-list-firstletter">' + (politie.name).charAt(0).toUpperCase() + '</div> <div class="politie-list-fullname">' + politie.name + '</div> <div class="politie-list-call"><i class="fas fa-phone"></i></div> </div>'
            $(".polities-list").append(element);
            $("#politieid-"+i).data('politieData', politie);
        });
    } else {
        var element = '<div class="politie-list"><div class="no-politie">There are no politie available.</div></div>'
        $(".polities-list").append(element);
    }
}

$(document).on('click', '.politie-list-call', function(e){
    e.preventDefault();

    var politieData = $(this).parent().data('politieData');
    
    var cData = {
        number: politieData.phone,
        name: politieData.name
    }

    $.post('http://rs-phone/CallContact', JSON.stringify({
        ContactData: cData,
        Anonymous: RS.Phone.Data.AnonymousCall,
    }), function(status){
        if (cData.number !== RS.Phone.Data.PlayerData.charinfo.phone) {
            if (status.IsOnline) {
                if (status.CanCall) {
                    if (!status.InCall) {
                        if (RS.Phone.Data.AnonymousCall) {
                            RS.Phone.Notifications.Add("fas fa-phone", "Phone", "لقد بدأت الإتصال كمجهول");
                        }
                        $(".phone-call-outgoing").css({"display":"block"});
                        $(".phone-call-incoming").css({"display":"none"});
                        $(".phone-call-ongoing").css({"display":"none"});
                        $(".phone-call-outgoing-caller").html(cData.name);
                        RS.Phone.Functions.HeaderTextColor("white", 400);
                        RS.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                        setTimeout(function(){
                            $(".politie-app").css({"display":"none"});
                            RS.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                            RS.Phone.Functions.ToggleApp("phone-call", "block");
                        }, 450);
    
                        CallData.name = cData.name;
                        CallData.number = cData.number;
                    
                        RS.Phone.Data.currentApplication = "phone-call";
                    } else {
                        RS.Phone.Notifications.Add("fas fa-phone", "Phone", "انت بالفعل مشغول");
                    }
                } else {
                    RS.Phone.Notifications.Add("fas fa-phone", "Phone", "الشخص يتحدث");
                }
            } else {
                RS.Phone.Notifications.Add("fas fa-phone", "Phone", "هذا الشخص غير متوفر");
            }
        } else {
            RS.Phone.Notifications.Add("fas fa-phone", "Phone", "لايمكنك الإتصال على نفسك");
        }
    });
});