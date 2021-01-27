Citizen.CreateThread(function()
	while true do
        --This is the Application ID (Replace this with you own)
		SetDiscordAppId(754408042380001357)

        --Here you will have to put the image name for the "large" icon.
		SetDiscordRichPresenceAsset('logo_mace')
        
        --(11-11-2018) New Natives:

        --Here you can add hover text for the "large" icon.
        SetDiscordRichPresenceAssetText('Penis roleplay for big bois' ..tostring(GetActivePlayers()))
       
        --Here you will have to put the image name for the "small" icon.
        SetDiscordRichPresenceAssetSmall('logo_mace')

        --Here you can add hover text for the "small" icon.
        SetDiscordRichPresenceAssetSmallText('Penis roleplay for big bois'..tostring(GetActivePlayers()))
        
        --It updates every one minute just in case.
		Citizen.Wait(60000)
	end
end)