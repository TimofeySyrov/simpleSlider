import sliderClassNames from '../utils/sliderClassNames'

class Range {
  
  private dom: HTMLElement;
  
  constructor () {
    
    this.createDom();
  }

  private createDom () {
    const rangeDom = document.createElement('div');
    rangeDom.classList.add(`${sliderClassNames.range}`);

    this.saveDom(rangeDom);
  }

  public saveDom (el: HTMLElement) {
    this.dom = el;
  }

  public getDom (): HTMLElement {
    return this.dom;
  }
}

export default Range;