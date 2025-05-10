# 🎬 Movie Explorer - Discover Your Favorite Films

[![Vercel Deployment](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel&style=for-the-badge)](https://movie-explorer-app-iota.vercel.app/)
[![React](https://img.shields.io/badge/React-18.2-%2361DAFB?logo=react)](https://reactjs.org)
[![Material UI](https://img.shields.io/badge/Material_UI-5.14-%230081CB?logo=mui)](https://mui.com)
[![License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

A feature-rich movie discovery platform built with React and powered by the TMDb API. Users can explore trending films, search for movies, save favorites, and enjoy a seamless viewing experience across devices.

🔗 **Live Demo:** [https://movie-explorer-app-iota.vercel.app/](https://movie-explorer-app-iota.vercel.app/)


## ✨ Key Features

- **🔐 User Authentication**  
  Secure login/signup with form validation and error handling
- **🔍 Intelligent Search**  
  Find movies by title with real-time API results
- **💖 Favorites System**  
  Save/remove movies with local storage persistence
- **🎨 Theme Customization**  
  Toggle between light/dark modes
- **📱 Responsive Design**  
  Fully optimized for mobile, tablet, and desktop
- **🎥 Rich Movie Details**  
  View trailers, cast info, ratings, and more

## 🛠️ Tech Stack

**Frontend:**
- React 18 (Hooks + Context API)
- Material-UI 5 (Styled Components)
- React Router 6
- Axios for HTTP requests

**Backend Services:**
- TMDb API (Movie database)
- Vercel Serverless Functions

**Dev Tools:**
- GitHub Actions (CI/CD)
- Vercel Deployment

##  Getting Started

### Prerequisites
- Node.js ≥ 16.x
- npm
- TMDb API key ([Get one here](https://www.themoviedb.org/settings/api))

### Installation
```bash
# Clone repository
git clone https://github.com/your-username/movie-explorer.git
cd movie-explorer

# Install dependencies
npm install

# Set up environment variables
echo "REACT_APP_TMDB_API_KEY=your_api_key_here" > .env

# Run development server
npm start
