class CollectionPagination {
  constructor() {
    this.productGrid = document.querySelector('#product-grid');
    if (!this.productGrid) return;

    this.paginationType = this.productGrid.dataset.paginationType;
    this.quickAddType = this.productGrid.dataset.quickAdd;
    this.isLoading = false;

    if (this.paginationType === 'infinite') {
      this.initInfiniteScroll();
    } else if (this.paginationType === 'load_more') {
      this.initLoadMore();
    }
  }

  initInfiniteScroll() {
    this.infiniteScrollContainer = document.querySelector('.collection-infinite-scroll');
    if (!this.infiniteScrollContainer) return;

    // Create Intersection Observer for infinite scroll
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.isLoading) {
            const nextUrl = this.infiniteScrollContainer.dataset.nextUrl;
            if (nextUrl) {
              this.loadMoreProducts(nextUrl);
            }
          }
        });
      },
      {
        rootMargin: '200px', // Start loading 200px before reaching the element
      }
    );

    this.observer.observe(this.infiniteScrollContainer);
  }

  initLoadMore() {
    this.loadMoreContainer = document.querySelector('.collection-load-more');
    if (!this.loadMoreContainer) return;

    this.loadMoreButton = this.loadMoreContainer.querySelector('.load-more-button');
    if (!this.loadMoreButton) return;

    this.loadMoreButton.addEventListener('click', () => {
      const nextUrl = this.loadMoreContainer.dataset.nextUrl;
      if (nextUrl && !this.isLoading) {
        this.loadMoreProducts(nextUrl);
      }
    });
  }

  async loadMoreProducts(nextUrl) {
    if (this.isLoading) return;
    this.isLoading = true;

    // Show loading state
    this.showLoadingState();

    try {
      const response = await fetch(nextUrl);
      if (!response.ok) throw new Error('Network response was not ok');

      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      // Extract new product items
      const newProducts = doc.querySelectorAll('#product-grid > li');
      
      if (newProducts.length > 0) {
        // Append new products to the grid
        newProducts.forEach((product) => {
          this.productGrid.appendChild(product);
        });

        // Re-initialize JavaScript functionality on new products
        this.reinitializeScripts(newProducts);

        // Update next URL
        this.updateNextUrl(doc);
      } else {
        // No more products, hide pagination
        this.hidePagination();
      }
    } catch (error) {
      console.error('Error loading more products:', error);
      this.showError();
    } finally {
      this.isLoading = false;
      this.hideLoadingState();
    }
  }

  reinitializeScripts(newProducts) {
    // Custom elements automatically call connectedCallback when added to DOM
    // But we need to ensure certain initializations happen

    newProducts.forEach((product) => {
      // Re-initialize Shopify Payment Buttons if present
      const paymentButtons = product.querySelectorAll('[data-shopify="payment-button"]');
      if (paymentButtons.length > 0 && window.Shopify && Shopify.PaymentButton) {
        Shopify.PaymentButton.init();
      }

      // Re-initialize product models if present
      if (window.ProductModel) {
        window.ProductModel.loadShopifyXR();
      }

      // Trigger scroll animations
      if (product.classList.contains('scroll-trigger')) {
        // Use IntersectionObserver to trigger animation when in view
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('animate--slide-in');
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1 }
        );
        observer.observe(product);
      }

      // Re-initialize any deferred media (videos, 3D models)
      const deferredMedia = product.querySelectorAll('deferred-media');
      deferredMedia.forEach((media) => {
        // Custom element will auto-initialize via connectedCallback
      });

      // For quantity inputs in bulk quick-add
      if (this.quickAddType === 'bulk') {
        const quantityInputs = product.querySelectorAll('quantity-input');
        quantityInputs.forEach((input) => {
          // Custom element will auto-initialize via connectedCallback
        });
      }
    });

    // Dispatch custom event for theme scripts to hook into
    document.dispatchEvent(
      new CustomEvent('collection:productsLoaded', {
        detail: { products: newProducts },
      })
    );

    // Trigger Shopify theme events
    if (window.Shopify && window.Shopify.theme) {
      document.dispatchEvent(new CustomEvent('shopify:section:load'));
    }
  }

  updateNextUrl(doc) {
    let newNextUrl = null;

    if (this.paginationType === 'infinite') {
      const newInfiniteScroll = doc.querySelector('.collection-infinite-scroll');
      if (newInfiniteScroll) {
        newNextUrl = newInfiniteScroll.dataset.nextUrl;
        this.infiniteScrollContainer.dataset.nextUrl = newNextUrl || '';
      }

      // If no more pages, hide the infinite scroll container
      if (!newNextUrl) {
        this.hidePagination();
      }
    } else if (this.paginationType === 'load_more') {
      const newLoadMore = doc.querySelector('.collection-load-more');
      if (newLoadMore) {
        newNextUrl = newLoadMore.dataset.nextUrl;
        this.loadMoreContainer.dataset.nextUrl = newNextUrl || '';
      }

      // If no more pages, hide the load more button
      if (!newNextUrl) {
        this.hidePagination();
      }
    }
  }

  showLoadingState() {
    if (this.paginationType === 'load_more' && this.loadMoreButton) {
      this.loadMoreButton.classList.add('loading');
      this.loadMoreButton.disabled = true;
      const spinner = this.loadMoreButton.querySelector('.loading-spinner');
      const text = this.loadMoreButton.querySelector('.load-more-text');
      if (spinner) spinner.classList.remove('hidden');
      if (text) text.classList.add('hidden');
    }
  }

  hideLoadingState() {
    if (this.paginationType === 'load_more' && this.loadMoreButton) {
      this.loadMoreButton.classList.remove('loading');
      this.loadMoreButton.disabled = false;
      const spinner = this.loadMoreButton.querySelector('.loading-spinner');
      const text = this.loadMoreButton.querySelector('.load-more-text');
      if (spinner) spinner.classList.add('hidden');
      if (text) text.classList.remove('hidden');
    }
  }

  hidePagination() {
    if (this.paginationType === 'infinite' && this.infiniteScrollContainer) {
      this.infiniteScrollContainer.style.display = 'none';
      if (this.observer) {
        this.observer.disconnect();
      }
    } else if (this.paginationType === 'load_more' && this.loadMoreContainer) {
      this.loadMoreContainer.style.display = 'none';
    }
  }

  showError() {
    // You can customize this to show a user-friendly error message
    console.error('Failed to load more products. Please try again.');
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    new CollectionPagination();
  });
} else {
  new CollectionPagination();
}

