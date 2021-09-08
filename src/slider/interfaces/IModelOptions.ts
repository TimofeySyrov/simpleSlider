import TCurrentValue from "./TCurrentValue";

interface IModelOptions {
  min: number,
  max: number,
  orientation?: 'horizontal' | 'vertical',
  type?: 'from-start' | 'from-end' | 'range',
  withRange?: boolean,
  withThumb?: boolean,
  withScale?: boolean,
  currentValue?: TCurrentValue,
  step?: number
}

export default IModelOptions