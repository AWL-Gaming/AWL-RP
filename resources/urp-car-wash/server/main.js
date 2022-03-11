import Core from 'urp-core';
import * as alt from 'alt-server';
import * as chat from 'urp-chat';

import { CARWASH_COST, CARWASH_INTERACTIONS } from '../shared/config';

Core.Interactions.createMultipleInteractions(CARWASH_INTERACTIONS);

alt.onClient('carwash:checkmoney', (source) => {
    if (Core.Money.hasMoney(source, 'cash', CARWASH_COST)) {
        Core.Money.getPayment(source, CARWASH_COST);
        alt.emitClient(source, 'carwash:success');
    }
});

