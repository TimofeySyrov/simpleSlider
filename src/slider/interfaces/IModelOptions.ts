import ICurrentValue from "./ICurrentValue";

interface IModelOptions {
  min: number,
  max: number,
  orientation?: 'horizontal' | 'vertical',
  type?: 'from-start' | 'from-end' | 'range',
  withRange?: boolean,
  withThumb?: boolean,
  withScale?: boolean,
  currentValue?: number | ICurrentValue,
  step?: number
}

export default IModelOptions