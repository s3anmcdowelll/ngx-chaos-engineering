import { HttpRequest } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChaosTrackingService {

  private _trackedRequests = signal<TrackedRequest[]>([])

  get trackedRequests() { 
    return this._trackedRequests.asReadonly();
  }

  trackRequest(req: HttpRequest<unknown>) {
    const action$ = new Subject<ChaosCommand>()
    this._trackedRequests.update((requests) => [
      ...requests,
       { 
        id: crypto.randomUUID(),
        method: req.method,
        pathName: new URL(req.urlWithParams).pathname,
        action$,
        timeStamp: new Date()
       }
    ]);
    return action$.asObservable();
  }

  completeRequest(id: string, command: ChaosCommand) {
    const request = this._trackedRequests().filter(request => request.id === id)[0];
    request.action$.next(command);
    request.action$.complete();
    this._trackedRequests.update((requests) => requests.filter(request => request.id !== id));
  }

}

export type ChaosCommand = {
  fail: boolean;
}

export type TrackedRequest = {
  id: string;
  method: string;
  pathName: string;
  timeStamp: Date;
  action$: Subject<ChaosCommand>;
}
