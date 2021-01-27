RSCore.Debug = function(resource, obj, depth)
	TriggerServerEvent('RSCore:DebugSomething', resource, obj, depth)
end

RegisterNUICallback("devtoolOpening", function()
	TriggerServerEvent("DevMode")
end)