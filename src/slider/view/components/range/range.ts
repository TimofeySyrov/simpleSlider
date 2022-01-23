import ICorrectOptions from '../../../utils/interfaces/ICorrectOptions';
import sliderClassNames from '../../../utils/sliderClassNames';

class Range {
  private dom!: HTMLDivElement;
  private options: ICorrectOptions;

  constructor (options: ICorrectOptions) {
    this.options = options;

    this.createDom();
  }

  public updateState (options: ICorrectOptions): void {
    this.options = options;
    this.updateStyles();
  }

  public getDom (): HTMLDivElement {
    return this.dom;
  }

  public setLenght (fromValue: number, toValue: number): void {
    const { orientation, type, withRange } = this.options;
    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';
    const isFromStart = type === 'from-start';
    const isRange = type === 'range';
    const sideStart = isVertical ? 'bottom' : 'left';
    const sideEnd = isVertical ? 'top' : 'right';

    if (withRange) {
      const fromPercent = fromValue;
      const toPercent = 100 - toValue;

      if (isFromStart) {
        this.dom.style[sideStart] = '0';
        this.dom.style[sideEnd] = `${100 - fromPercent}%`;
      }

      if (isFromEnd) {
        this.dom.style[sideStart] = `${fromPercent}%`;
        this.dom.style[sideEnd] = '0';
      }

      if (isRange) {
        this.dom.style[sideStart] = `${fromPercent}%`;
        this.dom.style[sideEnd] = `${toPercent}%`;
      }
    }
  }

  private createDom (): void {
    const rangeDom = document.createElement('div');
    rangeDom.classList.add(`${sliderClassNames.range.main}`);

    this.dom = rangeDom;
  }

  private updateStyles (): void {
    const { orientation } = this.options;
    const isVertical = orientation === 'vertical';
    const oldOrientation = isVertical ? 'horizontal' : 'vertical';
    const startSideClear = isVertical ? 'left' : 'bottom';
    const endSideClear = isVertical ? 'right' : 'top';
    
    this.dom.classList.remove(`${sliderClassNames.range[oldOrientation]}`);
    this.dom.classList.add(`${sliderClassNames.range[orientation]}`);
    this.dom.style[startSideClear] = '0';
    this.dom.style[endSideClear] = '0';
  }
}

export default Range;
