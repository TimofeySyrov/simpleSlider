export type TCurrentValue = number | { min: number, max: number };
export type TOrientation = 'vertical' | 'horizontal';
export type TToggle = 'from' | 'to';
export type TType = 'from-start' | 'from-end' | 'range';
export type TDomParent = HTMLDivElement | HTMLSpanElement;
export type TUpdateToggle = { handle: TToggle, value: number, valueFromScale?: boolean };