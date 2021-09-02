import sliderClassNames from '../utils/sliderClassNames'

class Scale {
  private dom: HTMLDivElement;
  constructor () {

    this.createDom();
  }

  private createDom () {
    const domScale = document.createElement('div');
    domScale.classList.add(`${sliderClassNames.scale.main}`);

    this.saveDom(domScale);
  }

  public saveDom (el: HTMLDivElement) {
    this.dom = el;
  }

  public getDom (): HTMLDivElement {
    return this.dom;
  }
}

export default Scale;