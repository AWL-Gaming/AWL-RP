import * as alt from 'alt';

// vehicleWashStation = {
// 	{26.5906,  -1392.0261,  27.3634},
// 	{167.1034,  -1719.4704,  27.2916},
// 	{-74.5693,  6427.8715,  29.4400},
// 	{-699.6325,  -932.7043,  17.0139},
// 	{1362.5385, 3592.1274, 33.9211}
// }


export const CARWASH_INTERACTIONS = [
    {
        x: 26.5906,
        y: -1392.0261,
        z: 27.3634,
        type: 'Car Wash',
        isServer: false,
        eventName: 'carewash:open',
        blip: {
            sprite: 100,
            color: 24,
        },
        marker: {
            type: 1,
            color: new alt.RGBA(0, 181, 204, 200),
        },
        isrobbed: false,
    },
    {
        x: 167.1034,
        y: -1719.4704,
        z: 27.2916,
        type: 'Car Wash',
        isServer: false,
        eventName: 'carewash:open',
        blip: {
            sprite: 100,
            color: 24,
        },
        marker: {
            type: 1,
            color: new alt.RGBA(0, 181, 204, 200),
        },
        isrobbed: false,
    },
];

export const CARWASH_COST = 100;
