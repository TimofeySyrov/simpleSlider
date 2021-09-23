import IModelEvents from "../utils/interfaces/model/IModelEvents";
import ICorrectOptions from "../utils/interfaces/ICorrectOptions";
import { TType, TCurrentValue, TUpdateToggle } from "../utils/types/namespace";
import Observer from "../observer/Observer";

class Model extends Observer {
  
  private modelOptions: ICorrectOptions;
  private _events: IModelEvents = {
    currentValueChanged: new Observer,
    modelOptionsChanged: new Observer
  }

  get options(): ICorrectOptions {
    return this.modelOptions
  }
  get events(): IModelEvents {
    return this._events;
  };

  constructor(options: ICorrectOptions) {
    super();

    this.modelOptions = options;
    this.checkModelOptions(options);
  }

  public updateModelOptions(options: ICorrectOptions): void {
    this.modelOptions = options;
    this.checkModelOptions(options);
    this.notify(this.modelOptions);
  }

  public updateCurrentValueOption(toggle: TUpdateToggle): void {
    const { min, max, type, currentValue, step } = this.modelOptions;
    const isRange = type === 'range';
    const isHandleFrom = toggle.handle === 'from';
    const isHandleTo = toggle.handle === 'to';

    const valueWithStep = toggle.checkStep ? this.getValueWithStep(toggle.value, min, step) : toggle.value;
    const correctValueWithStep = this.getCorrectDiapason(valueWithStep, min, max);

    if(isRange) {
      if(typeof currentValue === 'object') {
        if(isHandleFrom) {
          toggle.value = this.getCorrectDiapason(correctValueWithStep, min, currentValue.max);
          this.modelOptions.currentValue = { min: toggle.value, max: currentValue.max };
        }
        if(isHandleTo) {
          toggle.value = this.getCorrectDiapason(correctValueWithStep, currentValue.min, max);
          currentValue.max = toggle.value;
          this.modelOptions.currentValue = { min: currentValue.min, max: toggle.value };
        }
      }
    }

    if(!isRange) {
      toggle.value = correctValueWithStep;
      this.modelOptions.currentValue = toggle.value;
    }
    
    this._events.currentValueChanged.notify(toggle);
  }

  private checkModelOptions (options: ICorrectOptions) {
    const { min, max, currentValue, step, type } = options;
    const confirmedMinMax = this.getCorrectMinMax(min, max);

    this.modelOptions.min = confirmedMinMax.min;
    this.modelOptions.max = confirmedMinMax.max;
    this.modelOptions.currentValue = this.getCorrectCurrentValue(currentValue, type, this.modelOptions.min, this.modelOptions.max);
    this.modelOptions.step = this.getCorrectStep(step, min, max);
  }

  private getCorrectStep (step: number, min: number, max: number): number {
    const maxStep = max - min;

    if (step <= 0) return maxStep;
    if (step > maxStep) return maxStep;

    return step;
  }

  private getCorrectDiapason (value: number, min: number, max: number): number {
    if (value <= min) { return min; }
    if (value >= max) { return max; }
    return value;
  }

  private getValueWithStep (value: number, min: number, step: number) {
    const valueWithStep = Math.round((value - min) / step) * step + min;
    return valueWithStep;
  }
  
  private getCorrectMinMax (min: number, max: number): { min: number, max: number } {
    const checkMin = min > max ? max : min;

    return { min: checkMin, max: max };
  } 

  private getCorrectCurrentValue (currentValue: TCurrentValue, type: TType, min: number, max: number): TCurrentValue {
    const isRange = type === 'range';

    if(typeof currentValue === 'object') {

      if(isRange) {
        currentValue = this.getCorrectMinMax(currentValue.min, currentValue.max);

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