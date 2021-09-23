import { bind } from 'decko';

import sliderClassNames from '../utils/sliderClassNames';
import Range from './components/range/range';
import Toggle from './components/toggle/toggle';
import Thumb from './components/thumb/thumb';
import Scale from './components/scale/scale';
import Bar from './components/bar/bar';

import ISliderNodes from '../utils/interfaces/view/ISliderNodes';
import IEvents from '../utils/interfaces/view/IViewEvents';
import { TDomParent, TToggle, TUpdateToggle } from '../utils/types/namespace';
import Observer from '../observer/Observer';
import ICorrectOptions from '../utils/interfaces/ICorrectOptions';

class View extends Observer {
  private modelOptions: ICorrectOptions;

  private nodes!: ISliderNodes;

  private draggingToggle!: TToggle | null;

  private _events: IEvents = {
    onSlide: new Observer(),
  };

  get events (): IEvents {
    return this._events;
  }

  constructor (domParent: TDomParent, modelOptions: ICorrectOptions) {
    super();

    this.modelOptions = modelOptions;
    this.initSubView(domParent);
  }

  public updateModelOptions (newModelOptions: ICorrectOptions) {
    this.modelOptions = newModelOptions;
    this.render();
  }

  public updateCurrentValue (toggle: TUpdateToggle) {
    this.setToggleValue(toggle.handle, toggle.value);
  }

  private initSubView (newDomParent: TDomParent) {
    this.nodes = {
      domParent: newDomParent,
      slider: document.createElement('div'),
      bar: new Bar().getDom(),
      range: new Range().getDom(),
      from: {
        handle: new Toggle().createDom(),
        thumb: new Thumb().createDom(),
      },
      to: {
        handle: new Toggle().createDom(),
        thumb: new Thumb().createDom(),
      },
      scale: new Scale(),
    };

    this.render();
    this.initSubViewListeners();
  }

  private initSubViewListeners () {
    const { nodes } = this;

    window.removeEventListener('mousemove', this.drag);
    window.removeEventListener('mouseup', this.finishDragging);
    nodes.bar.addEventListener('click', this.click);
    nodes.bar.addEventListener('mousedown', this.startDragging);
    nodes.scale.getDom().addEventListener('click', this.setScaleItemCoords);
  }

  private render () {
    const {
      type, withRange, withThumb, withScale,
    } = this.modelOptions;
    const { nodes } = this;
    const isRange = type === 'range';
    const isFromStart = type === 'from-start';
    const isFromEnd = type === 'from-end';
    const isSliderHave = nodes.domParent.contains(nodes.slider);
    const isBarHave = nodes.slider.contains(nodes.bar);
    const isFromHave = nodes.bar.contains(nodes.from.handle);
    const isToHave = nodes.bar.contains(nodes.to.handle);
    const isThumbHave = nodes.from.handle.contains(nodes.from.thumb) && nodes.to.handle.contains(nodes.to.thumb);
    const isRangeHave = nodes.bar.contains(nodes.range);
    const isScaleHave = nodes.slider.contains(nodes.scale.getDom());

    /* Bar */
    if (!isBarHave) {
      nodes.slider.appendChild(nodes.bar);
    }

    /* From-start || From-end */
    if (isFromStart || isFromEnd) {
      if (!isFromHave) {
        nodes.bar.appendChild(nodes.from.handle);
      }
      if (isToHave) {
        nodes.bar.removeChild(nodes.to.handle);
      }
    }

    /* Range */
    if (isRange) {
      if (!isFromHave) {
        nodes.bar.appendChild(nodes.from.handle);
      }
      if (!isToHave) {
        nodes.bar.appendChild(nodes.to.handle);
      }
    }

    /* withRange */
    if (withRange && !isRangeHave) {
      nodes.bar.appendChild(nodes.range);
    }

    if (!withRange && isRangeHave) {
      nodes.bar.removeChild(nodes.range);
    }

    /* withScale */
    if (withScale) {
      this.renderScale();

      if (!isScaleHave) {
        nodes.slider.appendChild(nodes.scale.getDom());
      }
    }

    if (!withScale && isScaleHave) {
      nodes.slider.removeChild(nodes.scale.getDom());
    }

    /* withThumb */
    if (withThumb && !isThumbHave) {
      nodes.from.handle.appendChild(nodes.from.thumb);
      nodes.to.handle.appendChild(nodes.to.thumb);
    }

    if (!withThumb && isThumbHave) {
      nodes.from.handle.removeChild(nodes.from.thumb);
      nodes.to.handle.removeChild(nodes.to.thumb);
    }

    this.renderSubViewStyles();
    this.setCurrentValue();

    /* Slider */
    if (!isSliderHave) {
      nodes.domParent.appendChild(nodes.slider);
    }
  }

  private renderSubViewStyles () {
    const { orientation } = this.modelOptions;
    const {
      slider, from, to, bar, range, scale,
    } = this.nodes;
    const isVertical = orientation === 'vertical';
    const orientClear = isVertical ? 'horizontal' : 'vertical';
    const startSideClear = isVertical ? 'left' : 'bottom';
    const endSideClear = isVertical ? 'right' : 'top';

    slider.setAttribute('class', `${sliderClassNames.slider.main}`);
    from.handle.setAttribute('data-index', '0');
    to.handle.setAttribute('data-index', '1');

    bar.classList.remove(`${sliderClassNames.bar[orientClear]}`);
    range.classList.remove(`${sliderClassNames.range[orientClear]}`);
    from.handle.classList.remove(`${sliderClassNames.toggle[orientClear]}`);
    from.thumb.classList.remove(`${sliderClassNames.thumb[orientClear]}`);
    to.handle.classList.remove(`${sliderClassNames.toggle[orientClear]}`);
    to.thumb.classList.remove(`${sliderClassNames.thumb[orientClear]}`);
    scale.getDom().classList.remove(`${sliderClassNames.scale[orientClear]}`);
    scale.getItems().forEach((item) => {
      item.classList.remove(`${sliderClassNames.scaleItem[orientClear]}`);
    });

    range.style[startSideClear] = '0';
    range.style[endSideClear] = '0';

    from.handle.style.removeProperty(startSideClear);
    to.handle.style.removeProperty(startSideClear);

    slider.classList.add(`${sliderClassNames.slider[orientation]}`);
    bar.classList.add(`${sliderClassNames.bar[orientation]}`);
    range.classList.add(`${sliderClassNames.range[orientation]}`);
    from.handle.classList.add(`${sliderClassNames.toggle[orientation]}`);
    from.thumb.classList.add(`${sliderClassNames.thumb[orientation]}`);
    to.handle.classList.add(`${sliderClassNames.toggle[orientation]}`);
    to.thumb.classList.add(`${sliderClassNames.thumb[orientation]}`);
    scale.getDom().classList.add(`${sliderClassNames.scale[orientation]}`);
    scale.getItems().forEach((item) => {
      item.classList.add(`${sliderClassNames.scaleItem[orientation]}`);
    });
  }

  private renderScale () {
    const { orientation } = this.modelOptions;
    const { scale } = this.nodes;
    const values = this.getScaleValues();
    const isVertical = orientation === 'vertical';
    const typeStyleSide = isVertical ? 'bottom' : 'left';
    scale.getDom().innerHTML = '';

    values.map((item) => {
      const domItem = scale.addItem(Number(item.toFixed(2)));
      const percent = this.convertValueToPercent(item);
      domItem.style[typeStyleSide] = `${percent}%`;
    });
  }

  @bind
  private click (event: MouseEvent) {
    this.draggingToggle = this.chooseToggleByCoords(event);

    if (this.draggingToggle) {
      this.setLastToggle(this.draggingToggle);
      this.drag(event);
    }
  }

  @bind
  private startDragging (event: MouseEvent) {
    this.draggingToggle = this.chooseToggleByCoords(event);

    if (this.draggingToggle) {
      this.setLastToggle(this.draggingToggle);
      this.drag(event);
      window.addEventListener('mousemove', this.drag);
      window.addEventListener('mouseup', this.finishDragging);
    }
  }

  @bind
  private drag (event: MouseEvent) {
    if (this.draggingToggle) {
      const coords = this.getRelativeCoords(event);
      const value = this.convertCoordsToValue(coords);

      this._events.onSlide.notify({ handle: this.draggingToggle, value, checkStep: true } as TUpdateToggle);
    }
  }

  @bind
  private finishDragging () {
    if (this.draggingToggle) {
      window.removeEventListener('mousemove', this.drag);
      window.removeEventListener('mouseup', this.finishDragging);
      this.draggingToggle = null;
    }
  }

  @bind
  private setScaleItemCoords (event: MouseEvent) {
    const { target } = event;
    const { scale } = this.nodes;

    scale.getItems().forEach((item) => {
      if (target == item) {
        const value = Number(item.getAttribute('data-value'));
        const toggle = this.chooseToggleByCoords(event);

        this._events.onSlide.notify({ handle: toggle, value });
      }
    });
  }

  private convertCoordsToValue (coords: number): number {
    const { max, min } = this.modelOptions;
    const barLength = this.getBarLength();
    const value = Number((coords * (max - min) / barLength + min).toFixed(10));

    return value;
  }

  private convertValueToPercent (value: number): number {
    const {
      orientation, min, max, type,
    } = this.modelOptions;
    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';

    const percent = Number(((value - min) * 100 / (max - min)).toFixed(10));
    const confirmedPercent = isVertical ? isFromEnd ? 100 - percent : percent : isFromEnd ? 100 - percent : percent;

    return confirmedPercent;
  }

  private getBarLength ():number {
    const { orientation } = this.modelOptions;
    const { nodes } = this;
    const isVertical = orientation === 'vertical';
    const lengthType = isVertical ? 'offsetHeight' : 'offsetWidth';
    const length = nodes.bar[lengthType];

    return length;
  }

  private getBarOffset ():number {
    const { orientation, type } = this.modelOptions;
    const { bar } = this.nodes;
    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';
    const offsetSide = isVertical ? isFromEnd ? 'top' : 'bottom' : isFromEnd ? 'right' : 'left';
    const offset = bar.getBoundingClientRect()[offsetSide];

    return offset;
  }

  private getRelativeCoords (event: MouseEvent): number {
    const { orientation, type } = this.modelOptions;
    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';
    const axis = isVertical ? 'clientY' : 'clientX';
    const barOffset = this.getBarOffset();

    const result = isVertical ?
      isFromEnd ? event[axis] - barOffset : barOffset - event[axis]
      : isFromEnd ? barOffset - event[axis] : event[axis] - barOffset;

    return result;
  }

  private getToggleCoords (toggle: TToggle): number {
    const { orientation, type } = this.modelOptions;
    const { nodes } = this;

    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';
    const offsetType = isVertical ? 'offsetTop' : 'offsetLeft';
    const toggleSize = isVertical ? 'offsetHeight' : 'offsetWidth';
    const barLength = this.getBarLength();

    const pixelPosition = nodes[toggle].handle[offsetType] + (nodes[toggle].handle[toggleSize] / 2);
    const result = isVertical ? isFromEnd ? pixelPosition : barLength - pixelPosition : isFromEnd ? barLength - pixelPosition : pixelPosition;

    return result;
  }

  private getScaleValues (): number[] {
    const { max, min, step } = this.modelOptions;
    const midQuantity = Math.ceil((max - min) / step);
    const viewStep = Math.ceil(midQuantity / 6) * step;
    const midArr = [];
    let value = min;

    for (let i = 0; value < max; i += 1) {
      value += viewStep;
      if (value < max) {
        midArr.push(value);
      }
    }

    return [min, ...midArr, max];
  }

  private chooseToggleByCoords (event: MouseEvent): TToggle | null {
    const { type } = this.modelOptions;
    const isRange = type === 'range';
    const fromValue = this.getToggleCoords('from');
    const mouseCoords = this.getRelativeCoords(event);

    if (isRange) {
      const toValue = this.getToggleCoords('to');
      const rangeMiddle = (toValue - fromValue) / 2;
      const valueFromRangeMiddle = (mouseCoords - fromValue);

      if (mouseCoords <= fromValue) return 'from';
      if (mouseCoords >= toValue) return 'to';
      if (valueFromRangeMiddle <= rangeMiddle) return 'from';
      if (valueFromRangeMiddle > rangeMiddle) return 'to';
    }

    return 'from';
  }

  private setCurrentValue () {
    const { currentValue, type } = this.modelOptions;
    const isRange = type === 'range';

    if (typeof currentValue === 'object') {
      this.setToggleValue('from', currentValue.min);
      if (isRange) {
        this.setToggleValue('to', currentValue.max);
      }
    }

    if (typeof currentValue === 'number') {
      this.setToggleValue('from', currentValue);
      if (isRange) {
        this.setToggleValue('to', currentValue);
      }
    }
  }

  private setLastToggle (toggle: TToggle) {
    const { nodes } = this;
    const lastActiveClassName = `${sliderClassNames.toggle.main}` + '_last-active';

    if (!nodes[toggle].handle.classList.contains(`${lastActiveClassName}`)) {
      nodes.from.handle.classList.remove(`${lastActiveClassName}`);
      nodes.to.handle.classList.remove(`${lastActiveClassName}`);

      nodes[toggle].handle.classList.add(`${lastActiveClassName}`);
    }
  }

  private setRangePosition () {
    const { orientation, type, withRange } = this.modelOptions;
    const { range, from, to } = this.nodes;
    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';
    const isFromStart = type === 'from-start';
    const isRange = type === 'range';
    const sideStart = isVertical ? 'bottom' : 'left';
    const sideEnd = isVertical ? 'top' : 'right';

    if (withRange) {
      const fromPercent = parseFloat(from.handle.style[sideStart].replace(/[^0-9,.]/g, ' '));
      const toPercent = 100 - parseFloat(to.handle.style[sideStart].replace(/[^0-9,.]/g, ' '));

      if (isFromStart) {
        range.style[sideStart] = '0';
        range.style[sideEnd] = `${100 - fromPercent}%`;
      }

      if (isFromEnd) {
        range.style[sideStart] = `${fromPercent}%`;
        range.style[sideEnd] = '0';
      }

      if (isRange) {
        range.style[sideStart] = `${fromPercent}%`;
        range.style[sideEnd] = `${toPercent}%`;
      }
    }
  }

  private setThumbValue (toggle: TToggle, value: number) {
    const { nodes } = this;
    nodes[toggle].thumb.innerHTML = value.toFixed(2);
  }

  private setToggleValue (toggle: TToggle, value: number) {
    const { orientation, withThumb, withRange } = this.modelOptions;
    const { nodes } = this;
    const isVertical = orientation === 'vertical';
    const typeStyleSide = isVertical ? 'bottom' : 'left';
    const percent = this.convertValueToPercent(value);

    nodes[toggle].handle.style[typeStyleSide] = `${percent}%`;

    this.setLastToggle(toggle);
    if (withThumb) this.setThumbValue(toggle, value);
    if (withRange) this.setRangePosition();
  }
}

export default View;
