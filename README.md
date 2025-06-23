# Locate Price Smart Flow - Wax Pass Calculator

A modern, intelligent wax pass calculator and booking platform that helps users find the best wax service packages and pricing options. Built with React, TypeScript, and modern UI components for a seamless user experience.

## ✨ Features

### 🏢 Location Selection
- Interactive location finder for wax centers
- Integration with Zenoti API for real-time center data
- Smart location-based service filtering

### 💆‍♀️ Service Selection
- Comprehensive wax service catalog
- Dynamic pricing calculations
- Service bundling and recommendations

### 🎫 Pass Recommendations
- Intelligent pass suggestions based on selected services
- Cost optimization algorithms
- Flexible pass options and pricing tiers

### 📋 Booking & Checkout
- Streamlined booking flow
- Real-time pricing updates
- Booking confirmation and success tracking

### 🎨 Modern UI/UX
- Responsive design with Tailwind CSS
- Beautiful animations and transitions
- Glassmorphism design elements
- Floating gradient backgrounds
- Mobile-first approach

## 🛠️ Tech Stack

- **Frontend**: React 18 with TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: Radix UI primitives with shadcn/ui
- **Routing**: React Router DOM
- **State Management**: React Context API
- **API Integration**: Zenoti API
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Charts**: Recharts
- **Notifications**: Sonner toasts

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ (recommended: use [nvm](https://github.com/nvm-sh/nvm))
- npm, yarn, or bun package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repository-url>
   cd wax-pass-calculator
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   bun install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` with your configuration:
   ```env
   # Required: Your Zenoti API key
   VITE_ZENOTI_API_KEY=your_actual_api_key_here
   
   # Optional: Custom API base URL
   VITE_ZENOTI_API_BASE_URL=https://api.zenoti.com/v1
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:8080/` to see the application.

## 📜 Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build for development environment
- `npm run preview` - Preview production build locally
- `npm run lint` - Run ESLint for code quality

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ui/              # Reusable UI components (shadcn/ui)
│   └── waxPass/         # Wax pass specific components
├── pages/
│   └── WaxPassCalculator.tsx  # Main calculator page
├── lib/
│   ├── WaxPassContext.tsx     # Global state management
│   └── zenotiApi.ts           # Zenoti API integration
├── data/
│   └── waxPassData.ts         # Static data and types
├── hooks/               # Custom React hooks
├── App.tsx             # Main application component
└── main.tsx           # Application entry point
```

## 🔧 Configuration

### Tailwind CSS
The project uses a custom Tailwind configuration with:
- Custom color schemes
- Animation utilities
- Typography plugin
- Responsive breakpoints

### TypeScript
Configured with strict type checking and modern ES features.

### ESLint
Code quality enforcement with React-specific rules.

## 🌐 API Integration

The application integrates with the Zenoti API for:
- Fetching wax center locations
- Real-time service pricing
- Booking management
- Pass availability

## 🎨 Design System

Built with a cohesive design system featuring:
- **Colors**: Custom brand palette with gradients
- **Typography**: Clean, readable font hierarchy
- **Spacing**: Consistent spacing scale
- **Components**: Reusable UI components
- **Animations**: Smooth transitions and micro-interactions

## 📱 Responsive Design

Fully responsive design that works seamlessly across:
- Desktop computers
- Tablets
- Mobile devices
- Different screen orientations

## 🔒 Environment Variables

Required environment variables:

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_ZENOTI_API_KEY` | Your Zenoti API key for service integration | No* |
| `VITE_ZENOTI_API_BASE_URL` | Base URL for Zenoti API (optional) | No |
| `VITE_USE_MOCK_DATA` | Force mock data usage (set to 'true') | No |

\* The API key is optional. When not provided, the app automatically uses mock data.

⚠️ **Security Note**: Never commit your `.env` file. Keep your API keys secure and use different keys for development and production.

## 🚀 Deployment

### Vercel Deployment (Recommended)

The application is optimized for deployment on Vercel with automatic mock data fallback when API keys are not available.

#### Quick Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/wax-pass-calculator)

#### Manual Deployment
1. Push your code to GitHub
2. Import the project on [Vercel](https://vercel.com)
3. Configure environment variables (optional):
   - For production with API: Add `VITE_ZENOTI_API_KEY`
   - For demo/mock mode: Leave blank or set `VITE_USE_MOCK_DATA=true`
4. Deploy!

#### Mock Data Mode
When deployed without API credentials, the app automatically uses mock data with:
- 3 sample wax center locations in New York
- Full catalog of waxing services
- Realistic pricing and pass recommendations
- Complete calculator functionality

Perfect for demos, development, or public deployments.

### Development Build
```bash
npm run build:dev
```

### Production Build
```bash
npm run build
```

The built files will be in the `dist/` directory, ready for deployment to any static hosting service.

For detailed deployment instructions, see [docs/deployment/vercel-deployment.md](docs/deployment/vercel-deployment.md).

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary. All rights reserved.

## 🆘 Support

For support, please contact the development team or create an issue in the repository.

---

Built with ❤️ using modern web technologies
