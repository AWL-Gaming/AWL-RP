import Core from 'urp-core';
import * as alt from 'alt-server';

import { CLOTH_STORES } from '../shared/config';

Core.Interactions.createMultipleInteractions(CLOTH_STORES)

alt.onClient('Skinshop:refresh', (source, ) => {
    alt.emitClient(source, 'Skinshop:UpdateClothes', JSON.stringify(Core.Character.getComponentVariations(source)))
})

alt.onClient('Skinshop:att', (source, i, component, color) => {
    source.setClothes(i, component, color)
})

alt.onClient('Skinshop:Closenobuy', (source, i, component, color) => {
    source.setClothes(i, component, color)
})
alt.onClient('Skinshop:Buy', (source, i, component, color) => {
    if (Core.Money.hasFullMoney(source, 250)) {
        source.setClothes(i, component, color)
        Core.Character.changeCloth(source, i, component, color)
        Core.Money.getPayment(source, 250)
        alt.emitClient(source, 'Skinshop:UpdateClothes', JSON.stringify(Core.Character.getComponentVariations(source)))
        alt.emitClient(source, 'Skinshop:close')

    } else {
        alt.emitClient(source, 'Skinshop:close')
        alt.emitClient(source, 'notify', 'error', 'erro', 'don`t money')
    }

})