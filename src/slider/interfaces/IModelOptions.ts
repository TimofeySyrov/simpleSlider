import { TType, TCurrentValue, TUpdateToggle, TOrientation } from "./namespace";

interface IModelOptions extends API {
  min?: number,
  max?: number,
  orientation?: TOrientation,
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

export default IModelOptions;