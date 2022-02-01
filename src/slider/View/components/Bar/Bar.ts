import Options from '../../../utils/interfaces/options';
import sliderClassNames from '../../../utils/sliderClassNames';

class Bar {
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

  /* Получить координаты относительно бара */
  public getRelativeCoords (event: MouseEvent): number {
    const { orientation, direction } = this.options;
    const isVertical = orientation === 'vertical';
    const isRtlDirection = direction === 'rtl';
    const axis = isVertical ? 'clientY' : 'clientX';
    const barOffset = this.getOffset();
    const coords = event[axis] - barOffset;
    const reverted = barOffset - event[axis];
    const forVertical = isRtlDirection ? coords : reverted;
    const forHorizontal = isRtlDirection ? reverted : coords;
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
    const { orientation, direction } = this.options;
    const isVertical = orientation === 'vertical';
    const isRtlDirection = direction === 'rtl';
    const forVertical = isRtlDirection ? 'top' : 'bottom';
    const forHorizontal = isRtlDirection ? 'right' : 'left';
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
