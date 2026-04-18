# Padding Inspector - Design Style Guide

## 🎨 Overview

The Padding Inspector plugin uses a modern, professional dark theme with glassmorphic elements, smooth animations, and Apple-inspired design patterns. The interface prioritizes clarity, accessibility, and visual hierarchy.

---

## 🌈 Color Palette

### Background Colors
```css
Primary Background:     #1e1e1e
Secondary Background:   #2a2a2a
Tertiary Background:    #333333
```

### Border Colors
```css
Subtle Border:          rgba(255, 255, 255, 0.05)
Default Border:         rgba(255, 255, 255, 0.18)
Selected Border:        rgba(0, 102, 255, 0.3)
```

### Text Colors
```css
Primary Text:           rgba(255, 255, 255, 0.95)
Secondary Text:         rgba(255, 255, 255, 0.85)
Muted Text:             rgba(255, 255, 255, 0.3)
Disabled Text:          rgba(255, 255, 255, 0.3)
```

### Accent Colors
```css
Primary Blue:           #0066ff
Brand Gradient:         linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.06))
Blue Gradient:          linear-gradient(145deg, rgba(0,102,255,0.12), rgba(0,102,255,0.06))
Success:                rgba(0, 200, 0, 0.1)
Error:                  rgba(255, 0, 0, 0.1)
```

### Gradient Collections
```css
Progress Bar:           linear-gradient(90deg, #007AFF 0%, #5AC8FA 50%, #AF52DE 100%)
Slider Track:           linear-gradient(90deg, #2a2a2a 0%, #4a4a4a 50%, #6a6a6a 100%)
Button Disabled:        linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)
```

---

## 📝 Typography

### Font Family
```css
Primary Font: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif
```

### Font Sizes & Usage
```css
Modal Close (×):     24px  (weight 400)
Modal Titles (h2):   18px  (weight 600)
Color Action Buttons: 14px (weight 600)  /* Fix Paddings, Download JSON */
Primary Buttons:     13.5px (weight 500) /* Glassmorphic buttons */
Body Text:           12px  (weight 400-500)
Input Labels:        11px  (weight 400)
Input Fields:        11px  (weight 400)
Small Text:          10px  (weight 400-500) /* Hints, badges, tooltips */
```

### Font Weights
```css
Normal:         400
Medium:         500
Semi-Bold:      600
Bold:           700
```

### Letter Spacing
```css
Buttons (Color):    0.015em  /* Color action buttons */
Buttons (Primary):  0.02em   /* Glassmorphic buttons */
Default:            normal   /* Body text */
```

### Line Heights
```css
Buttons (Color):    1.15     /* Compact for color buttons */
Buttons (Primary):  normal   /* Standard for glassmorphic */
Body Text:          1.4      /* Readable for paragraphs */
Input Fields:       normal   /* Standard for forms */
```

---

## 🔘 Button Styles

### Primary Button (Glassmorphic) - General Use
```css
padding: 12px 20px;
font-size: 13.5px;
font-weight: 500;
font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
letter-spacing: 0.02em;
background: linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%);
color: rgba(255,255,255,0.95);
border: 1px solid rgba(255,255,255,0.18);
border-radius: 12px;
box-shadow: 0 8px 18px rgba(0,0,0,0.35), inset 0 0.5px 1px rgba(255,255,255,0.25);
backdrop-filter: blur(30px) saturate(160%);
transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.3s ease;
cursor: pointer;
white-space: nowrap;
```

### Color Action Button - Color Tab & Downloads
```css
padding: 9px 16px;
width: 100%;
font: 600 14px/1.15 -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif;
letter-spacing: 0.015em;
color: rgba(255, 255, 255, 0.96);
background: linear-gradient(145deg, rgba(24, 54, 88, 0.95) 0%, rgba(16, 38, 68, 0.95) 100%); /* Blue variant */
border-radius: 12px;
border: 1px solid rgba(120, 200, 255, 0.25);
box-shadow: inset 0 1px 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(255,255,255,.06), 0 6px 14px rgba(0,0,0,.42);
backdrop-filter: blur(14px) saturate(140%);
cursor: pointer;
white-space: nowrap;
transition: all 0.2s;
```

### Disabled State (Glassmorphic)
```css
background: linear-gradient(180deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%);
color: rgba(255,255,255,0.3);
border: 1px solid rgba(255,255,255,0.05);
box-shadow: inset 0 0 2px rgba(255,255,255,0.05), inset 0 -1px 3px rgba(0,0,0,0.15);
opacity: 0.4;
cursor: not-allowed;
```

### Loading State
```css
/* Add spinner animation */
width: 14px;
height: 14px;
border: 2px solid rgba(0, 255, 255, 0.4);
border-top: 2px solid transparent;
border-radius: 50%;
animation: spin 1s linear infinite, pulse 2s ease-in-out infinite;
box-shadow: 0 0 8px rgba(0,255,255,0.5);
```

---

## 📦 Form Elements

### Input Fields
```css
width: 100%;
padding: 8px;
font-size: 11px;
font-weight: 400;
background: #333;
border: 1px solid #555;
border-radius: 4px;
color: #fff;
outline: none;
```

### Input Labels
```css
display: block;
font-size: 11px;
font-weight: 400;
color: #999;
margin-bottom: 4px;
```

### Helper Text / Hints
```css
font-size: 10px;
font-weight: 400;
color: #999;
margin-top: 4px;
line-height: 1.4;
```

### Badges / Required Tags
```css
font-size: 10px;
font-weight: 500;
background: #0066ff;
color: #fff;
padding: 2px 6px;
border-radius: 3px;
```

### Textarea
```css
/* Same as input fields */
min-height: 60px;
resize: vertical;
font-family: monospace; /* For JSON/code input */
```

---

## 🎭 Modals

### Modal Overlay
```css
position: fixed;
top: 0; left: 0; right: 0; bottom: 0;
background: rgba(0, 0, 0, 0.8);
backdrop-filter: blur(4px);
z-index: 10000;
```

### Modal Container
```css
background: #2a2a2a;
border-radius: 12px;
padding: 20px;
max-width: 500px;
width: 90%;
max-height: 80vh;
overflow-y: auto;
border: 1px solid #444;
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);
```

### Modal Header
```css
font-size: 18px;
font-weight: 600;
color: #fff;
margin: 0;
margin-bottom: 16px;
```

### Modal Close Button
```css
background: transparent;
border: none;
color: #999;
font-size: 24px;
font-weight: 400;
cursor: pointer;
padding: 0;
width: 30px;
height: 30px;
```

---

## 🏗️ Layout Components

### Toolbar (Fixed Position)
```css
position: fixed;
left: 0; right: 0;
padding: 8px 10px;
background: #1e1e1e;
border-top: 1px solid #333; /* bottom toolbar */
border-bottom: 1px solid #333; /* top toolbar */
display: flex;
gap: 8px;
align-items: center;
z-index: 9998;
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
```

### Section Container
```css
padding: 12px;
background: #1e1e1e;
border-radius: 8px;
margin-bottom: 16px;
```

### Collapsible Section Header
```css
display: flex;
align-items: center;
gap: 8px;
cursor: pointer;
user-select: none;
transition: opacity 0.2s;
```

---

## 🎬 Animations

### Transitions
```css
/* Default smooth transition */
transition: all 0.25s ease;

/* Layout transitions */
transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);

/* Content transitions */
transition: padding 0.2s ease;

/* Micro-interactions */
transition: all 0.22s cubic-bezier(0.4, 0, 0.2, 1);
```

### Keyframe Animations
```css
/* Spinner */
@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

/* Pulse effect */
@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.7; }
}

/* Tab transitions */
.tab-panel--exit { animation: slideOut 200ms ease-out; }
.tab-panel--enter { animation: slideIn 200ms ease-out; }
```

---

## 🔧 Interactive Elements

### Range Slider
```css
/* Track */
width: 100px;
height: 8px;
background: linear-gradient(90deg, #2a2a2a 0%, #4a4a4a 50%, #6a6a6a 100%);
border-radius: 3px;
box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.35);

/* Thumb */
width: 18px;
height: 18px;
background: linear-gradient(145deg, #ffffff 0%, #f0f0f0 100%);
border-radius: 50%;
box-shadow: 0 3px 10px rgba(0, 0, 0, 0.32), inset 0 1px 0 rgba(255, 255, 255, 0.8);

/* Progress fill */
background: linear-gradient(90deg, #007AFF 0%, #5AC8FA 50%, #AF52DE 100%);
box-shadow: 0 1px 2px rgba(0, 122, 255, 0.35);
```

### Toggle Indicator
```css
font-size: 12px;
color: #999;
transition: transform 0.2s;
/* ▼ when expanded, ▶ when collapsed */
```

---

## 🎯 Spacing System

### Padding Scale
```css
xs:   4px
sm:   6px
md:   8px
lg:   12px
xl:   16px
2xl:  20px
```

### Gap Scale
```css
xs:   4px
sm:   6px
md:   8px
lg:   10px
xl:   12px
```

### Margin Scale
```css
/* Bottom margins for sections */
sm:   8px
md:   12px
lg:   16px
xl:   24px
```

---

## 🎨 Border Radius

```css
Small:      3px   (badges, small elements)
Default:    4px   (inputs, cards)
Medium:     8px   (sections, containers)
Large:      12px  (buttons, modals)
Circle:     50%   (avatars, indicators)
```

---

## 🌟 Shadow System

### Elevation Levels
```css
/* Level 1 - Subtle */
box-shadow: 0 1px 2px rgba(0, 0, 0, 0.15);

/* Level 2 - Card */
box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);

/* Level 3 - Button */
box-shadow: 0 8px 18px rgba(0, 0, 0, 0.35);

/* Level 4 - Modal */
box-shadow: 0 20px 60px rgba(0, 0, 0, 0.6);

/* Inset shadows */
box-shadow: inset 0 2px 3px rgba(0, 0, 0, 0.35);
box-shadow: inset 0 0.5px 1px rgba(255, 255, 255, 0.25);
```

---

## ✅ States & Feedback

### Success State
```css
background: rgba(0, 200, 0, 0.1);
border: 1px solid rgba(0, 200, 0, 0.3);
color: #00c800;
```

### Error State
```css
background: rgba(255, 0, 0, 0.1);
border: 1px solid rgba(255, 0, 0, 0.3);
color: #ff4444;
```

### Loading State
```css
opacity: 0.7;
cursor: wait;
/* Show spinner animation */
```

### Hover State
```css
opacity: 0.8;
transform: translateY(-1px);
box-shadow: 0 12px 24px rgba(0, 0, 0, 0.4);
```

### Active State
```css
opacity: 0.9;
transform: translateY(0);
```

---

## 🎪 Special Effects

### Glassmorphism
```css
background: rgba(255, 255, 255, 0.1);
backdrop-filter: blur(30px) saturate(160%);
border: 1px solid rgba(255, 255, 255, 0.18);
```

### Text Shadow (for labels)
```css
text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
```

### Backdrop Blur
```css
backdrop-filter: blur(4px);
```

---

## 📐 Best Practices

### 1. **Consistency**
   - Always use the spacing scale
   - Stick to the defined color palette
   - Use consistent border-radius values

### 2. **Accessibility**
   - Maintain sufficient color contrast (minimum 4.5:1 for text)
   - Provide hover/focus states for all interactive elements
   - Use semantic HTML and ARIA attributes

### 3. **Performance**
   - Use CSS transforms for animations (not top/left)
   - Prefer `opacity` and `transform` for transitions
   - Avoid expensive filters on frequently updated elements

### 4. **Visual Hierarchy**
   - Use size, color, and spacing to establish hierarchy
   - Primary actions should be most prominent
   - Group related elements with whitespace

### 5. **Responsive Design**
   - Use relative units (%, rem) where appropriate
   - Ensure touch targets are at least 44x44px
   - Test at different zoom levels

---

## 🔍 Example Components

### Glassmorphic Button (General Use)
```tsx
<button
  style={{
    padding: '12px 20px',
    fontSize: '13.5px',
    fontWeight: 500,
    fontFamily: '-apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '0.02em',
    background: 'linear-gradient(145deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
    color: 'rgba(255,255,255,0.95)',
    border: '1px solid rgba(255,255,255,0.18)',
    borderRadius: '12px',
    boxShadow: '0 8px 18px rgba(0,0,0,0.35), inset 0 0.5px 1px rgba(255,255,255,0.25)',
    backdropFilter: 'blur(30px) saturate(160%)',
    cursor: 'pointer',
    transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1), transform 0.2s ease, box-shadow 0.3s ease',
    whiteSpace: 'nowrap',
  }}
>
  Button Text
</button>
```

### Color Action Button (Downloads, Color Tab)
```tsx
<button
  style={{
    padding: '9px 16px',
    width: '100%',
    font: '600 14px/1.15 -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", Arial, sans-serif',
    letterSpacing: '0.015em',
    color: 'rgba(255, 255, 255, 0.96)',
    background: 'linear-gradient(145deg, rgba(24, 54, 88, 0.95) 0%, rgba(16, 38, 68, 0.95) 100%)',
    borderRadius: '12px',
    border: '1px solid rgba(120, 200, 255, 0.25)',
    boxShadow: 'inset 0 1px 0 rgba(255,255,255,.35), inset 0 -1px 0 rgba(255,255,255,.06), 0 6px 14px rgba(0,0,0,.42)',
    backdropFilter: 'blur(14px) saturate(140%)',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  }}
>
  Download JSON
</button>
```

---

## 📚 Design Principles

1. **Clarity** - Clear visual hierarchy and intuitive interactions
2. **Consistency** - Unified design language across all components
3. **Efficiency** - Quick access to common actions
4. **Polish** - Attention to detail in animations and micro-interactions
5. **Accessibility** - Usable by everyone, regardless of ability

---

## 🎨 Design Inspiration

- Apple Human Interface Guidelines
- Glassmorphism (iOS design language)
- Material Design (elevation & shadows)
- Figma's own design system

---

**Last Updated:** 2024
**Plugin Version:** 1.0.0
