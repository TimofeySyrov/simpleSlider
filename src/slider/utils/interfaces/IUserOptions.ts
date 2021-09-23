import ICallbackAPI from "./ICallbackAPI";
import { TType, TCurrentValue, TOrientation } from "../types/namespace";

interface IUserOptions extends ICallbackAPI {
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

export default IUserOptions;