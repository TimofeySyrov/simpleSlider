interface IModelOptions {
  min: number,
  max: number,
  orientation?: 'horizontal' | 'vertical',
  withDoubleHandle?: boolean,
  withThumb?: boolean,
  withRuler?: boolean,
  currentValue?: number | number[],
  step?: number
}

export default IModelOptions