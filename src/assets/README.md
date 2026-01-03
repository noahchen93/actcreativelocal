# ACT CREATIVE - Assets Directory

This directory contains all image assets used in the ACT CREATIVE website.

## 📁 Directory Structure

```
/assets
  /images
    logo.png                    # Company logo (black with neon green)
    /team                       # Team member photos (4 photos)
      noah-chen.png            # Founder & CEO
      daisy.png                # Designer
      jimmy-tang.png           # Supply Chain Expert
      steve-yang.png           # Technical Director
    /cases                      # Case study project images (6 photos)
      big-world.png            # A BIG BIG WORLD - Sentosa
      wings-art.png            # WINGS OF ART - Barbie Exhibition
      pacman.png               # PACMAN & FRIENDS - Sentosa
      hofman.png               # FLORENTIJN HOFMAN - Shanghai
      craig-karl.png           # CRAIG & KARL - Beijing
      k11.png                  # K11 SHENYANG - Art Collection
```

## 🎯 Current Status

### Figma Make Environment
- **Current Setup**: Code uses `figma:asset/[hash].png` paths
- **Status**: ✅ Images display correctly in Figma Make preview
- **Total Images**: 11 (1 logo + 4 team + 6 cases)

### Production Deployment (Vercel/Netlify)
- **Required Action**: Replace placeholder files with actual PNG images
- **Path in Code**: Will need to update imports from `figma:asset` to `/assets/images/`

## 📋 Image Requirements

### Logo (logo.png)
- Format: PNG with transparency
- Recommended size: 300-500px width
- Design: "ACT" text with neon green arrow on black background
- Usage: Header, Footer, Hero sections

### Team Photos (team/*.png)
- Format: PNG or JPG
- Recommended size: 400x400px minimum (square)
- Style: Professional headshots with neutral background
- Quality: High resolution for retina displays

### Case Study Images (cases/*.png)
- Format: PNG or JPG
- Recommended size: 1200x900px (4:3 aspect ratio)
- Content: Project highlights, installations, or event photos
- Quality: High resolution, optimized for web

## 🔄 Migration Guide

### For Development (Figma Make):
Current code uses virtual `figma:asset` imports - no changes needed.

### For Production Deployment:

1. **Export Images from Figma Make**
   - Download all 11 images from the Figma Make environment
   - Ensure proper naming and format

2. **Replace Placeholder Files**
   - Upload actual images to corresponding `/assets/images/` paths
   - Maintain the same file names

3. **Update Code Imports**
   - Replace `figma:asset/[hash].png` with relative paths
   - Example: `import logo from "../assets/images/logo.png"`

4. **Update All Components**
   - Header.tsx
   - Footer.tsx
   - Hero.tsx
   - TeamSection.tsx
   - CaseStudies.tsx

## 📝 Notes

- All placeholder files currently contain text descriptions
- Figma asset IDs are documented in each placeholder file
- Component usage is documented for reference
- Optimize images with TinyPNG or similar before deployment

## ✅ Checklist

- [ ] Export logo from Figma Make
- [ ] Export 4 team photos
- [ ] Export 6 case study images
- [ ] Optimize all images for web
- [ ] Replace placeholder files
- [ ] Update code imports
- [ ] Test in production environment
