// 注册 ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

// 1. 初始化 Lenis 平滑滚动 (L3 Interaction Core)
const lenis = new Lenis({
  duration: 1.2,
  easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // https://www.desmos.com/calculator/brs54l4xou
  direction: 'vertical',
  gestureDirection: 'vertical',
  smooth: true,
  mouseMultiplier: 1,
  smoothTouch: false,
  touchMultiplier: 2,
  infinite: false,
})

// 监听滚动并更新 ScrollTrigger
lenis.on('scroll', ScrollTrigger.update)

gsap.ticker.add((time)=>{
  lenis.raf(time * 1000)
})

gsap.ticker.lagSmoothing(0)

// 2. 全局背景发光追踪 (Spotlight & Glow Tracker)
const glowTracker = document.getElementById('glow-tracker');
let currentX = window.innerWidth / 2;
let currentY = window.innerHeight / 2;
let targetX = currentX;
let targetY = currentY;

document.addEventListener('mousemove', (e) => {
    targetX = e.clientX;
    targetY = e.clientY;
    
    // 给所有具备 spotlight-card 的元素传递鼠标坐标百分比
    document.querySelectorAll('.spotlight-card').forEach(card => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
});

// 使用 rAF 进行平滑插值跟随背景光晕
function updateGlowTracker() {
    currentX += (targetX - currentX) * 0.05;
    currentY += (targetY - currentY) * 0.05;
    
    if(glowTracker) {
        glowTracker.style.setProperty('--mouse-x', `${currentX}px`);
        glowTracker.style.setProperty('--mouse-y', `${currentY}px`);
    }
    requestAnimationFrame(updateGlowTracker);
}
updateGlowTracker();

// 3. 导航栏滚动毛玻璃效果
const navbar = document.getElementById('navbar');
lenis.on('scroll', (e) => {
    if (window.scrollY > 50) {
        navbar.style.background = 'rgba(5, 3, 10, 0.7)';
        navbar.style.backdropFilter = 'blur(16px)';
        navbar.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
    } else {
        navbar.style.background = 'transparent';
        navbar.style.backdropFilter = 'none';
        navbar.style.borderBottom = 'none';
    }
});

// 4. Hero 动画入场
document.addEventListener("DOMContentLoaded", (event) => {
    // Hero 区域文字揭示
    const tl = gsap.timeline();
    
    // 背景图缓动缩放淡入
    gsap.fromTo(".gs-hero-img", 
        { scale: 1.1, opacity: 0, filter: "blur(20px)" },
        { scale: 1, opacity: 0.8, filter: "blur(0px)", duration: 2, ease: "power3.out" }
    );
    
    tl.fromTo("#hero .gs-reveal", 
        { y: 50, opacity: 0, filter: "blur(10px)" },
        {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1,
            stagger: 0.15,
            ease: "power3.out",
            delay: 0.2
        }
    );

    // 5. 滚动揭示动画 (L2-L3)
    const revealElements = document.querySelectorAll("section:not(#hero) .gs-reveal, footer .gs-reveal");
    revealElements.forEach((el) => {
        // Set initial state for scroll elements
        gsap.set(el, { y: 50, opacity: 0, filter: "blur(10px)" });
        
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // 6. 视差图片滚动 (Parallax)
    const parallaxImages = document.querySelectorAll('.parallax-img');
    parallaxImages.forEach(img => {
        gsap.to(img, {
            yPercent: 15,
            ease: "none",
            scrollTrigger: {
                trigger: img.parentElement,
                start: "top bottom", 
                end: "bottom top",
                scrub: true
            }
        });
    });

    // 7. 3D Tilt 卡片效果 (Marimba/Voxr 交互细节)
    const tiltCards = document.querySelectorAll('.tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // 最大旋转角度10度
            const rotateY = ((x - centerX) / centerX) * 10;
            
            gsap.to(card, {
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                ease: "power1.out",
                duration: 0.4
            });
        });
        
        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                rotateX: 0,
                rotateY: 0,
                ease: "power3.out",
                duration: 0.8
            });
        });
    });

    // 8. 横向滚动区域鼠标拖拽逻辑
    const slider = document.getElementById('horizontal-scroll');
    let isDown = false;
    let startX;
    let scrollLeft;

    if (slider) {
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });
        slider.addEventListener('mouseleave', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mouseup', () => {
            isDown = false;
            slider.classList.remove('active');
        });
        slider.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 2; // 滚动速度
            slider.scrollLeft = scrollLeft - walk;
        });
    }

    // 9. 漂浮的传送带 (Floating Conveyor Belts)
    gsap.to("#floating-pills", {
        y: -20,
        rotation: 1,
        duration: 4,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1
    });

/* Web Audio API 音效交互 (Retro 8-bit) */
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    function playTone(type, startFreq, endFreq, duration, vol) {
        if (audioCtx.state === 'suspended') audioCtx.resume();
        const t = audioCtx.currentTime;
        
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        
        osc.type = type;
        osc.frequency.setValueAtTime(startFreq, t);
        if (endFreq && startFreq !== endFreq) {
            osc.frequency.exponentialRampToValueAtTime(endFreq, t + duration);
        }
        
        gain.gain.setValueAtTime(vol, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + duration);
        
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        
        osc.start(t);
        osc.stop(t + duration);
    }

    function playHoverSound() {
        // 微复古电音：短促跳跃方波，极低音量
        playTone('square', 440, 660, 0.08, 0.02);
    }

    function playClickSound() {
        // 微复古电音：干脆确认音
        playTone('square', 440, 880, 0.15, 0.03);
    }

    // Scroll tick sound 
    let lastTickTime = 0;
    function playScrollTick() {
        const now = audioCtx.currentTime;
        if (now - lastTickTime < 0.08) return; // 限制触发频率
        lastTickTime = now;
        
        playTone('square', 880, 880, 0.04, 0.01);
    }

    document.querySelectorAll('a, button, .glass-card, .btn-primary, .btn-outline').forEach(el => {
        el.addEventListener('mouseenter', playHoverSound);
        el.addEventListener('click', playClickSound);
    });

    // Gallery Non-Pinned Scroll with Perspective Scale & Sound
    if (document.getElementById('gallery-track-wrapper')) {
        const track = document.getElementById('gallery-track');
        const items = document.querySelectorAll('.gallery-item');
        
        // 取消 pin，直接伴随滚动同步横向滑动
        let tl = gsap.timeline({
            scrollTrigger: {
                trigger: "#gallery", // 触发区域改为整个 section
                start: "top bottom", // 当 section 顶部进入视口底部时开始
                end: "bottom top",   // 当 section 底部离开视口顶部时结束
                scrub: 1,
                onUpdate: (self) => {
                    if (Math.abs(self.getVelocity()) > 50) {
                        playScrollTick();
                    }
                }
            }
        });

        tl.to(track, {
            x: () => -(track.scrollWidth - window.innerWidth + window.innerWidth * 0.2),
            ease: "none"
        });

        // Near-large, far-small scale effect during rAF
        function updateGalleryScale() {
            const centerY = window.innerHeight / 2;
            const centerX = window.innerWidth / 2;
            items.forEach(item => {
                const rect = item.getBoundingClientRect();
                const itemCenterX = rect.left + rect.width / 2;
                
                const distanceX = Math.abs(centerX - itemCenterX);
                const maxDist = window.innerWidth * 0.8;
                
                // Calculate scale: 1 at center, smaller at edges
                let scale = 1 - (distanceX / maxDist) * 0.5;
                if (scale < 0.5) scale = 0.5; // min scale

                let opacity = 1 - (distanceX / maxDist) * 0.8;
                if (opacity < 0.2) opacity = 0.2;

                gsap.set(item, {
                    scale: scale,
                    opacity: opacity,
                    transformOrigin: "center center"
                });
            });
            requestAnimationFrame(updateGalleryScale);
        }
        updateGalleryScale();
    }

    // AI News Fetch (Fetch AIGCLIST via CORS Proxy)
    const newsContainer = document.getElementById('aigc-container');
    if (newsContainer) {
        const fetchNews = async () => {
            try {
                // Using a public CORS proxy to fetch the HTML content
                const res = await fetch('https://api.allorigins.win/get?url=' + encodeURIComponent('https://aigclist.com/blog'));
                const data = await res.json();
                
                if (data && data.contents) {
                    const parser = new DOMParser();
                    const doc = parser.parseFromString(data.contents, 'text/html');
                    
                    // AIGCLIST blog structure: looking for h3 tags that represent article titles
                    const headings = doc.querySelectorAll('h3');
                    const articles = [];
                    
                    headings.forEach(h3 => {
                        const a = h3.querySelector('a') || h3.closest('a');
                        if (h3.textContent && a && a.href) {
                            // Extract title
                            const title = h3.textContent.trim();
                            // Fix relative links
                            let link = a.getAttribute('href');
                            if (link.startsWith('/')) {
                                link = 'https://aigclist.com' + link;
                            }
                            
                            // Optional: find date
                            const dateEl = h3.nextElementSibling?.nextElementSibling;
                            const pubDate = dateEl && dateEl.textContent.match(/\d{4}\/\d{2}\/\d{2}/) ? dateEl.textContent.trim() : new Date().toLocaleDateString();

                            articles.push({
                                title: title,
                                link: link,
                                pubDate: pubDate,
                                description: "Explore the latest insights and guides on AI tools and trends directly from AIGCLIST."
                            });
                        }
                    });

                    if (articles.length > 0) {
                        renderNews(articles.slice(0, 4));
                    } else {
                        throw new Error("Could not parse articles from AIGCLIST.");
                    }
                } else {
                    throw new Error("Empty data from proxy");
                }
            } catch (err) {
                console.warn("Real-time AIGCLIST fetch failed, loading curated fallbacks", err);
                // Hardcoded fallback data based on AIGCLIST content
                const mockData = [
                    {
                        link: "https://aigclist.com/blog/motion-control-ai-for-video-generation",
                        pubDate: "2026/04/28",
                        title: "Motion Control AI for Video Generation: When You Need Control Instead of Guesswork",
                        description: "Discover how motion control AI is revolutionizing video generation by providing precise control over camera movements."
                    },
                    {
                        link: "https://aigclist.com/blog/best-motion-control-ai-tools",
                        pubDate: "2026/04/28",
                        title: "Best Motion Control AI Tools for Video, Camera Movement, and Animation",
                        description: "A comprehensive guide to the top AI tools for mastering motion control in your creative workflows."
                    },
                    {
                        link: "https://aigclist.com/blog/square-face-avatar-generator",
                        pubDate: "2026/04/28",
                        title: "Square Face Avatar Generator: What to Look For Before You Pick One",
                        description: "Everything you need to know about selecting the right AI tool to generate square-faced avatars and PFPs."
                    },
                    {
                        link: "https://aigclist.com/blog/why-the-next-ai-micro-businesses-won-t-look-like-startups",
                        pubDate: "2026/03/20",
                        title: "Why the Next AI Micro-Businesses Won’t Look Like Startups",
                        description: "An deep dive into how AI micro-businesses are shifting paradigms and redefining the startup landscape."
                    }
                ];
                renderNews(mockData);
            }
        };

        const renderNews = (articles) => {
            newsContainer.innerHTML = '';
            articles.forEach((item) => {
                newsContainer.innerHTML += `
                    <a href="${item.link}" target="_blank" class="glass-card p-8 group gs-reveal block cursor-pointer hover:border-highlight transition-colors relative overflow-hidden">
                        <div class="absolute inset-0 bg-highlight opacity-0 group-hover:opacity-5 transition-opacity duration-300"></div>
                        <div class="text-xs text-highlight tracking-widest uppercase mb-3">${item.pubDate}</div>
                        <h4 class="font-display text-xl font-bold mb-3 text-textMain group-hover:text-highlight transition-colors">${item.title}</h4>
                        <p class="text-muted text-sm line-clamp-2">${item.description}</p>
                    </a>
                `;
            });
            ScrollTrigger.refresh();
        };

        fetchNews();
    }
});