class DetailsDisclosure extends HTMLElement {
  constructor() {
    super();
    this.mainDetailsToggle = this.querySelector('details');
    this.content = this.mainDetailsToggle.querySelector('summary').nextElementSibling;

    this.mainDetailsToggle.addEventListener('focusout', this.onFocusOut.bind(this));
    this.mainDetailsToggle.addEventListener('toggle', this.onToggle.bind(this));
  }

  onFocusOut() {
    setTimeout(() => {
      if (!this.contains(document.activeElement)) this.close();
    });
  }

  onToggle() {
    if (!this.animations) this.animations = this.content.getAnimations();

    if (this.mainDetailsToggle.hasAttribute('open')) {
      this.animations.forEach((animation) => animation.play());
    } else {
      this.animations.forEach((animation) => animation.cancel());
    }
  }

  close() {
    this.mainDetailsToggle.removeAttribute('open');
    this.mainDetailsToggle.querySelector('summary').setAttribute('aria-expanded', false);
  }
}

customElements.define('details-disclosure', DetailsDisclosure);

class HeaderMenu extends DetailsDisclosure {
  constructor() {
    super();
    this.header = document.querySelector('.header-wrapper');
  }

  onToggle() {
    if (!this.header) return;
    this.header.preventHide = this.mainDetailsToggle.open;

    if (document.documentElement.style.getPropertyValue('--header-bottom-position-desktop') !== '') return;
    document.documentElement.style.setProperty(
      '--header-bottom-position-desktop',
      `${Math.floor(this.header.getBoundingClientRect().bottom)}px`
    );
  }
}

customElements.define('header-menu', HeaderMenu);

let menuItem = document.querySelectorAll(".list-menu .header__menu-item"),
    header_wrapper = document.querySelector(".header-wrapper");

menuItem.forEach(item => {
  let details = item.closest("details"),
    content = item.nextElementSibling;
  
  item.addEventListener("mouseenter", event => {
    let detailsAll = document.querySelectorAll("details.mega-menu")
    
    detailsAll.forEach(detail => {
      detail.removeAttribute("open");
    })
    details?.setAttribute("open", "open");
    if (details !== null) {
      header_wrapper.classList.add("header--mega-menu-open");
    } else {
      header_wrapper.classList.remove("header--mega-menu-open");
    }
  });

  if (content !== null) {
    content.addEventListener("mouseleave", event => {
      event.target.parentElement.removeAttribute("open");
      header_wrapper.classList.remove("header--mega-menu-open");
    });
  }
});
