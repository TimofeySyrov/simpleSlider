type Orientation = 'vertical' | 'horizontal';
type Direction = 'ltr' | 'rtl';
type DomParent = HTMLDivElement | HTMLSpanElement;
type SliderEvents = 'updateOptions' | 'updateValues';
type ToggleType = 'from' | 'to';
type UpdateValues = { option: ToggleType, value: number };

export {
  Orientation,
  ToggleType,
  Direction,
  DomParent,
  SliderEvents,
  UpdateValues,
};
