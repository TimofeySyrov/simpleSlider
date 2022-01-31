import Observer from '../observer/Observer';
import Options from '../utils/interfaces/options';
import { UpdateValues } from '../utils/types/namespace';

class Model extends Observer {
  private correctOptions: Options;

  get options (): Options {
    return this.correctOptions;
  }

  constructor (options: Options) {
    super();

    this.correctOptions = options;
    this.validateOptions(options);
  }

  public updateOptions (options: Partial<Options>): void {
    this.correctOptions = { ...this.correctOptions, ...options };
    this.validateOptions(options);
  }

  /* Метод обновления from и to опций в потоке */
  public updateValues ({ option, value }: UpdateValues): void {
    const { min, max, from, to } = this.options;
    const isRange = to !== undefined && !Number.isNaN(to);
    const isValue = !Number.isNaN(value);
    const isFromOption = option === 'from';
    const isToOption = option === 'to';
    
    if (isValue) {
      if (isRange) {
        /* Если есть to, и передано значение для from */
        if (isFromOption) {
          const correct = Model.getCorrectValueFromDiapason(value, min, to as number);

          this.options.from = correct;
          this.notify('updateValues', { option: 'from', value: correct });
        }
      }

      /* Если нет to, и передано значение для from */
      if (!isRange) {
        const valueFromDiapason = Model.getCorrectValueFromDiapason(value, min, max);

        this.options.from = valueFromDiapason;
        this.notify('updateValues', { option: 'from', value: valueFromDiapason });
      }

      /* Если нет to, и передано значение для to */
      if (isToOption) {
        const correct = Model.getCorrectValueFromDiapason(value, from, max);

        this.options.to = correct;
        this.notify('updateValues', { option: 'to', value: correct });
      }
    }
  }

  private validateOptions (options: Partial<Options>): void {
    const hasOptions = options !== undefined && options !== null && options !== {};

    if (hasOptions) {
      Object.keys(options).forEach((key) => this.handleOption(key));
      this.notify('updateOptions', this.correctOptions);
    }
  }

  private handleOption (option: string) {
    switch (option) {
      case 'min':
      case 'max':
        this.handleMinMax();
        break;
      case 'from':
      case 'to':
        this.handleFromTo();
        break;
      case 'step':
        this.handleStep();
        break;
      default: break;
    }
  }

  private handleMinMax (): void {
    const { min, max } = this.correctOptions;
    const correct = Model.getCorrectDiapason(min, max);

    this.correctOptions.min = correct.min;
    this.correctOptions.max = correct.max;
  }

  private handleFromTo (): void {
    const { min, max, from, to } = this.correctOptions;
    const hasTo = to !== undefined && !Number.isNaN(to);
    const isNanFrom = Number.isNaN(from);
    const correctFrom = Model.getCorrectValueFromDiapason(from, min, max);

    if (hasTo) {
      const correctTo = Model.getCorrectValueFromDiapason(to as number, min, max);

      this.correctOptions.from = Model.getCorrectValueFromDiapason(correctFrom, min, correctTo);
      this.correctOptions.to = Model.getCorrectValueFromDiapason(correctTo, correctFrom, max);
    }

    if (!hasTo) {
      if (!isNanFrom) {
        this.correctOptions.from = correctFrom;
      } else {
        this.correctOptions.from = min;
      }
    }
  }

  private handleStep (): void {
    const { min, max, step } = this.correctOptions;

    this.correctOptions.step = Model.getCorrectStep(step, min, max);
  }

  static getCorrectStep (step: number, min: number, max: number): number {
    const maxStep = max - min;

    if (step <= 0) return maxStep;
    if (step > maxStep) return maxStep;

    return step;
  }

  static getCorrectValueFromDiapason (value: number, min: number, max: number): number {
    if (value <= min) { return min; }
    if (value >= max) { return max; }
    return value;
  }

  static getCorrectDiapason (min: number, max: number): { min: number, max: number } {
    const checkMin = min > max ? max : min;

    return { min: checkMin, max };
  }
}

export default Model;
