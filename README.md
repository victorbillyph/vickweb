# VickWEB
An Whatsapp Messenger, Alert: this is **not affiliated with, authorized, maintained, sponsored, or endorsed by WhatsApp Inc.**

# Requirements
- an Machine/VPS with Ubuntu 20.04 (or superior)
- an Whatsapp Account (not affiliated with or endorsed by WhatsApp Inc.)

# Instructions:
Step 1:
install the Lastest Nodejs with npm
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.40.2/install.sh | bash
\. "$HOME/.nvm/nvm.sh"
nvm install 22
```
Step 2:
Clone the Project Repository
```bash
sudo apt install git -y
git clone https://github.com/victorbillyph/vickweb.git
```
Step 3:
Running the Project
```bash
npm install -g pm2
cd vickweb/
npm install
npm run build
pm2 start npm --name vickweb-frontend -- run frontend
pm2 start npm --name vickweb-backend -- run start
pm2 list
```

# Accessing the Application
Go to http://{your-IP}:5173/
