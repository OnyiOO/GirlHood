# 🚀 GirlHood - Quick Start Guide

## ⚡ Super Fast Setup (5 Minutes)

### 1️⃣ Download Files
Since Figma Make has no export button, you must **manually copy all 72 files**.

**See `HOW_TO_DOWNLOAD.md` for detailed instructions.**

### 2️⃣ Create Project Folder
```bash
mkdir girlhood
cd girlhood
```

### 3️⃣ Copy All Files
Maintain this exact structure:
```
girlhood/
├── package.json          ← START HERE (copy this first)
├── App.tsx
├── components/           ← 9 component files
│   ├── ui/              ← 44 UI components
│   └── figma/           ← 1 file
├── utils/               ← 2 files
├── styles/              ← 1 file
├── src/                 ← 1 file
├── guidelines/          ← 1 file
└── (config files)       ← 13 config files
```

### 4️⃣ Install & Run
```bash
npm install
npm run dev
```

Open: `http://localhost:5173`

---

## 📋 72 Files Checklist

### Must Copy (14 Core Files)
- [ ] `package.json` ⭐ (Copy this FIRST!)
- [ ] `App.tsx` ⭐
- [ ] `vite.config.ts` ⭐
- [ ] `tsconfig.json` ⭐
- [ ] `index.html` ⭐
- [ ] `src/main.tsx` ⭐
- [ ] `styles/globals.css` ⭐
- [ ] `utils/translations.ts` ⭐
- [ ] `utils/colorSchemes.ts` ⭐
- [ ] `.gitignore` ⭐
- [ ] All 9 component files in `components/` ⭐

### UI Components (44 files)
- [ ] Copy entire `components/ui/` folder

### Documentation (7 files)
- [ ] README.md
- [ ] LICENSE
- [ ] SETUP.md
- [ ] CONTRIBUTING.md
- [ ] GITHUB_CHECKLIST.md
- [ ] HOW_TO_DOWNLOAD.md
- [ ] Attributions.md

---

## 🎯 Most Important Files

If you're short on time, copy these **14 essential files** first:

1. `package.json`
2. `vite.config.ts`
3. `tsconfig.json`
4. `index.html`
5. `App.tsx`
6. `src/main.tsx`
7. `styles/globals.css`
8. `utils/translations.ts`
9. `utils/colorSchemes.ts`
10. All 9 files in `components/`
11. All 44 files in `components/ui/`
12. `components/figma/ImageWithFallback.tsx`

Then copy the rest later!

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| `npm: command not found` | Install Node.js from nodejs.org |
| Import errors | Check file paths and folder structure |
| Missing dependencies | Run `npm install` |
| Port 5173 in use | Change port in `vite.config.ts` |
| Build fails | Check all files are copied |

---

## 📤 Upload to GitHub

```bash
# Initialize git
git init

# Add all files
git add .

# First commit
git commit -m "Initial commit: GirlHood App"

# Connect to GitHub (create repo first on github.com)
git remote add origin https://github.com/yourusername/girlhood.git

# Push
git push -u origin main
```

**Detailed GitHub setup**: See `SETUP.md`

---

## 🌐 Deploy Online

### Vercel (Recommended)
1. Push to GitHub first
2. Go to [vercel.com](https://vercel.com)
3. Click "Import Project"
4. Select your GitHub repo
5. Deploy! ✅

### Netlify
1. Build: `npm run build`
2. Drag `dist/` folder to [netlify.com/drop](https://app.netlify.com/drop)
3. Done! ✅

### GitHub Pages
1. Install: `npm install gh-pages --save-dev`
2. Add to `package.json`:
   ```json
   "homepage": "https://yourusername.github.io/girlhood",
   "scripts": {
     "predeploy": "npm run build",
     "deploy": "gh-pages -d dist"
   }
   ```
3. Deploy: `npm run deploy`

---

## 📚 Useful Commands

```bash
# Development
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build

# Git
git status           # Check changes
git add .            # Stage all changes
git commit -m "msg"  # Commit with message
git push             # Push to GitHub
```

---

## 🎨 Features Overview

- 🤖 AI Emergency Calls
- 📍 Live Location Sharing
- 👥 Emergency Contacts
- 🗺️ Interactive Map
- 🌍 10 Languages
- 🎨 5 Color Themes
- 🌙 Dark Mode
- ✅ ID Verification
- 🚨 Safety Check-ins

---

## 🔗 Quick Links

- **Full Setup Guide**: `SETUP.md`
- **Download Instructions**: `HOW_TO_DOWNLOAD.md`
- **GitHub Checklist**: `GITHUB_CHECKLIST.md`
- **Contributing Guide**: `CONTRIBUTING.md`
- **Main Documentation**: `README.md`

---

## 💡 Tips

1. ✅ Copy `package.json` first - it's the most important file
2. ✅ Use VS Code for easier file management
3. ✅ Test after copying each major folder
4. ✅ Keep folder structure exact
5. ✅ Don't forget hidden files like `.gitignore`

---

## ❓ Need Help?

1. Check `HOW_TO_DOWNLOAD.md` for download help
2. Check `SETUP.md` for GitHub setup help
3. Check `README.md` for feature documentation
4. Open an issue on GitHub

---

**You've got this! 💪 Your safety app is ready to deploy! 💖**
