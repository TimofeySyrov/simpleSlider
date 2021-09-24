interface ISliderClassNames {
  slider: TClassNameKey,
  bar: TClassNameKey,
  range: TClassNameKey,
  toggle: TToggleKey,
  thumb: TClassNameKey,
  scale: TClassNameKey,
  scaleItem: TClassNameKey
}

interface TClassNameKey {
  main: string,
  horizontal: string,
  vertical: string,
}

interface TToggleKey extends TClassNameKey {
  active: string,
}

export default ISliderClassNames;
