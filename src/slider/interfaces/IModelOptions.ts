import ICurrentValue from "./ICurrentValue";

interface IModelOptions {
  min: number,
  max: number,
  orientation?: 'horizontal' | 'vertical',
  withDoubleHandle?: boolean,
  withThumb?: boolean,
  withRuler?: boolean,
  currentValue?: number | ICurrentValue,
  step?: number
}

export default IModelOptions