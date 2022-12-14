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
  - mo??liwo???? stworzenia kilku takich samych dropdown??w wed??ug klasy (np. drop-1, drop-2)
    - podajemy sam?? nazw?? i w p??tli szukamy dropdown??w z dopisan?? cyfr??
  - otwarcie innego dropdownu, klikniecie poza nim lub ponowne klikni??cie togglera powinno zamyka?? dropdown
    - ale dobrze by??oby doda?? wsparcie dla dropdown??w, kt??re zamykaj?? si?? tylko przy u??yciu togglera
  - wsparcie dla r????nych warto??ci display (nie tylko block, ale te?? flex, grid, itd, w zale??no??ci od wyboru u??ytkownika)
  - doda?? wsparcie dla animacji
  - doda?? mo??liwo???? otwierania, nawigacji i zamykania przy pomocy samej klawiatury
  - dzia??anie zale??ne od wielko??ci ekranu (np. powy??ej 700px w og??le przestaje cokolwiek robi??)
  - reagowanie na zmian?? wielko??ci ekranu (np. zamkni??cie wszystkich dropdown??w)
  - statyczna zmienna przechowuj??ca wszystkie dropdowny
  - metoda zamykaj??ca wszystkie dropdowny
  - metoda zamykaj??ca jednen dropdown
  - metoda otwieraj??ca jeden dropdown
  - metoda zmieniaj??ca stan jakiego?? elementu (np. textContent), elementy jakie maj?? zosta??
  zmienione i z jakimi warto??ciami mo??na poda?? w obiekcie lub tablicy
*/

/*
  OG??LNE ZASADY:
    - toggler powinien by?? elementem <button>
    - to jakim elementem jest dropdown nie ma znaczenia

    - podstawowa aktywacja i dezaktywacja dropdownu (np. klikni??cie aktywatora, najechanie i zjechanie myszk??)
    - mo??liwo???? dodania element??w, kt??re zostaj?? zmienione przy u??yciu klasy (np. napis wewn??trz)
*/

/*
  TYPY:
    1. pop-up
      - tylko jeden na raz widoczny
      - klikni??cie poza nim zamyka go (lub zsuni??cie myszki - w zale??no??ci
        od metody aktywacji)
      - prawdopodobnie pozycjonowany absolutnie (lub w inny spos??b usuni??ty z main flow),
        ale to raczej nie powinno mie?? znaczenia w implementacji

    2. sta??y
      - mo??e by?? kilka na raz widocznych
      - otwierany i zamykany tylko przy u??yciu aktywatora

*/