# GitHub Setup Instructions for GirlHood

This guide will help you transfer your GirlHood application from Figma Make to GitHub.

## 📋 Prerequisites

- A GitHub account ([Sign up here](https://github.com/join))
- Git installed on your computer ([Download here](https://git-scm.com/downloads))
- Node.js v18+ installed ([Download here](https://nodejs.org/))

## 🚀 Step-by-Step Setup

### Step 1: Create a New Repository on GitHub

1. Go to [GitHub](https://github.com) and log in
2. Click the **"+"** icon in the top right corner
3. Select **"New repository"**
4. Fill in the details:
   - **Repository name**: `girlhood` (or your preferred name)
   - **Description**: "AI-Powered Safety Companion Application"
   - **Visibility**: Choose Public or Private
   - **DO NOT** check "Initialize with README" (we already have one)
5. Click **"Create repository"**

### Step 2: Download Your Project Files from Figma Make

You'll need to manually copy all your files. Here's the complete file structure:

```
girlhood/
├── .gitignore                 ✅ Created
├── LICENSE                    ✅ Created
├── README.md                  ✅ Created
├── SETUP.md                   ✅ Created (this file)
├── package.json               ✅ Created
├── tsconfig.json              ✅ Created
├── tsconfig.node.json         ✅ Created
├── vite.config.ts             ✅ Created
├── index.html                 ✅ Created
├── src/
│   └── main.tsx               ✅ Created
├── App.tsx                    ⚠️ Copy from Figma Make
├── Attributions.md            ⚠️ Copy from Figma Make
├── components/
│   ├── CallView.tsx           ⚠️ Copy from Figma Make
│   ├── ContactsView.tsx       ⚠️ Copy from Figma Make
│   ├── DestinationTracker.tsx ⚠️ Copy from Figma Make
│   ├── HomeView.tsx           ⚠️ Copy from Figma Make
│   ├── MapView.tsx            ⚠️ Copy from Figma Make
│   ├── NetworkView.tsx        ⚠️ Copy from Figma Make
│   ├── ProfileView.tsx        ⚠️ Copy from Figma Make
│   ├── SafetyFeaturesView.tsx ⚠️ Copy from Figma Make
│   ├── SettingsView.tsx       ⚠️ Copy from Figma Make
│   ├── figma/
│   │   └── ImageWithFallback.tsx  ⚠️ Copy from Figma Make
│   └── ui/                    ⚠️ Copy entire ui folder from Figma Make
│       ├── accordion.tsx
│       ├── alert-dialog.tsx
│       └── ... (all 40+ UI components)
├── guidelines/
│   └── Guidelines.md          ⚠️ Copy from Figma Make
├── styles/
│   └── globals.css            ⚠️ Copy from Figma Make
└── utils/
    ├── colorSchemes.ts        ⚠️ Copy from Figma Make
    └── translations.ts        ⚠️ Copy from Figma Make
```

### Step 3: Set Up Your Local Project

1. **Create a new folder** on your computer:
```bash
mkdir girlhood
cd girlhood
```

2. **Copy all the files** from Figma Make into this folder, maintaining the exact folder structure shown above.

3. **Initialize Git**:
```bash
git init
```

4. **Add all files**:
```bash
git add .
```

5. **Make your first commit**:
```bash
git commit -m "Initial commit: GirlHood AI Safety Companion App"
```

### Step 4: Connect to GitHub

1. **Add GitHub as remote** (replace `yourusername` with your GitHub username):
```bash
git remote add origin https://github.com/yourusername/girlhood.git
```

2. **Push to GitHub**:
```bash
git branch -M main
git push -u origin main
```

### Step 5: Install Dependencies and Test

1. **Install all packages**:
```bash
npm install
```

2. **Start the development server**:
```bash
npm run dev
```

3. **Open your browser** to `http://localhost:5173` to verify everything works!

## 🎯 Quick Reference - Git Commands

After the initial setup, use these commands for future updates:

```bash
# Check what files have changed
git status

# Add all changed files
git add .

# Commit with a message
git commit -m "Description of your changes"

# Push to GitHub
git push

# Pull latest changes from GitHub
git pull
```

## 📦 Building for Production

When you're ready to deploy:

```bash
# Build the app
npm run build

# Preview the production build
npm run preview
```

The built files will be in the `dist/` folder, ready for deployment to services like:
- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

## 🔧 Troubleshooting

### Issue: "git: command not found"
**Solution**: Install Git from [git-scm.com](https://git-scm.com/downloads)

### Issue: "npm: command not found"
**Solution**: Install Node.js from [nodejs.org](https://nodejs.org/)

### Issue: "Permission denied (publickey)"
**Solution**: Set up SSH keys for GitHub:
1. Follow [GitHub's SSH key guide](https://docs.github.com/en/authentication/connecting-to-github-with-ssh)
2. Or use HTTPS instead of SSH (GitHub will prompt for username/password)

### Issue: Files are missing after git clone
**Solution**: Make sure you copied ALL files from Figma Make, including hidden files like `.gitignore`

## 📞 Need Help?

- [GitHub Documentation](https://docs.github.com/)
- [Git Basics Tutorial](https://git-scm.com/book/en/v2/Getting-Started-Git-Basics)
- [Vite Documentation](https://vitejs.dev/)
- Open an issue on your GitHub repository

## ✅ Checklist

Before pushing to GitHub, verify:

- [ ] All files copied from Figma Make
- [ ] `package.json` created
- [ ] `tsconfig.json` and `tsconfig.node.json` created
- [ ] `vite.config.ts` created
- [ ] `index.html` created
- [ ] `src/main.tsx` created
- [ ] `.gitignore` created
- [ ] `README.md` created
- [ ] `LICENSE` created
- [ ] Git initialized (`git init`)
- [ ] First commit made
- [ ] Remote added (`git remote add origin ...`)
- [ ] Pushed to GitHub (`git push -u origin main`)
- [ ] `npm install` works
- [ ] `npm run dev` works
- [ ] App loads in browser

## 🎉 Success!

Once all steps are complete, your GirlHood app will be:
- ✅ Backed up on GitHub
- ✅ Version controlled
- ✅ Ready for collaboration
- ✅ Shareable with others
- ✅ Ready for deployment

---

**Happy coding! Stay safe with GirlHood! 💖**
