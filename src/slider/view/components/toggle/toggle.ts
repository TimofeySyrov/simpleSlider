import Options from '../../../utils/interfaces/options';
import sliderClassNames from '../../../utils/sliderClassNames';
import convertValueToPercent from '../../../helpers/helpers';

class Toggle {
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

  public getCoords (barLength: number): number {
    const { orientation, direction } = this.options;
    const isVertical = orientation === 'vertical';
    const isFromEnd = direction === 'rtl';
    const offsetType = isVertical ? 'offsetTop' : 'offsetLeft';
    const toggleSize = isVertical ? 'offsetHeight' : 'offsetWidth';
    const coords = this.dom[offsetType] + (this.dom[toggleSize] / 2);
    const reverted = barLength - coords;
    const forVertical = isFromEnd ? coords : reverted;
    const forHorizontal = isFromEnd ? reverted : coords;
    const coordsByOrientation = isVertical ? forVertical : forHorizontal;

    return coordsByOrientation;
  }

  public setValue (value: number): void {
    const { min, max, orientation, direction } = this.options;
    const isVertical = orientation === 'vertical';
    const typeStyleSide = isVertical ? 'bottom' : 'left';
    const percent = convertValueToPercent({ min, max, value, direction });

    this.dom.style[typeStyleSide] = `${percent}%`;
  }

  public setActive (): void {
    const isActive = this.dom.classList.contains(`${sliderClassNames.toggle.active}`);

    if (!isActive) {
      this.dom.classList.add(`${sliderClassNames.toggle.active}`);
    }
  }

  public removeActive (): void {
    this.dom.classList.remove(`${sliderClassNames.toggle.active}`);
  }

  private createDom (): void {
    const domToggle = document.createElement('div');
    domToggle.classList.add(`${sliderClassNames.toggle.main}`);

    this.dom = domToggle;
  }

  private updateStyles (): void {
    const { orientation } = this.options;
    const isVertical = orientation === 'vertical';
    const oldOrientation = isVertical ? 'horizontal' : 'vertical';
    const startSideClear = isVertical ? 'left' : 'bottom';

    this.dom.classList.remove(`${sliderClassNames.toggle[oldOrientation]}`);
    this.dom.style.removeProperty(startSideClear);
    this.dom.classList.add(`${sliderClassNames.toggle[orientation]}`);
  }
}

export default Toggle;
