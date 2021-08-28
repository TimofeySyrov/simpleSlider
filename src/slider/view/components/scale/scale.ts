import sliderClassNames from '../utils/sliderClassNames'

class Scale {
  private dom: HTMLElement;
  constructor () {

    this.createDom();
  }

  private createDom () {
    const domScale = document.createElement('div');
    domScale.classList.add(`${sliderClassNames.scale}`);

    this.saveDom(domScale);
  }

  public saveDom (el: HTMLElement) {
    this.dom = el;
  }

  public getDom (): HTMLElement {
    return this.dom;
  }
}

export default Scale;