import Core from 'urp-core';
import * as natives from 'natives';
import * as alt from 'alt-client';


let isStarted = false;
let timer = 1000;
let particles;
let particles2;
let car;

alt.onServer('carewash:open', () => {
    if(isStarted) return;
    isStarted = true;
    alt.emitServer('carwash:checkmoney');
});

alt.onServer('carwash:success', () => {
    car = natives.getVehiclePedIsUsing(natives.playerPedId());
	let coords = natives.getEntityCoords(natives.playerPedId(), true);

    natives.freezeEntityPosition(car, true);

	if(!natives.hasNamedPtfxAssetLoaded("core")){
        natives.requestNamedPtfxAsset("core")
        while(!natives.hasNamedPtfxAssetLoaded("core")) {
            alt.setTimeout(() => {
            },200);
        }
    }

    natives.useParticleFxAsset("core");
	particles  = natives.startParticleFxLoopedAtCoord("ent_amb_waterfall_splash_p", coords.x, coords.y, coords.z, 0.0, 0.0, 0.0, 1.0, false, false, false, false);
	particles2  = natives.startParticleFxLoopedAtCoord("ent_amb_waterfall_splash_p", coords.x + 2, coords.y, coords.z, 0.0, 0.0, 0.0, 1.0, false, false, false, false);
});

alt.everyTick(async () => {
    if (!isStarted) return;
    if(timer > 0){  
        Core.Utils.drawText2D(
            `${(timer / 1000).toFixed(2)}s to complete`,
            { x: 0.5, y: 0.955 },
            0.35,
            { r: 255, g: 255, b: 255, a: 215 },
            0
        );
    }else if(timer == 0){
        natives.setVehicleDirtLevel(car, 0.1);
        natives.freezeEntityPosition(car, false);
        alt.emit('notify', 'success', 'Car Wash', 'Your vehicle has been cleaned!.');
        natives.stopParticleFxLooped(particles, 0);
        natives.stopParticleFxLooped(particles2, 0);
        natives.washDecalsFromVehicle(car, 1.0);
        isStarted = false;
    }
    timer = timer - 1
});

