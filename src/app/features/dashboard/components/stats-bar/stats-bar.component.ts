import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StockSignal } from '../../../../core/models/stock-signal.model';

@Component({
  selector: 'app-stats-bar',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="stats-bar">
      <div class="stat-card">
        <span class="stat-icon">📊</span>
        <div class="stat-info">
          <span class="stat-value">{{ trades.length }}</span>
          <span class="stat-label">Total Signals</span>
        </div>
      </div>
      <div class="stat-card buy">
        <span class="stat-icon">🚀</span>
        <div class="stat-info">
          <span class="stat-value">{{ buySetupCount }}</span>
          <span class="stat-label">BUY Setups</span>
        </div>
      </div>
      <div class="stat-card neutral">
        <span class="stat-icon">⏳</span>
        <div class="stat-info">
          <span class="stat-value">{{ noSetupCount }}</span>
          <span class="stat-label">No Setup</span>
        </div>
      </div>
      <div class="stat-card score">
        <span class="stat-icon">⭐</span>
        <div class="stat-info">
          <span class="stat-value">{{ avgScore }}</span>
          <span class="stat-label">Avg Score</span>
        </div>
      </div>
      <div class="stat-card rsi">
        <span class="stat-icon">📈</span>
        <div class="stat-info">
          <span class="stat-value">{{ avgRsi }}</span>
          <span class="stat-label">Avg RSI</span>
        </div>
      </div>
    </div>
  `,
  styleUrls: ['./stats-bar.component.css'],
})
export class StatsBarComponent {
  @Input() trades: StockSignal[] = [];

  get buySetupCount(): number {
    return this.trades.filter((t) => t.signal === 'BUY_SETUP').length;
  }

  get noSetupCount(): number {
    return this.trades.filter((t) => t.signal === 'NO_SETUP').length;
  }

  get avgScore(): string {
    if (!this.trades.length) return '—';
    const avg = this.trades.reduce((s, t) => s + (t.setupScore || 0), 0) / this.trades.length;
    return avg.toFixed(1);
  }

  get avgRsi(): string {
    if (!this.trades.length) return '—';
    const avg = this.trades.reduce((s, t) => s + (t.metrics?.rsi || 0), 0) / this.trades.length;
    return avg.toFixed(1);
  }
}
