import sliderClassNames from '../utils/sliderClassNames'

class Toggle {
  constructor () {

  }

  public getHtml ():ChildNode {
    const htmlDOM = document.createElement('div');
    htmlDOM.classList.add(`${sliderClassNames.toggle}`);

    const toggleHandle = document.createElement('input');
    toggleHandle.classList.add(`${sliderClassNames.toggleHandle}`);

    htmlDOM.appendChild(toggleHandle)

    return htmlDOM
  }
}

export default Toggle