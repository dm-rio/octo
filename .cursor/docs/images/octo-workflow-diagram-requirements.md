# Octo Workflow Diagram - Requirements

## Image File
**Target**: `octo-workflow-diagram.png`

## Usage
**Slide**: "The Octo Workflow"
**Purpose**: Show the complete development workflow from code to production

## Visual Requirements

### Layout
- **Type**: Horizontal process flow diagram (timeline)
- **Orientation**: Left to right flow
- **Style**: Modern process flow with icons and time indicators

### Workflow Steps

1. **Feature Branch** (Step 1)
   - Icon: Git branch icon or code icon
   - Label: "Feature Branch"
   - Color: `#0f3460`
   - Visual: Code/branch representation

2. **octo mr develop** (Step 2)
   - Icon: Terminal/CLI icon
   - Label: "octo mr develop"
   - Color: `#16213e`
   - Visual: Command line interface
   - **Emphasis**: This is the key command

3. **Build & Test** (Step 3)
   - Icon: Gears or build icon
   - Label: "Build & Test"
   - Sub-label: "Sonar Analysis"
   - Color: `#0f3460`
   - Time indicator: "~5 min"
   - Visual: Build process with test results

4. **Create MR** (Step 4)
   - Icon: GitLab/GitHub icon or merge request icon
   - Label: "Create MR"
   - Sub-label: "Auto-generated"
   - Color: `#16213e`
   - Visual: Merge request interface

5. **Review** (Step 5)
   - Icon: Checkmark or review icon
   - Label: "Review"
   - Color: `#0f3460`
   - Time indicator: "Team review"
   - Visual: Review process

6. **Merge** (Step 6)
   - Icon: Merge or combine icon
   - Label: "Merge"
   - Color: `#16213e`
   - Visual: Merge action

7. **Publish** (Step 7)
   - Icon: Upload or publish icon
   - Label: "Publish"
   - Sub-label: "Artifacts to Repo"
   - Color: `#0f3460`
   - Time indicator: "~2 min"
   - Visual: Publishing process

8. **Deploy** (Step 8)
   - Icon: Rocket or deploy icon
   - Label: "Deploy"
   - Sub-label: "To Production"
   - Color: `#16213e`
   - Visual: Deployment process

### Flow Elements
- **Arrows**: Connecting each step (rightward flow)
- **Arrow Style**: Modern, curved or straight
- **Arrow Color**: White or light gray
- **Flow Direction**: Clear left-to-right progression

### Time Indicators
- Show time for automated steps:
  - Build & Test: "~5 min"
  - Publish: "~2 min"
- Use clock icons or time badges
- Color: Light accent color

### Visual Style
- **Boxes**: Rounded rectangles for each step
- **Icons**: Modern, consistent icon style
- **Background**: Dark (`#1a1a2e`) or transparent
- **Spacing**: Even spacing between steps
- **Alignment**: Horizontal flow with consistent sizing

### Additional Elements
- **Start Point**: Developer/code icon on the left
- **End Point**: Production/rocket icon on the right
- **Automation Indicators**: Small automation badges on automated steps
- **Webhook Indicator**: Show webhook trigger between Merge and Publish

## Technical Specifications
- **Format**: PNG with transparency
- **Resolution**: 1920x1080 (16:9 aspect ratio)
- **File Size**: < 2MB
- **Background**: Transparent or dark (`#1a1a2e`)

## Design Notes
- Clear progression from left to right
- Emphasize automation at key steps
- Show time savings with time indicators
- Professional process flow appearance
- Easy to follow and understand

## Customization Instructions
Use this section to request specific changes:

### Workflow Changes
- [ ] Add/remove steps
- [ ] Change step order
- [ ] Modify step labels
- [ ] Add sub-steps

### Visual Changes
- [ ] Change color scheme (specify colors)
- [ ] Modify icon styles
- [ ] Adjust box sizes
- [ ] Change arrow style
- [ ] Modify time indicators

### Content Changes
- [ ] Update step descriptions
- [ ] Modify time estimates
- [ ] Add/remove sub-labels
- [ ] Change icons

### Flow Changes
- [ ] Add parallel paths
- [ ] Show decision points
- [ ] Add feedback loops
- [ ] Include error handling paths

### Other Changes
- [ ] _________________________________
- [ ] _________________________________

## Status
- [ ] Requirements defined
- [ ] Design approved
- [ ] Image generated
- [ ] Finalized

