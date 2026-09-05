export interface Patterns {
  isHammer: boolean;
  isBullishEngulfing: boolean;
  hasBullishPattern: boolean;
}

export interface Checks {
  isMacroUptrend: boolean;
  isUptrend: boolean;
  isValidPullback: boolean;
  breaksPrevHigh: boolean;
  hasOverheadRoom: boolean;
  isVolumeSurge: boolean;
  isMacdBullish: boolean;
}

export interface Metrics {
  price: number;
  supertrend: number;
  volumeMultiple: number;
  rsi: number;
  ema20: number;
  sma200: number;
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
  patterns: Patterns;
  checks: Checks;
  metrics: Metrics;
}
