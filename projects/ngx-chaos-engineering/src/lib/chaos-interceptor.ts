import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { throwError, delay, switchMap, tap, of, NEVER } from "rxjs";
import { ChaosLoggingService } from "./chaos-logging.service";
import { inject } from "@angular/core";
import { ChaosConfigService } from "./chaos-config.service";

export const chaosInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn)=>{
    const logger = inject(ChaosLoggingService);

    if (!shouldAddChaos()) {
        return next(req);
    }

    const delayMs = getDelay();
    const delay$ = of(NEVER).pipe(
        tap(()=>logger.logDebug(`begining ${delayMs}ms delay`)),
        delay(delayMs)
    );
    
    if (!isFailureChanceMet()) {
        return delay$.pipe(switchMap(() => next(req)));
    }

    return delay$
    .pipe(
        tap(()=>{
             logger.logInfo(`throwing artificial error for ${req.method} request to ${req.url}`)
            }),
        switchMap(() => throwError(() => new HttpErrorResponse(
            {
                error: { code: 500, description: 'Internal Server Error' },
                status: 500,
                statusText: 'Internal Server Error',
                url: req.url,
            }
            )))
    );
}

const getGetChaosConfig = () => inject(ChaosConfigService).chaosConfig;

const getDelay = () => {
    const config = getGetChaosConfig();
    if(config.randomDelay){
        return getRandomNumberInRange(config.randomDelay.min, config.randomDelay.max);
    }

    return config.delay;
}

const shouldAddChaos = () => getGetChaosConfig().chaosOn;

const isFailureChanceMet = () => getRandomNumberBetween1And100() <= getGetChaosConfig().failureChanceOutOf100;

const getRandomNumberBetween1And100 = () => getRandomNumberInRange(1, 100);

const getRandomNumberInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
