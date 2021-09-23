interface ISliderClassNames {
  slider: TOrientationKeys,
  bar: TOrientationKeys,
  range: TOrientationKeys,
  toggle: TOrientationKeys,
  thumb: TOrientationKeys,
  scale: TOrientationKeys,
  scaleItem: TOrientationKeys
}

type TOrientationKeys = {
  main: string,
  horizontal: string,
  vertical: string
}

export default ISliderClassNames