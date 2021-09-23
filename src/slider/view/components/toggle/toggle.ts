import sliderClassNames from '../../../utils/sliderClassNames';

class Toggle {
  private dom!: HTMLDivElement;

  constructor () {
  }

  public createDom (): HTMLDivElement {
    const domToggle = document.createElement('div');
    domToggle.classList.add(`${sliderClassNames.toggle.main}`);

    this.saveDom(domToggle);

    return domToggle;
  }

  public saveDom (el: HTMLDivElement) {
    this.dom = el;
  }

  public getDom (): HTMLDivElement {
    return this.dom;
  }
}

export default Toggle;
