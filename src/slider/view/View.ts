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

  private setClassesFromOrientation () {
    const { orientation } = this.modelOptions;
    const vertical = orientation === 'vertical';

    if(vertical) {
      this.bar.getDom().classList.add(`${sliderClassNames.barVertical}`);
      this.range.getDom().classList.add(`${sliderClassNames.rangeVertical}`);
      this.from.getDom().classList.add(`${sliderClassNames.toggleVertical}`);
      this.to.getDom().classList.add(`${sliderClassNames.toggleVertical}`);
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

    this.setClassesFromOrientation();
    this.domParent.appendChild(domSlider);
    this.bar.getDom().addEventListener("click", this.eventMouseClick.bind(this));
  }

  private eventMouseClick (event: MouseEvent) {
    const element = (event.target as Element);
    const bar = element.classList.contains(`${sliderClassNames.bar}`);
    const range = element.classList.contains(`${sliderClassNames.range}`);
    const toggle = element.classList.contains(`${sliderClassNames.toggle}`);
    const thumb = element.classList.contains(`${sliderClassNames.thumb}`);
    const percent = this.getClickPercentPosition(event);
    const { type } = this.modelOptions;

    this.setClickRangePosition(percent)
    this.setTogglePosition(this.from.getDom(), percent);
  }

  private setLastToggle (toggle: HTMLDivElement) {
    if(!toggle.classList.contains(`last-active`)) {
      this.from.getDom().classList.remove(`last-active`);
      this.to.getDom().classList.remove(`last-active`);
      toggle.classList.add(`last-active`)
    }
  }

  private getBarLength ():number {
    const { orientation } = this.modelOptions;
    const lengthType = orientation === 'vertical' ? `offsetHeight` : `offsetWidth`;
    const length = this.bar.getDom()[lengthType];

    return length;
  }

  private getBarOffset():number {
    const { orientation, type } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const fromEnd = type === 'from-end';
    const fromStart = type === 'from-start';
    const offsetSide = horizontal ? fromEnd ? `right` : `left` : fromStart ? `top` : `bottom`;
    const offset = this.bar.getDom().getBoundingClientRect()[offsetSide];

    return offset;
  }

  private getClickPercentPosition (event: MouseEvent) {
    const { orientation, type } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const fromEnd = type === 'from-end';
    const fromStart = type === 'from-start';
    const clickPosition = horizontal ? event.pageX : event.pageY;
    const barLength = this.getBarLength();
    const barOffset = this.getBarOffset();
    let pixelPosition: number;

    if(horizontal) {
      pixelPosition = fromEnd ? (barOffset - clickPosition) : (clickPosition - barOffset);
    }
    if(!horizontal) {
      pixelPosition = fromStart ? (clickPosition - barOffset) : (barOffset - clickPosition);
    }
    
    const percentPosition = (pixelPosition / barLength) * 100;

    return percentPosition;
  }

  private setClickRangePosition (percent: number) {
    const { orientation, type } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const fromEnd = type === 'from-end';
    const fromStart = type === 'from-start';
    const range = type === 'range';
    const typeStyle = horizontal ? fromEnd ? `left` : `right` : fromStart ? `bottom` : `top`;
    const stylePercent = 100 - percent;

    this.range.getDom().style[typeStyle] = `${stylePercent}%`;

    if(range) {

    }
  }

  private setTogglePosition (toggle: HTMLElement, percent: number) {
    const { orientation, type } = this.modelOptions;
    const side = orientation === 'vertical' ? 'bottom' : 'left';

    toggle.style[side] = `${percent}%`;
  }
}

export default View;