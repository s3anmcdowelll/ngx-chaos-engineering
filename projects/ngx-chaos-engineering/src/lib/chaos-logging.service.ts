import { Injectable, inject } from "@angular/core";
import { ChaosConfigService } from "./chaos-config.service";

@Injectable({providedIn: 'root'})
export class ChaosLoggingService{
    loggingLevel = inject(ChaosConfigService).chaosConfig.loggingLevel;

    logInfo (message: string)  {
        if(this.loggingLevel <= ChaosLoggingLevel.Info){
            this.log('INFO', message);
        }
    }
    
    logDebug(message: string) {
        if(this.loggingLevel <= ChaosLoggingLevel.Debug){
            this.log('DEBUG', message);
        }
    }

    log = (level: 'INFO' | 'DEBUG', message: string) => console.log(`ngx-chaos-engineering - ${ new Date().toISOString() } - ${level}: ${message}`)
}


export enum ChaosLoggingLevel {
    Debug,
    Info,
    None
}

