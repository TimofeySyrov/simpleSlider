interface ISliderClassNames {
  slider: string,
  bar: TOrientationKeys,
  range: TOrientationKeys,
  toggle: TOrientationKeys,
  thumb: TOrientationKeys,
  scale: TOrientationKeys
}

type TOrientationKeys = {
  main: string,
  horizontal: string,
  vertical: string
}

export default ISliderClassNames