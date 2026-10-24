import { describe, it, expect } from 'vitest';
import { StockCardComponent } from './stock-card.component';
import { StockSignal } from '../../../../core/models/stock-signal.model';

describe('StockCardComponent', () => {
  const createMockTrade = (overrides: Partial<StockSignal> = {}): StockSignal => ({
    id: 'test-1',
    symbol: 'RELIANCE',
    signal: 'BUY',
    setupScore: 80,
    entryPrice: 2500,
    stopLoss: 2400,
    target1: 2700,
    target2: 2850,
    checks: {
      isLiquid: true,
      isHealthyTrend: true,
      isEmaRising: true,
      isUptrend: true,
      isValidPullback: true,
      breaksPrevHigh: true,
      hasAdequateVolume: true,
      wasPullbackLowVolume: true,
      hasOverheadRoom: true,
      isVolumeSurge: true,
      isMacdBullish: true,
      rsiHookedUp: true,
      hasPivotConfluence: true,
    },
    metrics: {
      price: 2500,
      supertrend: 2450,
      volumeMultiple: 1.8,
      rsi: 65,
      ema20: 2480,
      sma50: 2400,
      sma200: 2200,
      pivot_PP: 2490,
      pivot_S1: 2420,
      pivot_R1: 2600,
    },
    ...overrides,
  });

  it('should toggle expansion state', () => {
    const comp = new StockCardComponent();
    expect(comp.expanded()).toBe(false);

    comp.toggleExpand();
    expect(comp.expanded()).toBe(true);

    comp.toggleExpand();
    expect(comp.expanded()).toBe(false);
  });

  it('should compute percentages accurately', () => {
    const comp = new StockCardComponent();
    comp.trade = createMockTrade({
      entryPrice: 100,
      stopLoss: 95, // -5%
      target1: 110, // +10%
      target2: 120, // +20%
    });

    expect(comp.stopLossPct).toBe('-5.0');
    expect(comp.target1Pct).toBe('10.0');
    expect(comp.target2Pct).toBe('20.0');
  });

  it('should return correct signal label and class', () => {
    const comp = new StockCardComponent();
    comp.trade = createMockTrade({ signal: 'BUY' });
    expect(comp.signalClass).toBe('badge-buy');
    expect(comp.signalLabel).toBe('BUY SETUP');

    comp.trade = createMockTrade({ signal: 'NO_SETUP' });
    expect(comp.signalClass).toBe('badge-neutral');
    expect(comp.signalLabel).toBe('NO SETUP');
  });

  it('should determine ring colors based on setupScore thresholds', () => {
    const comp = new StockCardComponent();

    comp.trade = createMockTrade({ setupScore: 85 });
    expect(comp.ringColor).toBe('var(--accent-green)');

    comp.trade = createMockTrade({ setupScore: 60 });
    expect(comp.ringColor).toBe('var(--accent-blue)');

    comp.trade = createMockTrade({ setupScore: 35 });
    expect(comp.ringColor).toBe('var(--accent-amber)');

    comp.trade = createMockTrade({ setupScore: 15 });
    expect(comp.ringColor).toBe('var(--accent-red)');
  });

  it('should format check items and metric items properly', () => {
    const comp = new StockCardComponent();
    comp.trade = createMockTrade();

    expect(comp.checkItems.length).toBe(13);
    expect(comp.metricItems.length).toBe(3);
    expect(comp.metricItems[0].label).toBe('RSI');
    expect(comp.metricItems[1].label).toBe('Price');
  });
});
