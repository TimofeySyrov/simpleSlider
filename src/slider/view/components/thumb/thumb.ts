import sliderClassNames from '../utils/sliderClassNames'

class Thumb {
  constructor () {

  }

  public getHtml ():ChildNode {
    const htmlDOM = document.createElement('div');
    htmlDOM.classList.add(`${sliderClassNames.thumb}`);
    htmlDOM.innerHTML = '0';

    return htmlDOM
  }
}

export default Thumb