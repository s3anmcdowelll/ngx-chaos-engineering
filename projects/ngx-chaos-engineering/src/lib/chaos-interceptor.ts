import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { throwError, delay, switchMap, tap, of, NEVER, forkJoin, Subject } from "rxjs";
import { ChaosLoggingService } from "./chaos-logging.service";
import { inject } from "@angular/core";
import { ChaosConfigService, ChaosMode } from "./chaos-config.service";
import { ChaosTrackingService } from "./chaos-tracking.service";

export const chaosInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn)=>{
    const logger = inject(ChaosLoggingService);
    const tracker = inject(ChaosTrackingService);

    if (shouldTrackChaos()){
        return handleTrackedChaos(logger, tracker, req, next);
    }

    if (!shouldAddConfiguredChaos()) {
        return next(req);
    }

    return handleConfiguredChaos(logger, req, next);
}

const handleConfiguredChaos = (logger: ChaosLoggingService, req: HttpRequest<unknown>, next: HttpHandlerFn) => {
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
        switchMap(() => fail(logger, req))
    );
}

const handleTrackedChaos = (logger: ChaosLoggingService, tracker: ChaosTrackingService, req: HttpRequest<unknown>, next: HttpHandlerFn) => {
    return tracker.trackRequest(req).pipe(
        switchMap((chaosCommand) => {
            if (chaosCommand.fail) {
                return fail(logger, req);
            }
            return next(req);
        })
    );
}

const fail = (logger: ChaosLoggingService, req: HttpRequest<unknown>) => {
    return of(NEVER).pipe(
        tap(()=>{
            logger.logInfo(`throwing artificial error for ${req.method} request to ${req.url}`)
           }),
        switchMap(()=> throwError(() => new HttpErrorResponse(
            {
                error: { code: 500, description: 'Internal Server Error' },
                status: 500,
                statusText: 'Internal Server Error',
                url: req.url
            }
        )
        ))
    )
}

const getGetChaosConfig = () => inject(ChaosConfigService).chaosConfig;

const getDelay = () => {
    const config = getGetChaosConfig();
    if(config.randomDelay){
        return getRandomNumberInRange(config.randomDelay.min, config.randomDelay.max);
    }

    return config.delay;
}

const shouldAddConfiguredChaos = () => getGetChaosConfig().chaosMode === ChaosMode.Configured;

const shouldTrackChaos = () => getGetChaosConfig().chaosMode === ChaosMode.Controlled;

const isFailureChanceMet = () => getRandomNumberBetween1And100() <= getGetChaosConfig().failureChanceOutOf100;

const getRandomNumberBetween1And100 = () => getRandomNumberInRange(1, 100);

const getRandomNumberInRange = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
