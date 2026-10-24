import { describe, it, expect } from 'vitest';
import { StatsBarComponent } from './stats-bar.component';
import { StockSignal } from '../../../../core/models/stock-signal.model';

describe('StatsBarComponent', () => {
  const createMockTrade = (overrides: Partial<StockSignal> = {}): StockSignal => ({
    id: 'test-1',
    symbol: 'TATAMOTORS',
    signal: 'BUY',
    setupScore: 85,
    entryPrice: 1000,
    stopLoss: 950,
    target1: 1100,
    target2: 1200,
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
      price: 1000,
      supertrend: 960,
      volumeMultiple: 2.1,
      rsi: 55,
      ema20: 970,
      sma50: 930,
      sma200: 850,
      pivot_PP: 990,
      pivot_S1: 960,
      pivot_R1: 1050,
    },
    ...overrides,
  });

  it('should initialize with empty trades', () => {
    const comp = new StatsBarComponent();
    expect(comp.trades).toEqual([]);
    expect(comp.buySetupCount).toBe(0);
    expect(comp.noSetupCount).toBe(0);
    expect(comp.avgScore).toBe('—');
    expect(comp.avgRsi).toBe('—');
  });

  it('should calculate counts correctly', () => {
    const comp = new StatsBarComponent();
    comp.trades = [
      createMockTrade({ id: '1', signal: 'BUY' }),
      createMockTrade({ id: '2', signal: 'BUY' }),
      createMockTrade({ id: '3', signal: 'NO_SETUP' }),
    ];

    expect(comp.buySetupCount).toBe(2);
    expect(comp.noSetupCount).toBe(1);
  });

  it('should calculate avgScore and avgRsi accurately', () => {
    const comp = new StatsBarComponent();
    comp.trades = [
      createMockTrade({
        id: '1',
        setupScore: 80,
        metrics: { ...createMockTrade().metrics, rsi: 60 },
      }),
      createMockTrade({
        id: '2',
        setupScore: 90,
        metrics: { ...createMockTrade().metrics, rsi: 50 },
      }),
    ];

    expect(comp.avgScore).toBe('85.0');
    expect(comp.avgRsi).toBe('55.0');
  });
});
