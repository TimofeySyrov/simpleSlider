import sliderClassNames from '../utils/sliderClassNames'

class Toggle {
  private dom: HTMLElement;

  constructor () {
  }

  public createDom ():ChildNode {
    const domToggle = document.createElement('div');
    domToggle.classList.add(`${sliderClassNames.toggle}`);

    this.saveDom(domToggle)

    return domToggle;
  }

  public saveDom (el: HTMLElement) {
    this.dom = el;
  }

  public getDom (): HTMLElement {
    return this.dom;
  }
}

export default Toggle