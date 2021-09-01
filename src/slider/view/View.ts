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
  private slider: HTMLDivElement;

  constructor (domParent: HTMLDivElement, modelOptions: IModelOptions) {
    super();

    this.domParent = domParent;
    this.modelOptions = modelOptions;
    this.render();
  }

  public updateModelOptions (newModelOptions: IModelOptions) {
    this.modelOptions = newModelOptions;
    this.render();
  }

  private render () {
    this.initViewComponents();
    this.createDomSlider();
    this.initComponentsListeners();
  }

  private initComponentsListeners () {
    this.bar.getDom().addEventListener("click", this.eventMouseClick.bind(this));
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
    this.from.getDom().setAttribute("data-index", '0');
    if(this.to)  {
      const domTo = this.to.createDom();
      domBar.appendChild(domTo).appendChild(this.thumb.createDom());
      this.to.getDom().setAttribute("data-index", '1');
    }
    domSlider.appendChild(domBar);
    domSlider.appendChild(domScale);
    this.slider = domSlider;

    this.setClassesFromOrientation();
    this.setLastToggle(this.from.getDom())
    this.setModelOptions();

    this.domParent.appendChild(domSlider);
  }

  private setModelOptions () {
    const { currentValue, type } = this.modelOptions;

    if(typeof currentValue == 'object') {
      this.setTogglePosition(this.from.getDom(), this.getPercentFromValue(currentValue.min));
      if(type === 'range') {
        this.setTogglePosition(this.to.getDom(), this.getPercentFromValue(currentValue.max));
      }
      this.setRangePosition();
    }
    if(typeof currentValue == 'number') {
      this.setTogglePosition(this.from.getDom(), this.getPercentFromValue(currentValue));
      if(type === 'range') {
        this.setTogglePosition(this.to.getDom(), this.getPercentFromValue(currentValue));
      }
      this.setRangePosition();
    }
  }

  private eventMouseClick (event: MouseEvent) {
    const percent = this.getClickPercentPosition(event);
    this.setClickPosition(percent);
  }

  private setClassesFromOrientation () {
    const { orientation, type } = this.modelOptions;
    const vertical = orientation === 'vertical';

    if(vertical) {
      this.bar.getDom().classList.add(`${sliderClassNames.barVertical}`);
      this.range.getDom().classList.add(`${sliderClassNames.rangeVertical}`);
      this.from.getDom().classList.add(`${sliderClassNames.toggleVertical}`);
      this.from.getDom().querySelector(`.${sliderClassNames.thumb}`).classList.add(`${sliderClassNames.thumbVertical}`);
      if(type === 'range') {
        this.to.getDom().classList.add(`${sliderClassNames.toggleVertical}`);
        this.to.getDom().querySelector(`.${sliderClassNames.thumb}`).classList.add(`${sliderClassNames.thumbVertical}`);
      }
    }
  }

  private setLastToggle (toggle: HTMLElement) {
    if(!toggle.classList.contains(`last-active`)) {

      this.from.getDom().classList.remove(`last-active`);

      if(this.to) {
        this.to.getDom().classList.remove(`last-active`);
      }

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
    const { orientation, type, max } = this.modelOptions;
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

  private getPercentFromValue (value: number): number {
    const { orientation, max, type } = this.modelOptions;
    const valuePercent = (value / max) * 100;
    const final = orientation === 'horizontal' ? valuePercent : type === 'from-end' ? 100 - valuePercent : valuePercent;

    return final;
  }

  private getTogglePosition (toggle: HTMLElement): number {
    const { orientation, type, max } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const offsetType = horizontal ? 'offsetLeft' : 'offsetTop';
    const toggleSize = horizontal ? 'offsetWidth' : 'offsetHeight';
    const barLength = this.getBarLength();
    const pixelPosition = toggle[offsetType] + (toggle[toggleSize] / 2);
    const percentPosition = (pixelPosition / barLength) * 100;
    const final = horizontal ? percentPosition : type === 'from-end' ? percentPosition : 100 - percentPosition;

    return final;
  }

  private setRangePosition () {
    const { orientation, type } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const fromEnd = type === 'from-end';
    const fromStart = type === 'from-start';
    const range = type === 'range';
    
    const typeFromStyle = horizontal ? `left` : `bottom`;
    const typeToStyle = horizontal ? `right` : `top`;

    const fromPercent = this.from.getDom().style[typeFromStyle];
    const percent = 100 - parseFloat(fromPercent.replace(/[^0-9,.]/g, ' '));

    if(fromStart) {
      this.range.getDom().style[typeFromStyle] = '0';
      this.range.getDom().style[typeToStyle] = `${percent}%`;
    }

    if(fromEnd) {
      this.range.getDom().style[typeToStyle] = '0';
      this.range.getDom().style[typeFromStyle] = fromPercent;
    }

    if(range){
      const toPercent = 100 - parseFloat(this.to.getDom().style[typeFromStyle].replace(/[^0-9,.]/g, ' '));
      this.range.getDom().style[typeFromStyle] = fromPercent;
      this.range.getDom().style[typeToStyle] = `${toPercent}%`;
    }
  }

  private setThumbValue (toggle: HTMLElement, percent: number) {
    const { orientation, type, max } = this.modelOptions;
    const final = orientation === 'horizontal' ? percent : type === 'from-end' ? 100 - percent : percent;
    const currentValue = max * (final/100);
    toggle.querySelector(`.${sliderClassNames.thumb}`).innerHTML = currentValue.toFixed(2);
  }

  private setTogglePosition (toggle: HTMLElement, percent: number) {
    const { orientation, type } = this.modelOptions;
    const typeStyle = orientation === 'horizontal' ? `left` : `bottom`;

    toggle.style[typeStyle] = `${percent}%`;
    this.setThumbValue(toggle, percent);
  }

  private setClickPosition (percent: number) {
    const { orientation, type } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const isFromStart = type === 'from-start';
    const isFromEnd = type === 'from-end';
    const isRange = type === 'range';
    const finalToggle = this.checkClickPosition(percent);

    if(isFromStart) {
      const stylePercent = horizontal ? percent : 100 - percent;
      this.setTogglePosition(finalToggle, stylePercent);
      this.setThumbValue(finalToggle, stylePercent);
      this.setRangePosition();
    }
    if(isFromEnd) {
      const stylePercent = horizontal ? 100 - percent : percent;
      this.setTogglePosition(finalToggle, stylePercent);
      this.setThumbValue(finalToggle, percent);
      this.setRangePosition();
    }
    if(isRange) {
      const stylePercent = horizontal ? 100 - percent : percent;
      this.setTogglePosition(finalToggle, percent);
      this.setThumbValue(finalToggle, percent);
      this.setRangePosition();
    }
  }

  private checkClickPosition (percent: number): HTMLElement {
    const { type } = this.modelOptions;
    const fromToggle = this.from.getDom();
    const fromTogglePercent = this.getTogglePosition(fromToggle);

    if(type === 'range') {

      const toToggle = this.to.getDom();
      const toTogglePercent = this.getTogglePosition(toToggle);
      const toggleRangeMiddle = (toTogglePercent - fromTogglePercent) / 2;
      const percentFromToggleRange = (percent - fromTogglePercent);

      if(percent <= fromTogglePercent) {
        this.setLastToggle(fromToggle)
        return fromToggle as HTMLElement;
      }
      if(percent >= toTogglePercent) {
        this.setLastToggle(toToggle)
        return toToggle as HTMLElement;
      }
      if(percentFromToggleRange <= toggleRangeMiddle) {
        console.log('from ret')
        this.setLastToggle(fromToggle)
        return fromToggle as HTMLElement;
      }
      if(percentFromToggleRange > toggleRangeMiddle) {
        console.log('to ret')
        this.setLastToggle(toToggle)
        return toToggle as HTMLElement;
      }
    }
    
    return fromToggle;
  }
}

export default View;