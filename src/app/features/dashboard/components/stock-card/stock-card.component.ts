import { Component, Input, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockSignal } from '../../../../core/models/stock-signal.model';

@Component({
  selector: 'app-stock-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stock-card" [class.expanded]="expanded()" (click)="toggleExpand()">
      <!-- Header -->
      <div class="card-header">
        <div class="symbol-block">
          <span class="symbol">{{ trade.symbol }}</span>
          <span class="signal-badge" [ngClass]="signalClass">{{ signalLabel }}</span>
        </div>
        <div class="score-ring">
          <svg viewBox="0 0 36 36" class="ring-svg">
            <circle class="ring-bg" cx="18" cy="18" r="15.9" />
            <circle
              class="ring-fill"
              cx="18" cy="18" r="15.9"
              [attr.stroke-dasharray]="ringDash"
              [style.stroke]="ringColor"
            />
          </svg>
          <span class="score-text">{{ trade.setupScore }}</span>
        </div>
      </div>

      <!-- Price Row -->
      <div class="price-row">
        <div class="price-item">
          <span class="price-label">Entry</span>
          <span class="price-value entry">₹{{ trade.entryPrice | number:'1.0-2' }}</span>
        </div>
        <div class="price-item">
          <span class="price-label">Stop Loss</span>
          <span class="price-value stop">₹{{ trade.stopLoss | number:'1.0-2' }}</span>
          <span class="price-pct stop">{{ stopLossPct }}%</span>
        </div>
        <div class="price-item">
          <span class="price-label">Target 1</span>
          <span class="price-value target">₹{{ trade.target1 | number:'1.0-2' }}</span>
          <span class="price-pct target">+{{ target1Pct }}%</span>
        </div>
        <div class="price-item">
          <span class="price-label">Target 2</span>
          <span class="price-value target">₹{{ trade.target2 | number:'1.0-2' }}</span>
          <span class="price-pct target">+{{ target2Pct }}%</span>
        </div>
      </div>

      <!-- Checks Grid -->
      <div class="checks-grid">
        <div class="check-item" *ngFor="let check of checkItems">
          <span class="check-icon" [class.pass]="check.value" [class.fail]="!check.value">
            {{ check.value ? '✓' : '✗' }}
          </span>
          <span class="check-label">{{ check.label }}</span>
        </div>
      </div>

      <!-- Metrics Strip -->
      <div class="metrics-strip">
        <div class="metric-pill" *ngFor="let m of metricItems">
          <span class="metric-label">{{ m.label }}</span>
          <span class="metric-value" [ngClass]="m.cls">{{ m.value }}</span>
        </div>
      </div>

      <!-- Expanded: Pattern Tags + full metrics -->
      @if (expanded()) {
        <div class="expanded-section" (click)="$event.stopPropagation()">
          <div class="pattern-tags">
            <span class="tag-label">Patterns</span>
            @if (trade.patterns.isHammer) {
              <span class="pattern-tag">🔨 Hammer</span>
            }
            @if (trade.patterns.isBullishEngulfing) {
              <span class="pattern-tag">🕯️ Bullish Engulfing</span>
            }
            @if (!trade.patterns.isHammer && !trade.patterns.isBullishEngulfing) {
              <span class="pattern-none">No named patterns</span>
            }
          </div>

          <div class="extended-metrics">
            <div class="ext-metric">
              <span class="ext-label">Supertrend</span>
              <span class="ext-value">₹{{ trade.metrics.supertrend | number:'1.0-2' }}</span>
            </div>
            <div class="ext-metric">
              <span class="ext-label">EMA 20</span>
              <span class="ext-value">₹{{ trade.metrics.ema20 | number:'1.0-2' }}</span>
            </div>
            <div class="ext-metric">
              <span class="ext-label">SMA 200</span>
              <span class="ext-value">₹{{ trade.metrics.sma200 | number:'1.0-2' }}</span>
            </div>
            <div class="ext-metric">
              <span class="ext-label">Vol Multiple</span>
              <span class="ext-value" [class.surge]="trade.checks.isVolumeSurge">
                {{ trade.metrics.volumeMultiple | number:'1.2-2' }}x
              </span>
            </div>
          </div>
        </div>
      }

      <div class="expand-hint">{{ expanded() ? '▲ Less' : '▼ More' }}</div>
    </div>
  `,
  styleUrls: ['./stock-card.component.css'],
})
export class StockCardComponent {
  @Input() trade!: StockSignal;

  expanded = signal(false);

  toggleExpand() {
    this.expanded.update((v) => !v);
  }

  get signalClass(): string {
    return this.trade.signal === 'BUY_SETUP' ? 'badge-buy' : 'badge-neutral';
  }

  get signalLabel(): string {
    return this.trade.signal === 'BUY_SETUP' ? 'BUY SETUP' : 'NO SETUP';
  }

  get ringDash(): string {
    const pct = Math.min(100, Math.max(0, this.trade.setupScore));
    const circumference = 100;
    return `${pct} ${circumference - pct}`;
  }

  get ringColor(): string {
    const s = this.trade.setupScore;
    if (s >= 75) return 'var(--accent-green)';
    if (s >= 50) return 'var(--accent-blue)';
    if (s >= 25) return 'var(--accent-amber)';
    return 'var(--accent-red)';
  }

  get stopLossPct(): string {
    return (((this.trade.stopLoss - this.trade.entryPrice) / this.trade.entryPrice) * 100).toFixed(1);
  }

  get target1Pct(): string {
    return (((this.trade.target1 - this.trade.entryPrice) / this.trade.entryPrice) * 100).toFixed(1);
  }

  get target2Pct(): string {
    return (((this.trade.target2 - this.trade.entryPrice) / this.trade.entryPrice) * 100).toFixed(1);
  }

  get checkItems() {
    const c = this.trade.checks;
    return [
      { label: 'Macro Uptrend', value: c.isMacroUptrend },
      { label: 'Uptrend', value: c.isUptrend },
      { label: 'Valid Pullback', value: c.isValidPullback },
      { label: 'Breaks Prev High', value: c.breaksPrevHigh },
      { label: 'Overhead Room', value: c.hasOverheadRoom },
      { label: 'Volume Surge', value: c.isVolumeSurge },
      { label: 'MACD Bullish', value: c.isMacdBullish },
    ];
  }

  get metricItems() {
    const m = this.trade.metrics;
    return [
      { label: 'RSI', value: m.rsi?.toFixed(1) ?? '—', cls: this.rsiClass(m.rsi) },
      { label: 'Price', value: `₹${m.price?.toFixed(0) ?? '—'}`, cls: '' },
      { label: 'Vol ×', value: `${m.volumeMultiple?.toFixed(2) ?? '—'}`, cls: m.volumeMultiple >= 1.5 ? 'metric-surge' : '' },
    ];
  }

  private rsiClass(rsi: number): string {
    if (rsi > 70) return 'metric-overbought';
    if (rsi < 40) return 'metric-oversold';
    return 'metric-normal';
  }
}
