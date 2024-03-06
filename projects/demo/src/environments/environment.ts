import { ChaosLoggingLevel, ChaosMode} from "ngx-chaos-engineering";

export const environment = {
     requestUrl: 'https://jsonplaceholder.typicode.com/todos/1' ,
     chaosConfig: {
        // chaosMode: ChaosMode.Off,
        // chaosMode: ChaosMode.Configured,
        chaosMode: ChaosMode.Controlled,
        delay: 3000,
        failureChanceOutOf100:  75,
        randomDelay: {
            min: 1000,
            max: 2000
        },
        loggingLevel: ChaosLoggingLevel.Debug
    }
};
