import sliderClassNames from '../utils/sliderClassNames'

class Thumb {
  private dom: HTMLElement;

  constructor () {
  }

  public createDom ():ChildNode {
    const domThumb = document.createElement('div');
    domThumb.classList.add(`${sliderClassNames.thumb}`);

    this.saveDom(domThumb)

    return domThumb;
  }

  public saveDom (el: HTMLElement) {
    this.dom = el;
  }

  public getDom (): HTMLElement {
    return this.dom;
  }
}

export default Thumb