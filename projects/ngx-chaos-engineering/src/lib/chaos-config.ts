import { InjectionToken, Provider, inject } from '@angular/core';
export const CHAOS_CONFIG = new InjectionToken<Partial<ChaosConfig>>('chaos.config', { factory: () => { return {}; } });

export type ChaosConfig = {
    chaosOn: boolean
    delay: number,
    failureChanceOutOf100: number 
};

export const provideChaosConfig = (config: Partial<ChaosConfig>): Provider => {
    return { provide: CHAOS_CONFIG, useValue: config }
}

export const getGetChaosConfig = (): ChaosConfig => {
    const configInput = inject(CHAOS_CONFIG);
    return {
        chaosOn: configInput.chaosOn ?? false,
        delay: configInput.delay ?? 2000,
        failureChanceOutOf100: configInput.failureChanceOutOf100 ?? 50
    }
}