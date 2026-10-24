import { describe, it, expect } from 'vitest';
import { FilterBarComponent, FilterState } from './filter-bar.component';

describe('FilterBarComponent', () => {
  it('should initialize with default filters', () => {
    const comp = new FilterBarComponent();
    expect(comp.filters).toEqual({ signal: 'ALL', minScore: 0, stock: 'ALL' });
  });

  it('should emit updated filters when signal changes', () => {
    const comp = new FilterBarComponent();
    let emitted: FilterState | null = null;
    comp.filterChange.subscribe((val) => {
      emitted = val;
    });

    comp.setSignal('BUY');
    expect(comp.filters.signal).toBe('BUY');
    expect(emitted).toEqual({ signal: 'BUY', minScore: 0, stock: 'ALL' });
  });

  it('should emit updated filters when stock changes', () => {
    const comp = new FilterBarComponent();
    let emitted: FilterState | null = null;
    comp.filterChange.subscribe((val) => {
      emitted = val;
    });

    comp.setStock('INFY');
    expect(comp.filters.stock).toBe('INFY');
    expect(emitted).toEqual({ signal: 'ALL', minScore: 0, stock: 'INFY' });
  });

  it('should reset filters to default and emit', () => {
    const comp = new FilterBarComponent();
    comp.filters = { signal: 'BUY', minScore: 60, stock: 'INFY' };

    let emitted: FilterState | null = null;
    comp.filterChange.subscribe((val) => {
      emitted = val;
    });

    comp.reset();
    expect(comp.filters).toEqual({ signal: 'ALL', minScore: 0, stock: 'ALL' });
    expect(emitted).toEqual({ signal: 'ALL', minScore: 0, stock: 'ALL' });
  });
});
