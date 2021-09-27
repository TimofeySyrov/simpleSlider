import ICorrectOptions from './interfaces/ICorrectOptions';

const defaultModelOptions: ICorrectOptions = {
  min: 0,
  max: 100,
  step: 1,
  orientation: 'horizontal',
  type: 'from-start',
  currentValue: 50,
  withRange: true,
  withThumb: true,
  withScale: true,
};

export default defaultModelOptions;