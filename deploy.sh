#!/bin/bash

# Uhuru Community Pixel Garden - Deployment Setup Script
# This script helps with initial setup for GitHub and Vercel deployment

echo "Setting up Uhuru Community Pixel Garden for deployment..."

# Check if git is installed
if ! command -v git &> /dev/null
then
    echo "Git is not installed. Please install Git first."
    exit 1
fi

# Check if GitHub CLI is installed
if ! command -v gh &> /dev/null
then
    echo "GitHub CLI is not installed. It's recommended for easy GitHub setup."
    echo "Visit https://cli.github.com/ to install it."
    read -p "Continue without GitHub CLI? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]
    then
        exit 1
    fi
fi

# Initialize Git if not already initialized
if [ ! -d ".git" ]; then
    git init
    echo "Git repository initialized."
fi

# Create a .env.local file from .env.example if it doesn't exist
if [ ! -f ".env.local" ] && [ -f ".env.example" ]; then
    cp .env.example .env.local
    echo "Created .env.local from .env.example"
    echo "Please update .env.local with your actual MongoDB URI and Solana settings"
fi

# Prompt for MongoDB URI
read -p "Enter your MongoDB connection URI (leave blank to set later): " mongodb_uri
if [ ! -z "$mongodb_uri" ]; then
    # Replace the placeholder in .env.local
    sed -i "s|mongodb+srv://username:password@cluster.mongodb.net/pixelgarden|$mongodb_uri|g" .env.local
    echo "MongoDB URI set in .env.local"
fi

# Prompt for Solana burn address
read -p "Enter the Solana burn address (leave blank to use default): " solana_burn
if [ ! -z "$solana_burn" ]; then
    # Replace the placeholder in .env.local
    sed -i "s|1111111111111111111111111111111111111111111|$solana_burn|g" .env.local
    echo "Solana burn address set in .env.local"
fi

# Add files to git
git add .

# Provide guidance for next steps
echo ""
echo "Setup completed! Next steps:"
echo "1. Create a GitHub repository at https://github.com/new"
echo "2. Run the following commands to push your code to GitHub:"
echo "   git commit -m \"Initial commit\""
echo "   git remote add origin https://github.com/yourusername/your-repo-name.git"
echo "   git push -u origin main"
echo ""
echo "3. Connect your GitHub repository to Vercel:"
echo "   - Sign up/in at https://vercel.com/"
echo "   - Import your GitHub repository"
echo "   - Add your environment variables (MONGODB_URI, SOLANA_RPC_URL, SOLANA_BURN_ADDRESS)"
echo "   - Deploy!"
echo ""
echo "Happy coding!"