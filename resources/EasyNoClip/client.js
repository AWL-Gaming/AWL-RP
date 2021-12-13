/// <reference types="@altv/types-client"/>
/// <reference types="@altv/types-natives"/>

import * as alt from 'alt-client';
import * as native from 'natives';

const player = alt.Player.local;

let arraynum = 4

let NoClipActive = false;

let wasinvehicle = false

let NoCE

let rotation = 0


const NoClipSpeed = [0, 0.125, 0.25, 0.5, 1, 1.5, 2, 4, 0]


alt.on('keyup', (key) => {
    if(key == 116) { // F5
        NoClip()
    }
})

function arraynumberplus() {

    arraynum++

    if (arraynum == 8) arraynum = 1 
    Notify('~b~Speed: ' +arraynum)

}

function arraynumberminus() {

    arraynum--

    if (arraynum == 0) arraynum = 7 
    Notify('~b~Speed: ' +arraynum)
}

alt.everyTick(() => {

    if (!NoClipActive) {
        
        prerot = native.getEntityRotation(player.scriptID, 2)

        rotation = prerot.z
        
    }

    if (NoClipActive) {

        let SelectedSpeed

        let yoff = 0.0

        let xoff = 0.0

        let zoff = 0.0


        native.disableControlAction(0, 32, true); // w
        native.disableControlAction(0, 33, true); // s
        native.disableControlAction(0, 34, true); // a
        native.disableControlAction(0, 35, true); // d
        native.disableControlAction(0, 22, true); // space
        native.disableControlAction(0, 21, true); // shift
        native.disableControlAction(0, 268, true); // MoveUP
        native.disableControlAction(0, 269, true); // MoveDown
        native.disableControlAction(0, 266, true); // MoveLeft
        native.disableControlAction(0, 267, true); // MoveRight
        native.disableControlAction(0, 31, true); // MoveUD
        native.disableControlAction(0, 30, true); // MoveLR
        native.disableControlAction(0, 44, true); // Cover Q
        native.disableControlAction(0, 85, true); // RadioWheel Q
        native.disableControlAction(0, 86, true); // Horn E
        native.disableControlAction(0, 74, true); // HeadLight


        SelectedSpeed = NoClipSpeed[arraynum]


        if (native.updateOnscreenKeyboard() !== 0 && alt.isGameFocused) {


            
            var prerot

            if (native.isDisabledControlPressed(0, 44)) rotation += 5

            if (native.isDisabledControlPressed(0, 86)) rotation -= 5
     
            if (native.isDisabledControlPressed(0, 32)) yoff = 1 * SelectedSpeed

            if (native.isDisabledControlPressed(0, 33)) yoff = -1 * SelectedSpeed

            if (native.isDisabledControlPressed(0, 34)) xoff = -1 * SelectedSpeed

            if (native.isDisabledControlPressed(0, 35)) xoff = 1 * SelectedSpeed

            if (native.isDisabledControlPressed(0, 22)) zoff = 1 * SelectedSpeed

            if (native.isDisabledControlPressed(0, 21)) zoff = -1 * SelectedSpeed

        }


        


        if (wasinvehicle == true) {

            if(!player.vehicle) {
                
                native.freezeEntityPosition(NoCE, false)

                native.setEntityCollision(NoCE, true, true)

                native.setVehicleGravity(NoCE, true)
                
                NoClipActive = false

            }

        }
        

        let newPosition

        newPosition = native.getOffsetFromEntityInWorldCoords(NoCE, xoff, yoff, zoff)
        
        native.setEntityRotation(NoCE, 0, 0, rotation, 0, false);
        native.setEntityCoordsNoOffset(NoCE, newPosition.x, newPosition.y, newPosition.z, true, true, true);

    }


})


function NoClip() {

    NoClipActive = !NoClipActive

    if (player.vehicle) {
        NoCE = player.vehicle.scriptID
        wasinvehicle = true
    } else {NoCE = player.scriptID
        wasinvehicle = false
    }
    

    if(NoClipActive) {

        if (player.vehicle) native.setVehicleGravity(NoCE, false)

        native.setEntityInvincible(player.scriptID, true)

        native.freezeEntityPosition(NoCE, true)

        native.setEntityCollision(NoCE, false, false)

        alt.emitServer('EasyNoClip:On')

    } else {
        native.freezeEntityPosition(NoCE, false)

        native.setEntityInvincible(player.scriptID, false)

        native.setEntityCollision(NoCE, true, true)

        if (player.vehicle) {

            native.setVehicleGravity(NoCE, true)
            native.setVehicleForwardSpeed(NoCE, 0.0)
            native.setVehicleForwardSpeed(NoCE, -0.01)
        }

        alt.emitServer('EasyNoClip:Off')
    }

}

alt.onServer('EasyNoClip:SpeedMinus', () => {

    arraynumberminus()
})

alt.onServer('EasyNoClip:SpeedPlus', () => {

    arraynumberplus()
})

alt.onServer('EasyNoClip:Notify', (message) => {
    Notify(message)
})

function Notify(message) {
    const textEntry = `TEXT_ENTRY_${(Math.random() * 1000).toFixed(0)}`;
    alt.addGxtText(textEntry, message);
    native.beginTextCommandThefeedPost('STRING');
    native.addTextComponentSubstringTextLabel(textEntry);
    native.endTextCommandThefeedPostTicker(false, false);
}