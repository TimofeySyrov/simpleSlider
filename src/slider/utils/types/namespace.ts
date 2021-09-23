type TCurrentValue = number | { min: number, max: number };
type TOrientation = 'vertical' | 'horizontal';
type TToggle = 'from' | 'to';
type TType = 'from-start' | 'from-end' | 'range';
type TDomParent = HTMLDivElement | HTMLSpanElement;
type TUpdateToggle = { handle: TToggle, value: number, checkStep?: boolean };

export { TCurrentValue, TOrientation, TToggle, TType, TDomParent, TUpdateToggle };