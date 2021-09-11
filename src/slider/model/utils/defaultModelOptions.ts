import IModelOptions from "../../interfaces/IModelOptions";

const defaultModelOptions: IModelOptions = {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  type: 'from-start',
  currentValue: 1,
  withRange: true,
  withThumb: true,
  withScale: true
}

export default defaultModelOptions;