local Keys = {
	["ESC"] = 322, ["F1"] = 288, ["F2"] = 289, ["F3"] = 170, ["F5"] = 166, ["F6"] = 167, ["F7"] = 168, ["F8"] = 169, ["F9"] = 56, ["F10"] = 57,
	["~"] = 243, ["1"] = 157, ["2"] = 158, ["3"] = 160, ["4"] = 164, ["5"] = 165, ["6"] = 159, ["7"] = 161, ["8"] = 162, ["9"] = 163, ["-"] = 84, ["="] = 83, ["BACKSPACE"] = 177,
	["TAB"] = 37, ["Q"] = 44, ["W"] = 32, ["E"] = 38, ["R"] = 45, ["T"] = 245, ["Y"] = 246, ["U"] = 303, ["P"] = 199, ["["] = 39, ["]"] = 40, ["ENTER"] = 18,
	["CAPS"] = 137, ["A"] = 34, ["S"] = 8, ["D"] = 9, ["F"] = 23, ["G"] = 47, ["H"] = 74, ["K"] = 311, ["L"] = 182,
	["LEFTSHIFT"] = 21, ["Z"] = 20, ["X"] = 73, ["C"] = 26, ["V"] = 0, ["B"] = 29, ["N"] = 249, ["M"] = 244, [","] = 82, ["."] = 81,
	["LEFTCTRL"] = 36, ["LEFTALT"] = 19, ["SPACE"] = 22, ["RIGHTCTRL"] = 70,
	["HOME"] = 213, ["PAGEUP"] = 10, ["PAGEDOWN"] = 11, ["DELETE"] = 178,
	["LEFT"] = 174, ["RIGHT"] = 175, ["TOP"] = 27, ["DOWN"] = 173,
	["NENTER"] = 201, ["N4"] = 108, ["N5"] = 60, ["N6"] = 107, ["N+"] = 96, ["N-"] = 97, ["N7"] = 117, ["N8"] = 61, ["N9"] = 118
}

RSCore = nil

local DropOffs = {
	[1] =  { ['x'] = -145.58,['y'] = -1430.18,['z'] = 30.92,['h'] = 0.0, ['info'] = 'Innocence Boulevard 1'},
	[2] =  { ['x'] = -258.61,['y'] = -841.55,['z'] = 31.42,['h'] = 0.0, ['info'] = 'Carson Avenue 1'},
	[3] =  { ['x'] = 307.95,['y'] = -1286.47,['z'] = 30.52,['h'] = 0.0, ['info'] = 'Crusade Road 1'},
	[4] =  { ['x'] = 236.70,['y'] = -1869.21,['z'] = 26.90,['h'] = 0.0, ['info'] = 'Roy Lowenstein Boulevard 1'},
	[5] =  { ['x'] = 403.63,['y'] = -1929.85,['z'] = 24.74,['h'] = 0.0, ['info'] = 'Jamestown Street 1'},
	[6] =  { ['x'] = 485.74,['y'] = -943.33,['z'] = 27.13,['h'] = 0.0, ['info'] = 'Atlee Street 1'},
	[7] =  { ['x'] = 281.72,['y'] = -800.77,['z'] = 29.31,['h'] = 0.0, ['info'] = 'Strawberry Avenue 1'},
	[8] =  { ['x'] = -657.77,['y'] = -679.26,['z'] = 31.47,['h'] = 0.0, ['info'] = 'Palomino Avenue 1'},
	[9] =  { ['x'] = -814.18,['y'] = -1114.65,['z'] = 11.18,['h'] = 0.0, ['info'] = 'South Rockford Drive 1'},
	[10] =  { ['x'] = -697.63,['y'] = -1182.29,['z'] = 10.71,['h'] = 0.0, ['info'] = 'South Rockford Drive 2'},
	[11] =  { ['x'] = -1268.93,['y'] = -877.842,['z'] = 11.93,['h'] = 0.0, ['info'] = 'San Andreas 1'},
	[12] =  { ['x'] = -601.30,['y'] = 279.34,['z'] = 82.03,['h'] = 0.0, ['info'] = 'West Boulevard 1'},
	[13] =  { ['x'] = -257.57,['y'] = 245.03,['z'] = 91.87,['h'] = 0.0, ['info'] = 'West Boulevard 2'},
	[14] =  { ['x'] = -1469.06,['y'] = -197.62,['z'] = 48.83,['h'] = 0.0, ['info'] = 'Cougar Avenue 1'},
	[15] =  { ['x'] = -1580.60,['y'] = -34.07,['z'] = 57.56,['h'] = 0.0, ['info'] = 'Sam Austin Dr 1'},
	[16] =  { ['x'] = -458.23,['y'] = 264.30,['z'] = 83.14,['h'] = 0.0, ['info'] = 'Boulevard 1'},
	[17] =  { ['x'] = 751.50,['y'] = 223.92,['z'] = 87.42,['h'] = 0.0, ['info'] = 'Clinton Avenue 1'},
	[18] =  { ['x'] = 1199.87,['y'] = -501.53,['z'] = 65.17,['h'] = 0.0, ['info'] = 'Mirror Park Boulevard 1'},
}

local TacoShop = {
	[1] =  { ['x'] = 8.00,['y'] = -1604.92,['z'] = 29.37,['h'] = 0.0, ['info'] = 'Taco Shop'},
}
-- Code

Citizen.CreateThread(function() 
    while true do
        Citizen.Wait(1)
        if RSCore == nil then
            TriggerEvent("RSCore:GetObject", function(obj) RSCore = obj end)    
            Citizen.Wait(200)
        end
    end
end)

local JobBusy = false
local Tasks = false
local rnd = 0

Citizen.CreateThread(function()
while true do
	Citizen.Wait(0)
		for k,v in pairs(Config.JobStart) do
			local pos = GetEntityCoords(GetPlayerPed(-1), false)
            local Gebied = GetDistanceBetweenCoords(pos.x, pos.y, pos.z, v.x, v.y, v.z, false)
				if Gebied <= 1.5  and JobBusy == false and not IsPedInAnyVehicle(GetPlayerPed(-1), false) then
					if Config.JobData['tacos'] >= 1 then
					DrawText3D(v.x, v.y, v.z + 0.15, '~g~E~s~ - Werk\n Taco\'s Beschikbaar: ~g~' ..Config.JobData['tacos']..'x')
					DrawMarker(2, v.x, v.y, v.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.05, 0, 255, 0, 155, false, false, false, true, false, false, false)
					if IsControlJustPressed(0, Keys['E']) then
						JobBusy = true
						Config.JobData['tacos'] = Config.JobData['tacos'] - 1
						RSCore.Functions.TriggerCallback('rs-taco:server:start:black', function(result)
						end)
						-- TriggerServerEvent('rs-taco:server:start:black')
					end
					else
					DrawText3D(v.x, v.y, v.z + 0.15, '~r~Er zijn geen Taco\'s op voorraad')
					DrawMarker(2, v.x, v.y, v.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.05, 255, 0, 0, 155, false, false, false, true, false, false, false)
					end
				elseif Gebied <= 3.0 and JobBusy == true then
				 DrawText3D(v.x, v.y, v.z + 0.15, '~r~Je werkt al..\n ~s~Taco\'s Beschikbaar: ~g~' ..Config.JobData['tacos']..'x')
				 DrawMarker(2, v.x, v.y, v.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.05, 255, 0, 0, 155, false, false, false, true, false, false, false)
				elseif Gebied <= 3.0 and IsPedInAnyVehicle(GetPlayerPed(-1), false) then
					DrawText3D(v.x, v.y, v.z + 0.15, '~o~Je zit in een voertuig..\n ~s~Taco\'s Beschikbaar: ~g~' ..Config.JobData['tacos']..'x')
					DrawMarker(2, v.x, v.y, v.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.05, 230, 166, 78, 155, false, false, false, true, false, false, false)
				else
					Citizen.Wait(2000)
			end
		end
	end
end)

Citizen.CreateThread(function()
	while true do 
		Citizen.Wait(1)
		for k,v in pairs(Config.PickUpStuff) do
		local pos = GetEntityCoords(GetPlayerPed(-1), false)
		local Gebied = GetDistanceBetweenCoords(pos.x, pos.y, pos.z, v.x, v.y, v.z, false)
		if Gebied <= 1.5  and Config.JobBusy == false and not IsPedInAnyVehicle(GetPlayerPed(-1), false) then
			DrawText3D(v.x, v.y, v.z + 0.15, '~g~E~s~ - Pak een doos')
			DrawMarker(2, v.x, v.y, v.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.05, 0, 255, 0, 155, false, false, false, true, false, false, false)  
			if IsControlJustPressed(0, Keys['E']) then
				SetNewWaypoint(TacoShop[1]["x"], TacoShop[1]["y"])
				RSCore.Functions.TriggerCallback('rs-tacos:server:get:stuff', function(result)
				end)
				-- TriggerServerEvent('rs-tacos:server:get:stuff')
				RSCore.Functions.Notify("Lever de doos af bij de "..TacoShop[1]["info"], "success", 10000)
				Config.JobBusy = true
			end
		elseif Gebied <= 3.0 and Config.JobBusy == true then
			DrawText3D(v.x, v.y, v.z + 0.15, '~r~Je bent nog steeds bezig..')
			DrawMarker(2, v.x, v.y, v.z, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.05, 255, 0, 0, 155, false, false, false, true, false, false, false)
	 	end
     end
	end
end)

RegisterNetEvent('rs-taco:start:black:job')
AddEventHandler('rs-taco:start:black:job', function()
	rnd = math.random(1,#DropOffs)
	CreateBlip()
	RSCore.Functions.Notify("Lever deze bestelling af bij "..DropOffs[rnd]["info"], "success", 10000)
	RSCore.Functions.TriggerCallback("RSCore:AddItem", function(res)
	end, "taco-bag", 1)
	TriggerEvent("inventory:client:ItemBox", RSCore.Shared.Items["taco-bag"], "add")
	if Tasks then
		return
	end
	Tasks = true
	while Tasks do
		Citizen.Wait(1)
		local pos = GetEntityCoords(GetPlayerPed(-1), false)
		local Gebied = GetDistanceBetweenCoords(pos.x, pos.y, pos.z, DropOffs[rnd]["x"], DropOffs[rnd]["y"], DropOffs[rnd]["z"], false)
		if Gebied <= 5.0 then
			DrawText3D(DropOffs[rnd]["x"], DropOffs[rnd]["y"], DropOffs[rnd]["z"]+0.1, '~g~E~s~ - Bezorgen') 
			DrawMarker(2, DropOffs[rnd]["x"], DropOffs[rnd]["y"], DropOffs[rnd]["z"], 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.1, 0.1, 0.05, 255, 255, 255, 155, false, false, false, true, false, false, false)
				if IsControlJustReleased(0,38) then
					if not IsPedInAnyVehicle(GetPlayerPed(-1), false) then
						EndJob()
					else
			        	RSCore.Functions.Notify("U kunt niet leveren in uw voertuig..", "error")
				end
			end
		else
			Citizen.Wait(2000)
		end
	end
end)

RegisterNetEvent('rs-taco:client:set:taco:count')
AddEventHandler('rs-taco:client:set:taco:count', function(what, bool)
	Config.JobData[what] = bool
end)

RegisterNetEvent('rs-taco:client:set:register:count')
AddEventHandler('rs-taco:client:set:register:count', function(bool)
	Config.JobData['register'] = bool
end)

function Animatie()
	loadAnimDict( "mp_safehouselost@" )
    TaskPlayAnim( PlayerPedId(), "mp_safehouselost@", "package_dropoff", 8.0, 1.0, -1, 16, 0, 0, 0, 0 )
end

function loadAnimDict(dict)
    while (not HasAnimDictLoaded(dict)) do
        RequestAnimDict(dict)
        Citizen.Wait(5)
    end
end 

function DeleteBlip()
	if DoesBlipExist(blip) then
		RemoveBlip(blip)
	end
end

function CreateBlip()
	if JobBusy then
	blip = AddBlipForCoord(DropOffs[rnd]["x"],DropOffs[rnd]["y"],DropOffs[rnd]["z"])
	end
	SetNewWaypoint(DropOffs[rnd]["x"], DropOffs[rnd]["y"])
	SetBlipSprite(blip, 501)
	SetBlipScale(blip, 0.9)
	SetBlipColour(blip, 48) 
    SetBlipAsShortRange(blip, false)
    BeginTextCommandSetBlipName("STRING")
    AddTextComponentString("Bezorg Adres")
    EndTextCommandSetBlipName(blip)
end

function EndJob()
	local laundryChance = math.random(1,1000)

	RSCore.Functions.TriggerCallback('RSCore:HasItem', function(HasItem)
		if JobBusy == true and HasItem then
			Tasks = false
			JobBusy = false
			HasLaundryItem = false
			RSCore.Functions.TriggerCallback('RSCore:HasItem', function(result)
				HasLaundryItem = result
			end, 'cash_roll')
			TriggerServerEvent("InteractSound_SV:PlayOnSource", "doorbell", 0.15)
			Citizen.Wait(1000)
			Animatie()
			Citizen.Wait(800)
			DeleteBlip()
			if laundryChance <= Config.LaundryChance and HasLaundryItem then
				TriggerServerEvent('RSCore:Server:RemoveItem', "cash_roll", 1)
				TriggerEvent("inventory:client:ItemBox", RSCore.Shared.Items["cash_roll"], "remove")
				RSCore.Functions.TriggerCallback('rs-taco:server:reward:laundrymoney', function()
				end)
			else
				RSCore.Functions.TriggerCallback('rs-taco:server:reward:money', function(result)
				end)
				Config.JobData['register'] = Config.JobData['register'] + math.random(100,200)
			end
			-- TriggerServerEvent('rs-taco:server:reward:money', true)
			TriggerServerEvent('RSCore:Server:RemoveItem', "taco-bag", 1)
			TriggerEvent("inventory:client:ItemBox", RSCore.Shared.Items["taco-bag"], "remove")
		else
			RSCore.Functions.Notify("Je hebt de bestelling niet eens meegenomen..", "error")
		end 
 	end, 'taco-bag')
end

-- Functions 

DrawText3D = function(x, y, z, text)
	local onScreen,_x,_y=World3dToScreen2d(x,y,z)
	local px,py,pz=table.unpack(GetGameplayCamCoords())
	local scale = 0.30
	if onScreen then
		SetTextScale(scale, scale)
		SetTextFont(4)
		SetTextProportional(1)
		SetTextColour(255, 255, 255, 215)
		SetTextOutline()
		SetTextEntry("STRING")
		SetTextCentre(1)
		AddTextComponentString(text)
        DrawText(_x,_y)
	end
end