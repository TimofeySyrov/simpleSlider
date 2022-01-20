import ICorrectOptions from '../../../utils/interfaces/ICorrectOptions';
import sliderClassNames from '../../../utils/sliderClassNames';

class Thumb {
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

  public setValue (value: number) {
    this.dom.innerHTML = `${value}`;
  }

  private createDom (): void {
    const domThumb = document.createElement('div');
    domThumb.classList.add(`${sliderClassNames.thumb.main}`);

    this.dom = domThumb;
  }

  private updateStyles (): void {
    const { orientation } = this.options;
    const isVertical = orientation === 'vertical';
    const oldOrientation = isVertical ? 'horizontal' : 'vertical';

    this.dom.classList.remove(`${sliderClassNames.thumb[oldOrientation]}`);
    this.dom.classList.add(`${sliderClassNames.thumb[orientation]}`);
  }
}

export default Thumb;
