/* Scripts extraídos de casamentos.html */

window.__resources = {};

class Component extends DCLogic {
  state = { submitted: false };

  constructor(props){
    super(props);
    this.navRef = React.createRef();
    this.navLinksRef = React.createRef();
    this.burgerRef = React.createRef();
    this.mobileMenuRef = React.createRef();
    this.depTrackRef = React.createRef();
    this._menuOpen = false;
  }

  _navPad(){
    const n = this.navRef.current; if(!n) return;
    const narrow = window.innerWidth <= 768;
    const h = narrow ? 24 : 60;
    if(window.scrollY > 30){ n.style.padding = (narrow?12:15)+'px '+h+'px'; n.style.background='rgba(26,22,18,0.95)'; n.style.boxShadow='0 2px 20px rgba(0,0,0,0.18)'; }
    else { n.style.padding = (narrow?18:24)+'px '+h+'px'; n.style.background='rgba(36,31,27,0.78)'; n.style.boxShadow='none'; }
  }

  componentDidMount(){
    this._onScroll = () => this._navPad();
    window.addEventListener('scroll', this._onScroll, { passive:true });

    this._applyResponsive = () => {
      const narrow = window.innerWidth <= 880;
      if(this.navLinksRef.current) this.navLinksRef.current.style.display = narrow ? 'none' : 'flex';
      if(this.burgerRef.current) this.burgerRef.current.style.display = narrow ? 'flex' : 'none';
      this._navPad();
      if(!narrow) this.closeMenu();
    };
    this._applyResponsive();
    window.addEventListener('resize', this._applyResponsive);

    if('IntersectionObserver' in window){
      this._io = new IntersectionObserver((entries)=>{
        entries.forEach(e=>{ if(e.isIntersecting){ e.target.style.opacity='1'; e.target.style.transform='none'; this._io.unobserve(e.target); } });
      }, { threshold:0.12 });
      requestAnimationFrame(()=>{
        document.querySelectorAll('[data-reveal]').forEach(el=>{
          el.style.opacity='0'; el.style.transform='translateY(24px)'; el.style.transition='opacity .8s ease, transform .8s ease';
          this._io.observe(el);
        });
      });
    }
  }

  componentWillUnmount(){
    window.removeEventListener('scroll', this._onScroll);
    window.removeEventListener('resize', this._applyResponsive);
    if(this._io) this._io.disconnect();
  }

  toggleMenu = () => {
    this._menuOpen = !this._menuOpen;
    const m = this.mobileMenuRef.current; if(!m) return;
    m.style.display = this._menuOpen ? 'flex' : 'none';
    document.body.style.overflow = this._menuOpen ? 'hidden' : '';
  };
  closeMenu = () => {
    this._menuOpen = false;
    if(this.mobileMenuRef.current) this.mobileMenuRef.current.style.display = 'none';
    document.body.style.overflow = '';
  };

  depPrev = () => { const t = this.depTrackRef.current; if(t) t.scrollBy({ left: -(t.clientWidth*0.8), behavior:'smooth' }); };
  depNext = () => { const t = this.depTrackRef.current; if(t) t.scrollBy({ left: (t.clientWidth*0.8), behavior:'smooth' }); };

  onSubmit = (e) => { e.preventDefault(); this.setState({ submitted:true }); };

  renderVals(){
    const S = (children) => React.createElement('svg', { viewBox:'0 0 24 24', style:{width:'24px',height:'24px'}, fill:'none', stroke:'#b0876a', strokeWidth:1.5, strokeLinecap:'round', strokeLinejoin:'round' }, children);
    const P = (d, i) => React.createElement('path', { key:'p'+i, d });
    return {
      showStats: this.props.showStats ?? true,
      showWhatsapp: this.props.showWhatsapp ?? true,
      submitted: this.state.submitted,
      showForm: !this.state.submitted,
      navRef: this.navRef,
      navLinksRef: this.navLinksRef,
      burgerRef: this.burgerRef,
      mobileMenuRef: this.mobileMenuRef,
      depTrackRef: this.depTrackRef,
      toggleMenu: this.toggleMenu,
      closeMenu: this.closeMenu,
      depPrev: this.depPrev,
      depNext: this.depNext,
      onSubmit: this.onSubmit,
      estruturaItems: [
        { title:'Salão interno moderno e climatizado', icon: S([React.createElement('rect',{key:'r',x:3,y:4,width:18,height:14,rx:1}), P('M3 18h18M8 21h8',1)]) },
        { title:'Ambiente sofisticado e versátil', icon: S([P('M12 2l2.4 5.5L20 8l-4 4 1 6-5-3-5 3 1-6-4-4 5.6-.5z',0)]) },
        { title:'Capacidade para até 150 convidados', icon: S([P('M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2',0), React.createElement('circle',{key:'c',cx:9,cy:7,r:4}), P('M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75',2)]) },
        { title:'Espaço seguro e de fácil acesso', icon: S([P('M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',0)]) },
        { title:'Buffet próprio', icon: S([P('M3 11h18M5 11a7 7 0 0 1 14 0M12 3v2M4 21h16',0)]) },
        { title:'Equipe de cozinha especializada', icon: S([P('M6 13.87A4 4 0 0 1 7.41 6a5.11 5.11 0 0 1 1.05-1.54 5 5 0 0 1 7.08 0A5.11 5.11 0 0 1 16.59 6 4 4 0 0 1 18 13.87V21H6z',0), P('M6 17h12',1)]) },
        { title:'Garçons treinados', icon: S([P('M12 3v6M5 21h14M12 9a7 7 0 0 0-7 7h14a7 7 0 0 0-7-7z',0)]) },
        { title:'Estrutura completa para recepção', icon: S([React.createElement('rect',{key:'r',x:2,y:7,width:20,height:14,rx:2}), P('M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2',1)]) }
      ],
      depoimentos: [
        { text:'Casamento perfeito do início ao fim. A equipe cuidou de cada detalhe e pudemos aproveitar o nosso dia sem preocupação alguma.', author:'Ana & Lucas' },
        { text:'O espaço é lindo e a comida impecável. Nossos convidados não param de elogiar até hoje. Recomendamos de olhos fechados.', author:'Marina & Pedro' },
        { text:'Tudo em um só lugar fez toda a diferença. Atendimento próximo, organizado e muito acolhedor em cada etapa.', author:'Júlia & Rafael' },
        { text:'Realizamos o casamento dos sonhos dentro do orçamento. Sofisticação e custo-benefício que só o Krispy entrega.', author:'Camila & Bruno' }
      ]
    };
  }
}