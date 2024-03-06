import { Component, inject } from '@angular/core';
import { ChaosTrackingService } from '../chaos-tracking.service';
import { ChaosConfigService, ChaosMode } from '../chaos-config.service';

@Component({
  selector: 'ngx-chaos-control',
  standalone: true,
  imports: [],
  templateUrl: './chaos-control.component.html',
  styleUrl: './chaos-control.component.css'
})
export class ChaosControlComponent {
  private tracker = inject(ChaosTrackingService);

  trackedRequests = this.tracker.trackedRequests;

  shouldShowChaosControl = inject(ChaosConfigService).chaosConfig.chaosMode === ChaosMode.Controlled;

  complete = (id: string) => this.tracker.completeRequest(id, {fail:false});

  fail = (id: string) => this.tracker.completeRequest(id, {fail:true});
}
