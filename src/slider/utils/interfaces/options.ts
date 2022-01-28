import { Direction, Orientation } from '../types/namespace';

interface Options {
  min: number,
  max: number,
  from: number,
  to?: number,
  step: number,
  orientation: Orientation,
  direction: Direction,
  withRange: boolean,
  withThumb: boolean,
  withScale: boolean,
}

export default Options;
