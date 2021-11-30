import { bind } from 'decko';

import Observer from '../observer/Observer';
import { TDomParent, TToggle, TUpdateCurrentValue } from '../utils/types/namespace';
import ISliderNodes from '../utils/interfaces/view/ISliderNodes';
import IViewEvents from '../utils/interfaces/view/IViewEvents';
import ICorrectOptions from '../utils/interfaces/ICorrectOptions';
import sliderClassNames from '../utils/sliderClassNames';
import Range from './components/range/range';
import Toggle from './components/toggle/toggle';
import Thumb from './components/thumb/thumb';
import Scale from './components/scale/scale';
import Bar from './components/bar/bar';

class View extends Observer {
  private modelOptions: ICorrectOptions;

  private nodes!: ISliderNodes;

  private draggingToggle!: TToggle | null;

  private viewEvents: IViewEvents = {
    onSlide: new Observer(),
  };

  get options (): ICorrectOptions {
    return this.modelOptions;
  }

  get events (): IViewEvents {
    return this.viewEvents;
  }

  constructor (domParent: TDomParent, modelOptions: ICorrectOptions) {
    super();

    this.modelOptions = modelOptions;
    this.initSubView(domParent);
  }

  public updateOptions (newModelOptions: ICorrectOptions): void {
    this.modelOptions = newModelOptions;
    this.render();
  }

  public updateCurrentValue (newValue: TUpdateCurrentValue): void {
    this.setToggleValue(newValue.option, newValue.value);
  }

  private initSubView (newDomParent: TDomParent) {
    this.nodes = {
      domParent: newDomParent,
      slider: document.createElement('div'),
      bar: new Bar().getDom(),
      range: new Range().getDom(),
      from: {
        handle: new Toggle().getDom(),
        thumb: new Thumb().getDom(),
      },
      to: {
        handle: new Toggle().getDom(),
        thumb: new Thumb().getDom(),
      },
      scale: new Scale(),
    };

    this.render();
    this.initSubViewListeners();
  }

  private initSubViewListeners () {
    const { bar, scale } = this.nodes;

    window.removeEventListener('mousemove', this.handleWindowMouseMove);
    window.removeEventListener('mouseup', this.handleWindowMouseUp);
    bar.addEventListener('click', this.handleBarClick);
    bar.addEventListener('mousedown', this.handleBarMouseDown);
    scale.getDom().addEventListener('click', this.handleScaleClick);
  }

  private render () {
    const { type, withRange, withThumb, withScale } = this.modelOptions;
    const { domParent, slider, bar, range, from, to, scale } = this.nodes;
    const isRange = type === 'range';
    const isFromStart = type === 'from-start';
    const isFromEnd = type === 'from-end';
    const isSliderHave = domParent.contains(slider);
    const isBarHave = slider.contains(bar);
    const isFromHave = bar.contains(from.handle);
    const isToHave = bar.contains(to.handle);
    const isFromThumbHave = from.handle.contains(from.thumb);
    const isToThumbHave = to.handle.contains(to.thumb);
    const isThumbHave = isFromThumbHave && isToThumbHave;
    const isRangeHave = bar.contains(range);
    const isScaleHave = slider.contains(scale.getDom());

    /* Bar */
    if (!isBarHave) {
      slider.appendChild(bar);
    }

    /* From-start || From-end */
    if (isFromStart || isFromEnd) {
      if (!isFromHave) {
        bar.appendChild(from.handle);
      }
      if (isToHave) {
        bar.removeChild(to.handle);
      }
    }

    /* Range */
    if (isRange) {
      if (!isFromHave) {
        bar.appendChild(from.handle);
      }
      if (!isToHave) {
        bar.appendChild(to.handle);
      }
    }

    /* withRange */
    if (withRange && !isRangeHave) {
      bar.appendChild(range);
    }

    if (!withRange && isRangeHave) {
      bar.removeChild(range);
    }

    /* withScale */
    if (withScale) {
      this.renderScale();

      if (!isScaleHave) {
        slider.appendChild(scale.getDom());
      }
    }

    if (!withScale && isScaleHave) {
      slider.removeChild(scale.getDom());
    }

    /* withThumb */
    if (withThumb && !isThumbHave) {
      from.handle.appendChild(from.thumb);
      to.handle.appendChild(to.thumb);
    }

    if (!withThumb && isThumbHave) {
      from.handle.removeChild(from.thumb);
      to.handle.removeChild(to.thumb);
    }

    this.renderSubViewStyles();
    this.setCurrentValue();

    /* Slider */
    if (!isSliderHave) {
      domParent.appendChild(slider);
    }
  }

  private renderSubViewStyles () {
    const { orientation } = this.modelOptions;
    const { slider, from, to, bar, range, scale } = this.nodes;
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

    values.forEach((item) => {
      const domItem = scale.addItem(Number(item.toFixed(1)));
      const percent = this.convertValueToPercent(item);
      domItem.style[typeStyleSide] = `${percent}%`;
    });
  }

  @bind
  private handleBarClick (event: MouseEvent) {
    this.draggingToggle = this.chooseToggleByCoords(event);

    if (this.draggingToggle) {
      this.setLastToggle(this.draggingToggle);
      this.handleWindowMouseMove(event);
    }
  }

  @bind
  private handleBarMouseDown (event: MouseEvent) {
    this.draggingToggle = this.chooseToggleByCoords(event);

    if (this.draggingToggle) {
      this.setLastToggle(this.draggingToggle);
      this.handleWindowMouseMove(event);
      window.addEventListener('mousemove', this.handleWindowMouseMove);
      window.addEventListener('mouseup', this.handleWindowMouseUp);
    }
  }

  @bind
  private handleWindowMouseMove (event: MouseEvent) {
    if (this.draggingToggle) {
      const coords = this.getRelativeCoords(event);
      const value = this.convertCoordsToValue(coords);
      const toggleToUpdate: TUpdateCurrentValue = { option: this.draggingToggle, value };

      this.viewEvents.onSlide.notify(toggleToUpdate);
    }
  }

  @bind
  private handleWindowMouseUp () {
    if (this.draggingToggle) {
      window.removeEventListener('mousemove', this.handleWindowMouseMove);
      window.removeEventListener('mouseup', this.handleWindowMouseUp);
      this.draggingToggle = null;
    }
  }

  @bind
  private handleScaleClick (event: MouseEvent) {
    const { target } = event;
    const { scale } = this.nodes;

    scale.getItems().forEach((item) => {
      if (target === item) {
        const value = Number(item.getAttribute('data-value'));
        const toggle = this.chooseToggleByCoords(event);
        const toggleToUpdate: TUpdateCurrentValue = { option: toggle, value };

        this.viewEvents.onSlide.notify(toggleToUpdate);
      }
    });
  }

  private convertCoordsToValue (coords: number): number {
    const { max, min, step } = this.modelOptions;
    const barLength = this.getBarLength();

    const value = Number(((coords * (max - min)) / barLength + min));
    const valueWithStep = Number((Math.round((value - min) / step) * step + min).toFixed(1));

    return valueWithStep;
  }

  private convertValueToPercent (value: number): number {
    const { min, max, type } = this.modelOptions;
    const isFromEnd = type === 'from-end';
    const start = 0; // Start percent

    const percent = Number((((value - min) * 100) / (max - min)).toFixed(3));
    const revertedPercent = 100 - percent;
    const percentByType = isFromEnd ? revertedPercent : percent;
    const percentIsNan = Number.isNaN(percentByType);

    if (percentIsNan) {
      return start;
    }

    return percentByType;
  }

  private getBarLength ():number {
    const { orientation } = this.modelOptions;
    const { bar } = this.nodes;
    const isVertical = orientation === 'vertical';
    const lengthType = isVertical ? 'offsetHeight' : 'offsetWidth';
    const length = bar[lengthType];

    return length;
  }

  private getBarOffset ():number {
    const { orientation, type } = this.modelOptions;
    const { bar } = this.nodes;
    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';

    const forVertical = isFromEnd ? 'top' : 'bottom';
    const forHorizontal = isFromEnd ? 'right' : 'left';
    const side = isVertical ? forVertical : forHorizontal;

    const offset = bar.getBoundingClientRect()[side];

    return offset;
  }

  private getRelativeCoords (event: MouseEvent): number {
    const { orientation, type } = this.modelOptions;
    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';
    const axis = isVertical ? 'clientY' : 'clientX';
    const barOffset = this.getBarOffset();

    const coords = event[axis] - barOffset;
    const reverted = barOffset - event[axis];

    const forVertical = isFromEnd ? coords : reverted;
    const forHorizontal = isFromEnd ? reverted : coords;

    const coordsByOrientation = isVertical ? forVertical : forHorizontal;

    return coordsByOrientation;
  }

  private getScaleValues (): number[] {
    const { max, min, step } = this.modelOptions;
    const middleValue = Math.ceil((max - min) / step);
    const valueWithStep = Math.ceil(middleValue / 6) * step;
    const values = [];
    let value = min;

    for (let i = 0; value < max; i += 1) {
      value += valueWithStep;
      if (value < max) {
        values.push(value);
      }
    }

    return [min, ...values, max];
  }

  private getToggleCoords (toggle: TToggle): number {
    const { orientation, type } = this.modelOptions;
    const { nodes } = this;

    const isVertical = orientation === 'vertical';
    const isFromEnd = type === 'from-end';
    const offsetType = isVertical ? 'offsetTop' : 'offsetLeft';
    const toggleSize = isVertical ? 'offsetHeight' : 'offsetWidth';
    const barLength = this.getBarLength();

    const coords = nodes[toggle].handle[offsetType] + (nodes[toggle].handle[toggleSize] / 2);
    const reverted = barLength - coords;

    const forVertical = isFromEnd ? coords : reverted;
    const forHorizontal = isFromEnd ? reverted : coords;
    const coordsByOrientation = isVertical ? forVertical : forHorizontal;

    return coordsByOrientation;
  }

  private chooseToggleByCoords (event: MouseEvent): TToggle {
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
      this.setToggleValue('from', currentValue.from);
      if (isRange) {
        this.setToggleValue('to', currentValue.to);
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

    if (!nodes[toggle].handle.classList.contains(`${sliderClassNames.toggle.active}`)) {
      nodes.from.handle.classList.remove(`${sliderClassNames.toggle.active}`);
      nodes.to.handle.classList.remove(`${sliderClassNames.toggle.active}`);

      nodes[toggle].handle.classList.add(`${sliderClassNames.toggle.active}`);
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
    nodes[toggle].thumb.innerHTML = `${value}`;
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
