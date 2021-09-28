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

  public updateOptions (options: ICorrectOptions): void {
    this.modelOptions = options;
    this.checkModelOptions(options);
    this.notify(this.modelOptions);
  }

  public updateCurrentValue (newValue: TUpdateCurrentValue): void {
    const { min, max, type, currentValue } = this.modelOptions;
    const confirmed: TUpdateCurrentValue = { ...newValue };
    const { option, value } = confirmed;
    const isRange = type === 'range';
    const isFromStart = type === 'from-start';
    const isFromEnd = type === 'from-end';
    const isValue = !Number.isNaN(value);
    const isFromOption = option === 'from';
    const isToOption = option === 'to';
    
    if(isValue) {
      if (isRange) {
        if (typeof currentValue === 'object') {
          const { from, to } = currentValue;

          if (isFromOption) {
            const correct = this.getCorrectDiapason(value, min, to);
            this.modelOptions.currentValue = { from: correct, to };
            confirmed.value = correct;
          }
          
          if (isToOption) {
            const correct = this.getCorrectDiapason(value, from, max);
            this.modelOptions.currentValue = { from, to: correct };
            confirmed.value = correct;
          }
        }
      }

      if (isFromStart || isFromEnd) {
        const valueFromDiapason = this.getCorrectDiapason(value, min, max);

        this.modelOptions.currentValue = valueFromDiapason;
        confirmed.value = valueFromDiapason;
      }

      this.modelEvents.currentValueChanged.notify(confirmed);
    }
  }

  private checkModelOptions (options: ICorrectOptions) {
    const { min, max, currentValue, step } = options;
    const confirmedMinMax = this.getCorrectMinMax(min, max);

    this.modelOptions.min = confirmedMinMax.min;
    this.modelOptions.max = confirmedMinMax.max;
    this.modelOptions.currentValue = this.getCorrectCurrentValue(currentValue);
    this.modelOptions.step = this.getCorrectStep(step, confirmedMinMax.min, confirmedMinMax.max);

    this.modelEvents.modelOptionsChanged.notify(this.modelOptions);
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
    const isRangeType = type === 'range';
    const isFromStartType = type === 'from-start';
    const isFromEndType = type === 'from-end';
    const isValue = !Number.isNaN(currentValue);

    if(isValue) {
      if(isRangeType) {
        if(typeof currentValue === 'number') {
          const value = this.getCorrectDiapason(currentValue, min, max);
          return { from: value, to: value };
        }

        if(typeof currentValue === 'object') {
          const valuesDiapason = this.getCorrectMinMax(currentValue.from, currentValue.to);
          return {
            from: this.getCorrectDiapason(valuesDiapason.min, min, max),
            to: this.getCorrectDiapason(valuesDiapason.max, min, max),
          };
        }
      }

      if (isFromStartType || isFromEndType) {
        if(typeof currentValue === 'number') {
          const value = this.getCorrectDiapason(currentValue, min, max);
          return value;
        }

        if (typeof currentValue === 'object') {
          const from = this.getCorrectDiapason(currentValue.from, min, max);
          return from;
        }
      }
    }

    return min;
  }
}

export default Model;
