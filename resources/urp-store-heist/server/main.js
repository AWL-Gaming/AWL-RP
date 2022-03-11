import Core from 'urp-core';
import * as alt from 'alt-server';
import * as chat from 'urp-chat';

import { MIN_COPS, timeout, STOREHEIST_INTERACTIONS } from '../shared/config';
let closestHeist;
alt.onClient('addStoreHeist:reward', (source) => {
    Core.Money.addMoney(source, 'cash', 25);
    alt.emitClient(source, 'notify', 'success', 'payment', 'you received $25');
    alt.setTimeout(() => {
        STOREHEIST_INTERACTIONS[closestHeist].robberywait = false;
    }, timeout);
});

alt.onClient('storeHeist:disableTimer', (source) => {
    alt.emit('Core:Emergency:Alert', source, 'police', 'Store robbery has been canceled')
    STOREHEIST_INTERACTIONS[closestHeist].robberywait = false;
});

Core.Interactions.createMultipleInteractions(STOREHEIST_INTERACTIONS);

const getClosestStoreHeist = (source) => {
    for (let i = 0; i < STOREHEIST_INTERACTIONS.length; i++) {
        const heistPos = new alt.Vector3(
            STOREHEIST_INTERACTIONS[i].x,
            STOREHEIST_INTERACTIONS[i].y,
            STOREHEIST_INTERACTIONS[i].z
        );
        const distanceToHeist = source.pos.distanceTo(heistPos);
        if (distanceToHeist <= 10) {
            return i;
        }
    }
    return false;
};

const enterStoreHeist = async (source) => {
    closestHeist = getClosestStoreHeist(source);
    let availablecops = 0;
    if (!source || !source.valid) {
        return;
    }
    const playerList = alt.Player.all;
    playerList.forEach((player) => {
        const playerjob = Core.Functions.getPlayerData(player, 'job');
        if (playerjob.name === "police" && playerjob.onDuty) availablecops = availablecops + 1;
    });
    if(availablecops >= MIN_COPS) {
        if(!STOREHEIST_INTERACTIONS[closestHeist].robberywait){
            STOREHEIST_INTERACTIONS[closestHeist].robberywait = true;
            chat.broadcast(`{5555AA}LAW & ORDER {FFFFFF}Store Heist Stated`);
            alt.emit('Core:Emergency:Alert', source, 'police', 'robbery in progress at the store')
            alt.emitClient(source, 'storeheist:waitreward');
        }else {
            alt.emitClient(source, 'notify', 'error', 'Store Heist', 'Store Heist On Hold, wait for cooldown.');
            return;
        }
    }else {
        alt.emitClient(source, 'notify', 'error', 'Store Heist', 'No available Cops in the city');
    }
};

alt.onClient('storeheist:enter', enterStoreHeist);
