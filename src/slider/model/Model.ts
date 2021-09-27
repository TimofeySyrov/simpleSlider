import IModelEvents from '../utils/interfaces/model/IModelEvents';
import ICorrectOptions from '../utils/interfaces/ICorrectOptions';
import { TCurrentValue, TUpdateCurrentValue } from '../utils/types/namespace';
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

  public updateCurrentValueOption (newValue: TUpdateCurrentValue): void {
    const { min, max, type, currentValue, step } = this.modelOptions;
    const isRange = type === 'range';
    const isFromStart = type === 'from-start';
    const isFromEnd = type === 'from-end';
    const isFrom = newValue.option === 'from';
    const isTo = newValue.option === 'to';
    const confirmed: TUpdateCurrentValue = { ...newValue };

    const valueFromDiapason = this.getCorrectDiapason(newValue.value, min, max);

    if (isRange) {
      if (typeof currentValue === 'object') {
        if (isFrom) {
          const value = this.getCorrectDiapason(valueFromDiapason, min, currentValue.to);
          this.modelOptions.currentValue = { from: value, to: currentValue.to };
          confirmed.value = value;
        }
        if (isTo) {
          const value = this.getCorrectDiapason(valueFromDiapason, currentValue.from, max);
          this.modelOptions.currentValue = { from: currentValue.from, to: value };
          confirmed.value = value;
        }
      }
    }

    if (isFromStart || isFromEnd) {
      this.modelOptions.currentValue = valueFromDiapason;
      confirmed.value = valueFromDiapason;
    }

    this.modelEvents.currentValueChanged.notify(confirmed);
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

  private getCorrectMinMax (min: number, max: number): { min: number, max: number } {
    const checkMin = min > max ? max : min;

    return { min: checkMin, max };
  }

  private getCorrectCurrentValue (currentValue: TCurrentValue): TCurrentValue {
    const { type, min, max } = this.modelOptions;
    const isRange = type === 'range';

    if (typeof currentValue === 'object') {
      if (isRange) {
        const diapason = this.getCorrectMinMax(currentValue.from, currentValue.to);

        return {
          from: this.getCorrectDiapason(diapason.min, min, max),
          to: this.getCorrectDiapason(diapason.max, min, max),
        };
      }
      return this.getCorrectDiapason(currentValue.from, min, max);
    }

    if (typeof currentValue === 'number') {
      const confirmedCurrentValue = this.getCorrectDiapason(currentValue, min, max);

      if (isRange) {
        return {
          from: confirmedCurrentValue,
          to: confirmedCurrentValue,
        };
      }
      return confirmedCurrentValue;
    }

    return (max - min) / 2;
  }
}

export default Model;
