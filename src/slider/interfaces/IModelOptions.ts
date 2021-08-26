interface IModelOptions {
  min?: number,
  max?: number,
  orientation?: 'horizontal' | 'vertical',
  withDoubleHandle?: boolean,
  withThumb?: boolean,
  withRuler?: boolean,
  currentValue?: number | { min?: number, max?: number } | 'middle',
  step?: number
}

export default IModelOptions