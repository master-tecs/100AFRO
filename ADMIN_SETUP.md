# Admin Dashboard Setup

## Current Status

✅ Admin login page created at `/admin/login`
✅ Admin dashboard created at `/admin/dashboard`
✅ API routes for blog CRUD operations
✅ Protected routes with NextAuth middleware

## How to Access

1. **Login**: Go to `http://localhost:3000/admin/login`
2. **Credentials**: 
   - Email: `admin@100afro.com` (or any user with ADMIN role)
   - Password: Currently, password verification is not implemented. Any admin user can login with just their email.

## Features

### Admin Dashboard
- View all blog posts
- Create new blog posts
- Delete blog posts
- Search and filter posts
- View statistics (placeholder data)
- Preview posts on live site

### Blog Management
- Create posts with:
  - Title (auto-generates slug)
  - Category (Music, Culture, Lifestyle, News, Industry)
  - Featured flag
  - Cover image URL
  - Excerpt
  - Full content
- Delete posts
- Edit posts (UI ready, API endpoint ready)

## Security Notes

⚠️ **Important**: Currently, password authentication is not implemented. The admin login accepts any email for users with ADMIN role without password verification.

### To Add Password Authentication:

1. **Add password field to User model**:
```prisma
model User {
  // ... existing fields
  password String? // Add this
}
```

2. **Run migration**:
```bash
npx prisma migrate dev --name add_password_field
```

3. **Update admin creation script** to hash passwords

4. **Update NextAuth credentials provider** to verify passwords with bcrypt

## Creating Admin Users

The admin user `admin@100afro.com` was created during seeding. To create more admin users:

1. Use Prisma Studio:
```bash
npm run db:studio
```

2. Or use the script (after adding password field):
```bash
npm run create-admin
```

## API Endpoints

- `GET /api/admin/blog` - List all posts (admin only)
- `POST /api/admin/blog` - Create new post (admin only)
- `PUT /api/admin/blog/[id]` - Update post (admin only)
- `DELETE /api/admin/blog/[id]` - Delete post (admin only)

All endpoints require ADMIN role authentication.

## Next Steps

1. ✅ Basic admin dashboard - DONE
2. ⏳ Add password authentication
3. ⏳ Add edit post functionality in UI
4. ⏳ Add video management
5. ⏳ Add user management
6. ⏳ Add analytics dashboard with real data

