# RESIDENCE DEPLOYMENT GUIDE

## Pre-Deployment Checklist

- [ ] All forms validated and working
- [ ] Dashboard metrics calculated correctly
- [ ] Mock data reflects realistic scenarios
- [ ] User roles and permissions configured
- [ ] Authentication token expiration set appropriately
- [ ] API endpoints mapped to production URLs
- [ ] No console errors or warnings
- [ ] Mobile responsiveness tested
- [ ] All routes working without 404s

## Local Testing

### 1. Run Development Server
```bash
cd residence-resi
npm install
npm start
```

### 2. Test Each Role
Log in with each user role and verify:
- Dashboard displays correct data
- Forms are accessible based on role
- Task management works
- Navigation is functional

### 3. Test Forms
- Create new transactions
- Verify validation works
- Check deadline auto-calculation
- Confirm data persistence

## Build for Production

```bash
npm run build
```

This generates an optimized build in the `build/` folder.

### What's Included
- Minified React bundles
- Optimized CSS
- Source maps for debugging
- Static assets

## Deployment Options

### Option 1: Vercel (Recommended)

**Setup:**
```bash
npm install -g vercel
vercel --prod
```

**Benefits:**
- Zero-config deployment
- Automatic HTTPS
- Global CDN
- Built-in analytics
- Free tier available

**Configuration:**
Create `vercel.json`:
```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "build",
  "rewrites": [
    { "source": "/(.*)", "destination": "/index.html" }
  ]
}
```

### Option 2: Netlify

**Setup:**
```bash
npm install -g netlify-cli
netlify deploy --prod --dir=build
```

**Redirect Configuration:**
Create `netlify.toml`:
```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
```

### Option 3: Traditional Server (Apache/Nginx)

**Upload Process:**
1. Build the project: `npm run build`
2. Upload `build/` folder contents to your server
3. Configure server to serve `index.html` for all routes

**Apache `.htaccess`:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

**Nginx Configuration:**
```nginx
location / {
  try_files $uri /index.html;
}
```

### Option 4: Docker

Create `Dockerfile`:
```dockerfile
FROM node:18-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

Build and run:
```bash
docker build -t residence-resi .
docker run -p 80:80 residence-resi
```

## Post-Deployment

### 1. Verify Deployment
- Visit your deployed URL
- Test login with demo credentials
- Navigate through all dashboards
- Create a test transaction
- Verify tasks load correctly

### 2. Monitor Performance
- Check Core Web Vitals
- Monitor error tracking
- Review API response times
- Track user engagement

### 3. Set Up Analytics
Add Google Analytics to `public/index.html`:
```html
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

### 4. Set Up SSL/HTTPS
Most modern hosting providers auto-enable HTTPS.

**Vercel/Netlify:** Automatic
**Traditional Server:** Use Let's Encrypt
```bash
certbot certonly --standalone -d yourdomain.com
```

## Production Configuration

### Environment Variables
Create `.env.production`:
```
REACT_APP_API_URL=https://api.yourdomain.com
REACT_APP_ENVIRONMENT=production
REACT_APP_VERSION=1.0.0
```

### Security Headers
Add to server configuration:
```
X-Content-Type-Options: nosniff
X-Frame-Options: SAMEORIGIN
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

### CORS Configuration
For API requests, configure CORS headers:
```javascript
// In your backend
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://yourdomain.com');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
  next();
});
```

## Rollback Plan

### If Issues Occur
1. Keep previous build archived
2. Redeploy previous version
3. Investigate error logs
4. Fix issues locally
5. Rebuild and redeploy

**Vercel Rollback:**
```bash
vercel rollback
```

**Netlify Rollback:**
Through Netlify dashboard > Deploys > select previous version

## Maintenance

### Regular Updates
- Check for React updates: `npm outdated`
- Update dependencies: `npm update`
- Security audits: `npm audit`
- Test after updates: `npm test`

### Monitoring
- Set up error tracking (Sentry)
- Monitor API usage
- Track performance metrics
- Review user feedback

### Backups
- Version control with Git
- Backup user data regularly
- Archive old deployments
- Keep deployment logs

## Troubleshooting

### Blank Page After Deploy
- Check browser console for errors
- Verify build was successful
- Check public base URL setting
- Clear browser cache

### Routes Return 404
- Ensure server redirects to index.html
- Check routing configuration
- Verify API base URLs

### Styles Not Loading
- Check CSS import paths
- Verify public folder configuration
- Clear browser cache

### API Calls Failing
- Verify API endpoint URLs
- Check CORS headers
- Review network tab
- Check authentication tokens

## Support Contacts

- **Deployment Help:** DevOps team
- **Frontend Issues:** Frontend lead
- **Backend/API Issues:** Backend team
- **User Support:** Support team

## Checklist for First Production Deployment

- [ ] All code reviewed and approved
- [ ] Tests passing locally
- [ ] Build succeeds without errors
- [ ] Production environment configured
- [ ] API endpoints updated
- [ ] Security headers set
- [ ] SSL/HTTPS configured
- [ ] Monitoring tools enabled
- [ ] Backup system in place
- [ ] Team trained on system
- [ ] Documentation updated
- [ ] Rollback plan ready
