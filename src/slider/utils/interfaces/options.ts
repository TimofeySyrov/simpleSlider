import { Type, Direction, Orientation } from '../types/namespace';

interface Options {
  min: number,
  max: number,
  from: number,
  to: number,
  step: number,
  type: Type,
  orientation: Orientation,
  direction: Direction,
  withRange: boolean,
  withThumb: boolean,
  withScale: boolean,
}

export default Options;
