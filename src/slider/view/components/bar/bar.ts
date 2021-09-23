import sliderClassNames from '../../../utils/sliderClassNames';

class Bar {
  private dom!: HTMLDivElement;

  constructor () {
    this.createDom();
  }

  private createDom () {
    const barDom = document.createElement('div');
    barDom.classList.add(`${sliderClassNames.bar.main}`);

    this.saveDom(barDom);
  }

  public saveDom (el: HTMLDivElement) {
    this.dom = el;
  }

  public getDom (): HTMLDivElement {
    return this.dom;
  }
}

export default Bar;
