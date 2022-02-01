# SimpleSlider (JQuery плагин)
SimpleSlider – это простой и отзывчивый слайдер диапазона. Слайдер реализован с [front-end-best-practices
](https://github.com/fullstack-development/front-end-best-practices) MetaLamp.

## Демо-страница
[Basic demo](https://timofeysyrov.github.io/simpleSlider/)

На демо-странице каждый слайдер имеет панель конфигурирования, для удобного демонстрирования вариаций настроек.

## Git клонирование и отчеты тестов
```
$ git clone https://github.com/TimofeySyrov/simpleSlider.git
$ cd simpleSlider
$ npm i && npm test
```

## NPM команды проекта
```js
$ npm run start  // Запуск webpack devServer
$ npm run dev  // Инициализация приложения в режиме development
$ npm run build  // Инициализация приложения в режиме production
$ npm run test  // Показать результаты всех тестов приложения с таблицей coverage 
$ npm run eslint  // Запуск eslint проверки кода приложения на требования airbnb ts
```

## Настройки
| Название  | Дата-атрибут | Тип  | Значение по умолчанию | Описание |
| :-: | :-: | :-: | :-: | :-: |
| min | data-min | number | 0 | Задает минимальное значение слайдера |
| max | data-max | number | 100 | Задает максимальное значение слайдера |
| from | data-from | number | 50 | Задает значение для первого ползунка  |
| to | data-to | number | 100 | Задает значение для второго ползунка  |
| step | data-step | number | 1 | Задает шаг для значений слайдера |
| type | data-type | string | "single" | Задает количество отображаемых ползунков. "single" - один, "double" - два |
| orientation | data-orientation | string | "horizontal" | Задает горизонтальный или вертикальный вид слайдера. Для горизонтального значение - "horizontal", для вертикального - "vertical" |
| direction | data-direction | string | "ltr" | Задает положение для слайдера. "ltr" - слева на право, "rtl" - справа на лево |
| withRange | data-with-range | boolean | true | Задает отображение полоски интервала слайдера |
| withThumb | data-with-thumb | boolean | true | Задает отображение подсказки у ползунков слайдера |
| withScale | data-with-scale | boolean | true | Задает отображение шкалы значений слайдера |

   **Настройки по умолчанию:**
  > ```js
  > const defaultOptions = {
  >   min: 0,
  >   max: 100,
  >   from: 50,
  >   to: 100,
  >   step: 1,
  >   type: 'single',
  >   orientation: 'horizontal',
  >   direction: 'ltr',
  >   withRange: true,
  >   withThumb: true,
  >   withScale: true,
  >};
  > ```

## Использование дата-атрибутов
Слайдер поддерживает инициализацию по дата-атрибутам. Задайте для родительского компонента слайдера опции с помощью дата-атрибутов, и они будут использованы слайдером для инициализации.
</br></br>**Пример использования:**
  > ```js
  > // Создаем родительский компонент с дата-атрибутами
  > const domParent = document.createElement('<div
  >   class="sliderContainer"
  >   data-min="100"
  >   data-max="1000"
  >   data-type="double"
  >   data-with-scale="false"
  > ></div>');
  >
  > // Создаем слайдер
  > $(domParent).simpleSlider();
  > ```

## API плагина
* `options` (): ICorrectOptions;</br></br>Это публичный метод, возвращающий опции слайдера.</br></br>**Пример использования:**
  > ```js
  > // Создаем слайдер
  > $('.sliderContainer').simpleSlider();
  >
  > // Сохраняем инстанс слайдера
  > const myCustomSlider = $('.sliderContainer').data("simpleSlider");
  >
  > // Используем публичный метод
  > console.log(myCustomSlider.options);
  > ```
* `updateOptions` (options: Options): void;</br></br>Это публичный метод обновления опций слайдера.</br></br>**Пример использования:**
  > ```js
  > // Создаем слайдер
  > $('.sliderContainer').simpleSlider();
  >
  > // Сохраняем инстанс слайдера
  > const myCustomSlider = $('.sliderContainer').data("simpleSlider");
  >
  > // Используем публичный метод
  > myCustomSlider.updateOptions({
  >   min: 0,
  >   max: 15,
  >   type: "double",
  > });
  > ```
* `updateValues` (newValue: UpdateValues): void;</br></br>Это публичный метод обновления текущего значения слайдера. Метод принимает объект типа UpdateValues = { option: 'from' | 'to', value: number };</br></br>**Пример использования:**
  > ```js
  > // Создаем слайдер
  > $('.sliderContainer').simpleSlider();
  >
  > // Сохраняем инстанс слайдера
  > const myCustomSlider = $('.sliderContainer').data("simpleSlider");
  >
  > // Используем публичный метод
  > myCustomSlider.updateValues({ option: 'from', value: '14' });
  > ```
* `subscribe`: (eventName: SliderEvents, callback: Function) => void;</br></br>Это публичный метод, подписывающий переданную callback функцию на наблюдаемый эвент типа SliderEvents = "updateOptions" | "updateValues".

  `"updateOptions"` - вызывается при каждом обновлении опций слайдера;
  `"updateValues"` - вызывается при каждом обновлении from и to значений слайдера;</br></br>**Пример использования:**
  > ```js
  > // Создаем слайдер
  > $('.sliderContainer').simpleSlider();
  >
  > // Сохраняем инстанс слайдера
  > const myCustomSlider = $('.sliderContainer').data("simpleSlider");
  >
  > // Создаем callback функцию
  > function displayValue ({ option, value }) {
  >    console.log(`Ползунок: ${option}, значение: ${value}`);
  > }
  > 
  > // Используем публичный метод
  > myCustomSlider.subscribe('updateValues', ({ option, value }) => displayValue);
  >
  > myCustomSlider.subscribe('updateOptions', (options) => {
  >   console.log(options);
  > });
  > ```
* `unsubscribe`: (eventName: SliderEvents, callback: Function) => void;</br></br>Это публичный метод, отписывающий переданную callback функцию от переданного эвента типа SliderEvents = "updateOptions" | "updateValues".</br></br>**Пример использования:**
  > ```js
  > // Создаем слайдер
  > $('.sliderContainer').simpleSlider();
  >
  > // Сохраняем инстанс слайдера
  > const myCustomSlider = $('.sliderContainer').data("simpleSlider");
  > 
  > // Используем публичный метод
  > myCustomSlider.unsubscribe('updateValues', displayValue);
  > ```

## UML-диаграмма плагина

<img src="https://github.com/TimofeySyrov/simpleSlider/blob/master/UML%20SimpleSlider.png?raw=true" alt="plugin's UML"><img/>
</br>
**Pattern MVC with Passive View**
</br>
* **Model** хранит в себе опции и бизнес-логику приложения. Ничего не знает о слоях Controller и View. Model наследуется от класса Observer. С помощью функционала Observer, Model уведомляет, что изменился.

* **View** является пользовательским интерфейсом. View ничего не знает о слоях Controller и Model. View также, как и Model наследуется от класса Observer. View взаимодействует с пользователем и отображает получаемую информацию. С помощью функционала Observer, View уведомляет, что изменился.

* **Controller** является руководящим звеном в приложении. Controller знает о слоях Model и View, также он подписан на них. При обновлении View, Controller получает изменения и обновляет Model. Аналогично при обновлении Model, Controller получает изменения и обновляет View

* **Observer** реализует функционал наблюдаемого объекта. На объект можно подписаться и отписаться. Также можно уведомить подписчиков объекта о изменениях.

* **Bar, Range, Scale, Thumb, Toggle** являются subView компонентами. Имеют агригационные отношения с View.

* **SimpleSlider** является фасадом Controller'а. Реализует удобный интерфейс приложения.