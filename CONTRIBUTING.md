# Contributing to GirlHood

First off, thank you for considering contributing to GirlHood! It's people like you that make GirlHood such a great tool for safety and peace of mind.

## 🌟 How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check the existing issues to avoid duplicates. When creating a bug report, include as many details as possible:

- **Use a clear and descriptive title**
- **Describe the exact steps to reproduce the problem**
- **Provide specific examples**
- **Describe the behavior you observed and what you expected**
- **Include screenshots if possible**
- **Note your environment** (browser, OS, etc.)

### Suggesting Enhancements

Enhancement suggestions are welcome! Please provide:

- **A clear and descriptive title**
- **A detailed description of the proposed feature**
- **Explain why this enhancement would be useful**
- **List any alternatives you've considered**

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Follow the code style** of the project
3. **Test your changes** thoroughly
4. **Update documentation** if needed
5. **Write clear commit messages**
6. **Submit your pull request**

## 🏗️ Development Setup

```bash
# Clone your fork
git clone https://github.com/yourusername/girlhood.git

# Navigate to the project
cd girlhood

# Install dependencies
npm install

# Start development server
npm run dev
```

## 📝 Code Style Guidelines

### TypeScript
- Use TypeScript for all new files
- Define proper types and interfaces
- Avoid `any` type when possible
- Use meaningful variable names

### React Components
- Use functional components with hooks
- Keep components focused and single-purpose
- Extract reusable logic into custom hooks
- Use proper prop types

### Styling
- Use Tailwind CSS classes
- Follow the existing color scheme system
- Respect dark mode compatibility
- Don't add inline styles unless absolutely necessary

### File Structure
```
components/
  ├── ComponentName.tsx     # Main component files
  └── ui/                   # Shadcn UI components only
utils/
  └── utilityName.ts        # Utility functions
styles/
  └── globals.css           # Global styles only
```

## 🌍 Translation Guidelines

When adding new UI text:

1. **Add the translation key** to `utils/translations.ts`
2. **Provide translations** for all 10 languages
3. **Use the translation function** in components:
   ```tsx
   const t = (key: string) => translate(key, language);
   <p>{t('your_key')}</p>
   ```
4. **Keep keys descriptive** (e.g., `emergency_contact_add`)

### Supported Languages
- English (en)
- Spanish (es)
- French (fr)
- Chinese (zh)
- Arabic (ar)
- Hindi (hi)
- Portuguese (pt)
- German (de)
- Japanese (ja)
- Korean (ko)

## 🎨 Adding Color Schemes

To add a new color scheme:

1. Open `utils/colorSchemes.ts`
2. Add your scheme following the existing pattern:
```typescript
yourcolor: {
  primary: '#your-color',
  light: '#lighter-shade',
  dark: '#darker-shade',
  gradient: 'linear-gradient(...)'
}
```
3. Update the `ColorScheme` type in `App.tsx`
4. Test in both light and dark modes

## 🧪 Testing

Before submitting:

- [ ] Test all features work correctly
- [ ] Check both light and dark modes
- [ ] Test with different color schemes
- [ ] Verify translations work
- [ ] Test on different screen sizes
- [ ] Check browser console for errors
- [ ] Test with different languages

## 📱 Mobile Responsiveness

Ensure your changes work on:
- Desktop (1920px+)
- Laptop (1366px)
- Tablet (768px)
- Mobile (375px)

## ♿ Accessibility

- Use semantic HTML
- Include proper ARIA labels
- Ensure keyboard navigation works
- Maintain sufficient color contrast
- Test with screen readers when possible

## 🔒 Security & Privacy

GirlHood is a safety app, so security is paramount:

- **Never expose API keys** in code
- **Keep user data local** (localStorage only)
- **No external API calls** without user consent
- **Document any data storage**
- **Follow privacy best practices**

## 💬 Communication

- Be respectful and constructive
- Use clear, concise language
- Provide context for your suggestions
- Be patient with review process

## 📄 Commit Message Guidelines

Use clear, descriptive commit messages:

```bash
# Good
git commit -m "Add German translation for emergency contacts"
git commit -m "Fix dark mode styling in ProfileView"
git commit -m "Update README with deployment instructions"

# Bad
git commit -m "fix stuff"
git commit -m "update"
git commit -m "changes"
```

### Format
```
<type>: <description>

[optional body]
```

Types:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting)
- `refactor`: Code refactoring
- `test`: Adding tests
- `chore`: Maintenance tasks

## 🎯 Priority Areas

We're especially interested in contributions for:

- 🌍 Additional language translations
- 🎨 New color schemes
- ♿ Accessibility improvements
- 📱 Mobile UX enhancements
- 🔒 Security enhancements
- 📚 Documentation improvements
- 🐛 Bug fixes

## ❓ Questions?

Don't hesitate to ask questions by:
- Opening an issue with the "question" label
- Starting a discussion in GitHub Discussions
- Commenting on relevant issues or PRs

## 🙏 Thank You!

Your contributions make GirlHood better for everyone. Every contribution, no matter how small, is valued and appreciated!

---

**Remember**: This is a safety application. Every feature, bug fix, and improvement can help keep someone safe. Thank you for being part of that mission! 💖
