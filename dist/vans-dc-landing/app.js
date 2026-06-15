// Desestructuramos los hooks que necesitamos de React (vía CDN global)
const { useState, useRef, useEffect } = React;

// --- DATA ---
const CAROUSEL_PRODUCTS = [
  { 
    id: 1, 
    title: "URBAN ESSENTIAL HOODIE", 
    desc: "GRAPHITE / 450G COTTON", 
    price: 85, 
    left: "ONLY 12 LEFT", 
    tag: "SOLD OUT SOON", 
    img: "https://images.unsplash.com/photo-1556905055-8f358a7a47b2?q=80&w=600&auto=format&fit=crop", 
    sizes: ["S", "M", "L", "XL"] 
  },
  { 
    id: 2, 
    title: "NEO-BRUTALIST TEE", 
    desc: "BEIGE / OVERSIZE CUT", 
    price: 65, 
    left: null, 
    tag: null, 
    img: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=600&auto=format&fit=crop", 
    sizes: ["S", "M", "L"] 
  },
  { 
    id: 3, 
    title: "ARCHIVE CARGO SYSTEM", 
    desc: "DARK DENIM / ARTICULATED", 
    price: 75, 
    left: null, 
    tag: "NEW IN", 
    img: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?q=80&w=600&auto=format&fit=crop", 
    sizes: ["30", "32", "34", "36"] 
  }
];

const HERO_SHOES_DATA = [
  { id: 'black', title: "SK8-HI RECONSTRUCTED", colorName: 'STEALTH BLACK', colorClass: 'bg-zinc-900', price: 120, heroImg: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=1200&auto=format&fit=crop' },
  { id: 'red', title: "SK8-HI RECONSTRUCTED", colorName: 'ACTION RED', colorClass: 'bg-[#A80000]', price: 120, heroImg: 'https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&w=1200&auto=format&fit=crop' },
  { id: 'white', title: "SK8-HI RECONSTRUCTED", colorName: 'STARK WHITE', colorClass: 'bg-zinc-100', price: 120, heroImg: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1200&auto=format&fit=crop' }
];

const TECH_SPECS = [
  { label: "UPPER MATERIAL", value: "450g Heavy Canvas & Reinforced Suede" },
  { label: "MIDSOLE TECH", value: "Dual-Density Vulcanized Rubber Wrap" },
  { label: "OUTSOLE PROFILE", value: "Aggressive 90-Degree Geometric Lug Grid" },
  { label: "STITCH RATIO", value: "Quad-Thread Industrial Nylon Perimeter" }
];

function App() {
  // --- ESTADOS DE LA COMPRA / CARRITO ---
  const [cartItems, setCartItems] = useState([
    { id: 'initial-1', title: "SK8-HI RECONSTRUCTED", desc: "STEALTH BLACK / size 10", price: 120, quantity: 1, img: "https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=100" }
  ]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('crypto'); 
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  // --- INTERFAZ GENERAL ---
  const [activeShoe, setActiveShoe] = useState(HERO_SHOES_DATA[0]);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [activeSpecIndex, setActiveSpecIndex] = useState(0);
  
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [emailSuccess, setEmailSuccess] = useState(false);

  const scrollContainer = useRef(null);

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const cartSubtotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  // --- MOTOR DE ANIMACIONES SCROLL REVEAL PERMANENTE ---
  useEffect(() => {
    const observerOptions = { root: null, threshold: 0.05, rootMargin: "0px 0px -10px 0px" };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => { 
        if (entry.isIntersecting) {
          entry.target.classList.add('active'); 
        }
      });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.reveal-up, .img-reveal');
    animatedElements.forEach(el => observer.observe(el));

    // Forzar activación inmediata si carga a mitad de página
    setTimeout(() => {
      animatedElements.forEach(el => {
        const rect = el.getBoundingClientRect();
        if (rect.top < window.innerHeight && rect.bottom >= 0) {
          el.classList.add('active');
        }
      });
    }, 100);

    const handleScroll = () => {
      const scrolled = window.pageYOffset;
      const heroBg = document.getElementById('hero-parallax-bg');
      if (heroBg) heroBg.style.transform = `translateY(${scrolled * 0.3}px)`;
    };
    window.addEventListener('scroll', handleScroll);

    return () => { window.removeEventListener('scroll', handleScroll); };
  }, []);

  // --- CONTROLADOR CAMBIO DE COLOR ---
  const handleColorChange = (newShoe) => {
    if (newShoe.id === activeShoe.id) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setActiveShoe(newShoe);
      setIsTransitioning(false);
    }, 300);
  };

  // --- RETORNO AUTOMÁTICO A HOME (MÉTODO SUAVE) ---
  const scrollToHome = (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  };

  // --- GESTIÓN DE CARRITO ---
  const addItemToCart = (itemToAdd) => {
    setCartItems(prevItems => {
      const existing = prevItems.find(i => i.id === itemToAdd.id);
      if (existing) {
        return prevItems.map(i => i.id === itemToAdd.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prevItems, { ...itemToAdd, quantity: 1 }];
    });
    setIsCartOpen(true); 
  };

  const updateQuantity = (id, amount) => {
    setCartItems(prevItems => 
      prevItems.map(item => {
        if (item.id === id) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      }).filter(Boolean)
    );
  };

  const handleCheckoutSubmit = (e) => {
    e.preventDefault();
    setIsCheckingOut(true);
    setTimeout(() => {
      alert("SYS_LOG: TRANSACCIÓN PROCESADA CON ÉXITO. REVISAR COMPROBANTE EN SU TERMINAL.");
      setCartItems([]);
      setIsCheckingOut(false);
      setIsCartOpen(false);
    }, 1500);
  };

  const handleNewsletterSubmit = (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setEmailError(true);
      setEmailSuccess(false);
    } else {
      setEmailError(false);
      setEmailSuccess(true);
      setEmail('');
    }
  };

  const scrollCarousel = (direction) => {
    if (scrollContainer.current) {
      const offset = direction === 'left' ? -400 : 400;
      scrollContainer.current.scrollBy({ left: offset, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative min-h-screen bg-[#050505] text-[#f9f9f9] selection:bg-[#A80000] selection:text-white">
      
      {/* HEADER */}
      <header id="main-header" className="fixed top-0 w-full z-[90] h-20 bg-black/40 backdrop-blur-md flex items-center px-6 md:px-12 justify-between border-b border-white/5">
        <div className="flex items-center">
          {/* LOGO LINK CON ACCIÓN DE RETORNO AL HOME */}
          <a href="#" onClick={scrollToHome} className="font-display text-3xl md:text-5xl text-white tracking-tighter font-bold cursor-pointer hover:opacity-80 transition-opacity select-none">
            VANS<span className="text-[#A80000]">×</span>DC
          </a>
        </div>
        <nav className="hidden lg:flex items-center gap-12">
          <a className="font-mono-tech text-[10px] tracking-[0.3em] text-white hover:text-[#A80000] transition-all" href="#editorial">EDITORIAL</a>
          <a className="font-mono-tech text-[10px] tracking-[0.3em] text-white hover:text-[#A80000] transition-all" href="#engineering">ENGINEERING</a>
          <a className="font-mono-tech text-[10px] tracking-[0.3em] text-white hover:text-[#A80000] transition-all" href="#shop">COLLECTION</a>
        </nav>
        <div className="flex items-center gap-8">
          <button onClick={() => setIsCartOpen(true)} className="p-2 hover:text-[#A80000] transition-colors relative flex items-center focus:outline-none">
            <span className="material-symbols-outlined text-white">shopping_bag</span>
            <span className="absolute -top-0.5 -right-0.5 bg-[#A80000] text-white text-[8px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {totalItemsCount}
            </span>
          </button>
        </div>
      </header>

      {/* CARRITO PANEL */}
      <div className={`fixed inset-0 z-[200] transition-opacity duration-300 ${isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}>
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsCartOpen(false)}></div>
        <div className={`absolute right-0 top-0 h-full w-full max-w-md bg-zinc-950 border-l border-white/10 p-6 md:p-8 flex flex-col justify-between transition-transform duration-500 transform ${isCartOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div>
            <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
              <div className="flex flex-col">
                <span className="font-mono-tech text-[9px] text-[#A80000] tracking-widest font-bold">// STORAGE MODULE</span>
                <h3 className="font-display text-3xl text-white font-bold uppercase">YOUR MANIFEST</h3>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-white/40 hover:text-[#A80000] font-mono-tech text-xs tracking-widest border border-white/10 px-3 py-1 hover:border-[#A80000] transition-colors">
                CLOSE // ✕
              </button>
            </div>
            <div className="space-y-4 max-h-[35vh] overflow-y-auto pr-2 hide-scrollbar">
              {cartItems.length === 0 ? (
                <p className="font-mono-tech text-xs text-white/20 uppercase tracking-wider py-8 text-center">// NO CORRUPTED DATA / CART EMPTY</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="flex gap-4 bg-black border border-white/5 p-3 relative">
                    <img src={item.img} alt={item.title} className="w-16 h-20 object-cover border border-white/10 grayscale" />
                    <div className="flex flex-col justify-between flex-grow">
                      <div>
                        <h4 className="font-display text-lg text-white font-bold leading-tight uppercase tracking-tight">{item.title}</h4>
                        <p className="font-mono-tech text-[9px] text-white/40 tracking-wider uppercase mt-0.5">{item.desc}</p>
                      </div>
                      <div className="flex justify-between items-center mt-2">
                        <div className="flex items-center border border-white/10">
                          <button onClick={() => updateQuantity(item.id, -1)} className="px-2 py-0.5 text-xs text-white/40 hover:text-white font-mono-tech hover:bg-white/5">-</button>
                          <span className="px-3 py-0.5 text-[10px] font-mono-tech text-white border-l border-r border-white/10 bg-zinc-900">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, 1)} className="px-2 py-0.5 text-xs text-white/40 hover:text-white font-mono-tech hover:bg-white/5">+</button>
                        </div>
                        <span className="font-mono-tech text-[12px] text-[#A80000] font-bold">${item.price * item.quantity}.00</span>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
          {cartItems.length > 0 && (
            <div className="border-t border-white/10 pt-4 mt-4">
              <span className="font-mono-tech text-[9px] text-white/30 tracking-widest block mb-3">// SECURE ARCHIVE PROTOCOL</span>
              <div className="grid grid-cols-3 gap-2 mb-6">
                <button onClick={() => setPaymentMethod('crypto')} className={`border p-3 text-center transition-all flex flex-col items-center justify-center ${paymentMethod === 'crypto' ? 'border-[#A80000] bg-[#A80000]/10 text-white' : 'border-white/10 bg-black text-white/40 hover:border-white/30'}`}>
                  <span className="material-symbols-outlined text-sm mb-1">currency_bitcoin</span>
                  <span className="font-mono-tech text-[8px] tracking-widest font-bold">CRYPTO</span>
                </button>
                <button onClick={() => setPaymentMethod('card')} className={`border p-3 text-center transition-all flex flex-col items-center justify-center ${paymentMethod === 'card' ? 'border-[#A80000] bg-[#A80000]/10 text-white' : 'border-white/10 bg-black text-white/40 hover:border-white/30'}`}>
                  <span className="material-symbols-outlined text-sm mb-1">credit_card</span>
                  <span className="font-mono-tech text-[8px] tracking-widest font-bold">CREDIT</span>
                </button>
                <button onClick={() => setPaymentMethod('transfer')} className={`border p-3 text-center transition-all flex flex-col items-center justify-center ${paymentMethod === 'transfer' ? 'border-[#A80000] bg-[#A80000]/10 text-white' : 'border-white/10 bg-black text-white/40 hover:border-white/30'}`}>
                  <span className="material-symbols-outlined text-sm mb-1">account_balance</span>
                  <span className="font-mono-tech text-[8px] tracking-widest font-bold">WIRE_TRF</span>
                </button>
              </div>
              <form onSubmit={handleCheckoutSubmit} className="space-y-3 bg-black border border-white/5 p-4 mb-4">
                {paymentMethod === 'crypto' && (
                  <div className="space-y-1">
                    <label className="font-mono-tech text-[8px] text-white/40 tracking-wider block">BITCOIN / ETHEREUM METAMASK HASH</label>
                    <input required className="w-full bg-zinc-900 border border-white/10 text-white font-mono-tech text-[10px] p-2 focus:outline-none" type="text" defaultValue="0x45cf7b821aa80901e1d3bf1" />
                  </div>
                )}
                {paymentMethod === 'card' && (
                  <div className="space-y-2">
                    <input required className="w-full bg-zinc-900 border border-white/10 text-white font-mono-tech text-[10px] p-2 focus:outline-none" type="text" placeholder="CARD HOLDER NAME" />
                    <div className="grid grid-cols-2 gap-2">
                      <input required className="w-full bg-zinc-900 border border-white/10 text-white font-mono-tech text-[10px] p-2 focus:outline-none" type="text" placeholder="MM/YY" />
                      <input required className="w-full bg-zinc-900 border border-white/10 text-white font-mono-tech text-[10px] p-2 focus:outline-none" type="password" placeholder="CVV" />
                    </div>
                  </div>
                )}
                {paymentMethod === 'transfer' && (
                  <div className="space-y-1 text-left">
                    <p className="font-mono-tech text-[8px] text-white/50 leading-relaxed uppercase">Transfiera a VANS-DC Labs Corp, Banco Agrícola: 0102-3942-11.</p>
                    <input required className="w-full bg-zinc-900 border border-white/10 text-white font-mono-tech text-[10px] p-2 mt-2 focus:outline-none" type="text" placeholder="TRANSACTION REF CODE" />
                  </div>
                )}
              </form>
              <div className="flex justify-between items-end mb-4 border-b border-white/10 pb-3">
                <span className="font-mono-tech text-[10px] text-white/40 tracking-widest uppercase font-bold">TOTAL SUM:</span>
                <span className="font-display text-4xl text-white font-bold">${cartSubtotal}.00</span>
              </div>
              <button type="submit" disabled={isCheckingOut} className="w-full bg-[#A80000] text-white font-mono-tech text-[11px] font-bold tracking-[0.2em] py-4 uppercase hover:bg-white hover:text-black transition-colors focus:outline-none">
                {isCheckingOut ? "EXECUTING TRANSACTION..." : `EXECUTE SYSTEM ORDER — $${cartSubtotal}.00`}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* HERO SECTION - ANIMADO */}
      <section className="relative h-screen w-full flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0 overflow-hidden">
          <img 
            id="hero-parallax-bg"
            alt="Hero Background" 
            className={`w-full h-full object-cover scale-110 will-change-transform transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) ${
              isTransitioning ? 'opacity-0 scale-100 brightness-[0.1]' : 'opacity-100 scale-110 brightness-[0.35]'
            }`} 
            src={activeShoe.heroImg}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#050505] via-transparent to-[#050505]"></div>
        </div>
        
        <div className="relative z-10 text-center px-4 max-w-5xl reveal-up">
          <span className="font-mono-tech text-[10px] text-[#A80000] tracking-[0.6em] block uppercase mb-4 font-bold">
            THE ARCHIVE 01 // OVERSIZE EXPERIMENT
          </span>
          <h1 className={`font-display text-[50px] md:text-[120px] text-white uppercase leading-[0.85] mb-8 tracking-tighter font-bold transition-all duration-300 ${
            isTransitioning ? 'opacity-50 translate-y-2' : 'opacity-100 translate-y-0'
          }`}>
            BEYOND THE<br/>
            <span className="text-[#A80000] transition-colors duration-300">{activeShoe.colorName}</span>
          </h1>

          <div className="bg-black/90 border border-white/10 p-4 inline-flex flex-col items-center gap-2 mb-8 backdrop-blur-md">
            <span className="text-[9px] font-mono-tech tracking-widest text-white/40 uppercase">INTERACTIVE PALETTE</span>
            <div className="flex gap-4">
              {HERO_SHOES_DATA.map((shoe) => (
                <button
                  key={shoe.id}
                  onClick={() => handleColorChange(shoe)}
                  className={`w-6 h-6 rounded-full border-2 transition-all duration-300 ${shoe.colorClass} ${
                    activeShoe.id === shoe.id ? 'border-white scale-125' : 'border-transparent hover:scale-110'
                  }`}
                />
              ))}
            </div>
          </div>

          <div className="flex justify-center">
            <a href="#editorial" className="bg-white text-black font-display text-xl font-bold px-16 py-5 hover:bg-[#A80000] hover:text-white transition-all duration-300">
              ENTER EXPERIENCE
            </a>
          </div>
        </div>
      </section>

      {/* EDITORIAL GRID - ANIMADO */}
      <section className="py-32 bg-[#050505] px-6 md:px-12 max-w-[1440px] mx-auto" id="editorial">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-y-24 md:gap-x-12 items-start">
          
          <div className="md:col-span-7 reveal-up">
            <div className="img-reveal group relative aspect-[4/5] overflow-hidden bg-zinc-900 border border-white/5">
              <img alt="Editorial Men" className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700" src="https://images.unsplash.com/photo-1488161628813-04466f872be2?q=80&w=600&auto=format&fit=crop"/>
            </div>
            <div className="mt-8 flex justify-between items-start reveal-up">
              <div className="max-w-xs">
                <h3 className="font-display text-4xl text-white font-bold">ARCHITECTURAL SILHOUETTES</h3>
                <p className="text-white/40 text-sm mt-2">Engineered for pure street movement. Built for premium industrial presence.</p>
              </div>
              <span className="font-mono-tech text-[10px] text-white/20">01 / 03</span>
            </div>
          </div>

          <div className="md:col-span-5 md:mt-48 reveal-up">
            <div className="img-reveal group relative aspect-[3/4] overflow-hidden bg-zinc-900 border border-white/5">
              <img alt="Editorial Women" className="w-full h-full object-cover grayscale brightness-90 hover:grayscale-0 transition-all duration-700" src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=600&auto=format&fit=crop"/>
              <div className="absolute bottom-12 left-12 z-20">
                <h3 className="font-display text-5xl text-white font-bold leading-none">WOMEN CAPSULE</h3>
                <a href="#shop" className="font-mono-tech text-[10px] tracking-[0.2em] text-white/60 mt-4 border-b border-white/20 pb-1 inline-block hover:text-[#A80000]">VIEW LOGS</a>
              </div>
            </div>
          </div>

          {/* VISOR INTERACTIVO CON EVENTO REVEAL */}
          <div className="md:col-span-12 lg:col-span-10 lg:col-start-2 mt-12 reveal-up">
            <div className="relative bg-zinc-950 p-6 md:p-12 border border-white/5">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                
                <div className="relative bg-black border border-white/5 p-4 flex justify-center items-center aspect-square overflow-hidden">
                  <img 
                    alt="Vans x DC Custom Shoe" 
                    className={`max-h-[300px] object-contain transition-all duration-300 ${
                      isTransitioning ? 'opacity-0 scale-95' : 'opacity-100 scale-100'
                    }`} 
                    src={activeShoe.heroImg}
                  />
                  
                  <button onClick={() => setActiveHotspot(activeHotspot === 'sole' ? null : 'sole')} className="absolute bottom-20 right-1/3 w-4 h-4 bg-[#A80000] rounded-full border-2 border-white animate-pulse z-20"/>
                  <button onClick={() => setActiveHotspot(activeHotspot === 'canvas' ? null : 'canvas')} className="absolute top-1/3 left-1/3 w-4 h-4 bg-[#A80000] rounded-full border-2 border-white animate-pulse z-20"/>

                  {activeHotspot && (
                    <div className="absolute inset-x-4 bottom-4 bg-black border border-[#A80000] p-4 z-30 transition-all">
                      <div className="flex justify-between items-center mb-1">
                        <span className="font-mono-tech text-[11px] font-bold text-[#A80000]">
                          {activeHotspot === 'sole' ? '// CORE TECH: VULCANIZED LAYER' : '// BOX SHAPE: 450G CANVAS'}
                        </span>
                        <button onClick={() => setActiveHotspot(null)} className="text-xs text-white/40 font-mono-tech">✕</button>
                      </div>
                      <p className="text-[12px] text-white/60">
                        {activeHotspot === 'sole' ? 'Suela de goma vulcanizada con doble banda de foxing.' : 'Paneles laterales de lona pesada reforzada de 450g.'}
                      </p>
                    </div>
                  )}
                </div>

                <div className="reveal-up">
                  <span className="font-mono-tech text-[#A80000] tracking-[0.4em] text-[10px] mb-4 block font-bold">PORTFOLIO INTERACTIVE HOTSPOT</span>
                  <h3 className="font-display text-5xl md:text-6xl text-white font-bold mb-6 leading-none">{activeShoe.title}</h3>
                  <p className="text-white/50 mb-8">Silueta híbrida premium con bordes duros de 90 grados y cero curvas suavizadas. Configuración de color del sistema: {activeShoe.colorName}.</p>
                  <button 
                    onClick={() => addItemToCart({ id: activeShoe.id, title: activeShoe.title, desc: `${activeShoe.colorName} / MODEL-HI`, price: activeShoe.price, img: activeShoe.heroImg })}
                    className="w-full sm:w-auto bg-[#A80000] text-white font-mono-tech py-4 px-10 text-[11px] tracking-widest uppercase hover:bg-white hover:text-black transition-colors focus:outline-none"
                  >
                    ADD TO BAG — ${activeShoe.price}.00
                  </button>
                </div>

              </div>
            </div>
          </div>

        </div>
      </section>

      {/* SECCIÓN DE INGENIERÍA - ANIMADA */}
      <section className="py-32 bg-zinc-950 border-t border-b border-white/5" id="engineering">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="reveal-up">
              <span className="font-mono-tech text-[10px] text-[#A80000] tracking-[0.5em] block uppercase mb-4 font-bold">SYSTEM MODULE_02 // STRESS ANALYSIS</span>
              <h2 className="font-display text-5xl md:text-7xl text-white uppercase font-bold mb-8 leading-tight">LABORATORY<br/>SPECIFICATIONS</h2>
              <div className="flex flex-col border-l border-white/10 pl-6 gap-6">
                {TECH_SPECS.map((spec, index) => (
                  <div key={spec.label} onClick={() => setActiveSpecIndex(index)} className={`cursor-pointer group py-2 transition-all duration-300 ${activeSpecIndex === index ? 'translate-x-2' : ''}`}>
                    <h4 className={`font-mono-tech text-[11px] tracking-widest transition-colors ${activeSpecIndex === index ? 'text-[#A80000] font-bold' : 'text-white/40 group-hover:text-white'}`}>[{index + 1}] {spec.label}</h4>
                    <p className={`text-sm mt-1 transition-opacity ${activeSpecIndex === index ? 'text-white font-normal' : 'text-white/20'}`}>{spec.value}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Contenedor del render técnico animado */}
            <div className="relative border border-white/10 bg-black p-8 flex flex-col justify-between aspect-[4/3] reveal-up">
              <div className="flex justify-between font-mono-tech text-[9px] text-white/30 border-b border-white/5 pb-4"><span>SYS_RENDER: ACTIVE</span><span>GRID_VAL: 99.82%</span></div>
              <div className="my-auto flex flex-col items-center">
                <span className="font-display text-8xl md:text-9xl text-white/5 font-bold tracking-tighter absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none">VANS×DC</span>
                <div className="z-10 text-center">
                  <span className="font-mono-tech text-[10px] text-[#A80000] block uppercase tracking-[0.3em] mb-2 font-bold">// REAL-TIME TELEMETRY</span>
                  <p className="font-display text-4xl text-white font-bold tracking-tight max-w-sm mx-auto uppercase transition-all duration-500 transform">{TECH_SPECS[activeSpecIndex].value}</p>
                </div>
              </div>
              <div className="flex justify-between items-end font-mono-tech text-[9px] text-[#A80000] border-t border-white/5 pt-4 font-bold"><span>DIAGNOSTIC_LOG_OK</span><span>0x88CF2A</span></div>
            </div>
          </div>
        </div>
      </section>

      {/* CAROUSEL PRODUCTS - ANIMADO Y CORREGIDO */}
      <section className="py-32 bg-[#050505] overflow-hidden" id="shop">
        <div className="px-6 md:px-12 max-w-[1440px] mx-auto mb-16 flex justify-between items-end reveal-up">
          <div>
            <h2 className="font-display text-5xl md:text-7xl text-white font-bold">SHOP THE DROP</h2>
            <span className="font-mono-tech text-[10px] text-[#A80000] tracking-wider block mt-2 font-bold">ACTIVE DYNAMIC CAROUSEL</span>
          </div>
          <div className="flex gap-4">
            <button onClick={() => scrollCarousel('left')} className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-[#A80000] transition-all text-white focus:outline-none"><span className="material-symbols-outlined">chevron_left</span></button>
            <button onClick={() => scrollCarousel('right')} className="w-12 h-12 border border-white/10 flex items-center justify-center hover:border-[#A80000] transition-all text-white focus:outline-none"><span className="material-symbols-outlined">chevron_right</span></button>
          </div>
        </div>
        
        {/* Contenedor del Carrusel con transiciones robustas */}
        <div ref={scrollContainer} className="flex gap-8 px-6 md:px-12 overflow-x-auto hide-scrollbar snap-x scroll-smooth reveal-up">
          {CAROUSEL_PRODUCTS.map((prod) => (
            <div key={prod.id} className="min-w-[300px] md:min-w-[420px] snap-start group transition-all duration-300">
              <div className="img-reveal relative bg-zinc-900 aspect-[4/5] overflow-hidden mb-6 border border-white/5">
                <img alt={prod.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" src={prod.img}/>
                {prod.tag && <div className="absolute top-6 left-6 z-10 bg-[#A80000] text-white text-[9px] px-4 py-2 font-mono-tech tracking-widest uppercase">{prod.tag}</div>}
                
                {/* Capa Overlay interactiva con animaciones fluidas */}
                <div className="absolute inset-0 bg-black/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-8">
                  <span className="font-mono-tech text-[10px] text-white/40 mb-3 block">SELECT FIT CODE</span>
                  <div className="flex gap-2 mb-6">
                    {prod.sizes.map((size) => (
                      <button key={size} onClick={(e) => { e.stopPropagation(); alert(`Talla ${size} seleccionada.`); }} className="w-10 h-10 border border-white/20 text-white font-mono-tech text-[10px] hover:bg-white hover:text-black transition-colors focus:outline-none">{size}</button>
                    ))}
                  </div>
                  <button onClick={() => addItemToCart({ id: `carousel-${prod.id}`, title: prod.title, desc: prod.desc, price: prod.price, img: prod.img })} className="w-full py-4 bg-white text-black font-mono-tech text-[11px] tracking-widest uppercase hover:bg-[#A80000] hover:text-white transition-colors focus:outline-none">ADD TO BAG — ${prod.price}</button>
                </div>
              </div>
              <div className="flex justify-between items-start px-1 reveal-up">
                <div>
                  <h3 className="font-display text-2xl text-white uppercase font-bold">{prod.title}</h3>
                  <p className="font-mono-tech text-[10px] text-white/30 tracking-widest">{prod.desc}</p>
                </div>
                <span className="font-mono-tech text-[#A80000] text-[11px] font-bold">{prod.left ? prod.left : `$${prod.price}.00`}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ACCESS CONTROL - ANIMADO */}
      <section className="bg-[#050505] py-40 px-6 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center reveal-up">
          <span className="font-mono-tech text-[10px] tracking-[0.5em] text-[#A80000] mb-6 block font-bold">ACCESS CONTROL</span>
          <h2 className="font-display text-5xl md:text-8xl text-white mb-12 leading-tight tracking-tight uppercase font-bold">THE INNER<br/>CIRCLE</h2>
          <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-4 sm:gap-0 border-0 sm:border border-white/10 p-0 sm:p-1 bg-transparent sm:bg-black">
            <input className={`flex-grow bg-black sm:bg-transparent border border-white/10 sm:border-0 sm:border-b-2 ${emailError ? 'border-[#A80000] text-[#A80000]' : 'border-white/10 sm:border-transparent text-white'} font-mono-tech px-6 py-5 focus:outline-none placeholder:text-white/20 uppercase tracking-widest text-xs h-14`} placeholder="ENTER SYSTEM ACCESS EMAIL" type="text" value={email} onChange={(e) => { setEmail(e.target.value); if (emailError) setEmailError(false); }} />
            <button className="w-full sm:w-auto bg-white text-black font-mono-tech font-bold px-12 py-5 hover:bg-[#A80000] hover:text-white transition-all uppercase tracking-[0.2em] text-xs h-14 flex items-center justify-center shrink-0" type="submit">SECURE ACCESS</button>
          </form>
          <div className="mt-6 h-6 text-center sm:text-left font-mono-tech text-[11px]">
            {emailError && <p className="text-[#A80000]">⚠ ERROR_LOG: EMAIL INVÁLIDO.</p>}
            {emailSuccess && <p className="text-green-500">✓ ACCESS_GRANTED: ACCESO REGISTRADO.</p>}
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white/40 py-16 border-t border-white/5 text-center font-mono-tech text-[10px] tracking-widest reveal-up">
        <p>© 2026 VANS OFF THE WALL × DC SHOE CO. COMPONENT SYSTEM BY RECONSTRUCTED LAB.</p>
      </footer>

    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);