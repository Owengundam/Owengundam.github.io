# Technical Context

## Technology Stack

### Core Technologies
- **HTML5**: Semantic markup, media elements (video)
- **CSS3**: Flexbox, Grid, custom properties, animations
- **Vanilla JavaScript**: DOM manipulation, event handling
- **Google Fonts**: Typography (Space Grotesk font family)

### No Framework Dependencies
- **Rationale**: Keeps bundle size minimal, reduces complexity
- **Benefits**: Fast loading, no version conflicts, full control
- **Trade-offs**: More manual DOM work, less abstraction

## Development Environment

### Hosting Platform
- **GitHub Pages**: Static site hosting
- **Domain**: owengundam.github.io
- **Deployment**: Automatic from main branch
- **SSL**: Provided by GitHub

### Development Setup
- **Local Development**: Any web server (Live Server, Python SimpleHTTPServer)
- **Version Control**: Git with GitHub
- **File Structure**: Flat structure for GitHub Pages compatibility

### Browser Support Requirements
- **Modern Browsers**: Chrome, Firefox, Safari, Edge (last 2 versions)
- **Mobile**: iOS Safari, Chrome Mobile
- **Responsive**: Mobile-first design approach

## Technical Constraints

### GitHub Pages Limitations
- **Static Only**: No server-side processing
- **File Size**: 1GB repository limit
- **Build Time**: Jekyll available but not currently used
- **Custom Domains**: Supported but using default subdomain

### Performance Constraints
- **Images**: Need optimization for web delivery
- **Fonts**: External loading may affect initial render
- **Media**: Video files should be compressed
- **CSS**: Multiple theme files increase initial page weight

## Asset Management

### Current Assets
```
/images/
├── original_253036431b75f71e2c963208cdabad35.jpg
├── original_36fac7ca4b9ec3b9e611e8af47a6432b.gif
├── original_fa6307f4e5d8decec46751893453a8fc.gif
└── original_025070e5d893cecc740d90dfec23cf93.gif

/videos/
└── Screen Recording.mp4
```

### Optimization Needed
- **Image Compression**: JPGs and GIFs could be smaller
- **Video Compression**: MP4 optimization for web
- **Format Considerations**: WebP for images, WebM for videos
- **Lazy Loading**: Not currently implemented

## Development Workflow

### CSS Theme Development
1. Copy existing theme CSS file
2. Modify variables and styles
3. Test across breakpoints
4. Update HTML link references

### Content Updates
1. Direct HTML editing
2. Asset file replacement
3. Git commit and push
4. GitHub Pages auto-deployment

### Testing Strategy
- **Cross-browser**: Manual testing on target browsers
- **Responsive**: Browser dev tools + physical devices  
- **Performance**: Lighthouse audits
- **Accessibility**: Basic WCAG compliance checking

## Security Considerations
- **Static Site**: Minimal attack surface
- **External Resources**: Google Fonts over HTTPS
- **Contact**: Email links only, no forms to secure 