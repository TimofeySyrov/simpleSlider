import ICorrectOptions from '../../../utils/interfaces/ICorrectOptions';
import sliderClassNames from '../../../utils/sliderClassNames';
import convertValueToPercent from '../../../helpers/helpers';

class Scale {
  private dom!: HTMLElement;
  private options: ICorrectOptions;

  constructor (options: ICorrectOptions) {
    this.options = options;

    this.init();
  }

  public updateState (options: ICorrectOptions): void {
    this.options = options;
    this.updateStyles();
    this.createScaleItems();
  }

  /* Получить массив с значениями шкалы */
  public getValues (): number[] {
    const { max, min, step } = this.options;
    const middleValue = Math.ceil((max - min) / step);
    const valueWithStep = Math.ceil(middleValue / 6) * step;
    const values = [];
    let value = min;

    for (let i = 0; value < max; i += 1) {
      value += valueWithStep;
      if (value < max) {
        values.push(value);
      }
    }

    return [min, ...values, max];
  }

  public addItem (value: number): HTMLElement {
    const { orientation, type, min, max } = this.options;
    const isVertical = orientation === 'vertical';
    const typeStyleSide = isVertical ? 'bottom' : 'left';
    const domItem = document.createElement('li');
    const indentPercent = convertValueToPercent({ min, max, value, type });

    domItem.classList.add(`${sliderClassNames.scaleItem.main}`, `${sliderClassNames.scaleItem[orientation]}`);
    domItem.setAttribute('data-value', `${value}`);
    domItem.innerHTML = `${value}`;
    domItem.style[typeStyleSide] = `${indentPercent}%`;
    this.dom.appendChild(domItem);

    return domItem;
  }

  public getItems (): NodeListOf<HTMLElement> {
    const list = this.dom.querySelectorAll(`.${sliderClassNames.scaleItem.main}`);
    return list as NodeListOf<HTMLElement>;
  }

  public getDom (): HTMLElement {
    return this.dom;
  }

  private init (): void {
    this.createDom();
    this.createScaleItems();
  }

  private createDom (): void {
    const domScale = document.createElement('ul');
    domScale.classList.add(`${sliderClassNames.scale.main}`);
    this.dom = domScale;
  }

  private createScaleItems (): void {
    this.dom.innerHTML = '';
    this.getValues().forEach((value) => this.addItem(Number(value.toFixed(1))));
  }

  private updateStyles (): void {
    const { orientation } = this.options;
    const isVertical = orientation === 'vertical';
    const oldOrientation = isVertical ? 'horizontal' : 'vertical';

    this.dom.classList.remove(`${sliderClassNames.scale[oldOrientation]}`);
    this.dom.classList.add(`${sliderClassNames.scale[orientation]}`);
    this.getItems().forEach((item) => {
      item.classList.remove(`${sliderClassNames.scaleItem[oldOrientation]}`);
      item.classList.add(`${sliderClassNames.scaleItem[orientation]}`);
    });
  }
}

export default Scale;
