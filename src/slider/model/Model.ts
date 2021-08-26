import IModelOptions from "../interfaces/IModelOptions";
import Observer from "../observer/Observer";

class Model extends Observer {
  
  private modelOptions: IModelOptions;

  constructor(modelOptions: IModelOptions) {
    super();

    this.modelOptions = this.checkModelOptions(modelOptions);
  }

  public updateModelOptions(newModelOptions: IModelOptions) {
    this.modelOptions = this.checkModelOptions(newModelOptions);
    this.notify(this.modelOptions);
  }

  public getModelOptions () {
    return this.modelOptions;
  }

  private checkModelOptions (checkModelOptions: IModelOptions): IModelOptions {
    let confirmedOptions = checkModelOptions;
    const { min, max, currentValue, step } = confirmedOptions;

    /* Если минимальное значение слайдера больше максимального, то 
    минимальному значению присваивается максимальное */
    if(min > max) {
      confirmedOptions.min = max;
    }

    /* Шаг не может быть отрицательным числом или равным нулю.
    Если шаг меньше нуля или равен ему, то шагу присваивается 
    максимально допустимый шаг, относительно значений слайдера */
    if(step <= 0) { 
      confirmedOptions.step = max - min;
    }

    /* Если шаг больше максимального значения слайдера, то шагу 
    присваивается максимально допустимый шаг, относительно значений слайдера */
    if(step > max) {
      confirmedOptions.step = max - min;
    }

    switch (typeof currentValue) {

      case 'number':
        if(currentValue > max) { 
          confirmedOptions.currentValue = max;
        }
        if(currentValue < min) {
          confirmedOptions.currentValue = min;
        }
        break;

      case 'object':
        if(currentValue.min > currentValue.max) {
          confirmedOptions.currentValue = { min: currentValue.max, max: currentValue.max }
        }
        
        break;

      case 'string':
        if(currentValue == 'middle') {
          confirmedOptions.currentValue = (max - min) / 2;
        }
        break;

      default:
        confirmedOptions.currentValue = (max - min) / 2;
        break;
    }

    return confirmedOptions;
  }
}

export default Model