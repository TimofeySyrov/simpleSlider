import { TType, TCurrentValue, TUpdateToggle } from "./namespace";

interface IModelOptions extends API {
  min?: number,
  max?: number,
  orientation?: 'horizontal' | 'vertical',
  type?: TType,
  withRange?: boolean,
  withThumb?: boolean,
  withScale?: boolean,
  currentValue?: TCurrentValue,
  step?: number
}

export interface API {
  onSlide?: (callback: TUpdateToggle) => void;
  updateOptions?: (optionsToUpdate: Partial<IModelOptions>) => void;
}

interface TargetElement extends HTMLElement {
  simpleSlider?: API;
}

export { TargetElement as target };
export default IModelOptions