import Observer from "../observer/Observer";
import IModelOptions from "../interfaces/IModelOptions";
import { TToggle } from "../interfaces/view/namespace";
import IModelEvents from "../interfaces/model/IModelEvents";
import TCurrentValue from "../interfaces/TCurrentValue";

class Model extends Observer {
  
  private modelOptions: IModelOptions;
  private _events: IModelEvents = {
    currentValueChanged: new Observer
  }

  get events(): IModelEvents {
    return this._events;
  };

  constructor(modelOptions: IModelOptions) {
    super();

    this.modelOptions = this.checkModelOptions(modelOptions);
  }

  public updateModelOptions(newModelOptions: IModelOptions): void {
    this.modelOptions = this.checkModelOptions(newModelOptions);
    this.notify(this.modelOptions);
  }

  public updateCurrentValueOption(obj: { handle: TToggle, value: number }) {

    this._events.currentValueChanged.notify(obj);
  }

  public getModelOptions () {
    return this.modelOptions;
  }

  private checkModelOptions (checkModelOptions: IModelOptions): IModelOptions {
    
    return checkModelOptions;
  }

  private checkCurrentValue (currentValue: TCurrentValue, max: number, min: number) {
    if(typeof currentValue === 'object') {
      
      if(currentValue.min > currentValue.max) {
        currentValue.min = currentValue.max;
      }

      if(currentValue.min < min) {
        currentValue.min = min;
      }

      if(currentValue.max > max) {
        currentValue.max = max;
      }
    }

    if(typeof currentValue === 'number') {
      if(currentValue < min) {
        currentValue = min;
      }

      if(currentValue > max) {
        currentValue = max;
      }
    }
  }
}

export default Model;