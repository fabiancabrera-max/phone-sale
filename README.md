# Phone Sale - iPhone E-commerce Website

A modern, responsive e-commerce website for selling iPhones built with Next.js, React, TypeScript, Material-UI, and Tailwind CSS.

## Features

- 🎨 **Premium Design** - Modern UI with gradient backgrounds and smooth animations
- 📱 **Fully Responsive** - Optimized for mobile, tablet, and desktop
- 🖼️ **Product Carousel** - Auto-playing carousel with manual navigation
- 🔍 **Product Details** - Detailed product pages with image galleries (5 images per product)
- 💬 **Contact Integration** - WhatsApp and Instagram contact buttons
- ⚡ **Fast Performance** - Built with Next.js for optimal performance
- 🎯 **Type Safe** - Full TypeScript support
- ✨ **Code Quality** - ESLint and Prettier configured

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

3. **Update contact information** in `src/config/contact.ts`:

```typescript
export const contactConfig: ContactConfig = {
  whatsapp: {
    phoneNumber: 'YOUR_WHATSAPP_NUMBER', // Format: 5491112345678
    messageTemplate: (product) =>
      `Hola! Estoy interesado en el ${product.title} - $${product.price}`,
  },
  instagram: {
    username: 'YOUR_INSTAGRAM_USERNAME',
  },
};
```

4. **Replace placeholder images** (Important!):

   The project currently uses placeholder images from `placehold.co`. To use your own product images:

   **Option A: Local Images (Recommended)**

   ```bash
   # Create images directory
   mkdir -p public/images

   # Add your product images to public/images/
   # Then update src/data/products.ts with local paths:
   images: [
     '/images/iphone-15-pro-max-1.jpg',
     '/images/iphone-15-pro-max-2.jpg',
     // ... etc
   ]
   ```

   **Option B: External URLs**

   ```typescript
   // In src/data/products.ts, replace placeholder URLs with your image hosting URLs
   images: [
     'https://your-cdn.com/iphone-15-pro-max-1.jpg',
     'https://your-cdn.com/iphone-15-pro-max-2.jpg',
     // ... etc
   ];
   ```

5. Start the development server

```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

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
│   ├── app/                    # Next.js app directory
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── product/[id]/      # Product detail pages
│   ├── components/            # React components
│   │   ├── ProductCarousel.tsx
│   │   ├── ProductCard.tsx
│   │   ├── ImageGallery.tsx
│   │   └── ContactButtons.tsx
│   ├── data/                  # Product data
│   ├── config/                # Configuration files
│   ├── theme/                 # Material-UI theme
│   └── types/                 # TypeScript types
├── public/                    # Static files
└── Configuration files
```

## Customization

### Replacing Placeholder Images

**Current Status**: The project uses placeholder images from `placehold.co` for demonstration purposes.

**To use real product images:**

1. **Prepare your images**:
   - Recommended size: 800x800px or larger
   - Format: JPG, PNG, or WebP
   - Each product needs 5 images (front, back, sides, camera detail, etc.)

2. **Add images to your project**:

   ```bash
   # Create the images directory
   mkdir -p public/images

   # Copy your images
   cp /path/to/your/images/* public/images/
   ```

3. **Update product data** in `src/data/products.ts`:
   ```typescript
   {
     id: '1',
     title: 'iPhone 15 Pro Max',
     images: [
       '/images/iphone-15-pro-max-front.jpg',
       '/images/iphone-15-pro-max-back.jpg',
       '/images/iphone-15-pro-max-side.jpg',
       '/images/iphone-15-pro-max-camera.jpg',
       '/images/iphone-15-pro-max-box.jpg',
     ],
     // ... rest of product data
   }
   ```

### Adding or Modifying Products

Edit `src/data/products.ts` to add or modify products:

```typescript
{
  id: 'unique-id',
  title: 'iPhone Model',
  description: 'Product description',
  price: 999,
  images: ['/images/img1.jpg', '/images/img2.jpg', ...], // 5 images
  featured: true, // Show in carousel
  specs: {
    storage: '128GB',
    color: 'Blue',
    condition: 'New',
  },
}
```

### Styling

- **Global styles**: `src/app/globals.css`
- **Material-UI theme**: `src/theme/muiTheme.ts`
- **Tailwind config**: `tailwind.config.ts`

## Deployment

> **⚠️ Important**: Before deploying to production, make sure to:
>
> - Replace all placeholder images with real product photos
> - Update WhatsApp number and Instagram username in `src/config/contact.ts`
> - Test all contact buttons and image galleries

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

**Note**: If using external image hosting (Cloudinary, AWS S3, etc.), update `next.config.js` to allow those domains:

```javascript
images: {
  domains: ['your-cdn-domain.com'],
},
```

## License

ISC

## Author

Phone Sale Team

---

Built with ❤️ using Next.js and React
