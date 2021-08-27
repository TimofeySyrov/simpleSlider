import sliderClassNames from '../utils/sliderClassNames'

class Bar {
  
  private dom: HTMLElement;
  
  constructor () {
    
  }

  public getHtml ():ChildNode {
    const bar = document.createElement('div');
    bar.classList.add(`${sliderClassNames.bar}`);

    const barScale = document.createElement('div');
    barScale.classList.add(`${sliderClassNames.barScale}`);

    bar.appendChild(barScale)
    this.saveDom(bar);

    return bar;
  }

  public saveDom (el: HTMLElement) {
    this.dom = el;
  }

  public getDom (): HTMLElement {
    return this.dom;
  }
}

export default Bar;