import Observer from "../observer/Observer";

import IModelOptions from "../interfaces/IModelOptions";
import sliderClassNames from "./components/utils/sliderClassNames";

import Range from "./components/range/range";
import Toggle from "./components/toggle/toggle";
import Thumb from "./components/thumb/thumb";
import Scale from "./components/scale/scale";
import Bar from "./components/bar/bar";

class View extends Observer {

  private modelOptions: IModelOptions;
  private domParent: HTMLDivElement;

  private bar: Bar;
  private range: Range;
  private from: Toggle;
  private to: Toggle;
  private thumb: Thumb;
  private scale: Scale;

  constructor (domParent: HTMLDivElement, modelOptions: IModelOptions) {
    super();

    this.domParent = domParent;
    this.modelOptions = modelOptions;
    this.render();
  }

  public updateModelOptions (newModelOptions: IModelOptions) {
    this.modelOptions = newModelOptions;
  }

  private render () {
    this.initViewComponents();
    this.createDomSlider();
  }

  private initViewComponents () {
    const { type, withThumb, withScale } = this.modelOptions;

    this.bar = new Bar();
    this.range = new Range();
    this.from = new Toggle();
    if(type === 'range') {
      this.to = new Toggle();
    }
    if(withThumb) {
      this.thumb = new Thumb();
    }
    if(withScale) {
      this.scale = new Scale();
    }
  }

  private createDomSlider () {
    const domSlider = document.createElement('div');
    domSlider.classList.add(`${sliderClassNames.slider}`);
    
    const domBar = this.bar.getDom();
    const domRange = this.range.getDom();
    const domFrom = this.from.createDom();
    const domScale = this.scale.getDom();
    
    domBar.appendChild(domRange);
    domBar.appendChild(domFrom).appendChild(this.thumb.createDom());
    if(this.to)  {
      const domTo = this.to.createDom();
      domBar.appendChild(domTo).appendChild(this.thumb.createDom());
    }
    domSlider.appendChild(domBar);
    domSlider.appendChild(domScale);

    this.domParent.appendChild(domSlider);
    this.bar.getDom().addEventListener("click", this.getClickPercentPosition.bind(this));
  }

  private getBarInfo(): {length: number, offset: number} {
    const { orientation, type } = this.modelOptions;
    let length;
    let offset;

    if(orientation === 'horizontal') {
      length = this.bar.getDom().offsetWidth;
      offset = this.bar.getDom().getBoundingClientRect().left;
      
      if(type === 'from-end') {
        offset = this.bar.getDom().getBoundingClientRect().right;
      }
    }
    if(orientation === 'vertical') {
      length = this.bar.getDom().offsetHeight;
      offset = this.bar.getDom().getBoundingClientRect().bottom;
      
      if(type === 'from-start') {
        offset = this.bar.getDom().getBoundingClientRect().top;
      }
    }

    return {length, offset};
  }

  private getClickPercentPosition (event: MouseEvent) {
    const { orientation, type } = this.modelOptions;
    const barInfo = this.getBarInfo();
    const horizontal = orientation === 'horizontal';
    const clickPosition = horizontal ? event.pageX : event.pageY;
    const pixelPosition = type === 'from-end' ? (barInfo.offset - clickPosition) : (clickPosition - barInfo.offset);
    const percentPosition = (pixelPosition / barInfo.length) * 100;

    // return percentPosition;
    console.log(percentPosition)
    this.setClickRangePosition(percentPosition);  
  }

  private setClickRangePosition (percent: number) {
    const { orientation, type } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const stylePercent = horizontal ? 100-percent : 100-(percent * (-1)); //разберись че почему при вертикальном отрицательный процент идет (-1) убери
    const typeStyle = horizontal 
    ? type === 'from-end' 
    ? `left` : `right` 
    : type === 'from-start' 
    ? `bottom` : `top`;

    this.range.getDom().style[typeStyle] = `${stylePercent}%`;
  }
}

export default View;