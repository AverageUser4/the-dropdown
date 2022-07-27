'use strict';

class TheDropdown {

  static allDropdowns = [];

  static createMany(togglerClass, dropdownClass, closerClass, options) {
    let toggler;
    let dropdown;
    let closer;

    for(let i = 1; i <= 256; i++) {
      toggler = document.getElementsByClassName(togglerClass + i)[0];
      if(typeof toggler === 'undefined')
        break;

      dropdown = document.getElementsByClassName(dropdownClass + i)[0];
      if(typeof dropdown === 'undefined')
        break;

      if(typeof closerClass !== 'undefined')
        closer = document.getElementsByClassName(closerClass + i)[0];

      new TheDropdown(toggler, dropdown, closer, options);
    }
  }

  toggler;
  closer;
  dropdown;
  transitionDuration;
  open;
  blocked;

  activationMethod = 'click';
  dropdownType = 'popUp';

  textChange = [];
  classToggle = [];

  constructor(toggler, dropdown, closer, options) {
    TheDropdown.allDropdowns.push(this);
    this.blocked = false;

    if(typeof options !== 'undefined')
      for(let key in options)
        this[key] = options[key];

    this.toggler = toggler;
    this.dropdown = dropdown;
    this.closer = closer;

    this.open = this.dropdown.getAttribute('hidden') === null ? true : false;

    this.transitionDuration = 
      parseFloat(getComputedStyle(this.dropdown).transitionDuration) * 1000;

    toggler.addEventListener('click', () => this.toggleDropdown());
    if(this.dropdownType === 'popUp')
      window.addEventListener('resize', () => this.closeDropdown());
    if(typeof this.closer !== 'undefined')
      this.closer.addEventListener('click', () => this.closeDropdown());
  }

  toggleDropdown() {
    if(this.blocked)
      return;

    if(this.open)
      this.closeDropdown();
    else
      this.openDropdown();
  }

  closeDropdown() {
    if(!this.open)
      return;

    this.open = false;
    this.dropdown.style.opacity = 0
    this.blocked = true;

    setTimeout(
      () => {
        this.dropdown.setAttribute('hidden', '');
        this.blocked = false;
      },
      this.transitionDuration
    );

    for(let val of this.textChange)
      val.element.textContent = val.closedText;
    for(let val of this.classToggle)
      val.element.classList.toggle(val.className);
  }

  openDropdown() {
    if(this.open)
      return;

    this.open = true;
    this.dropdown.removeAttribute('hidden');
    this.blocked = true;

    /* if opacity gets changed immediately,
       transition effect isn't applied */
    setTimeout(
      () => this.dropdown.style.opacity = 1,
    );
    setTimeout(
      () => this.blocked = false,
      this.transitionDuration
    );

    for(let val of this.textChange)
      val.element.textContent = val.openText;
    for(let val of this.classToggle)
      val.element.classList.toggle(val.className);
  }

}

// const theDropdown = new TheDropdown(
//   document.getElementById('toggler-1'),
//   document.getElementById('dropdown-1'),
// );

// TheDropdown.createMany('toggler-', 'dropdown-')
for(let i = 1; i <= 3; i++) {
  new TheDropdown(
    document.getElementsByClassName(`toggler-${i}`)[0],
    document.getElementsByClassName(`dropdown-${i}`)[0],
    undefined,
    {
      textChange: [
        {
          element: document.getElementsByClassName(`toggler-${i}`)[0],
          openText: 'zamknij',
          closedText: 'otwurz'
        },
        {
          element: document.getElementsByClassName(`dropdown-${i}`)[0],
          openText: 'jestem otwarty',
          closedText: 'jestem zamknienty i nie widzisz tego :)'
        }
      ]
    }
  )
}

/*
  - dropdown element has to have the 'hidden' boolean attribute set, 
    unless it's meant to to be visible when page loads

  - 'closer' and 'options' arguments are optional

  - 'toggler' opens or closes 'dropdown'

  - 'dropdown' is the element that can be shown or hidden

  - 'closer' closes dropdown (probably a button inside 'dropdown'), is not required

  - static method createMany() requires unique class names that are indexed from one -
    when given class 'dropdown', the method will check whether elements
    with classes 'dropdown1', 'dropdown2', etc. exist and if they do it will
    create objects
    'dropdown3' would be activated by 'toggler3' etc.

  - there are two types of dropdowns
    - solid:
      - it can be open and closed only by toggler
      - multiple solid dropdowns can be opened at once
      - doesn't get closed on resize
    - popUp
      - toggler opens it but it can be also closed by clicking
      outside the dropdown
      - only one can be open at once
      - gets closed on resize

  - there are two activation methods
    - click:
      - when activator receives click event
      - when anything outside dropdown receives click event
      it gets closed
    - hover:
      - hovering over activator opens dropdown (mouseenter event)
      - when dropdown is hovered over it's still open
      - hovering somewhere else closes dropdown

  - options argument looks like this:
    - it is an object containing these options:

      - dropdownType values: 'solid', 'popUp' (strings)
        - if not specified popUp is default

      - activationMethod values: 'click', 'hover' (strings)
        - if not specified click is default

      - textChange:
        - contains array of objects
        - each object has these properties:
          - element: element whose textContent gets changed (html element)
          - openText: textContent of element when dropdown is open (string)
          - closedText: textContent of element when dropdown is closed (string)

      - classToggle:
        - contains array of objects
        - each object has these propeties:
          - element: element whose class is toggled on open / close of dropdown (html element)
          - className: name of class that gets toggled on element (string)

      - example options object:

        const options = {
          textChange: [
            {
              element: document.getElementById('ElementX'),
              openText: 'Close',
              closedText: 'Open'
            }
          ],
          classToggle: [
            {
              element: document.getElementById('ElementY'),
              className: 'ClassZ'
            }
          ],
          dropdownType: 'solid',
          activationMethod: 'hover'
        };
*/

/*
  - możliwość stworzenia kilku takich samych dropdownów według klasy (np. drop-1, drop-2)
    - podajemy samą nazwę i w pętli szukamy dropdownów z dopisaną cyfrą
  - otwarcie innego dropdownu, klikniecie poza nim lub ponowne kliknięcie togglera powinno zamykać dropdown
    - ale dobrze byłoby dodać wsparcie dla dropdownów, które zamykają się tylko przy użyciu togglera
  - wsparcie dla różnych wartości display (nie tylko block, ale też flex, grid, itd, w zależności od wyboru użytkownika)
  - dodać wsparcie dla animacji
  - dodać możliwość otwierania, nawigacji i zamykania przy pomocy samej klawiatury
  - działanie zależne od wielkości ekranu (np. powyżej 700px w ogóle przestaje cokolwiek robić)
  - reagowanie na zmianę wielkości ekranu (np. zamknięcie wszystkich dropdownów)
  - statyczna zmienna przechowująca wszystkie dropdowny
  - metoda zamykająca wszystkie dropdowny
  - metoda zamykająca jednen dropdown
  - metoda otwierająca jeden dropdown
  - metoda zmieniająca stan jakiegoś elementu (np. textContent), elementy jakie mają zostać
  zmienione i z jakimi wartościami można podać w obiekcie lub tablicy
*/

/*
  OGÓLNE ZASADY:
    - toggler powinien być elementem <button>
    - to jakim elementem jest dropdown nie ma znaczenia

    - podstawowa aktywacja i dezaktywacja dropdownu (np. kliknięcie aktywatora, najechanie i zjechanie myszką)
    - możliwość dodania elementów, które zostają zmienione przy użyciu klasy (np. napis wewnątrz)
*/

/*
  TYPY:
    1. pop-up
      - tylko jeden na raz widoczny
      - kliknięcie poza nim zamyka go (lub zsunięcie myszki - w zależności
        od metody aktywacji)
      - prawdopodobnie pozycjonowany absolutnie (lub w inny sposób usunięty z main flow),
        ale to raczej nie powinno mieć znaczenia w implementacji

    2. stały
      - może być kilka na raz widocznych
      - otwierany i zamykany tylko przy użyciu aktywatora

*/