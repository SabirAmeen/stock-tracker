import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterState {
  signal: 'ALL' | 'BUY_SETUP' | 'NO_SETUP';
  minScore: number;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-bar">
      <div class="filter-section">
        <span class="filter-label">Signal</span>
        <div class="chip-group">
          <button
            *ngFor="let opt of signalOptions"
            class="chip"
            [class.active]="filters.signal === opt.value"
            [class]="'chip ' + opt.cls + (filters.signal === opt.value ? ' active' : '')"
            (click)="setSignal(opt.value)"
            [id]="'filter-' + opt.value.toLowerCase()"
          >
            {{ opt.label }}
          </button>
        </div>
      </div>

      <div class="filter-section">
        <span class="filter-label">Min Score: <strong>{{ filters.minScore }}</strong></span>
        <div class="slider-wrap">
          <input
            id="min-score-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            [(ngModel)]="filters.minScore"
            (ngModelChange)="emit()"
            class="score-slider"
          />
          <div class="slider-ticks">
            <span>0</span><span>25</span><span>50</span><span>75</span><span>100</span>
          </div>
        </div>
      </div>

      <button class="reset-btn" (click)="reset()" id="filter-reset">
        ↺ Reset
      </button>
    </div>
  `,
  styleUrls: ['./filter-bar.component.css'],
})
export class FilterBarComponent {
  @Output() filterChange = new EventEmitter<FilterState>();

  filters: FilterState = { signal: 'ALL', minScore: 0 };

  signalOptions = [
    { value: 'ALL' as const, label: 'All', cls: 'all' },
    { value: 'BUY_SETUP' as const, label: '🚀 BUY Setup', cls: 'buy' },
    { value: 'NO_SETUP' as const, label: '⏳ No Setup', cls: 'neutral' },
  ];

  setSignal(val: FilterState['signal']) {
    this.filters.signal = val;
    this.emit();
  }

  reset() {
    this.filters = { signal: 'ALL', minScore: 0 };
    this.emit();
  }

  emit() {
    this.filterChange.emit({ ...this.filters });
  }
}
