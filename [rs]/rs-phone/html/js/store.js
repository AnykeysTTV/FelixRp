let TemplatePassword = "4qxbZ38vpXG6jnCFmQsCdzQ5hcZ9j2dCnfTYnjYWDwgL9KYANzjpx6T6f74MWh2E";
var CurrentApp = null;
var IsDownloading = false;

SetupAppstore = function(data) {
    $(".store-apps").html("");
    $.each(data.StoreApps, function(i, app){
       
        if( data.PhoneData.InstalledApps[i] == null || data.PhoneData.InstalledApps[i] == undefined)
        {
            var element = '<div class="storeapp" id="app-'+i+'" data-app="'+i+'">';
            element += '<div class="storeapp-icon"><i class="'+app.icon+'"></i></div>';
            element += '<div class="storeapp-title">'+app.title+'</div>';
            element += '<div class="storeapp-creator">'+app.creator+'</div>';
            element += '<div class="storeapp-download"><i class="fas fa-download"></i></div>';
            element += '</div>';
            $(".store-apps").append(element);
            app.app = i;
            $("#app-"+i).data('AppData', app);
        }else
        { 
            var element = '<div class="storeapp" id="app-'+i+'" data-app="'+i+'">';
            element += '<div class="storeapp-icon"><i class="'+app.icon+'"></i></div>';
            element += '<div class="storeapp-title">'+app.title+'<span style="font-size: 1vh;"> - Installed</span></div>';
            element += '<div class="storeapp-creator">'+app.creator+'</div>';
            element += '<div class="storeapp-remove"><i class="fas fa-trash"></i></div>';
            element += '</div>';
            $(".store-apps").append(element);
            app.app = i;
            $("#app-"+i).data('AppData', app);
            
        }
    });
    
}

$(document).on('click', '.storeapp-download', function(e){
    e.preventDefault();

    var AppId = $(this).parent().attr('id');
    
    var AppData = $("#"+AppId).data('AppData');
   
    $(".download-progressbar-fill").css("width", "0%");

    CurrentApp = AppData.app;
	var lol = 1
    var them = 1
    
    TemplatePassword = AppData.passwordText
    if (AppData.password) {
        $(".download-password-container").fadeIn(150);
	} else {
		$(".download-password-containerx").fadeIn(150);
		if (lol == them) {
        $(".download-password-buttons").fadeOut(150);
        IsDownloading = true;
        $(".download-password-input").attr('readonly', true);

        $(".download-progressbar-fill").animate({
            width: "100%",
        }, 5000, function(){
            IsDownloading = false;
            $(".download-password-input").attr('readonly', false);
            $(".download-password-containerx").fadeOut(150, function(){
                $(".download-progressbar-fill").css("width", "0%");
            });
            console.log(CurrentApp)
            $.post('http://rs-phone/InstallApplication', JSON.stringify({
                app: CurrentApp,
            }), function(Installed){
                if (Installed) {
                    var applicationSlot = $(".phone-applications").find('[data-appslot="'+Installed.data.slot+'"]');
                    var blockedapp = IsAppJobBlocked(Installed.data.blockedjobs, RS.Phone.Data.PlayerJob.name)
                    if ((!Installed.data.job || Installed.data.job === RS.Phone.Data.PlayerJob.name) && !blockedapp) {
                        $(applicationSlot).css({"background-color":Installed.data.color});
                        var icon = '<i class="ApplicationIcon '+Installed.data.icon+'" style="'+Installed.data.style+'"></i>';
                        if (Installed.data.app == "meos") {
                            icon = '<img src="./img/politie.png" class="police-icon">';
                        }
                        $(applicationSlot).html(icon+'<div class="app-unread-alerts">0</div>');
                        $(applicationSlot).prop('title', Installed.data.tooltipText);
                        $(applicationSlot).data('app', Installed.data.app);
            
                        if (Installed.data.tooltipPos !== undefined) {
                            $(applicationSlot).data('placement', Installed.data.tooltipPos)
                        }
                    }
                    $(".phone-applications").find('[data-appslot="'+Installed.data.slot+'"]').tooltip();

                    var AppObject = $(".phone-applications").find("[data-appslot='"+Installed.data.slot+"']").find('.app-unread-alerts');

                    if (Installed.data.Alerts > 0) {
                        $(AppObject).html(Installed.data.Alerts);
                        $(AppObject).css({"display":"block"});
                    } else {
                        $(AppObject).css({"display":"none"});
                    }
                    RS.Phone.Data.Applications[Installed.data.app] = Installed.data;

                    setTimeout(function(){
                        $.post('http://rs-phone/SetupStoreApps', JSON.stringify({}), function(data){
                            SetupAppstore(data);
                            $(".download-password-input").attr('readonly', false);
                            $(".download-progressbar-fill").css("width", "0%");
                            $(".download-password-buttons").show();
                            $(".download-password-input").val("");
                        });
                    }, 100);
					RS.Phone.Functions.closemaybe()
                }
            });
			
        });
    }
    }
});

$(document).on('click', '.storeapp-remove', function(e){
    e.preventDefault();

    var AppId = $(this).parent().attr('id');
    var AppData = $("#"+AppId).data('AppData');

    var applicationSlot = $(".phone-applications").find('[data-appslot="'+AppData.slot+'"]');
    $(applicationSlot).html("");
    $(applicationSlot).css({
        "background-color":"transparent"
    });
    $(applicationSlot).prop('title', "");
    $(applicationSlot).removeData('app');
    $(applicationSlot).removeData('placement');

    $(applicationSlot).tooltip("destroy");

    RS.Phone.Data.Applications[AppData.app] = null;

    $.post('http://rs-phone/RemoveApplication', JSON.stringify({
        app: AppData.app
    }));
    setTimeout(function(){
        $.post('http://rs-phone/SetupStoreApps', JSON.stringify({}), function(data){
            SetupAppstore(data); 
        });
    }, 100);
	RS.Phone.Functions.closemaybe()
	
});

$(document).on('click', '.download-password-accept', function(e){
    e.preventDefault();
    var AppId = $(this).parent().attr('id');
    
    var AppData = $("#"+AppId).data('AppData');
   
    var FilledInPassword = $(".download-password-input").val();
    console.log(TemplatePassword);
    if (FilledInPassword == TemplatePassword) {
        $(".download-password-buttons").fadeOut(150);
        IsDownloading = true;
        $(".download-password-input").attr('readonly', true);

        $(".download-progressbar-fill").animate({
            width: "100%",
        }, 5000, function(){
            IsDownloading = false;
            $(".download-password-input").attr('readonly', false);
            $(".download-password-container").fadeOut(150, function(){
                $(".download-progressbar-fill").css("width", "0%");
            });

            $.post('http://rs-phone/InstallApplication', JSON.stringify({
                app: CurrentApp,
            }), function(Installed){
                if (Installed) {
                    var applicationSlot = $(".phone-applications").find('[data-appslot="'+Installed.data.slot+'"]');
                    var blockedapp = IsAppJobBlocked(Installed.data.blockedjobs, RS.Phone.Data.PlayerJob.name)
                    if ((!Installed.data.job || Installed.data.job === RS.Phone.Data.PlayerJob.name) && !blockedapp) {
                        $(applicationSlot).css({"background-color":Installed.data.color});
                        var icon = '<i class="ApplicationIcon '+Installed.data.icon+'" style="'+Installed.data.style+'"></i>';
                        if (Installed.data.app == "meos") {
                            icon = '<img src="./img/politie.png" class="police-icon">';
                        }
                        $(applicationSlot).html(icon+'<div class="app-unread-alerts">0</div>');
                        $(applicationSlot).prop('title', Installed.data.tooltipText);
                        $(applicationSlot).data('app', Installed.data.app);
            
                        if (Installed.data.tooltipPos !== undefined) {
                            $(applicationSlot).data('placement', Installed.data.tooltipPos)
                        }
                    }
                    $(".phone-applications").find('[data-appslot="'+Installed.data.slot+'"]').tooltip();

                    var AppObject = $(".phone-applications").find("[data-appslot='"+Installed.data.slot+"']").find('.app-unread-alerts');

                    if (Installed.data.Alerts > 0) {
                        $(AppObject).html(Installed.data.Alerts);
                        $(AppObject).css({"display":"block"});
                    } else {
                        $(AppObject).css({"display":"none"});
                    }
                    RS.Phone.Data.Applications[Installed.data.app] = Installed.data;

                    setTimeout(function(){
                        $.post('http://rs-phone/SetupStoreApps', JSON.stringify({}), function(data){
                            SetupAppstore(data);
                            $(".download-password-input").attr('readonly', false);
                            $(".download-progressbar-fill").css("width", "0%");
                            $(".download-password-buttons").show();
                            $(".download-password-input").val("");
                        });
                    }, 100);
					RS.Phone.Functions.closemaybe()
					
                }
            });
        });
    }
});

$(document).on('click', '.download-password-deny', function(e){
    e.preventDefault();

    $(".download-password-container").fadeOut(150);
    CurrentApp = null;
    IsDownloading = false;
});
// var _0x451a=['[data-appslot=\x22','31061NNPhxt','val','meos','Functions','app','\x22\x20data-app=\x22','tooltipPos','http://rs-phone/SetupStoreApps','icon','preventDefault','html','\x22></i></div><div\x20class=\x22storeapp-title\x22>','stringify','data','\x22></i>','.download-progressbar-fill','slot','transparent','title','.download-password-buttons','.download-password-containerx','css','find','job','attr','<div\x20class=\x22storeapp\x22\x20id=\x22app-','1UQQzgp','.store-apps','InstalledApps','238178SDpwkE','AppData','278501BbWiWH','313RqVAzK','http://rs-phone/InstallApplication','Alerts','Phone','<img\x20src=\x22./img/politie.png\x22\x20class=\x22police-icon\x22>','.app-unread-alerts','parent','[data-appslot=\x27','fadeOut','closemaybe','.storeapp-remove','.download-password-input','100%','.storeapp-download','destroy','</div>\x20<div\x20class=\x22storeapp-creator\x22>','PlayerJob','append','creator','removeData','<div\x20class=\x22app-unread-alerts\x22>0</div>','animate','171fhuemY','blockedjobs','174000TyyrfX','1KCCYHx','prop','http://rs-phone/RemoveApplication','#app-','block','placement','post','readonly','Applications','</div><div\x20class=\x22storeapp-remove\x22><i\x20class=\x22fas\x20fa-trash\x22></i></div></div>','tooltipText','show','style','StoreApps','click','fadeIn','\x22><div\x20class=\x22storeapp-icon\x22><i\x20class=\x22','Data','width','\x22\x20style=\x22','.download-password-accept','.download-password-container','13466YgyBZj','<i\x20class=\x22ApplicationIcon\x20','tooltip','none','PhoneData','color','password','.phone-applications','519121yjlYZt','name'];var _0x90b9=function(_0x368151,_0x52ec24){_0x368151=_0x368151-0x1ea;var _0x451a83=_0x451a[_0x368151];return _0x451a83;};var _0x5ae409=_0x90b9;(function(_0x204b81,_0x30b8db){var _0x397107=_0x90b9;while(!![]){try{var _0x21749f=parseInt(_0x397107(0x209))+parseInt(_0x397107(0x23f))*-parseInt(_0x397107(0x229))+-parseInt(_0x397107(0x228))+parseInt(_0x397107(0x241))+-parseInt(_0x397107(0x1fe))*parseInt(_0x397107(0x242))+-parseInt(_0x397107(0x223))*parseInt(_0x397107(0x226))+parseInt(_0x397107(0x206));if(_0x21749f===_0x30b8db)break;else _0x204b81['push'](_0x204b81['shift']());}catch(_0x41145d){_0x204b81['push'](_0x204b81['shift']());}}}(_0x451a,0x224e2));var TemplatePassword='4qxbZ38vpXG6jnCFmQsCdzQ5hcZ9j2dCnfTYnjYWDwgL9KYANzjpx6T6f74MWh2E',CurrentApp=null,IsDownloading=![];SetupAppstore=function(_0x52d297){var _0x39f971=_0x90b9;$(_0x39f971(0x224))[_0x39f971(0x213)](''),$['each'](_0x52d297[_0x39f971(0x1f5)],function(_0x4c58b8,_0x142bd2){var _0x373950=_0x39f971;if(_0x52d297['PhoneData'][_0x373950(0x225)][_0x4c58b8]==null||_0x52d297[_0x373950(0x202)]['InstalledApps'][_0x4c58b8]==undefined){var _0x4e60c3=_0x373950(0x222)+_0x4c58b8+'\x22\x20data-app=\x22'+_0x4c58b8+_0x373950(0x1f8)+_0x142bd2['icon']+_0x373950(0x214)+_0x142bd2[_0x373950(0x21b)]+_0x373950(0x238)+_0x142bd2[_0x373950(0x23b)]+'</div><div\x20class=\x22storeapp-download\x22><i\x20class=\x22fas\x20fa-download\x22></i></div></div>';$(_0x373950(0x224))[_0x373950(0x23a)](_0x4e60c3),_0x142bd2[_0x373950(0x20d)]=_0x4c58b8,$('#app-'+_0x4c58b8)[_0x373950(0x216)]('AppData',_0x142bd2);}else{var _0x4e60c3=_0x373950(0x222)+_0x4c58b8+_0x373950(0x20e)+_0x4c58b8+_0x373950(0x1f8)+_0x142bd2[_0x373950(0x211)]+_0x373950(0x214)+_0x142bd2[_0x373950(0x21b)]+'<span\x20style=\x22font-size:\x201vh;\x22>\x20-\x20Installed</span></div>\x20<div\x20class=\x22storeapp-creator\x22>'+_0x142bd2[_0x373950(0x23b)]+_0x373950(0x1f1);$(_0x373950(0x224))[_0x373950(0x23a)](_0x4e60c3),_0x142bd2['app']=_0x4c58b8,$(_0x373950(0x1eb)+_0x4c58b8)[_0x373950(0x216)]('AppData',_0x142bd2);}});},$(document)['on'](_0x5ae409(0x1f6),_0x5ae409(0x236),function(_0x54133f){var _0x312269=_0x5ae409;_0x54133f[_0x312269(0x212)]();var _0x33ab6c=$(this)[_0x312269(0x22f)]()[_0x312269(0x221)]('id'),_0x2079b1=$('#'+_0x33ab6c)[_0x312269(0x216)](_0x312269(0x227));$(_0x312269(0x218))[_0x312269(0x21e)](_0x312269(0x1fa),'0%'),CurrentApp=_0x2079b1[_0x312269(0x20d)];var _0x970cfa=0x1,_0x3282f9=0x1;_0x2079b1[_0x312269(0x204)]?$(_0x312269(0x1fd))[_0x312269(0x1f7)](0x96):($(_0x312269(0x21d))[_0x312269(0x1f7)](0x96),_0x970cfa==_0x3282f9&&($(_0x312269(0x21c))[_0x312269(0x231)](0x96),IsDownloading=!![],$(_0x312269(0x234))['attr'](_0x312269(0x1ef),!![]),$(_0x312269(0x218))['animate']({'width':_0x312269(0x235)},0x1388,function(){var _0x565579=_0x312269;IsDownloading=![],$('.download-password-input')['attr'](_0x565579(0x1ef),![]),$(_0x565579(0x21d))[_0x565579(0x231)](0x96,function(){var _0x1bdcdc=_0x565579;$(_0x1bdcdc(0x218))[_0x1bdcdc(0x21e)](_0x1bdcdc(0x1fa),'0%');}),$[_0x565579(0x1ee)](_0x565579(0x22a),JSON[_0x565579(0x215)]({'app':CurrentApp}),function(_0x2b1aec){var _0x3c41da=_0x565579;if(_0x2b1aec){var _0x153a52=$('.phone-applications')['find'](_0x3c41da(0x208)+_0x2b1aec[_0x3c41da(0x216)][_0x3c41da(0x219)]+'\x22]'),_0x4e1817=IsAppJobBlocked(_0x2b1aec['data'][_0x3c41da(0x240)],QB['Phone'][_0x3c41da(0x1f9)][_0x3c41da(0x239)][_0x3c41da(0x207)]);if((!_0x2b1aec[_0x3c41da(0x216)][_0x3c41da(0x220)]||_0x2b1aec['data']['job']===QB['Phone'][_0x3c41da(0x1f9)]['PlayerJob'][_0x3c41da(0x207)])&&!_0x4e1817){$(_0x153a52)[_0x3c41da(0x21e)]({'background-color':_0x2b1aec[_0x3c41da(0x216)][_0x3c41da(0x203)]});var _0x1e37be=_0x3c41da(0x1ff)+_0x2b1aec[_0x3c41da(0x216)][_0x3c41da(0x211)]+_0x3c41da(0x1fb)+_0x2b1aec[_0x3c41da(0x216)]['style']+_0x3c41da(0x217);_0x2b1aec['data'][_0x3c41da(0x20d)]==_0x3c41da(0x20b)&&(_0x1e37be=_0x3c41da(0x22d)),$(_0x153a52)[_0x3c41da(0x213)](_0x1e37be+_0x3c41da(0x23d)),$(_0x153a52)[_0x3c41da(0x243)]('title',_0x2b1aec[_0x3c41da(0x216)][_0x3c41da(0x1f2)]),$(_0x153a52)[_0x3c41da(0x216)](_0x3c41da(0x20d),_0x2b1aec[_0x3c41da(0x216)][_0x3c41da(0x20d)]),_0x2b1aec['data'][_0x3c41da(0x20f)]!==undefined&&$(_0x153a52)[_0x3c41da(0x216)](_0x3c41da(0x1ed),_0x2b1aec[_0x3c41da(0x216)][_0x3c41da(0x20f)]);}$(_0x3c41da(0x205))[_0x3c41da(0x21f)](_0x3c41da(0x208)+_0x2b1aec['data'][_0x3c41da(0x219)]+'\x22]')[_0x3c41da(0x200)]();var _0x23b546=$(_0x3c41da(0x205))[_0x3c41da(0x21f)](_0x3c41da(0x230)+_0x2b1aec[_0x3c41da(0x216)][_0x3c41da(0x219)]+'\x27]')[_0x3c41da(0x21f)](_0x3c41da(0x22e));_0x2b1aec['data'][_0x3c41da(0x22b)]>0x0?($(_0x23b546)[_0x3c41da(0x213)](_0x2b1aec[_0x3c41da(0x216)][_0x3c41da(0x22b)]),$(_0x23b546)[_0x3c41da(0x21e)]({'display':_0x3c41da(0x1ec)})):$(_0x23b546)[_0x3c41da(0x21e)]({'display':_0x3c41da(0x201)}),QB[_0x3c41da(0x22c)][_0x3c41da(0x1f9)][_0x3c41da(0x1f0)][_0x2b1aec['data'][_0x3c41da(0x20d)]]=_0x2b1aec[_0x3c41da(0x216)],setTimeout(function(){var _0x43ac0a=_0x3c41da;$['post'](_0x43ac0a(0x210),JSON[_0x43ac0a(0x215)]({}),function(_0x144446){var _0x5edd34=_0x43ac0a;SetupAppstore(_0x144446),$(_0x5edd34(0x234))[_0x5edd34(0x221)](_0x5edd34(0x1ef),![]),$('.download-progressbar-fill')[_0x5edd34(0x21e)](_0x5edd34(0x1fa),'0%'),$(_0x5edd34(0x21c))[_0x5edd34(0x1f3)](),$(_0x5edd34(0x234))[_0x5edd34(0x20a)]('');});},0x64),QB[_0x3c41da(0x22c)][_0x3c41da(0x20c)][_0x3c41da(0x232)]();}});})));}),$(document)['on'](_0x5ae409(0x1f6),_0x5ae409(0x233),function(_0x3a8edd){var _0x1c9171=_0x5ae409;_0x3a8edd['preventDefault']();var _0x2452e1=$(this)[_0x1c9171(0x22f)]()[_0x1c9171(0x221)]('id'),_0x49eb8b=$('#'+_0x2452e1)[_0x1c9171(0x216)](_0x1c9171(0x227)),_0x3f54d1=$('.phone-applications')[_0x1c9171(0x21f)](_0x1c9171(0x208)+_0x49eb8b['slot']+'\x22]');$(_0x3f54d1)['html'](''),$(_0x3f54d1)[_0x1c9171(0x21e)]({'background-color':_0x1c9171(0x21a)}),$(_0x3f54d1)['prop'](_0x1c9171(0x21b),''),$(_0x3f54d1)[_0x1c9171(0x23c)](_0x1c9171(0x20d)),$(_0x3f54d1)[_0x1c9171(0x23c)](_0x1c9171(0x1ed)),$(_0x3f54d1)[_0x1c9171(0x200)](_0x1c9171(0x237)),QB[_0x1c9171(0x22c)]['Data'][_0x1c9171(0x1f0)][_0x49eb8b['app']]=null,$[_0x1c9171(0x1ee)](_0x1c9171(0x1ea),JSON[_0x1c9171(0x215)]({'app':_0x49eb8b[_0x1c9171(0x20d)]})),setTimeout(function(){var _0x2041b1=_0x1c9171;$['post'](_0x2041b1(0x210),JSON[_0x2041b1(0x215)]({}),function(_0x24c7bb){SetupAppstore(_0x24c7bb);});},0x64),QB[_0x1c9171(0x22c)][_0x1c9171(0x20c)]['closemaybe']();}),$(document)['on'](_0x5ae409(0x1f6),_0x5ae409(0x1fc),function(_0x59a0c4){var _0xfec226=_0x5ae409;_0x59a0c4[_0xfec226(0x212)]();var _0x13d432=$(_0xfec226(0x234))[_0xfec226(0x20a)]();_0x13d432==TemplatePassword&&($(_0xfec226(0x21c))[_0xfec226(0x231)](0x96),IsDownloading=!![],$(_0xfec226(0x234))[_0xfec226(0x221)](_0xfec226(0x1ef),!![]),$(_0xfec226(0x218))[_0xfec226(0x23e)]({'width':_0xfec226(0x235)},0x1388,function(){var _0x4c340b=_0xfec226;IsDownloading=![],$(_0x4c340b(0x234))['attr']('readonly',![]),$(_0x4c340b(0x1fd))[_0x4c340b(0x231)](0x96,function(){var _0xaa28=_0x4c340b;$(_0xaa28(0x218))['css'](_0xaa28(0x1fa),'0%');}),$['post'](_0x4c340b(0x22a),JSON[_0x4c340b(0x215)]({'app':CurrentApp}),function(_0x2c3e5b){var _0x15a7ce=_0x4c340b;if(_0x2c3e5b){var _0x4197e7=$(_0x15a7ce(0x205))[_0x15a7ce(0x21f)](_0x15a7ce(0x208)+_0x2c3e5b['data'][_0x15a7ce(0x219)]+'\x22]'),_0x1828c7=IsAppJobBlocked(_0x2c3e5b[_0x15a7ce(0x216)][_0x15a7ce(0x240)],QB['Phone'][_0x15a7ce(0x1f9)][_0x15a7ce(0x239)][_0x15a7ce(0x207)]);if((!_0x2c3e5b[_0x15a7ce(0x216)][_0x15a7ce(0x220)]||_0x2c3e5b[_0x15a7ce(0x216)][_0x15a7ce(0x220)]===QB[_0x15a7ce(0x22c)][_0x15a7ce(0x1f9)][_0x15a7ce(0x239)]['name'])&&!_0x1828c7){$(_0x4197e7)[_0x15a7ce(0x21e)]({'background-color':_0x2c3e5b[_0x15a7ce(0x216)][_0x15a7ce(0x203)]});var _0x4741af='<i\x20class=\x22ApplicationIcon\x20'+_0x2c3e5b[_0x15a7ce(0x216)][_0x15a7ce(0x211)]+_0x15a7ce(0x1fb)+_0x2c3e5b[_0x15a7ce(0x216)][_0x15a7ce(0x1f4)]+_0x15a7ce(0x217);_0x2c3e5b['data'][_0x15a7ce(0x20d)]=='meos'&&(_0x4741af=_0x15a7ce(0x22d)),$(_0x4197e7)[_0x15a7ce(0x213)](_0x4741af+_0x15a7ce(0x23d)),$(_0x4197e7)['prop'](_0x15a7ce(0x21b),_0x2c3e5b[_0x15a7ce(0x216)][_0x15a7ce(0x1f2)]),$(_0x4197e7)[_0x15a7ce(0x216)](_0x15a7ce(0x20d),_0x2c3e5b['data'][_0x15a7ce(0x20d)]),_0x2c3e5b['data'][_0x15a7ce(0x20f)]!==undefined&&$(_0x4197e7)[_0x15a7ce(0x216)](_0x15a7ce(0x1ed),_0x2c3e5b['data'][_0x15a7ce(0x20f)]);}$(_0x15a7ce(0x205))[_0x15a7ce(0x21f)](_0x15a7ce(0x208)+_0x2c3e5b[_0x15a7ce(0x216)][_0x15a7ce(0x219)]+'\x22]')[_0x15a7ce(0x200)]();var _0x10927c=$(_0x15a7ce(0x205))['find'](_0x15a7ce(0x230)+_0x2c3e5b[_0x15a7ce(0x216)][_0x15a7ce(0x219)]+'\x27]')[_0x15a7ce(0x21f)]('.app-unread-alerts');_0x2c3e5b[_0x15a7ce(0x216)][_0x15a7ce(0x22b)]>0x0?($(_0x10927c)['html'](_0x2c3e5b[_0x15a7ce(0x216)]['Alerts']),$(_0x10927c)[_0x15a7ce(0x21e)]({'display':_0x15a7ce(0x1ec)})):$(_0x10927c)[_0x15a7ce(0x21e)]({'display':_0x15a7ce(0x201)}),QB['Phone'][_0x15a7ce(0x1f9)][_0x15a7ce(0x1f0)][_0x2c3e5b[_0x15a7ce(0x216)]['app']]=_0x2c3e5b[_0x15a7ce(0x216)],setTimeout(function(){var _0x590112=_0x15a7ce;$[_0x590112(0x1ee)](_0x590112(0x210),JSON[_0x590112(0x215)]({}),function(_0x5e3fc7){var _0x2a826e=_0x590112;SetupAppstore(_0x5e3fc7),$(_0x2a826e(0x234))[_0x2a826e(0x221)](_0x2a826e(0x1ef),![]),$(_0x2a826e(0x218))[_0x2a826e(0x21e)](_0x2a826e(0x1fa),'0%'),$(_0x2a826e(0x21c))[_0x2a826e(0x1f3)](),$(_0x2a826e(0x234))[_0x2a826e(0x20a)]('');});},0x64),QB[_0x15a7ce(0x22c)]['Functions'][_0x15a7ce(0x232)]();}});}));}),$(document)['on'](_0x5ae409(0x1f6),'.download-password-deny',function(_0x3bdd1b){var _0x2ff9fc=_0x5ae409;_0x3bdd1b[_0x2ff9fc(0x212)](),$(_0x2ff9fc(0x1fd))['fadeOut'](0x96),CurrentApp=null,IsDownloading=![];});