interface ISliderClassNames {
  slider: IClassNameKey,
  bar: IClassNameKey,
  range: IClassNameKey,
  toggle: IToggleKey,
  thumb: IClassNameKey,
  scale: IClassNameKey,
  scaleItem: IClassNameKey
}

interface IClassNameKey {
  main: string,
  horizontal: string,
  vertical: string,
}

interface IToggleKey extends IClassNameKey {
  active: string,
}

export default ISliderClassNames;
