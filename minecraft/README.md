# 🎮 Minecraft Server Hub

A modern, responsive Minecraft-themed dashboard website built with clean HTML5, CSS3, and Vanilla JavaScript.

Designed for server owners who want a professional, beautiful, and dynamic website for their Minecraft community — with zero complicated frameworks.

---

## 📁 Project Structure

This project is completely self-contained in this folder and independent from any other projects:

```
minecraft/
├── index.html        # Main HTML structure, semantic sections, and meta tags
├── style.css         # Dark theme styling, glassmorphism, pixel touches, responsive layout
├── script.js         # Interactive features, mock/live API handling, copy IP, search filter
├── hero-bg.jpg       # Beautiful custom voxel landscape hero banner
├── serve.ps1         # Optional quick PowerShell local web server
└── README.md         # Beginner documentation and customization guide (this file)
```

---

## 🚀 How to Run the Website

You have multiple easy options to view and run the website locally:

### Option 1: Direct in Browser (Simplest)
1. Navigate to the `minecraft` folder on your computer.
2. Double-click `index.html` to open it directly in Chrome, Edge, Firefox, or Safari!

### Option 2: Using the Included PowerShell Server
Open PowerShell in the `minecraft` folder and run:
```powershell
powershell -ExecutionPolicy Bypass -File .\serve.ps1
```
Then open your browser to:
`http://localhost:3000/`

### Option 3: Using VS Code / IDE Live Server
If you use VS Code:
1. Install the **Live Server** extension.
2. Right-click `index.html` and click **"Open with Live Server"**.

---

## 🛠️ How to Customize Your Server

All common settings are gathered at the very top of `script.js` so you don't need to dig through hundreds of lines of code.

### 1. Change the Server Name
Open `script.js` and edit line 23:
```javascript
serverName: "Gunjan's Minecraft Server", // Change to your server name
```
You can also change the title and branding in `index.html` around line 52 and line 105:
```html
<span class="brand-subtitle">Gunjan's SMP</span>
```

### 2. Change the Server IP & Port
Open `script.js` and edit lines 24–26:
```javascript
serverIp: "play.gunjanserver.net", // Your Java Server IP or Domain
javaPort: 25565,                  // Default Java port
bedrockPort: 19132,               // Default Bedrock port
```
When you change `serverIp` here, the **Copy IP** button, the displayed server address, and the API requests will automatically use your new address!

### 3. Change Server Specs (Version, Location, Software)
Open `script.js` and edit lines 27–31:
```javascript
version: "1.20.4",
software: "Purpur / PaperMC",
location: "Frankfurt, Germany",
maxPlayers: 20,
uptime: "99.98% (24/7)",
```

---

## 🌐 How to Connect a Real Minecraft Server API

The dashboard is structured so you can switch from demo/mock data to a **live public Minecraft status API** in just 1 click.

### Using the Built-In API Integration:
1. Open `script.js`.
2. Look at line 34:
   ```javascript
   useRealApi: false,
   ```
3. Change it to:
   ```javascript
   useRealApi: true,
   ```
4. Make sure `serverIp` is set to your real public server address (e.g. `mc.hypixel.net` or your own server domain/IP).
5. Save the file and refresh your browser!

### How the API Works:
The dashboard uses the free public **[mcsrvstat.us](https://api.mcsrvstat.us/)** API:
```
https://api.mcsrvstat.us/3/{YOUR_SERVER_IP}
```
This API automatically returns:
- Whether your server is **online** or **offline**
- Current **online player count** and **max players**
- Current **server version**
- Current **MOTD (Message of the Day)**
- List of online player usernames (if enabled in your `server.properties`)

---

## 🎮 Key Features Included

- **Dark Minecraft Aesthetic**: Emerald green accents, deep charcoal background, subtle voxel cube 3D logo, and tactile buttons.
- **Copy IP Functionality**: One-click copy with instant visual feedback and toast notifications.
- **Refresh Status**: Interactive reload with loading animation and timestamp.
- **Demo Mode Controls**: "Simulate Online / Offline" toggle button so you can preview both states without needing to bring a real server down.
- **Player Grid & Live Search**: Filter online players in real-time as you type.
- **Crossplay Instructions**: Step-by-step connection guides for both Java Edition and Bedrock Edition (Console/Mobile).
- **Responsive Layout**: Pixel-perfect on desktop, tablet, and mobile with a smooth sliding navigation menu.
- **Lightweight XP Particles**: Pure HTML5 canvas animation for floating Minecraft experience orbs.

---

## 🚢 Deploying to the Web

To publish this website for free to the public, you can upload the contents of the `minecraft` folder to:
- **GitHub Pages** (Free)
- **Vercel** (Free)
- **Netlify** (Free)
- **Cloudflare Pages** (Free)

---

&copy; 2026 Gunjan's Minecraft Server Hub. Not an official Minecraft product.
