import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, WritableSignal, signal } from '@angular/core';
import { Observable, catchError, of, tap} from 'rxjs';
import { environment } from '../environments/environment';
import { AsyncPipe, JsonPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [JsonPipe, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  requestState: WritableSignal<'PENDING' | 'IN-FLIGHT' | 'ERROR' | 'SUCCESS'> = signal('PENDING');
  requestResult$: Observable<unknown> | undefined;

  constructor(private httpClient: HttpClient) { }

  makeRequest() {
    this.requestState.set('IN-FLIGHT');
    this.requestResult$ = this.httpClient.get<unknown>(environment.requestUrl).pipe(
      tap(()=>this.requestState.set('SUCCESS')),
      catchError((error) => { 
        this.requestState.set('ERROR')
        return of(error);
      })
    );
  }
}
