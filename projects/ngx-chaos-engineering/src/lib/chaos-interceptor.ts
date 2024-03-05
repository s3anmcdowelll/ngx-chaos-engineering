import { HttpErrorResponse, HttpHandlerFn, HttpInterceptorFn, HttpRequest } from "@angular/common/http";
import { throwError, timer, switchMap } from "rxjs";
import { getGetChaosConfig } from "./chaos-config";

export const chaosInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn)=>{
    if (!shouldAddChaos()) {
        return next(req);
    }

    const delay$ = timer(getGetChaosConfig().delay);
    
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

const shouldAddChaos = () => getGetChaosConfig().chaosOn;

const isFailureChanceMet = () => getRandomNumberBetween1And100() <= getGetChaosConfig().failureChanceOutOf100;

const getRandomNumberBetween1And100 = () => Math.floor(Math.random() * 100) + 1;
