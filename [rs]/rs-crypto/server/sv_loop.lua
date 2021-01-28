local coin = "dogecoin"
TriggerEvent('RSCore:GetObject', function(obj) RSCore = obj end)

Citizen.CreateThread(function() 
    FetchPrices()
    while true do 
            
            local trend = math.random(0,90)
            local newWorth = math.random(1, 50)
            UpdateCryptoTrend(trend, newWorth) 
            Citizen.Wait(900*1000)       
    end

end)

UpdateCryptoTrend = function(trend, change)    
    
    local newValue = Crypto.Worth[coin]
    
    Crypto.History[coin].PreviousWorth = Crypto.Worth[coin]
    if trend <= 33 then -- down
     newValue = Crypto.Worth[coin] - change
    elseif trend > 66 then --up
        newValue = Crypto.Worth[coin] + change
    else  
        newValue = Crypto.Worth[coin]
        return
    end
    
    if newValue < 0 then 
        newValue = 0
    end

   
    
    Crypto.Worth[coin] = newValue
    RSCore.Functions.ExecuteSql(false, "UPDATE `crypto` SET `worth` = '"..newValue.."', `history` = '"..json.encode(Crypto.History[coin]).."' WHERE `crypto` = '"..coin.."'")
    
end


function FetchPrices()
    RSCore.Functions.ExecuteSql(false, "SELECT * FROM `crypto` WHERE `crypto` = '"..coin.."'", function(result)
        if result[1] ~= nil then
            Crypto.Worth[coin] = result[1].worth
            if result[1].history ~= nil then
                Crypto.History[coin] = json.decode(result[1].history)
                TriggerClientEvent('rs-crypto:client:UpdateCryptoWorth', -1, coin, result[1].worth, json.decode(result[1].history))
            else
                TriggerClientEvent('rs-crypto:client:UpdateCryptoWorth', -1, coin, result[1].worth, nil)
            end
        end
    end)
end

