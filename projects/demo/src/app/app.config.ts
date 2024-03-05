import { ApplicationConfig } from '@angular/core';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { chaosInterceptor } from 'ngx-chaos-engineering';
import { provideChaosConfig } from 'ngx-chaos-engineering';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideChaosConfig(environment.chaosConfig),
    provideHttpClient(withInterceptors([chaosInterceptor]))
  ]
};
