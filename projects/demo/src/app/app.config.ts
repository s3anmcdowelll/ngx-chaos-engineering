import { ApplicationConfig } from '@angular/core';

import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { chaosInterceptor } from 'ngx-chaos-engineering';
import { CHAOS_CONFIG } from 'ngx-chaos-engineering';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: CHAOS_CONFIG, useValue: { chaosOn: true, delay: 3000, failureChanceOutOf100: 75 } },
    provideHttpClient(withInterceptors([chaosInterceptor]))
  ]
};
