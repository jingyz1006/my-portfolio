# DESIGN SPEC: AI Media Personal Website

## 1. Visual Theme & Atmosphere
- **Theme**: Dark Tech & Glassmorphism (暗黑科技与玻璃拟态)
- **Keywords**: 深邃 (Profound)、未来 (Futuristic)、发光 (Glowing)、层叠 (Layered)
- **Vibe**: 深空控制台，柔和的霓虹灯效与半透明的毛玻璃层叠，营造极简、前沿且带有一丝神秘感的人工智能艺术媒体空间。结合 Marimba 的灵动滚动与 Voxr 的暗色流光紫韵。

## 2. Color Palette & Roles
- `--color-bg`: `#05030A` (Deep Void - 极深的暗紫黑色，接近纯黑)
- `--color-surface`: `rgba(255, 255, 255, 0.03)` (Glass Surface - 极微弱的白，用于毛玻璃卡片背景)
- `--color-border`: `rgba(255, 255, 255, 0.08)` (Glass Border - 用于卡片微弱的边缘轮廓)
- `--color-text`: `#F0F0F0` (Starlight White - 极其纯净的主文本色)
- `--color-text-muted`: `#8B8B8B` (Ash Gray - 次要文字)
- `--color-highlight`: `#B16BFF` (Neon Purple - 核心霓虹紫)
- `--color-accent`: `#5EEAD4` (Teal - 用于科技感的局部点缀与对比)
- `--color-glow`: `rgba(177, 107, 255, 0.2)` (Purple Glow - 用于全局或聚光灯的弥散光晕)

## 3. Typography Rules
- **Display/Headings**: `Space Grotesk` - 带有未来感与极简主义的无衬线字体，展现科技张力。
- **Body/UI**: `Inter` - 清晰理性的几何无衬线体。
- **Hierarchy**:
  - `h1`: 4.5rem (Space Grotesk, Bold)
  - `h2`: 2.5rem (Space Grotesk, Semi-bold)
  - `body`: 1.125rem (Inter, 400, 1.6 line-height)

## 4. Component Stylings
- **Cards (Glassmorphism)**: 
  - `background`: `var(--color-surface)`
  - `border`: `1px solid var(--color-border)`
  - `backdrop-filter`: `blur(16px)`
  - **Hover**: 微弱的光晕叠加（Spotlight tracking）和轻微的 translateY 上浮。
- **Buttons**:
  - 实心霓虹按钮：紫色高亮背景，白色文字，Hover 时触发 `glow` 阴影放大。
  - 透明线框按钮：带有微紫色的发光边框。
- **Navigation**:
  - 悬浮时带有 `backdrop-filter: blur(20px)`，极度通透。

## 5. Layout Principles
- **Grid**: 松散的不对称网格，融入错层与漂浮感。
- **Spacing**: 大面积的深色留白，区块之间间距至少 160px，让光晕和内容有足够的呼吸空间。

## 6. Depth & Elevation
- 抛弃实心投影。通过 **发光 (Glow)** 和 **层叠毛玻璃 (Backdrop Blur)** 制造深度。
- **Spotlight Hover**: 鼠标悬浮在卡片上方时，局部出现渐变光源跟随鼠标移动。

## 7. Animation & Interaction (L3 沉浸体验)
- **Smooth Scrolling**: 引入 `Lenis` 库实现全站丝滑阻尼滚动。
- **Entrance**: 页面元素基于滚动的揭示 (Scroll Reveal) - FadeInUp + Blur 逐渐清晰。
- **Hero Reveal**: 大范围大字体的视差 (Parallax) 与透明度、缩放入场效果。
- **Cursor Tracking**: 背景深处漂浮随着鼠标微动的巨大紫红色光斑，营造活物般的氛围。
- **3D Tilt**: 核心画廊作品卡片随鼠标视角产生轻微的 3D 偏转。

## 8. Do's and Don'ts
- **DO** 利用弥散的深色光斑做局部照明。
- **DO** 保持界面的极致暗场，不要过度滥用高亮颜色。
- **DON'T** 避免在移动元素上使用过多的 `backdrop-filter: blur` 以免引发性能问题。
- **DON'T** 避免纯白背景区块，一切应融入深空主题。
- **DON'T** 避免杂乱的字体组合，坚守两套无衬线字体。

## 9. Responsive Behavior
- **Desktop**: 展示所有 L3 动画与光标跟踪，复杂的非对称错落布局。
- **Mobile**:
  - 关闭背景聚光灯跟随计算（保性能）。
  - 取消 3D 偏转，转为标准的点击态反馈。
  - 毛玻璃效果可降级处理，保证滑动帧率。