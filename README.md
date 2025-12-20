# Phone Sale - iPhone E-commerce Website

A modern, responsive e-commerce website for selling iPhones built with Next.js, React, TypeScript, Material-UI, and Tailwind CSS.

## Features

- 🎨 **Premium Dark Design** - Modern UI with dark slate gradients and elegant aesthetics
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop with adaptive layouts
- 🖼️ **Product Carousel** - Auto-playing carousel with swipe support and manual navigation
- 🔍 **Product Details** - Detailed product pages with interactive image galleries (5 images per product)
- 💬 **Contact Integration** - WhatsApp and Instagram contact buttons with pre-filled messages
- 🖼️ **Realistic Product Images** - High-quality generated images for iPhone 15 Pro Max, iPhone 15, and iPhone 14 Pro
- 💰 **ARS Price Formatting** - Argentinian locale formatting (e.g., $ 1.299)
- ⚡ **Fast Performance** - Built with Next.js for optimal performance
- 🎯 **Type Safe** - Full TypeScript support
- ✨ **Code Quality** - ESLint and Prettier configured
- 🎨 **Custom Favicon** - Professional titanium-style favicon

## Tech Stack

- **Framework**: Next.js 15.5.6
- **UI Library**: React 19.0.0
- **Language**: TypeScript 5.7.2
- **Styling**: Tailwind CSS 3.4.17 + Material-UI 6.3.0
- **Icons**: Material-UI Icons
- **Code Quality**: ESLint + Prettier

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or yarn package manager

### Installation

1. Clone the repository

```bash
git clone <your-repo-url>
cd phone-sale
```

2. Install dependencies

```bash
npm install
```

3. **Update contact information** in `src/frontend/config/contact.ts`:

```typescript
export const contactConfig: ContactConfig = {
  whatsapp: {
    phoneNumber: 'YOUR_WHATSAPP_NUMBER', // Format: 5491112345678
    messageTemplate: (product) =>
      `Hola! Estoy interesado en el ${product.title} - ${formatPrice(product.price)}`,
  },
  instagram: {
    username: 'YOUR_INSTAGRAM_USERNAME',
  },
};
```

4. Start the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## Project Structure

```
phone-sale/
├── src/
│   ├── frontend/              # Frontend application
│   │   ├── app/               # Next.js app directory
│   │   │   ├── icon.png       # Custom favicon
│   │   │   ├── layout.tsx     # Root layout
│   │   │   ├── page.tsx       # Home page (Hero, Carousel, Grid)
│   │   │   └── product/[id]/  # Product detail pages
│   │   ├── components/        # React components
│   │   │   ├── ProductCarousel.tsx  # Responsive carousel with swipe
│   │   │   ├── ProductCard.tsx      # Product card component
│   │   │   ├── ImageGallery.tsx     # Image gallery with thumbnails
│   │   │   └── ContactButtons.tsx   # WhatsApp/Instagram buttons
│   │   ├── data/              # Product data (mock - temporal)
│   │   │   └── products.ts    # Product catalog
│   │   ├── config/            # Configuration files
│   │   │   └── contact.ts     # Contact information
│   │   ├── theme/             # Material-UI theme
│   │   │   └── muiTheme.ts    # Custom theme configuration
│   │   ├── utils/             # Utility functions
│   │   │   └── formatters.ts  # Price formatting (ARS locale)
│   │   └── types/             # TypeScript types
│   │       └── product.ts     # Product type definitions
│   ├── backend/               # Backend application (ready for development)
│   │   └── README.md          # Backend setup guide
│   └── app -> frontend/app    # Symlink for Next.js compatibility
├── public/                    # Static files
│   └── images/                # Product images
└── Configuration files
```

**Note**: The project is structured with separate `frontend` and `backend` folders to facilitate future backend development. Currently, all product data is in `src/frontend/data/products.ts` as mock data. Once the backend is ready, this will be replaced with API calls.


## Key Features Explained

### Responsive Product Carousel

The carousel adapts to different screen sizes:

- **Mobile** (< 768px): 1 item, swipe navigation, dots only
- **Tablet** (768px - 1024px): 2 items, navigation arrows
- **Desktop** (> 1024px): 3 items, navigation arrows

Touch swipe support is enabled on all devices for a native app-like experience.

### Image Gallery

Each product detail page features an interactive gallery with:

- Main image display with navigation arrows
- Thumbnail strip with elegant selection state (opacity + border)
- Improved spacing between thumbnails (gap-4)
- Smooth transitions and hover effects

### Price Formatting

All prices are displayed using Argentinian locale formatting:

- Format: `$ 1.299` (dot as thousands separator)
- Implemented via `Intl.NumberFormat` with `es-AR` locale
- Consistent across all components (cards, detail pages, WhatsApp messages)

## Customization

### Adding or Modifying Products

Edit `src/frontend/data/products.ts` to add or modify products:

```typescript
{
  id: 'unique-id',
  title: 'iPhone Model',
  description: 'Product description',
  price: 999,
  images: [
    '/images/model-front.png',
    '/images/model-back.png',
    '/images/model-side.png',
    '/images/model-camera.png',
    '/images/model-box.png'
  ],
  featured: true, // Show in carousel
  specs: {
    storage: '128GB',
    color: 'Blue',
    condition: 'Nuevo',
  },
}
```

### Adding Product Images

1. **Prepare your images**:
   - Recommended size: 800x800px or larger
   - Format: PNG, JPG, or WebP
   - Each product should have 5 images (front, back, side, camera, box)

2. **Add images to the project**:

   ```bash
   # Images go in public/images/
   cp /path/to/your/images/* public/images/
   ```

3. **Update product data** in `src/data/products.ts` with the new image paths

### Styling

- **Global styles**: `src/frontend/app/globals.css`
- **Material-UI theme**: `src/frontend/theme/muiTheme.ts`
- **Tailwind config**: `tailwind.config.ts`

Current color scheme uses dark slate gradients (`#0f172a` to `#334155`) for a premium, professional look.

## Deployment

> **⚠️ Important**: Before deploying to production, make sure to:
>
> - Update WhatsApp number and Instagram username in `src/frontend/config/contact.ts`
> - Test all contact buttons and image galleries
> - Verify all product images are loading correctly

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Deploy with one click
4. Vercel will automatically serve images from the `public` folder

### Other Platforms

Build the project:

```bash
npm run build
```

The output will be in the `.next` folder. Follow your hosting provider's Next.js deployment guide.

## Recent Updates

- ✅ Dark slate gradient hero section with reduced padding
- ✅ Custom professional favicon (titanium style)
- ✅ Generated realistic product images for main models
- ✅ Improved image gallery styling (better spacing and selection)
- ✅ ARS price formatting across all components
- ✅ Enhanced responsive carousel with swipe support

## License

ISC

## Author

Phone Sale Team

---

Built with ❤️ using Next.js and React
