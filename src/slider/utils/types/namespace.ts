type TCurrentValue = number | { from: number, to: number };
type TOrientation = 'vertical' | 'horizontal';
type TToggle = 'from' | 'to';
type TType = 'from-start' | 'from-end' | 'range';
type TDomParent = HTMLDivElement | HTMLSpanElement;
type TUpdateCurrentValue = { option: TToggle, value: number };

export {
  TCurrentValue, TOrientation, TToggle, TType, TDomParent, TUpdateCurrentValue,
};
