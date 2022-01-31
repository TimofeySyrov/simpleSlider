import Options from './interfaces/options';

const defaultOptions: Options = {
  min: 0,
  max: 100,
  from: 50,
  to: 100,
  step: 1,
  type: 'single',
  orientation: 'horizontal',
  direction: 'ltr',
  withRange: true,
  withThumb: true,
  withScale: true,
};

export default defaultOptions;
