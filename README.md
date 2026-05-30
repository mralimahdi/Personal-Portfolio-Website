# Syed Ali Mahdi — Portfolio

A fully custom, animated personal portfolio website built with vanilla HTML, CSS, and JavaScript. Features a multi-section scroll experience, SVG loader animation, interactive particle canvas, CV unroll animation, skills iris wheel, and a working contact form via EmailJS.

---

## Features

- Animated SVG logo loader
- Particle / neural network canvas background
- Smooth multi-section scroll with parallax
- Animated timeline (education & experience)
- Scroll-driven capabilities card deck
- CV parchment unroll animation with stamp effect
- Interactive iris skill wheel (drag/scroll to reveal)
- 3D tilt glass contact card
- EmailJS-powered contact form
- Fully responsive design

---

## Setup

### 1. Clone the repository
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### 2. Configure EmailJS credentials
```bash
cp config.example.js config.js
```
Open `config.js` and fill in your actual EmailJS keys:
```js
window._ENV = {
    EMAILJS_SERVICE_ID:  'your_service_id',
    EMAILJS_TEMPLATE_ID: 'your_template_id',
    EMAILJS_PUBLIC_KEY:  'your_public_key',
};
```

### 3. Link config.js in your HTML
Make sure this line is in your `index.html` **before** `script.js`:
```html
<script src="config.js"></script>
<script src="script.js"></script>
```

### 4. Run locally
Open with **VS Code Live Server** or any local server:
```
http://127.0.0.1:5500
```

---

## EmailJS Setup

1. Create a free account at [emailjs.com](https://www.emailjs.com)
2. Add a Gmail service → copy the **Service ID**
3. Create an email template → copy the **Template ID**
4. Go to Account → General → copy your **Public Key**
5. Paste all three into `config.js`

Template variables used:
| Variable | Value |
|---|---|
| `{{name}}` | Sender's name |
| `{{email}}` | Sender's email |
| `{{message}}` | Project details |
| `{{time}}` | Submission timestamp |
| `{{title}}` | Project title / subject |

---

## Project Structure

```
├── index.html
├── style.css
├── script.js
├── config.js          ← gitignored (your private keys)
├── config.example.js  ← safe to commit (template)
├── .env.example       ← environment variable template
├── .gitignore
└── README.md
```

---

## Tech Stack

- HTML5 / CSS3 / Vanilla JavaScript
- EmailJS (contact form)
- Canvas API (particle network)
- SVG animations
- CSS custom properties & animations

---

## License

© 2026 Syed Ali Mahdi. All rights reserved.
