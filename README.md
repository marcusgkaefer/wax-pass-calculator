# Welcome to your Lovable project

## Project info

**URL**: https://lovable.dev/projects/bad76af4-a2a4-4f57-b265-5e0113cf8556

## How can I edit this code?

There are several ways of editing your application.

**Use Lovable**

Simply visit the [Lovable Project](https://lovable.dev/projects/bad76af4-a2a4-4f57-b265-5e0113cf8556) and start prompting.

Changes made via Lovable will be committed automatically to this repo.

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes. Pushed changes will also be reflected in Lovable.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Set up environment variables (see Environment Setup section below)

# Step 5: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## Environment Setup

This project requires environment variables to function properly. Follow these steps:

1. **Copy the environment template:**
   ```sh
   cp .env.example .env
   ```

2. **Edit the `.env` file with your actual values:**
   ```sh
   # Required: Your Zenoti API key
   VITE_ZENOTI_API_KEY=your_actual_api_key_here
   
   # Optional: Custom API base URL (defaults to https://api.zenoti.com/v1)
   VITE_ZENOTI_API_BASE_URL=https://api.zenoti.com/v1
   ```

3. **Get your Zenoti API key:**
   - Log into your Zenoti dashboard
   - Navigate to API settings
   - Generate or copy your API key

⚠️ **Important:** Never commit your `.env` file to version control. It's already included in `.gitignore`.

## What technologies are used for this project?

This project is built with:

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## How can I deploy this project?

Simply open [Lovable](https://lovable.dev/projects/bad76af4-a2a4-4f57-b265-5e0113cf8556) and click on Share -> Publish.

## Can I connect a custom domain to my Lovable project?

Yes, you can!

To connect a domain, navigate to Project > Settings > Domains and click Connect Domain.

Read more here: [Setting up a custom domain](https://docs.lovable.dev/tips-tricks/custom-domain#step-by-step-guide)
