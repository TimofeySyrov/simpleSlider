import sliderClassNames from '../utils/sliderClassNames'

class Thumb {
  private dom: HTMLElement;
  constructor () {

  }

  public getHtml ():ChildNode {
    const htmlDOM = document.createElement('div');
    htmlDOM.classList.add(`${sliderClassNames.thumb}`);
    htmlDOM.innerHTML = '0';
    this.saveDom(htmlDOM);

    return htmlDOM
  }

  public saveDom (el: HTMLElement) {
    this.dom = el;
  }

  public getDom (): HTMLElement {
    return this.dom;
  }
}

export default Thumb