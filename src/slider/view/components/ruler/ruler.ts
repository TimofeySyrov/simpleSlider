import sliderClassNames from '../utils/sliderClassNames'

class Ruler {
  constructor () {

  }

  public getHtml ():ChildNode {
    const htmlDOM = document.createElement('ul');
    htmlDOM.classList.add(`${sliderClassNames.ruler}`);

    const toggleHandle = document.createElement('li');
    toggleHandle.classList.add(`${sliderClassNames.rulerItem}`);

    htmlDOM.appendChild(toggleHandle)

    return htmlDOM
  }
}

export default Ruler