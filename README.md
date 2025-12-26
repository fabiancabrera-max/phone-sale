# Phone Sale - iPhone E-commerce Website

A modern, responsive e-commerce website for selling iPhones built with Next.js, React, TypeScript, Material-UI, and Tailwind CSS.

## Features

- 🎨 **Premium Modern Design** - Clean "Airy" UI for admin and sleek dark gradients for landing
- 🔐 **Admin Dashboard** - Full CRUD for products, image uploading, and featured status management
- 📱 **Fully Responsive** - Hybrid views (Table/Cards) and adaptive layouts for all devices
- 🗺️ **Google Maps Integration** - Integrated location section with Pilar store details
- ⚙️ **JSON Configuration** - Easily customize all website texts via `siteContent.json`
- 🧪 **Unit Testing** - Robust test suite with Jest for formatters, forms, and dashboard
- 🔍 **Product Details** - Interactive galleries and detailed specs
- 💰 **Multi-Currency Support** - ARS/USD price formatting with locale-aware utility
- 🖼️ **Image Management** - Cloudinary integration for professional image hosting
- ⚡ **Next.js 15+ Optimized** - Using modern async patterns and App Router features

## Tech Stack

- **Framework**: Next.js 15.5+
- **UI Library**: React 19.0.0
- **Testing**: Jest + React Testing Library
- **Database**: PostgreSQL (Prisma/Neon)
- **Image Hosting**: Cloudinary
- **Styling**: Tailwind CSS 3.4 + Material-UI 6.3 (Grid2)
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

3. Setup environment variables:
   Copy `.env.example` to `.env.local` and fill in your Cloudinary and Database credentials.

4. Start the development server

```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) for the public site or [/admin/dashboard](http://localhost:3000/admin/dashboard) for the admin panel.

## Testing

Run the full test suite to ensure stability:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch
```

We test utilities, UI components, and the Admin Dashboard integration.

## Available Scripts

- `npm run dev` - Start development server
- `npm test` - Run Jest tests
- `npm run build` - Build for production
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## Project Structure

```
phone-sale/
├── src/
│   ├── app/                   # Next.js App Router
│   │   ├── admin/             # Admin Dashboard & CRUD
│   │   ├── api/               # API Routes (Products, Uploads)
│   │   └── product/           # Public Product Pages
│   ├── backend/               # Server-side logic & Database
│   │   ├── lib/               # Prisma & Product Actions
│   │   └── types/             # Backend Type Definitions
│   ├── frontend/              # Shared Frontend Logic
│   │   ├── components/        # UI Components & Tests
│   │   ├── theme/             # MUI Theme & Design System
│   │   └── utils/             # Formatters & Helpers
│   └── config/                # Centralized Config
│       └── siteContent.json   # UI Text Customization
├── public/                    # Static Assets
└── tests/                     # Jest Configuration & Setup
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

### Text Customization (JSON)

You can change almost any text on the landing page without touching the code. Edit `src/config/siteContent.json`:

```json
{
  "hero": {
    "title": "Phone Sale",
    "subtitle": "Los Mejores iPhones",
    "description": "..."
  },
  "location": {
    "address": "Vedia 2186, Pilar...",
    "hours": "Lunes a Viernes..."
  }
}
```

### Admin Dashboard Features

Access `/admin/dashboard` to:
- Create, Edit, and Delete products.
- Upload images directly to Cloudinary.
- Manage "Featured" status to update the home carousel.
- Real-time price formatting (USD/ARS).
- Optimized mobile experience with Sticky Action Bars.

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
