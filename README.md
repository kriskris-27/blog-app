# Next Blog App

A Next.js 14 blog with MongoDB for content, Cloudinary for image storage, and an admin area to manage posts and email subscriptions.

## Features
- Blog CRUD via `/api/blog` with image uploads to Cloudinary (type/size validation, cleanup on delete).
- Email subscriptions via `/api/email` with basic validation.
- Admin UI for adding blogs and managing subscriptions.
- Tailwind CSS styling, Toast notifications, remote images allowed from Cloudinary.

## Cloudinary integration
- Configured in `lib/services/cloudinary.js` using `CLOUDINARY_*` env vars with secure uploads.
- `POST /api/blog` uploads images via Cloudinary upload streams; saves `secure_url` and `public_id` on the blog.
- `DELETE /api/blog` removes the associated Cloudinary image via `public_id` (falls back to local unlink if no public_id).
- Allowed domain `res.cloudinary.com` in `next.config.js`; images served from Cloudinary CDN.
- Validation: JPG/PNG/WEBP only, max 5MB on upload; optional folder via `CLOUDINARY_UPLOAD_FOLDER`.

## Requirements
- Node.js 18+
- MongoDB Atlas (or any MongoDB URI)
- Cloudinary account (cloud name, API key/secret)

## Setup
1) Install deps
```bash
npm install
```
2) Create `.env.local` with your values (see `.env.example`):
```
MONGODB_URI=your_mongodb_connection_string
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
CLOUDINARY_UPLOAD_FOLDER=blog-app   # optional
```
3) Run dev server
```bash
npm run dev
```
Then open the printed localhost port.

## Scripts
- `npm run dev` – start Next dev server
- `npm run build` – production build
- `npm run start` – run production build
- `npm run lint` – lint the project

## API Overview
- `GET /api/blog` → list blogs; `GET /api/blog?id=...` → single blog
- `POST /api/blog` (multipart/form-data: title, description, category, author, authorImg, image)
- `DELETE /api/blog?id=...` → removes blog and associated Cloudinary image
- `GET /api/email` → list subscriptions
- `POST /api/email` (formData: email) → subscribe
- `DELETE /api/email?id=...` → delete subscription

## Frontend structure
- Pages
  - `app/page.js`: Home, renders Header → BlogList → Footer; includes ToastContainer.
  - `app/blogs/[id]/page.jsx`: Blog detail page (fetches single blog by `id`).
  - `app/admin/addBlog/page.jsx`: Admin add-blog form (image validation, progress).
  - `app/admin/subscriptions/page.jsx`: Lists subscriptions with delete.
  - `app/admin/page.jsx`: Admin dashboard entry.
- Components (key)
  - `Components/Header.jsx`: top hero/CTA, brand.
  - `Components/BlogList.jsx`: fetches blogs, category filters (All/Tech/Startup/Lifestyle), handles loading/error, renders `BlogItem`.
  - `Components/BlogItem.jsx`: card for a blog with image, category pill, excerpt, link to detail.
  - `Components/Footer.jsx`: footer with branding/socials.
  - Admin components under `Components/AdminComponents/` for tables/actions.
- Styling
  - Tailwind via `app/globals.css` + utility classes; custom scrollbar hide + blog content typography tweaks.
  - Google font Outfit loaded in `app/layout.js`.
  - Remote images from Cloudinary allowed in `next.config.js` (`res.cloudinary.com`).
- UX touches
  - Client-side toasts for feedback (react-toastify).
  - Image preview + upload progress in admin add-blog.
  - Category filter buttons; empty/loading states handled.

## UI overview
- Homepage: hero/header, latest blogs grid with category filters, footer with branding/socials; responsive layout with Tailwind.
- Blog cards: image, category pill, title, excerpt, “Read more” link; hover shadow effect.
- Admin add blog: validated form, image preview, upload progress, disabled submit while uploading.
- Subscriptions admin: list/delete subscriptions.
- Styling conventions: utility-first via Tailwind; typography tweaks in `app/globals.css`; Outfit font for consistent look.

## Deployment (Vercel)
- Add the same env vars in Vercel → Settings → Environment Variables.
- Deploy/redeploy; ensure Cloudinary and MongoDB are reachable from the deployment.
