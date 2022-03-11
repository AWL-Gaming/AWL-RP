import Core from 'urp-core';
import * as natives from 'natives';
import * as alt from 'alt-client';

import { STOREHEIST_INTERACTIONS } from '../shared/config';

const localPlayer = alt.Player.local;
let isStarted = false;
let closestHeist;
let robberyCancel;

alt.onServer('storeheist:open', () => {
    robberyCancel = false;
    alt.emitServer('storeheist:enter');
});

alt.onServer('storeheist:waitreward', () => {
    closestHeist = getClosestStoreHeist();
    isStarted = true;
    alt.setTimeout(() => {
        if(!isStarted && robberyCancel) return;
        alt.emitServer('addStoreHeist:reward');
        isStarted = false;
    }, 0.5 * (60 * 1000));
});

alt.everyTick(async () => {
    if (!isStarted) return;
    const distanceToHeistSpot = localPlayer.pos.distanceTo(new alt.Vector3 (STOREHEIST_INTERACTIONS[closestHeist].x,STOREHEIST_INTERACTIONS[closestHeist].y,STOREHEIST_INTERACTIONS[closestHeist].z));
    if(distanceToHeistSpot >=20) {
        alt.emit('notify', 'important', 'Store Heist', 'Store Heist Cancelled.');
        isStarted = false;
        robberyCancel = true;
        alt.emitServer('storeHeist:disableTimer');
        return;
        }
});

const getClosestStoreHeist = () => {
    for (let i = 0; i < STOREHEIST_INTERACTIONS.length; i++) {
        const heistPos = new alt.Vector3(
            STOREHEIST_INTERACTIONS[i].x,
            STOREHEIST_INTERACTIONS[i].y,
            STOREHEIST_INTERACTIONS[i].z
        );
        const distanceToHeist = localPlayer.pos.distanceTo(heistPos);
        if (distanceToHeist <= 10) {
            return i;
        }
    }
    return false;
};
