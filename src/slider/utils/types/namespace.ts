type Orientation = 'vertical' | 'horizontal';
type Direction = 'ltr' | 'rtl';
type Type = 'single' | 'double';
type DomParent = HTMLDivElement | HTMLSpanElement;
type SliderEvents = 'updateOptions' | 'updateValues';
type ToggleType = 'from' | 'to';
type UpdateValues = { option: ToggleType, value: number };

export {
  Orientation,
  ToggleType,
  Direction,
  Type,
  DomParent,
  SliderEvents,
  UpdateValues,
};
