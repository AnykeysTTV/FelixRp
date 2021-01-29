let _berichten =[];
function SetupNieuwsApp()
{
    
    $.getJSON('http://127.0.0.1/nieuws/nieuws.json', function(data)
    {
        for(let i in data)
            _berichten.push(data);
    });
    console.log(_berichten.length);
    if (_berichten.length > 0 ) {
        $.each(_berichten, function(i, data){
            // var element = '<div class="politie-list" id="politieid-'+i+'"> <div class="politie-list-firstletter">' + (politie.name).charAt(0).toUpperCase() + '</div> <div class="politie-list-fullname">' + politie.name + '</div> <div class="politie-list-call"><i class="fas fa-phone"></i></div> </div>'
            // $(".polities-list").append(element);
            // $("#politieid-"+i).data('politieData', politie);
            console.log(data.date);
        });
    }
    
}


