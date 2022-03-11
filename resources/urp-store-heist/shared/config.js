import * as alt from 'alt';

// export const STORE_HEIST = [
//     { x: -43.43, y: -1748.3, y: 29.42 , robbed: false},
//     { x: -1478.94, y: -375.5, y: 39.16, robbed: false },
//     { x: -1220.85, y: -916.05, y: 11.32, robbed: false },
//     { x: -709.74, y: -904.15, y: 19.21, robbed: false },
//     { x: 28.21, y: -1339.14, y: 29.49, robbed: false },
//     { x: 1126.77, y: -980.1, y: 45.41, robbed: false },
//     { x: 1159.46, y: -314.05, y: 69.2, robbed: false },
//     { x: 378.17, y: 333.44, y: 103.56, robbed: false },
//     { x: -1829.27, y: 798.76, y: 138.19, robbed: false },
//     { x: -2959.64, y: 387.08, y: 14.04, robbed: false },
//     { x: -3047.88, y: 585.61, y: 7.9, robbed: false },
//     { x: -3250.02, y: 1004.43, y: 12.83, robbed: false },
//     { x: 546.41, y: 2662.8, y: 42.15, robbed: false },
//     { x: 1169.31, y: 2717.79, y: 37.15, robbed: false },
//     { x: 2672.69, y: 3286.63, y: 55.24, robbed: false },
//     { x: 1959.26, y: 3748.92, y: 32.34, robbed: false },
//     { x: 1734.78, y: 6420.84, y: 35.03, robbed: false },
//     { x: -168.40, y: 6318.80, y: 30.58, robbed: false },
//     { x: 168.95, y: 6644.74, y: 31.70, robbed: false },
// ];

export const STOREHEIST_INTERACTIONS = [
    {
        x: -43.35,
        y: -1748.36,
        z: 29.41,
        type: 'Store Robbery',
        isServer: false,
        eventName: 'storeheist:open',
        blip: {
            sprite: 156,
            color: 1,
        },
        marker: {
            type: 1,
            color: new alt.RGBA(0, 181, 204, 200),
        },
        isrobbed: false,
    },
    {
        x: -1478.72,
        y: -375.16,
        z: 39.15,
        type: 'Store Robbery',
        isServer: false,
        eventName: 'storeheist:open',
        blip: {
            sprite: 156,
            color: 1,
        },
        marker: {
            type: 1,
            color: new alt.RGBA(0, 181, 204, 200),
        },
        isrobbed: false,
    },
];


export const MIN_COPS = 1;

export const timeout =  30 * (60 * 1000);