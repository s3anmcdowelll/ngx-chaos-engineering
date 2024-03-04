import { InjectionToken } from '@angular/core';
export const CHAOS_CONFIG = new InjectionToken<ChaosConfig>('chaos.config');

export type ChaosConfig = Partial<{
    chaosOn: boolean
    delay: number,
    failureChanceOutOf100: number 
}>