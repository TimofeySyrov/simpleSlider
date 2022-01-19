type CurrentValue = number | { from: number, to: number };
type Orientation = 'vertical' | 'horizontal';
type ToggleType = 'from' | 'to';
type SliderType = 'from-start' | 'from-end' | 'range';
type DomParent = HTMLDivElement | HTMLSpanElement;
type UpdateCurrentValue = { option: ToggleType, value: number };

export {
  CurrentValue, Orientation, ToggleType, SliderType, DomParent, UpdateCurrentValue,
};
