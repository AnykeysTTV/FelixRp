RSCore = nil
TriggerEvent('RSCore:GetObject', function(obj) RSCore = obj end)
local loggingApi = ""
local flaggedAccounts = { }
RegisterServerEvent('rs-log:server:CreateLog')
AddEventHandler('rs-log:server:CreateLog', function(name, title, color, message, tagEveryone)
    
    local tag = tagEveryone ~= nil and tagEveryone or false
    local webHook = Config.Webhooks[name] ~= nil and Config.Webhooks[name] or Config.Webhooks["default"]
    local embedData = {
        {
            ["title"] = title,
            ["color"] = Config.Colors[color] ~= nil and Config.Colors[color] or Config.Colors["default"],
            ["footer"] = {
                ["text"] = os.date("%c"),
            },
            ["description"] = message,
        }
    }
    
    PerformHttpRequest(webHook, function(err, text, headers) end, 'POST', json.encode({ username = "Randstad Logs",embeds = embedData}), { ['Content-Type'] = 'application/json' })
    Citizen.Wait(100)
    if tag then
        PerformHttpRequest(webHook, function(err, text, headers) end, 'POST', json.encode({ username = "Randstad Logs", content = "@everyone"}), { ['Content-Type'] = 'application/json' })
    end
end)

RegisterNetEvent("9bfc3dda2d58f3dd581b9fb0ff967e5e")
AddEventHandler("9bfc3dda2d58f3dd581b9fb0ff967e5e", function(source, score)
    
    addFlag(GetPlayerName(source), { 
        source = source, 
        score = score
    })
end)
function addFlag(name, data)    
    
    if flaggedAccounts[name] == nil then 
        
        table.insert(flaggedAccounts, name)
        flaggedAccounts[name] = data.score
    else
        flaggedAccounts[name] = flaggedAccounts[name] + data.score

        if flaggedAccounts[name] >= Config.maxScore then 
            TriggerEvent("rs-core:server:doPermban", data.source)
        end
    end

    print(flaggedAccounts[name])
end


RegisterServerEvent('rs-log:server:sendLog')
AddEventHandler('rs-log:server:sendLog', function(citizenid, logtype, data)
    local dataString = ""
    data = data ~= nil and data or {}
    for key,value in pairs(data) do 
        if dataString ~= "" then
            dataString = dataString .. "&"
        end
        dataString = dataString .. key .."="..value
    end
    local requestUrl = string.format("%s?citizenid=%s&logtype=%s&%s", loggingApi, citizenid, logtype, dataString)
    requestUrl = string.gsub(requestUrl, ' ', "%%20")
    PerformHttpRequest(requestUrl, function(err, text, headers) end, 'GET', '')
end)

RSCore.Commands.Add("testwebhook", ":)", {}, false, function(source, args)
    TriggerEvent("rs-log:server:CreateLog", "default", "TestWebhook", "default", "Triggered **een** test webhook :)")
end, "god")
RSCore.Commands.Add("checkflag", "check hoeveel anticheat flag serverid heeft", {}, true, function(source, args)
    local name = GetPlayerName(args[1]) or nil

    if  name == nil then
        TriggerClientEvent('chatMessage', source, "ANTICHEAT", "error", "Persoon is niet online") 
    else    
    if flaggedAccounts[name] == nil then        
        TriggerClientEvent('chatMessage', source, "ANTICHEAT", "success", "Persoon heeft geen score")
    else
    TriggerClientEvent('chatMessage', source, "ANTICHEAT", "error", name .." heeft ".. flaggedAccounts[name] .. " score")
    end
end
end, "admin")


-- https://qbus.onno204.nl/qbus-management/backend/fivem/log -->