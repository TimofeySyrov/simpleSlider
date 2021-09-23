import IModelEvents from '../utils/interfaces/model/IModelEvents';
import ICorrectOptions from '../utils/interfaces/ICorrectOptions';
import { TCurrentValue, TUpdateToggle } from '../utils/types/namespace';
import Observer from '../observer/Observer';

class Model extends Observer {
  private modelOptions: ICorrectOptions;

  private modelEvents: IModelEvents = {
    currentValueChanged: new Observer(),
    modelOptionsChanged: new Observer(),
  };

  get options (): ICorrectOptions {
    return this.modelOptions;
  }

  get events (): IModelEvents {
    return this.modelEvents;
  }

  constructor (options: ICorrectOptions) {
    super();

    this.modelOptions = options;
    this.checkModelOptions(options);
  }

  public updateModelOptions (options: ICorrectOptions): void {
    this.modelOptions = options;
    this.checkModelOptions(options);
    this.notify(this.modelOptions);
  }

  public updateCurrentValueOption (toggle: TUpdateToggle): void {
    const {
      min, max, type, currentValue, step,
    } = this.modelOptions;
    const isRange = type === 'range';
    const isFromStart = type === 'from-start';
    const isFromEnd = type === 'from-end';
    const isHandleFrom = toggle.handle === 'from';
    const isHandleTo = toggle.handle === 'to';
    const withStep = toggle.checkStep;
    const correctToggle = toggle;

    const valueType = withStep ? this.getValueWithStep(toggle.value, min, step) : toggle.value;
    const valueFromDiapason = this.getCorrectDiapason(valueType, min, max);

    if (isRange) {
      if (typeof currentValue === 'object') {
        if (isHandleFrom) {
          const value = this.getCorrectDiapason(valueFromDiapason, min, currentValue.max);
          this.modelOptions.currentValue = { min: value, max: currentValue.max };
          correctToggle.value = value;
        }
        if (isHandleTo) {
          const value = this.getCorrectDiapason(valueFromDiapason, currentValue.min, max);
          this.modelOptions.currentValue = { min: currentValue.min, max: value };
          correctToggle.value = value;
        }
      }
    }

    if (isFromStart || isFromEnd) {
      this.modelOptions.currentValue = valueFromDiapason;
      correctToggle.value = valueFromDiapason;
    }

    this.modelEvents.currentValueChanged.notify(correctToggle);
  }

  private checkModelOptions (options: ICorrectOptions) {
    const { min, max, currentValue, step } = options;
    const confirmedMinMax = this.getCorrectMinMax(min, max);

    this.modelOptions.min = confirmedMinMax.min;
    this.modelOptions.max = confirmedMinMax.max;
    this.modelOptions.currentValue = this.getCorrectCurrentValue(currentValue);
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

    return { min: checkMin, max };
  }

  private getCorrectCurrentValue (currentValue: TCurrentValue): TCurrentValue {
    const { type, min, max } = this.modelOptions;
    const isRange = type === 'range';

    if (typeof currentValue === 'object') {
      if (isRange) {
        const diapason = this.getCorrectMinMax(currentValue.min, currentValue.max);

        return {
          min: this.getCorrectDiapason(diapason.min, min, max),
          max: this.getCorrectDiapason(diapason.max, min, max),
        };
      }
      return this.getCorrectDiapason(currentValue.min, min, max);
    }

    if (typeof currentValue === 'number') {
      const confirmedCurrentValue = this.getCorrectDiapason(currentValue, min, max);

      if (isRange) {
        return {
          min: confirmedCurrentValue,
          max: confirmedCurrentValue,
        };
      }
      return confirmedCurrentValue;
    }

    return (max - min) / 2;
  }
}

export default Model;
