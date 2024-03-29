RSCore = nil
TriggerEvent('RSCore:GetObject', function(obj) RSCore = obj end)

local PaymentTax = 15
local Bail = {}

RegisterServerEvent('rs-tow:server:DoBail')
AddEventHandler('rs-tow:server:DoBail', function(bool, vehInfo)
    local src = source
    local Player = RSCore.Functions.GetPlayer(src)

    if bool then
        if Player.PlayerData.money.cash >= Config.BailPrice then
            Bail[Player.PlayerData.citizenid] = Config.BailPrice
            Player.Functions.RemoveMoney('cash', Config.BailPrice, "tow-paid-bail")
            TriggerClientEvent('RSCore:Notify', src, 'Je hebt de borg van 1000,- betaald', 'success')
            TriggerClientEvent('rs-tow:client:SpawnVehicle', src, vehInfo)
        elseif Player.PlayerData.money.bank >= Config.BailPrice then
            Bail[Player.PlayerData.citizenid] = Config.BailPrice
            Player.Functions.RemoveMoney('bank', Config.BailPrice, "tow-paid-bail")
            TriggerClientEvent('RSCore:Notify', src, 'Je hebt de borg van 1000,- betaald', 'success')
            TriggerClientEvent('rs-tow:client:SpawnVehicle', src, vehInfo)
        else
            TriggerClientEvent('RSCore:Notify', src, 'Je hebt niet genoeg contant, de borg is 1000,-', 'error')
        end
    else
        if Bail[Player.PlayerData.citizenid] ~= nil then
            Player.Functions.AddMoney('cash', Bail[Player.PlayerData.citizenid], "tow-bail-paid")
            Bail[Player.PlayerData.citizenid] = nil
            TriggerClientEvent('RSCore:Notify', src, 'Je hebt de borg van 1000,- terug gekregen', 'success')
        end
    end
end)

RegisterNetEvent('rs-tow:server:11101110')
AddEventHandler('rs-tow:server:11101110', function()
    RSCore.Functions.BanInjection(source, 'rs-tow (11101110)')
end)

RSCore.Functions.CreateCallback('rs-tow:11101110', function(source, cb, drops)
    local src = source 
    local Player = RSCore.Functions.GetPlayer(src)
    local drops = tonumber(drops)
    local bonus = 0
    local DropPrice = math.random(450, 700)
    if drops > 5 then 
        bonus = math.ceil((DropPrice / 100) * 5)
    elseif drops > 10 then
        bonus = math.ceil((DropPrice / 100) * 7)
    elseif drops > 15 then
        bonus = math.ceil((DropPrice / 100) * 10)
    elseif drops > 20 then
        bonus = math.ceil((DropPrice / 100) * 12)
    end
    local price = (DropPrice * drops) + bonus
    local taxAmount = math.ceil((price / 100) * PaymentTax)
    local payment = price - taxAmount

    Player.Functions.AddJobReputation(1)
    Player.Functions.AddMoney("bank", payment, "tow-salary")
    TriggerClientEvent('chatMessage', source, "BAAN", "warning", "Je hebt je salaris ontvangen van: €"..payment..", bruto: €"..price.." (waarvan €"..bonus.." bonus) en €"..taxAmount.." belasting ("..PaymentTax.."%)")

end)

RSCore.Commands.Add("npc", "Toggle npc baan optie", {}, false, function(source, args)
	TriggerClientEvent("jobs:client:ToggleNpc", source)
end)

RSCore.Commands.Add("tow", "Zet een wagen op de achterkant van je flatbed", {}, false, function(source, args)
    local Player = RSCore.Functions.GetPlayer(source)
    if Player.PlayerData.job.name == "tow" then
        TriggerClientEvent("rs-tow:client:TowVehicle", source)
    end
end)

