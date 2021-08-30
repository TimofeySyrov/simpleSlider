import Observer from "../observer/Observer";

import IModelOptions from "../interfaces/IModelOptions";
import ISliderNodes from "../interfaces/view/ISliderNodes";
import sliderClassNames from "./components/utils/sliderClassNames";

import Range from "./components/range/range";
import Toggle from "./components/toggle/toggle";
import Thumb from "./components/thumb/thumb";
import Scale from "./components/scale/scale";
import Bar from "./components/bar/bar";

class View extends Observer {

  private modelOptions: IModelOptions;
  private domParent: HTMLDivElement;
  private nodes: ISliderNodes;

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
    this.from.getDom().style.bottom = '25%' /* Надо получать курент валью и ставить его в стили, иначе checktoggles не будет работать. В модели по умолчанию будет если нет курент валью то при одиночном это середина слайдера, при диапазоне minCurrentValue = min maxCurrentValue = max */
    if(this.to)  {
      const domTo = this.to.createDom();
      domBar.appendChild(domTo).appendChild(this.thumb.createDom());
      this.to.getDom().setAttribute("data-index", '1');
      this.to.getDom().style.bottom = '75%' /* Тут такая же ситуация как и в комменте выше ^^^, короче метод надо который курент валюшку будет ставить при инициализации слайдера */
    }
    domSlider.appendChild(domBar);
    domSlider.appendChild(domScale);
    this.slider = domSlider;

    this.setClassesFromOrientation();
    this.setLastToggle(this.from.getDom())

    this.domParent.appendChild(domSlider);
  }

  private eventMouseClick (event: MouseEvent) {
    const percent = this.getClickPercentPosition(event);
    const element = event.target as HTMLElement;
    const isToggle = element.classList.contains(`${sliderClassNames.toggle}`) ? element : null;
    this.setTogglePosition(percent);
    this.setRangePosition();
    
    
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

  private setRangePosition () {
    const { orientation, type } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const fromEnd = type === 'from-end';
    const fromStart = type === 'from-start';
    const range = type === 'range';
    const typeFromStyle = horizontal ? `left` : `bottom`;
    const typeToStyle = horizontal ? `right` : `top`;

    const fromPercent = this.from.getDom().style[typeFromStyle];

    if(fromStart) {
      const percent = 100 - parseFloat(fromPercent.replace(/[^0-9,.]/g, ' '));
      this.range.getDom().style[typeToStyle] = `${percent}%`;
    }

    if(fromEnd) {
      this.range.getDom().style[typeFromStyle] = fromPercent;
    }

    if(range){
      const toPercent = 100 - parseFloat(this.to.getDom().style[typeFromStyle].replace(/[^0-9,.]/g, ' '));
      this.range.getDom().style[typeFromStyle] = fromPercent;
      this.range.getDom().style[typeToStyle] = `${toPercent}%`;
    }
  }

  private setThumbValue (toggle: HTMLElement, percent: number) {
    toggle.querySelector(`.${sliderClassNames.thumb}`).innerHTML = percent.toFixed(2);
  }

  private setTogglePosition (percent: number) {
    const { orientation, type } = this.modelOptions;
    const horizontal = orientation === 'horizontal';
    const side = horizontal ? 'left' : 'bottom';
    const isFromStart = type === 'from-start';
    const isFromEnd = type === 'from-end';
    const isRange = type === 'range';
    const finalToggle = this.checkRangeToggles(percent);
    console.log(finalToggle)

    if(isFromStart) {
      const stylePercent = horizontal ? percent : 100 - percent;
      finalToggle.style[side] = `${stylePercent}%`;
      this.setThumbValue(finalToggle, stylePercent);
    }
    if(isFromEnd) {
      const stylePercent = horizontal ? 100 - percent : percent;
      finalToggle.style[side] = `${stylePercent}%`;
      this.setThumbValue(finalToggle, 100 - percent);
    }
    if(isRange) {
      finalToggle.style[side] = `${percent}%`;
      this.setThumbValue(finalToggle, percent);
    }
  }

  private checkRangeToggles (percent: number): HTMLElement {
    const { orientation, type } = this.modelOptions;
    const styleType = orientation === 'horizontal' ? `left` : `bottom`;
    const fromToggle = this.from.getDom();
    const fromTogglePercent = parseFloat(fromToggle.style[styleType].replace(/[^0-9,.]/g, ' '));

    if(type === 'range') {

      const toToggle = this.to.getDom();
      const toTogglePercent = parseFloat(toToggle.style[styleType].replace(/[^0-9,.]/g, ' '));
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
        this.setLastToggle(fromToggle)
        return fromToggle as HTMLElement;
      }
      if(percentFromToggleRange > toggleRangeMiddle) {
        this.setLastToggle(toToggle)
        return toToggle as HTMLElement;
      }
    }
  
    return fromToggle;
  }
}

export default View;