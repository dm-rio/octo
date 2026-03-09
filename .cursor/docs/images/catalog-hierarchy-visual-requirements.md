# Catalog Hierarchy Visual - Requirements

## Image File
**Target**: `catalog-hierarchy-visual.png`

## Usage
**Slide**: "Key Benefits: Enterprise Catalog"
**Purpose**: Visualize the hierarchical structure of the enterprise catalog

## Visual Requirements

### Layout
- **Type**: Organizational tree diagram (top-down)
- **Orientation**: Vertical hierarchy
- **Style**: Organizational chart with color-coded levels

### Hierarchy Structure

1. **Domain** (Top Level - Level 1)
   - Box: Large, prominent
   - Color: `#1a1a2e` (dark blue)
   - Example: "E-commerce Domain"
   - Icon: Globe or building icon

2. **System** (Second Level - Level 2)
   - Box: Medium size
   - Color: `#16213e` (medium blue)
   - Example: "Payment System"
   - Icon: Server or system icon
   - Multiple systems can branch from one domain

3. **Component** (Third Level - Level 3)
   - Box: Medium size
   - Color: `#0f3460` (lighter blue)
   - Example: "Payment Gateway Component"
   - Icon: Package or component icon
   - Multiple components per system

4. **Service** (Fourth Level - Level 4)
   - Box: Smaller size
   - Color: `#4a90e2` (light blue)
   - Example: "Payment Processing Service"
   - Icon: Service or API icon
   - Multiple services per component

5. **API** (Fifth Level - Level 5)
   - Box: Smallest size
   - Color: `#7bb3f0` (very light blue)
   - Example: "Payment API"
   - Icon: API or endpoint icon
   - Multiple APIs per service

### Visual Elements
- **Connecting Lines**: Vertical and horizontal lines connecting levels
- **Line Style**: Clean, modern lines
- **Line Color**: White or light gray
- **Spacing**: Even spacing between levels
- **Alignment**: Centered or left-aligned hierarchy

### Example Structure to Show
```
E-commerce Domain
  ├── Payment System
  │   ├── Payment Gateway Component
  │   │   ├── Payment Processing Service
  │   │   │   ├── Payment API
  │   │   │   └── Refund API
  │   │   └── Fraud Detection Service
  │   └── Billing Component
  └── Order System
      └── Order Management Component
```

## Technical Specifications
- **Format**: PNG with transparency
- **Resolution**: 1920x1080 (16:9 aspect ratio)
- **File Size**: < 2MB
- **Background**: Transparent or dark (`#1a1a2e`)

## Design Notes
- Use gradient or distinct colors for each level
- Ensure text is readable at all sizes
- Keep hierarchy clear and easy to follow
- Professional organizational chart appearance

## Customization Instructions
Use this section to request specific changes:

### Hierarchy Changes
- [ ] Add/remove levels
- [ ] Change level names
- [ ] Modify example structure

### Visual Changes
- [ ] Change color scheme (specify colors)
- [ ] Modify box styles
- [ ] Adjust spacing
- [ ] Change icon style

### Content Changes
- [ ] Update example names
- [ ] Add/remove example branches
- [ ] Modify icons
- [ ] Add labels or annotations

### Other Changes
- [ ] _________________________________
- [ ] _________________________________

## Status
- [ ] Requirements defined
- [ ] Design approved
- [ ] Image generated
- [ ] Finalized

