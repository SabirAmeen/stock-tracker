export interface Patterns {
  isHammer: boolean;
  isBullishEngulfing: boolean;
  hasBullishPattern: boolean;
}

export interface Checks {
  isLiquid: boolean;
  isHealthyTrend: boolean;
  isEmaRising: boolean;
  isUptrend: boolean;
  isValidPullback: boolean;
  breaksPrevHigh: boolean;
  hasAdequateVolume: boolean;
  wasPullbackLowVolume: boolean;
  hasOverheadRoom: boolean;
  isVolumeSurge: boolean;
  isMacdBullish: boolean;
  rsiHookedUp: boolean;
  hasPivotConfluence: boolean;
}

export interface Metrics {
  price: number;
  supertrend: number;
  volumeMultiple: number;
  rsi: number;
  ema20: number;
  sma50: number;
  sma200: number;
  pivot_PP: number;
  pivot_S1: number;
  pivot_R1: number;
}

export interface StockSignal {
  id: string;
  symbol: string;
  signal: 'BUY_SETUP' | 'NO_SETUP' | string;
  setupScore: number;
  entryPrice: number;
  stopLoss: number;
  target1: number;
  target2: number;
  patterns?: Patterns;
  checks: Checks;
  metrics: Metrics;
}
