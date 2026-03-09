# HIP3399 Shopify Theme

Custom Shopify Online Store 2.0 theme for the HIP3399 storefront. This codebase is based on Shopify Dawn `15.4.1` and extends it with a Vite-powered frontend pipeline, custom homepage merchandising sections, responsive collection sliders, and cart experience enhancements.

## Overview

- Shopify OS 2.0 architecture using Liquid, JSON templates, sections, snippets, and theme settings
- Dawn foundation with custom storefront functionality layered on top of the standard theme feature set
- Vite 5 build pipeline for frontend assets, with Tailwind CSS 4 and Swiper bundled into the theme
- Git-friendly structure for ongoing section, snippet, and styling customization

## Storefront Features

- Custom homepage media banner section with image or video support, separate mobile assets, optional overlay, flexible content alignment, and optional video audio toggle
- Custom featured collection section with configurable title source, optional collection imagery, responsive grid or Swiper slider layouts, autoplay, navigation, pagination, and view-all CTA support
- Default homepage composition already set up for hero banners, new arrivals, best sellers, essentials, and featured product merchandising
- Collection pages with filtering, sorting, optional collection title display, and configurable pagination modes: default pagination, load more, infinite scroll, or show all
- Product cards that support quick add, bulk quick order, secondary hover images, ratings, and multiple image shape treatments
- Product detail pages with variant pickers and swatches, sticky product info, breadcrumbs, media gallery layouts, image zoom, pickup availability, share button, related products, collapsible tabs, and horizontal tab content blocks
- Cart experience with configurable cart drawer, cart page, or cart notification behavior
- Cart drawer enhancements including a free shipping progress banner, configurable cart recommendations, cart notes, and in-drawer quantity updates
- Sticky header with dropdown, mega menu, or drawer navigation modes
- Predictive search, customer account links, and localization selectors for country and language
- Content templates for blog, article, search, contact, about, standard pages, password, gift card, and customer account flows
- Localization-ready theme structure with `31` storefront locale files plus schema translation files

## Custom Theme Settings

- Fluid container toggle in global layout settings
- Free shipping threshold, messaging, colors, and progress bar controls
- Cart recommendation heading and product limit controls
- Optional mobile menu drawer logo configuration
- Breadcrumb toggle on product pages
- Flexible spacing, alignment, typography, and color scheme controls across core and custom sections

## Frontend Stack

- Shopify Liquid and JSON templates
- Vite 5 with `vite-plugin-shopify`
- Tailwind CSS 4 with the `ts:` utility prefix
- Swiper 11 for responsive sliders
- Custom JavaScript modules in `frontend/web/scripts`
- Theme entrypoints loaded through `main.css` and `main.js`

## Project Structure

```text
assets/      Compiled theme assets and runtime scripts
config/      Theme settings schema and data
frontend/    Vite entrypoints, custom scripts, and source styles
layout/      Theme layout files
locales/     Storefront and schema translations
sections/    OS 2.0 sections, including custom homepage sections
snippets/    Reusable Liquid partials
templates/   JSON and Liquid templates for storefront pages
```

## Development

### Prerequisites

- Node.js and npm
- Shopify CLI
- Access to the target Shopify store

### Commands

```bash
npm install
npm run dev
npm run deploy
```

`npm run dev` starts `shopify theme dev` and the Vite dev server together.  
`npm run deploy` builds the frontend assets and pushes the theme to Shopify.

## Notes

- The theme layout loads Vite-generated assets through [`snippets/vite-tag.liquid`](snippets/vite-tag.liquid).
- The current homepage configuration is stored in [`templates/index.json`](templates/index.json).
- Theme settings and editor controls are defined in [`config/settings_schema.json`](config/settings_schema.json).
