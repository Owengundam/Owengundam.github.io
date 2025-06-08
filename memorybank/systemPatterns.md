# System Patterns

## Architecture Overview
Single-page application (SPA) with modular CSS theming system, built for GitHub Pages static hosting.

## Key Technical Decisions

### 1. Single HTML File Structure
- **Decision**: All content in one `index.html` file
- **Rationale**: Simplifies deployment, improves performance, reduces complexity
- **Trade-offs**: Harder to scale content, but appropriate for portfolio scope

### 2. Modular CSS Theme System
- **Pattern**: Multiple CSS files with theme variations
- **Current Themes**:
  - `styles.css` (base)
  - `styles-playful.css`
  - `styles-maximal.css` 
  - `styles-techy.css`
  - `styles-handmade-organic.css` (currently active)
  - `styles-serious.css`
- **Implementation**: Commented link switching in HTML head

### 3. Image Carousel Component
- **Pattern**: Vanilla JavaScript carousel with manual navigation
- **Structure**: Container → Slide → Items
- **Features**: Previous/Next navigation, loop functionality
- **Media Support**: Both images and videos

## Component Relationships

```
index.html
├── Header (Name + Location)
├── Bio Section (Personal Statement)
├── Projects Section
│   └── Carousel Component
│       ├── Slide Container
│       ├── Navigation Controls
│       └── Media Items (images/videos)
├── Interests/Tools Grid
└── Footer (Contact + Copyright)
```

## Design Patterns in Use

### 1. Progressive Enhancement
- Base HTML works without JavaScript
- JavaScript adds carousel functionality
- CSS provides visual enhancement layers

### 2. Theme Switching Pattern
- CSS files as interchangeable modules
- HTML structure remains constant
- Easy A/B testing of visual styles

### 3. Responsive Grid System
- Flexbox-based layouts
- Mobile-first approach
- Breakpoint-based adaptations

### 4. Asset Organization
- `/images/` - static project images
- `/videos/` - project demonstration videos
- `/memorybank/` - project documentation
- Root level - HTML, CSS, Git files

## Performance Considerations
- External font loading (Google Fonts)
- Image optimization needed
- Minimal JavaScript footprint
- CSS theme switching without reload

## Scalability Patterns
Current structure supports:
- Adding new themes (new CSS files)
- Adding carousel items (modify HTML array)
- Content updates (modify HTML sections)
- New sections (extend main container) 