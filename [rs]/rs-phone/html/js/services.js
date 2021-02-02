setupServicesList = function(data) {
    $(".services-list").html("");


    if (data.length > 0 )
    {
        $.each(data, function(i, service){              
               
                if (service.onduty){
                var element = '<div class="service-list" id="serviceid-'+i+' data-name="'+service.name+'" data-phone="'+service.phone+'"> ';
                element += '<div class="service-list-firstletter">'+(service.name).charAt(0).toUpperCase()+'</div>';
                element += '<div class="service-list-fullname">'+service.job+'</div>';
                element += '<div class="service-list-call"><i class="fas fa-phone"></i></div>';
                element += '</div>';
                
                $("#serviceid-"+i).data('ServiceData', service)
                $(".services-list").append(element);
                }
                
             })
                   
    }
}

$(document).on('click', '.service-list-call', function(e){
    e.preventDefault();

  
    var cData = {
        number: $(this).parent().data('phone'),
        name:  $(this).parent().data('name')
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
                            RS.Phone.Notifications.Add("fas fa-phone", "Phone", "Je belt nu annoniem");
                        }
                        $(".phone-call-outgoing").css({"display":"block"});
                        $(".phone-call-incoming").css({"display":"none"});
                        $(".phone-call-ongoing").css({"display":"none"});
                        $(".phone-call-outgoing-caller").html(cData.name);
                        RS.Phone.Functions.HeaderTextColor("white", 400);
                        RS.Phone.Animations.TopSlideUp('.phone-application-container', 400, -160);
                        setTimeout(function(){
                            $(".servicess-app").css({"display":"none"});
                            RS.Phone.Animations.TopSlideDown('.phone-application-container', 400, 0);
                            RS.Phone.Functions.ToggleApp("phone-call", "block");
                        }, 450);
    
                        CallData.name = cData.name;
                        CallData.number = cData.number;
                    
                        RS.Phone.Data.currentApplication = "phone-call";
                    } else {
                        RS.Phone.Notifications.Add("fas fa-phone", "Phone", "Persoon in gesprek");
                    }
                } else {
                    RS.Phone.Notifications.Add("fas fa-phone", "Phone", "Deze persoon is in");
                }
            } else {
                RS.Phone.Notifications.Add("fas fa-phone", "Phone", "Persoon is niet in de stad");
            }
        } else {
            RS.Phone.Notifications.Add("fas fa-phone", "Phone", "Je kan niet met je zelf praten");
        }
    });
});