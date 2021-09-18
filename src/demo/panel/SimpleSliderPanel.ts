import { TDomParent } from "../../slider/interfaces/namespace";
import SimpleSlider from "../../slider/simpleSlider";

class SimpleSliderPanel {

  private domParent: TDomParent;
  private slider: SimpleSlider;

  constructor (domParent: TDomParent, slider: SimpleSlider) {
    this.domParent = domParent;
    this.slider = slider;
    /* Т.к в одном domParent может быть более одного слайдера, нужно оборачивать слайдер и панель в дополнительный контейнер и отправлять этот контейнер в domParent.

    Пример:

    - domParent
    --- slider1
    --- slider2

    $(domParent).simpleSliderPanel(slider1);

    преобразуем в:
    
    - domParent
    --- containerPanel
    ------ slider1
    ------ panel
    --- slider 2
    
    */

    /* Сделать ивент в слайдере о обновлении опций и передавать обновившиеся опции*/
  }
}

export default SimpleSliderPanel;