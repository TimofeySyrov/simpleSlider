import sliderClassNames from '../../../utils/sliderClassNames';

class Thumb {
  private dom!: HTMLDivElement;

  constructor () {
    this.createDom();
  }

  public createDom (): void {
    const domThumb = document.createElement('div');
    domThumb.classList.add(`${sliderClassNames.thumb.main}`);

    this.saveDom(domThumb);
  }

  public saveDom (el: HTMLDivElement) {
    this.dom = el;
  }

  public getDom (): HTMLDivElement {
    return this.dom;
  }
}

export default Thumb;
