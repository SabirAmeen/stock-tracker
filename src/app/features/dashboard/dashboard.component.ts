import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { StockService } from '../../core/services/stock.service';
import { StockSignal } from '../../core/models/stock-signal.model';
import { StatsBarComponent } from './components/stats-bar/stats-bar.component';
import { FilterBarComponent, FilterState } from './components/filter-bar/filter-bar.component';
import { StockCardComponent } from './components/stock-card/stock-card.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, StatsBarComponent, FilterBarComponent, StockCardComponent],
  template: `
    <div class="dashboard">
      <!-- Header -->
      <header class="dashboard-header">
        <div class="header-left">
          <div class="logo">
            <span class="logo-icon">📡</span>
            <span class="logo-text">SwingTracker</span>
          </div>
          <p class="header-subtitle">Live swing trade recommendations from Firestore</p>
        </div>
        <div class="header-right">
          <span class="live-dot"></span>
          <span class="live-label">LIVE</span>
          <span class="last-updated">{{ allTrades.length }} signals loaded</span>
        </div>
      </header>

      <!-- Stats -->
      <app-stats-bar [trades]="filteredTrades"></app-stats-bar>

      <!-- Filters -->
      <app-filter-bar (filterChange)="onFilterChange($event)"></app-filter-bar>

      <!-- Loading State -->
      @if (loading) {
        <div class="loading-state">
          <div class="spinner"></div>
          <span>Fetching swing trades…</span>
        </div>
      }

      <!-- Error State -->
      @if (error) {
        <div class="error-state">
          <span class="error-icon">⚠️</span>
          <span>{{ error }}</span>
        </div>
      }

      <!-- Empty State -->
      @if (!loading && !error && filteredTrades.length === 0) {
        <div class="empty-state">
          <span class="empty-icon">🔍</span>
          <p>No trades match your current filters.</p>
          <p class="empty-hint">Try adjusting the signal type or lowering the min score.</p>
        </div>
      }

      <!-- Cards Grid -->
      @if (!loading && filteredTrades.length > 0) {
        <div class="cards-grid">
          @for (trade of filteredTrades; track trade.id) {
            <app-stock-card [trade]="trade"></app-stock-card>
          }
        </div>
      }
    </div>
  `,
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit, OnDestroy {
  allTrades: StockSignal[] = [];
  filteredTrades: StockSignal[] = [];
  loading = true;
  error: string | null = null;
  private activeFilters: FilterState = { signal: 'ALL', minScore: 0 };
  private sub!: Subscription;

  constructor(private stockService: StockService) {}

  ngOnInit() {
    this.sub = this.stockService.getSwingTrades().subscribe({
      next: (trades) => {
        this.allTrades = trades;
        this.applyFilters();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Failed to load trades. Check your Firebase configuration.';
        this.loading = false;
        console.error(err);
      },
    });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }

  onFilterChange(filters: FilterState) {
    this.activeFilters = filters;
    this.applyFilters();
  }

  private applyFilters() {
    this.filteredTrades = this.allTrades.filter((t) => {
      const signalOk =
        this.activeFilters.signal === 'ALL' || t.signal === this.activeFilters.signal;
      const scoreOk = (t.setupScore ?? 0) >= this.activeFilters.minScore;
      return signalOk && scoreOk;
    });
  }
}
