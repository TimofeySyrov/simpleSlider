import sliderClassNames from '../utils/sliderClassNames'

class Bar {
  
  private dom: HTMLElement;
  
  constructor () {
    
    this.createDom();
  }

  private createDom () {
    const barDom = document.createElement('div');
    barDom.classList.add(`${sliderClassNames.bar}`);

    this.saveDom(barDom);
  }

  public saveDom (el: HTMLElement) {
    this.dom = el;
  }

  public getDom (): HTMLElement {
    return this.dom;
  }
}

export default Bar;