import sliderClassNames from '../../../utils/sliderClassNames'

class Scale {
  
  private dom!: HTMLElement;

  constructor() {

    this.createDom();
  }

  private createDom () {
    const domScale = document.createElement('ul');
    domScale.classList.add(`${sliderClassNames.scale.main}`);

    this.saveDom(domScale);
  }

  public addItem (value: number): HTMLElement {
    const domScaleItem = document.createElement('li');
    domScaleItem.classList.add(`${sliderClassNames.scaleItem.main}`);

    domScaleItem.setAttribute(`data-value`, `${value}`);
    domScaleItem.innerHTML = `${value}`;
    this.dom.appendChild(domScaleItem);
    return domScaleItem;
  }

  public getItems (): NodeListOf<HTMLElement> {
    const list = this.dom.querySelectorAll(`.${sliderClassNames.scaleItem.main}`);
    return list as NodeListOf<HTMLElement>;
  }

  public saveDom (el: HTMLElement) {
    this.dom = el;
  }

  public getDom (): HTMLElement {
    return this.dom;
  }
}

export default Scale;