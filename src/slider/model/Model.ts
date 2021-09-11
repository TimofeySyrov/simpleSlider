import Observer from "../observer/Observer";
import IModelOptions from "../interfaces/IModelOptions";
import { TToggle, TType, TCurrentValue } from "../interfaces/namespace";
import IModelEvents from "../interfaces/model/IModelEvents";

class Model extends Observer {
  
  private modelOptions: IModelOptions;
  private _events: IModelEvents = {
    currentValueChanged: new Observer
  }

  get options(): IModelOptions {
    return this.modelOptions
  }
  get events(): IModelEvents {
    return this._events;
  };

  constructor(options: IModelOptions) {
    super();

    this.modelOptions = options;
    this.checkModelOptions();
  }

  public updateModelOptions(options: IModelOptions): void {
    this.modelOptions = options;
    this.checkModelOptions();
    this.notify(this.modelOptions);
  }

  public updateCurrentValueOption(obj: { handle: TToggle, value: number }): void {
    const { min, max, type, currentValue, step } = this.modelOptions;
    const isRange = type === 'range';
    const isHandleFrom = obj.handle === 'from';
    const isHandleTo = obj.handle === 'to';

    const valueWithStep = this.getValueWithStep(obj.value, min, max, step);

    if(isRange) {
      if(typeof currentValue === 'object') {
        if(isHandleFrom) {
          obj.value = this.getCorrectDiapason(valueWithStep, min, currentValue.max);
          this.modelOptions.currentValue = { min: obj.value, max: currentValue.max };
        }
        if(isHandleTo) {
          obj.value = this.getCorrectDiapason(valueWithStep, currentValue.min, max);
          currentValue.max = obj.value;
          this.modelOptions.currentValue = { min: currentValue.min, max: obj.value };
        }
      }
    }

    if(!isRange) {
      obj.value = valueWithStep;
      this.modelOptions.currentValue = obj.value;
    }
    
    this._events.currentValueChanged.notify(obj);
  }

  private checkModelOptions () {
    const { min, max, currentValue, step, type } = this.modelOptions;
    const confirmedMinMax = this.getCorrectMinMax(min, max);

    this.modelOptions.min = confirmedMinMax.min;
    this.modelOptions.max = confirmedMinMax.max;
    this.modelOptions.currentValue = this.getCorrectCurrentValue(currentValue, type, this.modelOptions.min, this.modelOptions.max);
    this.modelOptions.step = this.getCorrectStep(step, min, max);
  }

  private getCorrectStep (step: number, min: number, max: number): number {
    const maxStep = max - min;

    if (step <= 0) return maxStep;
    if(step >= max) return maxStep;

    return step;
  }

  private getCorrectDiapason (value: number, min: number, max: number): number {
    if (value <= min) { return min; }
    if (value >= max) { return max; }
    return value;
  }

  private getValueWithStep (value: number, min: number, max: number, step: number) {
    const valueWithStep = Math.round((value - min) / step) * step + min;
    return this.getCorrectDiapason(valueWithStep, min, max);
  }
  
  private getCorrectMinMax (min: number, max: number): { min: number, max: number } {
    const checkMin = min > max ? max : min;

    return { min: checkMin, max: max };
  } 

  private getCorrectCurrentValue (currentValue: TCurrentValue, type: TType, min: number, max: number): TCurrentValue {
    const isRange = type === 'range';

    if(typeof currentValue === 'object') {
      
      if(currentValue.min > currentValue.max) {
        currentValue.min = currentValue.max;
      }

      if(isRange) {
        return {
          min: this.getCorrectDiapason (currentValue.min, min, max),
          max: this.getCorrectDiapason (currentValue.max, min, max)
        }
      }
      return this.getCorrectDiapason (currentValue.min, min, max);
    }

    if(typeof currentValue === 'number') {
      const confirmedCurrentValue = this.getCorrectDiapason(currentValue, min, max);
      if(isRange) {
        return {
          min: confirmedCurrentValue,
          max: confirmedCurrentValue
        }
      }
      return confirmedCurrentValue;
    }

    return (max - min) / 2;
  }
}

export default Model;