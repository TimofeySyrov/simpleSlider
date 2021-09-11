import { TType, TCurrentValue } from "./namespace";

interface IModelOptions {
  min: number,
  max: number,
  orientation?: 'horizontal' | 'vertical',
  type?: TType,
  withRange?: boolean,
  withThumb?: boolean,
  withScale?: boolean,
  currentValue?: TCurrentValue,
  step?: number
}

export default IModelOptions