/**
 * Horizontal Tabs Component
 * Handles tab switching functionality for product horizontal tabs
 */

class HorizontalTabs {
  constructor(container) {
    this.container = container;
    this.buttons = container.querySelectorAll('.horizontal-tabs__button');
    this.panels = container.querySelectorAll('.horizontal-tabs__panel');
    
    this.init();
  }

  init() {
    // Add click event listeners to all tab buttons
    this.buttons.forEach(button => {
      button.addEventListener('click', (e) => this.handleTabClick(e));
    });

    // Add keyboard navigation
    this.container.addEventListener('keydown', (e) => this.handleKeyboard(e));
  }

  handleTabClick(event) {
    const button = event.currentTarget;
    const targetId = button.getAttribute('data-tab-target');
    
    if (!targetId) return;

    // Remove active class from all buttons and panels
    this.buttons.forEach(btn => btn.classList.remove('active'));
    this.panels.forEach(panel => panel.classList.remove('active'));

    // Add active class to clicked button
    button.classList.add('active');

    // Show corresponding panel
    const targetPanel = this.container.querySelector(`#${targetId}`);
    if (targetPanel) {
      targetPanel.classList.add('active');
    }

    // Update ARIA attributes for accessibility
    this.updateAriaAttributes(button, targetPanel);
  }

  handleKeyboard(event) {
    const target = event.target;
    
    // Only handle keyboard events on tab buttons
    if (!target.classList.contains('horizontal-tabs__button')) return;

    const buttons = Array.from(this.buttons);
    const currentIndex = buttons.indexOf(target);
    let nextIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        nextIndex = currentIndex > 0 ? currentIndex - 1 : buttons.length - 1;
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
        break;
      case 'ArrowRight':
        event.preventDefault();
        nextIndex = currentIndex < buttons.length - 1 ? currentIndex + 1 : 0;
        buttons[nextIndex].focus();
        buttons[nextIndex].click();
        break;
      case 'Home':
        event.preventDefault();
        buttons[0].focus();
        buttons[0].click();
        break;
      case 'End':
        event.preventDefault();
        buttons[buttons.length - 1].focus();
        buttons[buttons.length - 1].click();
        break;
    }
  }

  updateAriaAttributes(button, panel) {
    // Update button ARIA attributes
    this.buttons.forEach(btn => {
      btn.setAttribute('aria-selected', btn === button ? 'true' : 'false');
      btn.setAttribute('tabindex', btn === button ? '0' : '-1');
    });

    // Update panel ARIA attributes
    this.panels.forEach(p => {
      p.setAttribute('aria-hidden', p === panel ? 'false' : 'true');
    });
  }
}

// Initialize all horizontal tabs on the page
document.addEventListener('DOMContentLoaded', () => {
  const tabContainers = document.querySelectorAll('.product__horizontal-tabs');
  tabContainers.forEach(container => {
    new HorizontalTabs(container);
  });
});

// Re-initialize if tabs are dynamically added (e.g., via AJAX)
if (typeof window.Shopify !== 'undefined') {
  document.addEventListener('shopify:section:load', () => {
    const tabContainers = document.querySelectorAll('.product__horizontal-tabs');
    tabContainers.forEach(container => {
      new HorizontalTabs(container);
    });
  });
}

