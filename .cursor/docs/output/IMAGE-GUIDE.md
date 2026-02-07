# Octo Presentation Image Guide

This document provides guidance on images to include in the Octo presentation for maximum visual impact.

## 📸 Required Images

### 1. `octo-architecture-diagram.png`
**Location**: Slide "The Octo Solution"
**Purpose**: Show the three main components and how they connect
**Content**:
- Three boxes: "Octo Portal", "Octo CLI", "Octo Utilities"
- Arrows showing data flow between them
- Developer icon connecting to CLI
- Cloud icons for Portal
- Modern, clean design
**Style**: Infographic, blue/dark theme matching presentation colors

### 2. `catalog-hierarchy-visual.png`
**Location**: Slide "Key Benefits: Enterprise Catalog"
**Purpose**: Visualize the hierarchical structure
**Content**:
- Tree diagram showing:
  - Domain (top level)
    - System (second level)
      - Component (third level)
        - Service (fourth level)
          - API (fifth level)
- Use different colors for each level
- Include example names (e.g., "E-commerce Domain" → "Payment System" → "Payment API")
**Style**: Organizational chart style, colorful, easy to read

### 3. `true-devops-diagram.png` ⭐ **HIGH PRIORITY**
**Location**: Slide "True DevOps: Everything as Code"
**Purpose**: Emphasize the "everything as code" benefit (specifically requested)
**Content**:
- Left side: Traditional approach (multiple tools, manual steps, complexity)
- Right side: Octo approach (single command, automated flow)
- Show code flowing through automated pipeline
- Minimal manual intervention
- Speed indicators (fast arrows, clock icons)
**Style**: Before/After comparison, modern, dynamic
**Colors**: Red/Orange for "before" (complex), Green/Blue for "after" (simple)

### 4. `octo-workflow-diagram.png`
**Location**: Slide "The Octo Workflow"
**Purpose**: Show the complete development workflow
**Content**:
- Flowchart with steps:
  1. Feature Branch (git icon)
  2. `octo mr develop` (CLI icon)
  3. Build & Test (gears icon)
  4. Create MR (GitLab/GitHub icon)
  5. Review (checkmark icon)
  6. Merge (merge icon)
  7. Publish (upload icon)
  8. Deploy (rocket icon)
- Arrows showing flow direction
- Time indicators (e.g., "5 min", "2 min")
**Style**: Process flow diagram, modern icons, timeline feel

## 🎨 Optional but Recommended Images

### 5. `portal-screenshot.png`
**Location**: Any Portal slide
**Purpose**: Show actual Octo Portal interface
**Content**: Screenshot of the catalog view showing components
**Style**: Real interface, annotated if needed

### 6. `cli-demo.png`
**Location**: CLI section
**Purpose**: Show CLI in action
**Content**: Terminal screenshot showing `octo mr develop` command and output
**Style**: Terminal/console style, syntax highlighted

### 7. `plugin-ecosystem.png`
**Location**: Backstage Ecosystem slide
**Purpose**: Visualize the plugin ecosystem
**Content**: 
- Central "Octo Portal" hub
- Multiple plugin icons around it (Kubernetes, GitHub, SonarQube, etc.)
- Connection lines showing integration
**Style**: Network diagram, colorful plugin icons

### 8. `roi-comparison.png`
**Location**: Business Value section
**Purpose**: Show time/cost savings
**Content**:
- Bar chart comparing:
  - Time per MR: Before (30 min) vs After (1 min)
  - Infrastructure costs: Before vs After
  - Developer hours saved per month
**Style**: Professional chart, clear labels, green for savings

### 9. `security-features.png`
**Location**: Security/SSO slide
**Purpose**: Show security architecture
**Content**:
- OIDC SSO flow diagram
- RBAC visualization
- Security layers
**Style**: Security-focused, professional, trust-building colors

## 🎨 Design Guidelines

### Color Palette
- **Primary Dark**: `#1a1a2e` (dark blue)
- **Secondary Dark**: `#16213e` (medium blue)
- **Accent**: `#0f3460` (lighter blue)
- **Accent Colors**: Use green for positive, red for negative, orange for warnings

### Style Principles
1. **Modern & Clean**: Minimalist design, plenty of white space
2. **Professional**: Enterprise-grade appearance
3. **Consistent**: Use same icon style throughout
4. **Accessible**: High contrast, readable fonts
5. **Engaging**: Use icons, colors, and visual hierarchy

### Icon Sources
- **Font Awesome**: https://fontawesome.com/
- **Feather Icons**: https://feathericons.com/
- **Heroicons**: https://heroicons.com/
- **Material Icons**: https://fonts.google.com/icons

## 🛠️ Tools for Creating Images

### Free Options
1. **Draw.io / diagrams.net**: Flowcharts, architecture diagrams
2. **Canva**: Professional graphics, templates
3. **Figma**: Design tool (free tier available)
4. **Excalidraw**: Hand-drawn style diagrams
5. **Lucidchart**: Diagrams (free tier)

### Paid Options
1. **Adobe Illustrator**: Professional vector graphics
2. **Sketch**: Mac design tool
3. **InVision**: Prototyping and design

## 📝 Image Specifications

- **Format**: PNG (with transparency) or SVG (for scalability)
- **Resolution**: Minimum 1920x1080 for full-screen display
- **Aspect Ratio**: 16:9 (standard presentation ratio)
- **File Size**: Keep under 2MB for web presentations
- **Naming**: Use kebab-case (e.g., `octo-architecture-diagram.png`)

## 🚀 Quick Start

1. Create an `images/` folder in the same directory as the presentation
2. Generate or source the required images
3. Place images in the `images/` folder
4. The presentation will automatically reference them

## 💡 Tips

- **Use real screenshots** when possible (more authentic)
- **Annotate screenshots** to highlight key features
- **Keep it simple** - don't overcrowd images
- **Test on projector** - ensure images look good when projected
- **Have backup** - keep high-res versions for printing

## 📋 Checklist

- [ ] octo-architecture-diagram.png
- [ ] catalog-hierarchy-visual.png
- [ ] true-devops-diagram.png ⭐
- [ ] octo-workflow-diagram.png
- [ ] portal-screenshot.png (optional)
- [ ] cli-demo.png (optional)
- [ ] plugin-ecosystem.png (optional)
- [ ] roi-comparison.png (optional)
- [ ] security-features.png (optional)

