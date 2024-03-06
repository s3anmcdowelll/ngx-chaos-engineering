import { Injectable, InjectionToken, Provider, inject } from '@angular/core';
import { ChaosLoggingLevel } from './chaos-logging.service';

@Injectable({providedIn: 'root'})
export class ChaosConfigService{
    chaosConfig: ChaosConfig;

    constructor(){
        const configInput = inject(CHAOS_CONFIG);
        
        this.chaosConfig = {
            chaosMode: configInput.chaosMode ?? ChaosMode.Off,
            delay: configInput.delay ?? 2000,
            failureChanceOutOf100: configInput.failureChanceOutOf100 ?? 50,
            randomDelay: configInput.randomDelay ?? null,
            loggingLevel: configInput.loggingLevel ?? ChaosLoggingLevel.Info
        }
    }
}
export const CHAOS_CONFIG = new InjectionToken<Partial<ChaosConfig>>('chaos.config', { factory: () => { return {}; } });

export type ChaosConfig = {
    chaosMode: ChaosMode
    delay: number,
    randomDelay: {
        min: number,
        max: number
    } | null,
    failureChanceOutOf100: number,
    loggingLevel: ChaosLoggingLevel
};

export const provideChaosConfig = (config: Partial<ChaosConfig>): Provider => {
    return { provide: CHAOS_CONFIG, useValue: config }
}

export enum ChaosMode{
    Off,
    Configured,
    Controlled
}