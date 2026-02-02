# 🚀 GitDeploy - Free GitHub Project Deployment

Deploy your GitHub projects with free domains in one click!

## 🌐 Live Demo
[https://yourusername.github.io/gitdeploy-app](https://yourusername.github.io/gitdeploy-app)

## ✨ Features

- **One-Click Deployment** from GitHub repositories
- **Free Domains** from multiple providers
- **Mobile-First** responsive design
- **No Backend Required** - runs entirely on GitHub Pages
- **Multiple Providers**:
  - Vercel (.vercel.app)
  - Netlify (.netlify.app)
  - GitHub Pages (.github.io)

## 🚀 Quick Start

### Option 1: Use the Live App
1. Visit [https://yourusername.github.io/gitdeploy-app](https://yourusername.github.io/gitdeploy-app)
2. Connect your GitHub account
3. Select a repository
4. Choose a deployment provider
5. Get your free domain instantly!

### Option 2: Deploy Your Own Copy

1. **Fork this repository**
   ```bash
   Click the "Fork" button at the top right of this page
   ```

2. **Enable GitHub Pages**
   - Go to your forked repository Settings
   - Click "Pages" in the sidebar
   - Select "main branch" as source
   - Click Save

3. **Your app is live!**
   - Visit `https://yourusername.github.io/gitdeploy-app`

## 🔧 How It Works

1. **Authentication**: Uses GitHub OAuth to access your repositories
2. **Repository Selection**: Browse and select any GitHub repository
3. **Provider Selection**: Choose between Vercel, Netlify, or GitHub Pages
4. **Domain Generation**: Get a free subdomain automatically
5. **Deployment**: One-click deployment to your chosen provider

## 📁 Project Structure

```
gitdeploy-app/
├── index.html          # Main application
├── style.css           # Styles
├── script.js           # JavaScript logic
├── manifest.json       # PWA manifest
├── 404.html            # Custom 404 page
└── README.md           # This file
```

## 🛠️ Setup GitHub OAuth (Optional)

For full GitHub integration, create a GitHub OAuth App:

1. Go to [GitHub Settings → Developer settings → OAuth Apps](https://github.com/settings/developers)
2. Click "New OAuth App"
3. Fill in:
   - Application name: GitDeploy
   - Homepage URL: `https://yourusername.github.io/gitdeploy-app`
   - Authorization callback URL: `https://yourusername.github.io/gitdeploy-app`
4. Click "Register application"
5. Copy the Client ID
6. Update `script.js` with your Client ID

## 🌐 Free Domain Providers

| Provider | Domain | Features |
|----------|--------|----------|
| Vercel | `.vercel.app` | Auto SSL, CDN, Serverless |
| Netlify | `.netlify.app` | Forms, Functions, Split Testing |
| GitHub Pages | `.github.io` | Free, Custom Domains |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file

## 🙏 Credits

Built with ❤️ using:
- GitHub Pages
- GitHub API
- Font Awesome
- Google Fonts

## 🆘 Support

Found a bug or have a feature request?  
[Open an Issue](https://github.com/yourusername/gitdeploy-app/issues)

---

Made with ❤️ by [Your Name](https://github.com/yourusername)
