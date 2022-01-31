import Options from '../../../slider/utils/interfaces/options';

class Slider {
  private body: HTMLElement | null;
  private options: Partial<Options> | undefined;

  constructor (domParent: HTMLElement, options?: Partial<Options>) {
    this.body = domParent.querySelector('.js-slider');
    this.options = options;

    this.init();
  }

  public getDom (): HTMLElement | null {
    return this.body;
  }

  private init (): void {
    const { body, options } = this;
    const hasBody = body !== undefined && body !== null;

    if (hasBody) {
      $(body).simpleSlider(options);
    }
  }
}

export default Slider;
