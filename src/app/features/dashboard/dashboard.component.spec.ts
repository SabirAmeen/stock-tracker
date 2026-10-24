import { describe, it, expect, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { DashboardComponent } from './dashboard.component';
import { StockService } from '../../core/services/stock.service';
import { StockSignal } from '../../core/models/stock-signal.model';

describe('DashboardComponent', () => {
  const mockTrades: StockSignal[] = [
    {
      id: '1',
      symbol: 'INFY',
      signal: 'NO_SETUP',
      setupScore: 40,
      entryPrice: 1500,
      stopLoss: 1450,
      target1: 1600,
      target2: 1700,
      checks: {} as any,
      metrics: { rsi: 50 } as any,
    },
    {
      id: '2',
      symbol: 'TCS',
      signal: 'BUY',
      setupScore: 85,
      entryPrice: 3500,
      stopLoss: 3400,
      target1: 3700,
      target2: 3800,
      checks: {} as any,
      metrics: { rsi: 62 } as any,
    },
  ];

  it('should load trades successfully on init and prioritize BUY signals', () => {
    const mockStockService = {
      getSwingTrades: vi.fn().mockReturnValue(of(mockTrades)),
    } as unknown as StockService;

    const comp = new DashboardComponent(mockStockService);
    comp.ngOnInit();

    expect(comp.loading()).toBe(false);
    expect(comp.error()).toBeNull();
    expect(comp.allTrades().length).toBe(2);

    // BUY should sort ahead of NO_SETUP
    const filtered = comp.filteredTrades();
    expect(filtered.length).toBe(2);
    expect(filtered[0].symbol).toBe('TCS');
    expect(filtered[1].symbol).toBe('INFY');

    comp.ngOnDestroy();
  });

  it('should handle error when loading trades fails', () => {
    const mockStockService = {
      getSwingTrades: vi.fn().mockReturnValue(throwError(() => new Error('Firestore Error'))),
    } as unknown as StockService;

    const comp = new DashboardComponent(mockStockService);
    comp.ngOnInit();

    expect(comp.loading()).toBe(false);
    expect(comp.error()).toContain('Failed to load trades');
    comp.ngOnDestroy();
  });

  it('should filter trades by signal type and minScore', () => {
    const mockStockService = {
      getSwingTrades: vi.fn().mockReturnValue(of(mockTrades)),
    } as unknown as StockService;

    const comp = new DashboardComponent(mockStockService);
    comp.ngOnInit();

    // Filter by BUY only
    comp.onFilterChange({ signal: 'BUY', minScore: 0 });
    let filtered = comp.filteredTrades();
    expect(filtered.length).toBe(1);
    expect(filtered[0].symbol).toBe('TCS');

    // Filter by minScore higher than INFY
    comp.onFilterChange({ signal: 'ALL', minScore: 50 });
    filtered = comp.filteredTrades();
    expect(filtered.length).toBe(1);
    expect(filtered[0].symbol).toBe('TCS');

    // Filter by minScore higher than any
    comp.onFilterChange({ signal: 'ALL', minScore: 90 });
    filtered = comp.filteredTrades();
    expect(filtered.length).toBe(0);

    comp.ngOnDestroy();
  });
});
