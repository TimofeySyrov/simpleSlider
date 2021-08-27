import sliderClassNames from '../utils/sliderClassNames'

class Ruler {
  private dom: HTMLElement;
  constructor () {

  }

  public getHtml ():ChildNode {
    const htmlDOM = document.createElement('ul');
    htmlDOM.classList.add(`${sliderClassNames.ruler}`);

    const toggleHandle = document.createElement('li');
    toggleHandle.classList.add(`${sliderClassNames.rulerItem}`);

    htmlDOM.appendChild(toggleHandle)
    this.saveDom(htmlDOM)

    return htmlDOM
  }

  public saveDom (el: HTMLElement) {
    this.dom = el;
  }

  public getDom (): HTMLElement {
    return this.dom;
  }
}

export default Ruler