import ICorrectOptions from '../../../utils/interfaces/ICorrectOptions';
import sliderClassNames from '../../../utils/sliderClassNames';

class Bar {
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

  /* Получить координаты относительно бара */
  public getRelativeCoords (event: MouseEvent): number {
    const { orientation, type } = this.options;
    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';
    const axis = isVertical ? 'clientY' : 'clientX';
    const barOffset = this.getOffset();
    const coords = event[axis] - barOffset;
    const reverted = barOffset - event[axis];
    const forVertical = isFromEnd ? coords : reverted;
    const forHorizontal = isFromEnd ? reverted : coords;
    const coordsByOrientation = isVertical ? forVertical : forHorizontal;

    return coordsByOrientation;
  }

  /* Получить значение по координатам относительно бара */
  public getValueByCoords (coords: number): number {
    const { max, min, step } = this.options;
    const barLength = this.getLength();
    const value = Number(((coords * (max - min)) / barLength + min));
    const valueWithStep = Number((Math.round((value - min) / step) * step + min).toFixed(1));

    return valueWithStep;
  }

  /* Получить длину бара */
  public getLength (): number {
    const { orientation } = this.options;
    const isVertical = orientation === 'vertical';
    const lengthType = isVertical ? 'offsetHeight' : 'offsetWidth';

    return this.dom[lengthType];
  }

  /* Получить отступ бара относительно видимой части страницы */
  public getOffset (): number {
    const { orientation, type } = this.options;
    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';
    const forVertical = isFromEnd ? 'top' : 'bottom';
    const forHorizontal = isFromEnd ? 'right' : 'left';
    const side = isVertical ? forVertical : forHorizontal;

    return this.dom.getBoundingClientRect()[side];
  }

  private createDom (): void {
    const barDom = document.createElement('div');
    barDom.classList.add(`${sliderClassNames.bar.main}`);

    this.dom = barDom;
  }

  private updateStyles (): void {
    const { orientation } = this.options;
    const isVertical = orientation === 'vertical';
    const oldOrientation = isVertical ? 'horizontal' : 'vertical';

    this.dom.classList.remove(`${sliderClassNames.bar[oldOrientation]}`);
    this.dom.classList.add(`${sliderClassNames.bar[orientation]}`);
  }
}

export default Bar;
