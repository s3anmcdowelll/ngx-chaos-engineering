import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { inject } from "@angular/core";
import { throwError, timer, switchMap } from "rxjs";
import { CHAOS_CONFIG } from "./chaos-config";

export const chaosInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn)=>{
    if (!shouldAddChaos()) {
        return next(req);
    }

    const delay$ = timer(getDelay());
    
    if (!isFailureChanceMet()) {
        return delay$.pipe(switchMap(() => next(req)));
    }

    return delay$
    .pipe(
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

const shouldAddChaos = () => inject(CHAOS_CONFIG).chaosOn ?? false;

const getDelay = () => inject(CHAOS_CONFIG).delay ?? 2000;

const isFailureChanceMet = () => getRandomNumberBetween1And100() <= getFailureChanceOutOf100();

const getRandomNumberBetween1And100 = () => Math.floor(Math.random() * 100) + 1;

const getFailureChanceOutOf100 = () => inject(CHAOS_CONFIG).failureChanceOutOf100 ?? 50;