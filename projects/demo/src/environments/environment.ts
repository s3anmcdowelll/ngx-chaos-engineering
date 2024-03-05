import { ChaosLoggingLevel } from "../../../ngx-chaos-engineering/src/lib/chaos-logging.service";

export const environment = {
     requestUrl: 'https://httpstat.us/200' ,
     chaosConfig: {
        chaosOn: true,
        delay: 3000,
        failureChanceOutOf100:  75,
        randomDelay: {
            min: 1000,
            max: 2000
        },
        loggingLevel: ChaosLoggingLevel.Debug
    }
};
