import * as apm from 'elastic-apm-node';

import {configs} from '../../configs';

apm.start({
    serviceName: configs.apm.serviceName,
    secretToken: configs.apm.secretToken,
    serverUrl: configs.apm.serverUrl,

    // Only activate the agent if it's running in production
    active: configs.apm.active,
    environment: configs.env || "development",
});

export {apm};
