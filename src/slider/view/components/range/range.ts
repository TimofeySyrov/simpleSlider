import Options from '../../../utils/interfaces/options';
import sliderClassNames from '../../../utils/sliderClassNames';

class Range {
  private dom!: HTMLDivElement;
  private options: Options;

  constructor (options: Options) {
    this.options = options;

    this.createDom();
  }

  public updateState (options: Options): void {
    this.options = options;
    this.updateStyles();
  }

  public getDom (): HTMLDivElement {
    return this.dom;
  }

  public setLength (fromValue: number, toValue: number): void {
    const { orientation, direction, withRange, to } = this.options;
    const isVertical = orientation === 'vertical';
    const isLtrDirection = direction === 'ltr';
    const isRange = to !== undefined && !Number.isNaN(toValue);
    const sideStart = isVertical ? 'bottom' : 'left';
    const sideEnd = isVertical ? 'top' : 'right';

    if (withRange) {
      const fromPercent = fromValue;
      const toPercent = 100 - toValue;

      if (isRange) {
        this.dom.style[sideStart] = isLtrDirection ? `${fromPercent}%` : `${100 - toPercent}%`;
        this.dom.style[sideEnd] = isLtrDirection ? `${toPercent}%` : `${100 - fromPercent}%`;
      } else {
        this.dom.style[sideStart] = isLtrDirection ? '0' : `${fromPercent}%`;
        this.dom.style[sideEnd] = isLtrDirection ? `${100 - fromPercent}%` : '0';
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
