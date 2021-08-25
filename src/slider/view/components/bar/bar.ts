import sliderClassNames from '../utils/sliderClassNames'

class Bar {
  
  constructor () {
    
  }

  public getHtml ():ChildNode {
    const htmlDOM = document.createElement('div');
    htmlDOM.classList.add(`${sliderClassNames.bar}`);

    const barScale = document.createElement('div');
    barScale.classList.add(`${sliderClassNames.barScale}`);

    htmlDOM.appendChild(barScale)

    return htmlDOM
  }
}

export default Bar