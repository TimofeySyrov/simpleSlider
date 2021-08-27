import sliderClassNames from '../utils/sliderClassNames'

class Toggle {
  private dom: HTMLElement;
  constructor () {

  }

  public getHtml ():ChildNode {
    const htmlDOM = document.createElement('div');
    htmlDOM.classList.add(`${sliderClassNames.toggle}`);

    const toggleHandle = document.createElement('input');
    toggleHandle.classList.add(`${sliderClassNames.toggleHandle}`);

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

export default Toggle