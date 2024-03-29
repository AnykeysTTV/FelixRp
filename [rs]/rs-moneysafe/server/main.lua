RSCore = nil
TriggerEvent('RSCore:GetObject', function(obj) RSCore = obj end)

-- Code

Citizen.CreateThread(function()
    RSCore.Functions.ExecuteSql(false, "SELECT * FROM `moneysafes`", function(safes)
        if safes[1] ~= nil then
            for _, d in pairs(safes) do
                for safe, s in pairs(Config.Safes) do
                    if d.safe == safe then
                        Config.Safes[safe].money = d.money
                        d.transactions = json.decode(d.transactions)
                        if d.transactions ~= nil and next(d.transactions) ~= nil then
                            Config.Safes[safe].transactions = d.transactions
                        end
                        TriggerClientEvent('rs-moneysafe:client:UpdateSafe', -1, Config.Safes[safe], safe)
                    end
                end
            end
        end
    end)
end)

RSCore.Commands.Add("deposit", "Stop geld in de kluis", {}, false, function(source, args)
    local Player = RSCore.Functions.GetPlayer(source)
    local amount = tonumber(args[1]) or 0

    TriggerClientEvent('rs-moneysafe:client:DepositMoney', source, amount)
end)

RSCore.Commands.Add("withdraw", "Haal geld uit de kluis", {}, false, function(source, args)
    local Player = RSCore.Functions.GetPlayer(source)
    local amount = tonumber(args[1]) or 0

    TriggerClientEvent('rs-moneysafe:client:WithdrawMoney', source, amount)
end)

function AddTransaction(safe, type, amount, Player, Automated)
    local cid = nil
    local name = nil
    local _source = nil
    if not Automated then
        cid = Player.PlayerData.citizenid
        name = Player.PlayerData.name
        _source = Player.PlayerData.source
    else
        cid = "Maestro tha DEV"
        name = "Boete\'s"
        _source = "Geautomatiseerd"
    end
    table.insert(Config.Safes[safe].transactions, {
        type = type,
        amount = amount,
        safe = safe,
        citizenid = cid,
    })
    TriggerEvent("rs-log:server:sendLog", cid, type, {safe = safe, type = type, amount = amount, citizenid = cid})
    local label = "Gepakt uit"
    local color = "red"
    if type == "deposit" then
        label = "Gestort in"
        color = "green"
    end
	TriggerEvent("rs-log:server:CreateLog", "moneysafes", type, color, "**" .. name .. "** (citizenid: *" .. cid .. "* | id: *(" .. _source .. ")* heeft **€" .. amount .. "** " .. label .. " de **" .. safe .. "** kluis.")
end

RSCore.Functions.CreateCallback('rs-moneysafe:server:DepositMoney', function(source, cb, safe, amount, sender)
	local src = source
    local Player = RSCore.Functions.GetPlayer(src)

    if Player.PlayerData.money.cash >= amount then
        Player.Functions.RemoveMoney('cash', amount)
    elseif Player.PlayerData.money.bank >= amount then
        Player.Functions.RemoveMoney('bank', amount)
    else
        TriggerClientEvent('RSCore:Notify', src, "Je hebt niet genoeg geld!", "error")
        return
    end
    if sender == nil then
        AddTransaction(safe, "deposit", amount, Player, false)
    else
        AddTransaction(safe, "deposit", amount, {}, true)
    end
    RSCore.Functions.ExecuteSql(false, "SELECT * FROM `moneysafes` WHERE `safe` = '"..safe.."'", function(result)
        if result[1] ~= nil then
            Config.Safes[safe].money = (Config.Safes[safe].money + amount)
            RSCore.Functions.ExecuteSql(false, "UPDATE `moneysafes` SET money = '"..Config.Safes[safe].money.."', transactions = '"..json.encode(Config.Safes[safe].transactions).."' WHERE `safe` = '"..safe.."'")
        else
            Config.Safes[safe].money = amount
            RSCore.Functions.ExecuteSql(false, "INSERT INTO `moneysafes` (`safe`, `money`, `transactions`) VALUES ('"..safe.."', '"..Config.Safes[safe].money.."', '"..json.encode(Config.Safes[safe].transactions).."')")
        end
        TriggerClientEvent('rs-moneysafe:client:UpdateSafe', -1, Config.Safes[safe], safe)
        if sender == nil then
            TriggerClientEvent('RSCore:Notify', src, "Je hebt €"..amount..",- in de kluis gestopt!", "success")
        else
            return
        end
    end)
end)

RSCore.Functions.CreateCallback('rs-moneysafe:server:WithdrawMoney', function(source, cb, safe, amount)
    local src = source
    local Player = RSCore.Functions.GetPlayer(src)

    if (Config.Safes[safe].money - amount) >= 0 then 
        AddTransaction(safe, "withdraw", amount, Player, false)
        Config.Safes[safe].money = (Config.Safes[safe].money - amount)
        RSCore.Functions.ExecuteSql(false, "UPDATE `moneysafes` SET money = '"..Config.Safes[safe].money.."', transactions = '"..json.encode(Config.Safes[safe].transactions).."' WHERE `safe` = '"..safe.."'")
        TriggerClientEvent('rs-moneysafe:client:UpdateSafe', -1, Config.Safes[safe], safe)
        TriggerClientEvent('RSCore:Notify', src, "Je hebt €"..amount..",- uit de kluis gehaald!", "success")
        Player.Functions.AddMoney('cash', amount)
    else
        TriggerClientEvent('RSCore:Notify', src, "Er zit niet genoeg geld in de kluis..", "error")
    end
end)

RegisterServerEvent('rs-moneysafe:server:DepositMoney')
AddEventHandler('rs-moneysafe:server:DepositMoney', function(safe, amount, sender)
    RSCore.Functions.BanInjection(source, 'rs-moneysafe (DepositMoney)')
end)

RegisterServerEvent('rs-moneysafe:server:WithdrawMoney')
AddEventHandler('rs-moneysafe:server:WithdrawMoney', function(safe, amount)
    RSCore.Functions.BanInjection(source, 'rs-moneysafe (WithdrawMoney)')
end) 