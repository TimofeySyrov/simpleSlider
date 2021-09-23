import { TCurrentValue, TOrientation, TType } from "../types/namespace";

interface ICorrectOptions {
  min: number,
  max: number,
  orientation: TOrientation,
  type: TType,
  withRange: boolean,
  withThumb: boolean,
  withScale: boolean,
  currentValue: TCurrentValue,
  step: number
}

export default ICorrectOptions;