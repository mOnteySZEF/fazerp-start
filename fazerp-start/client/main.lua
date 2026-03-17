RegisterCommand('pomoc', function()
    TriggerEvent('fazerp:openStartMenu')
end)

RegisterNetEvent('fazerp:openStartMenu', function()
    while GetIsLoadingScreenActive() do
        Citizen.Wait(0)
    end

    SetNuiFocus(true, true)
    SendNUIMessage({
        action = 'open'
    })
end)

RegisterNUICallback('submit', function()   
    SetNuiFocus(false, false)
    SendNUIMessage({
        action = 'close'
    })
end)

RegisterNetEvent('fazerp:updatePlayerInfo', function (playerName)
    Citizen.Wait(750)
    
    SendNUIMessage({
        action = 'playerName',
        playerName = playerName
    })
end)