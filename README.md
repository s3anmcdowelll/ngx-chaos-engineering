# nxg-chaos-engineering

Add controlled chaos to your Angular app in under 5 minutes.

## What is Chaos Engineering

Chaos engineering is the practice of intentionally adding failures and latency to your application to ensure it handles issues gracefully.

The practice has been adopted and pionneered by Apple, Amazon, Google and Netflix among others.

You can read more about it [here](https://en.wikipedia.org/wiki/Chaos_engineering).

## How Does this Library Work?

This library introduces an interceptor to all calls made by Angular's HttpClient.

The interceptor can run in two modes, Configured or Controlled.

In Configured mode you can set configuration options to introduce artificial delays and failures to your HTTP calls.

In Controlled mode all HTTP requests are captured and displayed in a tracking control which allows you to either let them continue on their normal path or artificially fail.

## Where Should I Carry out Chaos Testing

The library is toggled by configuration, so you can choose whichever environment you like to carry out chaos testing.

The safest place is of course a local or test environment, but large companies like Netflix are known to temporarily introduce chaos to production to see how their systems hold up.

## Setup

### Installation

```shell
npm install ngx-chaos-engineering
```

### Providers

***app.config.ts***
```ts
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

```

The ```provideChaosConfig``` function is required to set up configuration. It takes a ```ChaosConfig``` object which you can initialize anywhere but it is recommended to add this to an environment configuration.

### Configuration

#### Options

| Option                | Type   | Default                | Note                                                                                                                         |
|-----------------------|--------|------------------------|------------------------------------------------------------------------------------------------------------------------------|
| chaosMode             | enum   | ChaosMode.Off          | Mode the library will run in. See options below.                                                                             |
| delay                 | number | 2000                   | Artifial delay in ms. Only takes effect in "Configured" mode.                                                                |
| randomDelay           | object | null                   | Delay range between which a random delay will be selected. This takes precedence over the "delay" option. The object contains min and max properties which define the range (inclusive) in ms. |
| failureChanceOutOf100 | number | 50                     | Percentage chance of failure.                                                                                                |
| loggingLevel          | enum   | ChaosLoggingLevel.Info | Logging level. Logging is output in console. See options below.   

##### Chaos Mode Options

| Option               | Note                                                                                                                                                                                                                                                                                         |
|----------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| ChaosMode.Off        | HTTP calls will not be intercepted.                                                                                                                                                                                                                                                          |
| ChaosMode.Configured | HTTP calls are disrupted using the other configuration options such as delay and failureChanceOutOf100.                                                                                                                                                                                       |
| ChaosMode.Controlled | HTTP calls are intercepted and "held". In flight requests are displayed in the chaos control component and the tester can choose to "play" the request or "fail" the request generating an artifical error. Other configuration options are ignored such as delay and failureChanceOutOf100. |

##### Choas Logging Options

| Option                  | Note                                     |
|-------------------------|------------------------------------------|
| ChaosLoggingLevel.None  | No logging will be output.               |
| ChaosLoggingLevel.Debug | Debug logging will be output to console. |
| ChaosLoggingLevel.Info  | Info logging will be output to console.  |


#### Example

***environment.ts***
```ts
import { ChaosLoggingLevel, ChaosMode} from "ngx-chaos-engineering";

export const environment = {
     chaosConfig: {
        // chaosMode: ChaosMode.Controlled,
        // chaosMode: ChaosMode.Off,
        chaosMode: ChaosMode.Configured,
        delay: 3000,
        failureChanceOutOf100:  75,
        randomDelay: {
            min: 1000,
            max: 2000
        },
        loggingLevel: ChaosLoggingLevel.Debug
    }
};
```
### Chaos Control Component

If running in ```ChaosMode.Controlled``` all requests will be held until they are passed or failed by the tester in the Chaos Control Component.

This control must be rendered your application.

***app.component.ts***
```ts
import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ChaosControlComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  ...
}
```

***app.component.html***
```html
...
<ngx-chaos-control />
...
```
