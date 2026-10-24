import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface FilterState {
  signal: 'ALL' | 'BUY' | 'NO_SETUP';
  minScore: number;
  stock: string;
}

@Component({
  selector: 'app-filter-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="filter-bar">
      <div class="filter-section">
        <label for="stock-select" class="filter-label">Stock</label>
        <div class="select-wrap">
          <select
            id="stock-select"
            class="stock-select"
            [(ngModel)]="filters.stock"
            (ngModelChange)="emit()"
          >
            <option value="ALL">All Stocks</option>
            <option *ngFor="let s of stocks" [value]="s">{{ s }}</option>
          </select>
        </div>
      </div>

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
  @Input() stocks: string[] = [];
  @Output() filterChange = new EventEmitter<FilterState>();

  filters: FilterState = { signal: 'ALL', minScore: 0, stock: 'ALL' };

  signalOptions = [
    { value: 'ALL' as const, label: 'All', cls: 'all' },
    { value: 'BUY' as const, label: '🚀 BUY Setup', cls: 'buy' },
    { value: 'NO_SETUP' as const, label: '⏳ No Setup', cls: 'neutral' },
  ];

  setSignal(val: FilterState['signal']) {
    this.filters.signal = val;
    this.emit();
  }

  setStock(stock: string) {
    this.filters.stock = stock;
    this.emit();
  }

  reset() {
    this.filters = { signal: 'ALL', minScore: 0, stock: 'ALL' };
    this.emit();
  }

  emit() {
    this.filterChange.emit({ ...this.filters });
  }
}

