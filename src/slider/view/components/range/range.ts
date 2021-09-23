import sliderClassNames from '../../../utils/sliderClassNames';

class Range {
  private dom!: HTMLDivElement;

  constructor () {
    this.createDom();
  }

  private createDom () {
    const rangeDom = document.createElement('div');
    rangeDom.classList.add(`${sliderClassNames.range.main}`);

    this.saveDom(rangeDom);
  }

  public saveDom (el: HTMLDivElement) {
    this.dom = el;
  }

  public getDom (): HTMLDivElement {
    return this.dom;
  }
}

export default Range;
