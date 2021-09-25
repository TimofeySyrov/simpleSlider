import IModelEvents from '../utils/interfaces/model/IModelEvents';
import ICorrectOptions from '../utils/interfaces/ICorrectOptions';
import Observer from '../observer/Observer';
import defaultModelOptions from '../utils/defaultModelOptions';

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
    this.setCorrectOptions();
  }

  public updateOptions (options: ICorrectOptions): void {
    this.modelOptions = options;
    this.setCorrectOptions();
    this.notify(this.modelOptions);
  }

  private setCorrectOptions (): void {
    this.setCorrectDiapason();
    this.setCorrectCurrentValues();
    this.setCorrectStep();
  }

  private setCorrectDiapason (): void {
    const { min, max } = this.modelOptions;
    if (min > max) {
      this.modelOptions.min = max;
    }
  }

  private setCorrectCurrentValues (): void {
    const { currentValues, type, min, max } = this.modelOptions;
    const isRange = type === 'range';
    const isFromStart = type === 'from-start';
    const isFromEnd = type === 'from-end';

    if (!currentValues.max) {
      this.modelOptions.currentValues.max = defaultModelOptions.currentValues.max;
    }

    if (currentValues.min < min) {
      this.modelOptions.currentValues.min = min;
    }

    if (isFromStart || isFromEnd) {
      if (currentValues.min > max) {
        this.modelOptions.currentValues.min = max;
      }
    }
    
    if (isRange) {
      if (currentValues.max > max) {
        this.modelOptions.currentValues.max = max;
      }
      if (currentValues.min > currentValues.max) {
        this.modelOptions.currentValues.min = currentValues.max;
      }
    }

    this.modelEvents.currentValueChanged.notify(this.modelOptions.currentValues);
  }

  private setCorrectStep (): void {
    const { max, min, step } = this.modelOptions;
    const maxStep = max - min;
    const lessThanZeroOrEqual = step <= 0;
    const moreThanMaxStep = step > maxStep;

    if (lessThanZeroOrEqual || moreThanMaxStep) {
      this.modelOptions.step = maxStep;
    }
  }
}

export default Model;
