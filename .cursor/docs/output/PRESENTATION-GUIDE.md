# Octo Presentation Guide

## 📊 Presentation Formats

The presentation is available in reveal.js format (modern, interactive slides).

## 🚀 How to Use

### Option 1: Reveal.js (Recommended - Most Modern)

1. **Install reveal-md** (if not already installed):
   ```bash
   npm install -g reveal-md
   ```

2. **Run the presentation**:
   ```bash
   reveal-md octo-presentation.md --theme white --highlight-theme github
   ```

3. **Or use a local server**:
   ```bash
   reveal-md octo-presentation.md --port 1948
   ```
   Then open `http://localhost:1948` in your browser.

### Option 2: VS Code Extension

1. Install the "Markdown Preview Enhanced" extension
2. Open `octo-presentation.md`
3. Right-click → "Markdown Preview Enhanced: Open Preview"
4. Use presentation mode

### Option 3: Online Reveal.js Viewer

1. Copy the markdown content
2. Go to https://revealjs.com/
3. Use their online editor or convert using tools like:
   - https://www.markdowntopresentation.com/
   - https://slides.com/

### Option 4: Convert to PowerPoint/PDF

Use tools like:
- **Pandoc**: `pandoc octo-presentation.md -o presentation.pptx`
- **Marp**: https://marp.app/ (supports markdown presentations)
- **Deckset**: https://www.deckset.com/ (Mac only)

## 🎨 Customization

### Change Theme

Edit the frontmatter:
```yaml
theme: white  # Options: white, black, league, beige, sky, night, serif, simple, solarized
```

### Change Transition

```yaml
transition: slide  # Options: none, fade, slide, convex, concave, zoom
```

## 📝 Presentation Structure

1. **Title Slide** - Introduction
2. **Problem Statement** - Pain points
3. **Solution Overview** - Octo platform
4. **Portal Deep Dive** - Enterprise catalog
5. **CLI Deep Dive** - Automation
6. **Utilities** - Tools
7. **Workflow** - Step-by-step process
8. **Ecosystem** - Backstage plugins
9. **Business Value** - ROI
10. **Use Cases** - Real-world applications
11. **Beta Status** - Important notice
12. **Next Steps** - Call to action

## 🖼️ Adding Images

To add images, place them in a `images/` folder and reference:
```markdown
![Alt text](images/your-image.png)
```

## 💡 Tips for Presenting

1. **Practice the flow** - Know the transitions
2. **Emphasize ROI** - Time and cost savings
3. **Show real examples** - Use your own use cases
4. **Be transparent** - Address beta status honestly
5. **Engage audience** - Ask questions, get feedback

## 🔄 Updating the Presentation

The presentation is based on `hl-overview.md` specifications. When updating:
1. Keep the modern, engaging tone
2. Maintain the Silicon Valley mindset
3. Emphasize business value
4. Include technical details but keep them accessible
5. Always mention beta status at the end

