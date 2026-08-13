"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";

type Product = {
  id: number;
  type: string;
  category: string;
  title: string;
  creator: string;
  credentials: string;
  rating: string;
  reviews: string;
  price: string;
  installments: string;
  lessons: string;
  tone: string;
  badge: string;
  icon: string;
  description: string;
  includes: string[];
};

type View = "home" | "library" | "producer" | "admin";
type Dialog = "signin" | "admin-login" | "apply" | "upload" | "checkout" | "success" | "draft" | null;

const products: Product[] = [
  {
    id: 1,
    type: "Curso em vídeo",
    category: "Gestão hospitalar",
    title: "Indicadores hospitalares na prática",
    creator: "Especialista em Indicadores",
    credentials: "Qualidade & Segurança",
    rating: "4,9",
    reviews: "128",
    price: "R$ 149,90",
    installments: "ou 12x de R$ 15,04",
    lessons: "18 aulas",
    tone: "teal",
    badge: "Mais vendido",
    icon: "chart",
    description: "Aprenda a escolher, calcular e apresentar indicadores que apoiam decisões reais em hospitais e clínicas.",
    includes: ["18 videoaulas", "6 planilhas editáveis", "Certificado de conclusão"],
  },
  {
    id: 2,
    type: "Kit de documentos",
    category: "Enfermagem",
    title: "Protocolos essenciais de enfermagem",
    creator: "Instituto Demo de Enfermagem",
    credentials: "Educação continuada",
    rating: "4,8",
    reviews: "94",
    price: "R$ 89,90",
    installments: "ou 8x de R$ 12,05",
    lessons: "32 arquivos",
    tone: "blue",
    badge: "Atualizado",
    icon: "files",
    description: "Protocolos, POPs e checklists editáveis para padronizar rotinas de enfermagem com mais segurança.",
    includes: ["20 protocolos em DOCX", "8 checklists em PDF", "4 fluxogramas editáveis"],
  },
  {
    id: 3,
    type: "Planilha profissional",
    category: "Clínicas",
    title: "Gestão financeira para clínicas",
    creator: "Gestão Clínica Demo",
    credentials: "Gestão em saúde",
    rating: "4,9",
    reviews: "76",
    price: "R$ 59,90",
    installments: "ou 5x de R$ 12,74",
    lessons: "12 planilhas",
    tone: "coral",
    badge: "Pronto para usar",
    icon: "grid",
    description: "Um painel simples e completo para organizar custos, receitas, repasses e metas da sua clínica.",
    includes: ["Dashboard automático", "Controle de fluxo de caixa", "Guia rápido de configuração"],
  },
  {
    id: 4,
    type: "Curso + materiais",
    category: "Segurança do paciente",
    title: "Núcleo de segurança do zero",
    creator: "Especialista em Segurança",
    credentials: "Especialista em NSP",
    rating: "5,0",
    reviews: "51",
    price: "R$ 219,90",
    installments: "ou 12x de R$ 22,06",
    lessons: "24 aulas + bônus",
    tone: "violet",
    badge: "Formação completa",
    icon: "shield",
    description: "Implemente e fortaleça o Núcleo de Segurança do Paciente com um roteiro claro, documentos e exemplos práticos.",
    includes: ["24 videoaulas", "Modelos de protocolos", "Plano de implantação em 30 dias"],
  },
  {
    id: 5,
    type: "E-book",
    category: "Nutrição",
    title: "Manual de terapia nutricional",
    creator: "Nutrição Profissional",
    credentials: "Nutrição clínica",
    rating: "4,7",
    reviews: "63",
    price: "R$ 39,90",
    installments: "pagamento único",
    lessons: "186 páginas",
    tone: "lime",
    badge: "Leitura essencial",
    icon: "book",
    description: "Referência prática para avaliação, conduta e acompanhamento nutricional no ambiente hospitalar.",
    includes: ["E-book em PDF", "Tabelas de referência", "Atualizações por 12 meses"],
  },
  {
    id: 6,
    type: "Modelos editáveis",
    category: "Fisioterapia",
    title: "Avaliações e evoluções funcionais",
    creator: "Fisio Modelo",
    credentials: "Fisioterapia hospitalar",
    rating: "4,8",
    reviews: "42",
    price: "R$ 74,90",
    installments: "ou 6x de R$ 13,31",
    lessons: "20 modelos",
    tone: "amber",
    badge: "Editável",
    icon: "pulse",
    description: "Modelos prontos para registrar avaliações e evoluções com objetividade, clareza e padronização.",
    includes: ["20 modelos em DOCX", "Escalas funcionais", "Guia de personalização"],
  },
];

const categoryOptions = ["Todas", "Enfermagem", "Gestão hospitalar", "Segurança do paciente", "Fisioterapia", "Nutrição", "Clínicas"];
const androidAppDownload = "https://github.com/EberChuarstman/EBER-CHUARTSMAN-APPS/releases/latest/download/SaudeHub-Android-v1.0.0.apk";

const adminTransactions = [
  { id: "SH-1084", date: "13/08/2026 · 09:42", buyer: "Comprador 01", product: "Núcleo de segurança do zero", producer: "Especialista em Segurança", method: "PIX", gross: "R$ 219,90", commission: "R$ 32,99", producerNet: "R$ 186,91", status: "Aprovada" },
  { id: "SH-1083", date: "13/08/2026 · 08:17", buyer: "Comprador 02", product: "Protocolos essenciais", producer: "Instituto Demo de Enfermagem", method: "Cartão · 3x", gross: "R$ 89,90", commission: "R$ 13,49", producerNet: "R$ 76,41", status: "Aprovada" },
  { id: "SH-1082", date: "12/08/2026 · 19:05", buyer: "Comprador 03", product: "Indicadores hospitalares", producer: "Especialista em Indicadores", method: "Cartão · 12x", gross: "R$ 149,90", commission: "R$ 22,49", producerNet: "R$ 127,41", status: "Aprovada" },
  { id: "SH-1081", date: "12/08/2026 · 16:33", buyer: "Comprador 04", product: "Manual de terapia nutricional", producer: "Nutrição Profissional", method: "PIX", gross: "R$ 39,90", commission: "R$ 5,99", producerNet: "R$ 33,91", status: "Aprovada" },
  { id: "SH-1080", date: "12/08/2026 · 14:21", buyer: "Comprador 05", product: "Gestão financeira para clínicas", producer: "Gestão Clínica Demo", method: "Cartão · 5x", gross: "R$ 59,90", commission: "R$ 0,00", producerNet: "R$ 0,00", status: "Reembolsada" },
  { id: "SH-1079", date: "12/08/2026 · 11:08", buyer: "Comprador 06", product: "Avaliações funcionais", producer: "Fisio Modelo", method: "Boleto", gross: "R$ 74,90", commission: "R$ 11,24", producerNet: "R$ 63,66", status: "Pendente" },
];

const reviewQueue = [
  { id: "creator-demo", kind: "Novo criador", title: "Profissional demonstrativo", subtitle: "Medicina intensiva · registro verificado", meta: "Documentos e currículo enviados" },
  { id: "content-checklist", kind: "Novo conteúdo", title: "Checklist de segurança cirúrgica", subtitle: "Instituto Demonstrativo · Enfermagem", meta: "12 arquivos · R$ 69,90" },
  { id: "content-lgpd", kind: "Atualização de curso", title: "LGPD aplicada à saúde", subtitle: "Gestão Clínica Demo · Gestão hospitalar", meta: "9 aulas novas · 2 PDFs" },
];

function ArrowIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>;
}

function SearchIcon() {
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="6.5" /><path d="m16 16 4 4" /></svg>;
}

function StarIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m10 2.8 2.1 4.3 4.8.7-3.5 3.4.8 4.8-4.2-2.3L5.8 16l.8-4.8-3.5-3.4 4.8-.7L10 2.8Z" /></svg>;
}

function CloseIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg>;
}

function DownloadIcon() {
  return <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M10 3v9m-4-4 4 4 4-4M4 16h12" /></svg>;
}

function Brand({ onClick }: { onClick: () => void }) {
  return (
    <button className="brand brand-button" type="button" onClick={onClick} aria-label="SaúdeHub — início">
      <span className="brand-mark" aria-hidden="true"><span /><span /></span>
      <span>Saúde<span>Hub</span></span>
    </button>
  );
}

function ProductCover({ product, compact = false }: { product: Product; compact?: boolean }) {
  return (
    <div className={`product-cover cover-${product.tone} ${compact ? "product-cover-compact" : ""}`}>
      <span className="product-badge">{product.badge}</span>
      <div className={`cover-symbol symbol-${product.icon}`} aria-hidden="true"><span /><span /><span /></div>
      <span className="product-type">{product.type}</span>
      <b>{product.lessons}</b>
    </div>
  );
}

function Header({ view, navigate, openDialog, logoutAdmin }: { view: View; navigate: (next: View, anchor?: string) => void; openDialog: (dialog: Dialog) => void; logoutAdmin: () => void }) {
  return (
    <header className="site-header">
      <Brand onClick={() => navigate("home", "#top")} />
      <nav className="desktop-nav" aria-label="Navegação principal">
        <button className={view === "home" ? "nav-active" : ""} type="button" onClick={() => navigate("home", "#marketplace")}>Explorar</button>
        <button className={view === "library" ? "nav-active" : ""} type="button" onClick={() => navigate("library")}>Minha biblioteca</button>
        <button className={view === "producer" ? "nav-active" : ""} type="button" onClick={() => navigate("producer")}>Área do produtor</button>
        <button type="button" onClick={() => navigate("home", "#android-app")}>App Android</button>
        {view === "admin" && <button className="nav-active" type="button" onClick={() => navigate("admin")}>Administração</button>}
      </nav>
      {view === "admin" ? (
        <div className="header-actions admin-session"><span><i>◆</i> Administrador</span><button className="text-button" type="button" onClick={logoutAdmin}>Sair</button></div>
      ) : (
        <div className="header-actions">
          <button className="text-button" type="button" onClick={() => openDialog("signin")}>Entrar</button>
          <button className="button button-small button-dark" type="button" onClick={() => openDialog("apply")}>Quero vender</button>
        </div>
      )}
    </header>
  );
}

function HomeView({ query, setQuery, category, setCategory, visibleProducts, openProduct, openDialog }: {
  query: string;
  setQuery: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  visibleProducts: Product[];
  openProduct: (product: Product) => void;
  openDialog: (dialog: Dialog) => void;
}) {
  const submitSearch = (event: FormEvent) => {
    event.preventDefault();
    document.querySelector("#marketplace")?.scrollIntoView({ behavior: "smooth" });
  };

  const selectCategory = (value: string) => {
    setCategory(value);
    document.querySelector("#marketplace")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <>
      <section className="hero" id="top">
        <div className="hero-orb hero-orb-one" /><div className="hero-orb hero-orb-two" />
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" />Conteúdo criado por quem vive a saúde</div>
          <h1>Conhecimento em saúde que <em>vira prática.</em></h1>
          <p>Cursos, protocolos, planilhas e materiais profissionais feitos por especialistas verificados para transformar sua rotina.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#marketplace">Explorar conteúdos <ArrowIcon /></a>
            <button className="button button-ghost" type="button" onClick={() => openDialog("apply")}>Publique na SaúdeHub</button>
          </div>
          <div className="trust-row" aria-label="Diferenciais da SaúdeHub">
            <span><b>✓</b> Compra segura</span><span><b>✓</b> Acesso imediato</span><span><b>✓</b> Criadores verificados</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Prévia de um curso da plataforma">
          <div className="visual-grid" />
          <div className="course-window">
            <div className="course-window-top"><span className="window-dot" /><span>SaúdeHub Player</span><span className="window-live">AULA 04</span></div>
            <div className="course-screen"><div className="screen-kicker">FORMAÇÃO PROFISSIONAL</div><h2>Segurança do paciente</h2><p>Do protocolo à prática assistencial</p><button type="button" aria-label="Assistir à prévia" onClick={() => openProduct(products[3])}><span>▶</span></button></div>
            <div className="course-progress"><div><span>Seu progresso</span><b>68%</b></div><div className="progress-track"><span /></div><small>12 de 18 aulas concluídas</small></div>
          </div>
          <div className="floating-card floating-card-files"><span className="floating-icon">PDF</span><div><b>Material da aula</b><small>Protocolos.pdf</small></div><span className="download-mark">↓</span></div>
          <div className="floating-card floating-card-rating"><span className="rating-avatar">HM</span><div><span><StarIcon /> 4,9</span><small>Conteúdo verificado</small></div></div>
        </div>
      </section>

      <form className="search-panel" aria-label="Busca de conteúdos" onSubmit={submitSearch}>
        <div className="search-field"><SearchIcon /><input aria-label="Buscar conteúdo" placeholder="O que você quer aprender hoje?" value={query} onChange={(event) => setQuery(event.target.value)} /></div>
        <div className="search-divider" />
        <label className="search-select"><span>Categoria</span><select aria-label="Selecionar categoria" value={category} onChange={(event) => setCategory(event.target.value)}>{categoryOptions.map((option) => <option key={option}>{option}</option>)}</select></label>
        <button className="button button-primary search-button" type="submit">Buscar</button>
      </form>

      <section className="category-strip" id="categories" aria-label="Categorias em destaque">
        <span>Explore por área</span>
        {[["✚", "Enfermagem"], ["▥", "Gestão hospitalar"], ["◉", "Segurança do paciente"], ["⌁", "Fisioterapia"], ["♧", "Nutrição"], ["＋", "Todas"]].map(([icon, label]) => (
          <button className={category === label ? "category-active" : ""} type="button" onClick={() => selectCategory(label)} key={label}><b>{icon}</b>{label === "Gestão hospitalar" ? "Gestão" : label === "Segurança do paciente" ? "Segurança" : label === "Todas" ? "Ver todas" : label}</button>
        ))}
      </section>

      <section className="marketplace section-shell" id="marketplace">
        <div className="section-heading">
          <div><span className="section-kicker">ESCOLHAS DA COMUNIDADE</span><h2>{query || category !== "Todas" ? `${visibleProducts.length} conteúdos encontrados` : "Conteúdos para avançar na sua carreira"}</h2></div>
          {(query || category !== "Todas") && <button className="clear-filter" type="button" onClick={() => { setQuery(""); setCategory("Todas"); }}>Limpar filtros</button>}
        </div>
        {visibleProducts.length > 0 ? (
          <div className="product-grid">
            {visibleProducts.map((product) => (
              <article className="product-card" key={product.id}>
                <ProductCover product={product} />
                <div className="product-body">
                  <span className="product-category">{product.category}</span><h3>{product.title}</h3>
                  <div className="creator-row"><span className="creator-avatar">{product.creator.slice(0, 2).toUpperCase()}</span><div><b>{product.creator}</b><small>{product.credentials}</small></div><span className="verified" title="Criador verificado">✓</span></div>
                  <div className="product-meta"><span className="rating"><StarIcon /> {product.rating} <small>({product.reviews})</small></span><span className="price"><small>a partir de</small><b>{product.price}</b></span></div>
                  <button className="product-action" type="button" onClick={() => openProduct(product)}>Ver conteúdo <ArrowIcon /></button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="empty-state"><span>⌕</span><h3>Nenhum conteúdo encontrado</h3><p>Tente outro termo ou escolha uma área diferente.</p><button className="button button-dark" type="button" onClick={() => { setQuery(""); setCategory("Todas"); }}>Ver todos os conteúdos</button></div>
        )}
      </section>

      <section className="creator-call section-shell" id="creator-call">
        <div className="creator-call-copy"><span className="section-kicker light">PARA QUEM ENSINA</span><h2>Seu conhecimento pode melhorar a saúde de muita gente.</h2><p>Transforme sua experiência em cursos e materiais digitais. A SaúdeHub cuida da vitrine, do acesso e da experiência dos seus alunos.</p><button className="button button-light" type="button" onClick={() => openDialog("apply")}>Quero ser produtor <ArrowIcon /></button></div>
        <div className="creator-steps"><div><b>01</b><span><strong>Envie sua proposta</strong><small>Conte sobre você e seu conteúdo.</small></span></div><div><b>02</b><span><strong>Passe pela curadoria</strong><small>Validamos qualidade e experiência.</small></span></div><div><b>03</b><span><strong>Publique e venda</strong><small>Acompanhe tudo em um só lugar.</small></span></div></div>
      </section>

      <section className="android-app section-shell" id="android-app">
        <div className="android-app-copy">
          <span className="section-kicker light">SAÚDEHUB NO CELULAR</span>
          <h2>Seu conteúdo de saúde sempre por perto.</h2>
          <p>Instale o aplicativo Android para acessar o marketplace, sua biblioteca, o painel do produtor e a administração em uma experiência otimizada para o celular.</p>
          <div className="android-features" aria-label="Recursos do aplicativo">
            <span><b>✓</b> Acesso à mesma conta e aos mesmos conteúdos</span>
            <span><b>✓</b> Atualizações do site aparecem automaticamente</span>
            <span><b>✓</b> APK assinado e pronto para instalação direta</span>
          </div>
          <div className="android-actions">
            <a className="button button-primary" href={androidAppDownload} download><DownloadIcon /> Baixar aplicativo Android</a>
            <small>Versão 1.0.0 · Android 8 ou superior</small>
          </div>
        </div>
        <div className="android-phone" aria-label="Prévia do SaúdeHub para Android">
          <div className="android-phone-frame">
            <div className="android-phone-speaker" />
            <div className="android-phone-screen">
              <div className="android-phone-brand"><span className="brand-mark" aria-hidden="true"><span /><span /></span><b>Saúde<span>Hub</span></b></div>
              <div className="android-phone-hero"><small>CONHECIMENTO EM SAÚDE</small><strong>Aprenda.<br />Aplique.<br /><em>Evolua.</em></strong></div>
              <div className="android-phone-card"><span>▶</span><div><b>Continuar aprendendo</b><small>Segurança do paciente · 68%</small><i><span /></i></div></div>
              <div className="android-phone-nav"><span>⌂<small>Início</small></span><span>▦<small>Biblioteca</small></span><span>●<small>Perfil</small></span></div>
            </div>
          </div>
          <span className="android-badge"><b>APK</b><small>Instalação direta</small></span>
        </div>
      </section>
    </>
  );
}

function LibraryView({ purchased, openProduct }: { purchased: number[]; openProduct: (product: Product) => void }) {
  const libraryItems = [products[3], products[1], products[4], ...products.filter((item) => purchased.includes(item.id) && ![2, 4, 5].includes(item.id))];
  const progress = [68, 100, 22, 0, 0, 0];
  return (
    <section className="workspace-view">
      <div className="workspace-top section-shell"><div><span className="section-kicker">MINHA BIBLIOTECA</span><h1>Olá! Vamos continuar?</h1><p>Seus cursos e materiais ficam organizados aqui.</p></div><div className="workspace-avatar">SH</div></div>
      <div className="library-summary section-shell"><div><span>Conteúdos adquiridos</span><b>{libraryItems.length}</b></div><div><span>Em andamento</span><b>{libraryItems.filter((_, index) => progress[index] > 0 && progress[index] < 100).length}</b></div><div><span>Concluídos</span><b>1</b></div><div><span>Certificados</span><b>1</b></div></div>
      <div className="library-layout section-shell">
        <div className="continue-panel"><span className="section-kicker light">CONTINUE DE ONDE PAROU</span><h2>Núcleo de segurança do zero</h2><p>Módulo 3 · Gestão de riscos assistenciais</p><div className="continue-progress"><span><i style={{ width: "68%" }} /></span><b>68%</b></div><button className="button button-primary" type="button" onClick={() => openProduct(products[3])}>Continuar curso <ArrowIcon /></button></div>
        <aside className="next-lessons"><h3>Próximas aulas</h3><button type="button" onClick={() => openProduct(products[3])}><span>05</span><div><b>Matriz de riscos</b><small>12 min · Vídeo</small></div><i>▶</i></button><button type="button" onClick={() => openProduct(products[3])}><span>06</span><div><b>Plano de segurança</b><small>18 min · Vídeo</small></div><i>▶</i></button><button type="button" onClick={() => openProduct(products[3])}><span>07</span><div><b>Kit de documentos</b><small>8 arquivos · Download</small></div><i>↓</i></button></aside>
      </div>
      <div className="library-collection section-shell"><div className="workspace-section-heading"><div><span className="section-kicker">TODOS OS CONTEÚDOS</span><h2>Sua coleção</h2></div><label><SearchIcon /><input placeholder="Buscar na biblioteca" aria-label="Buscar na biblioteca" /></label></div><div className="library-grid">{libraryItems.map((product, index) => <article className="library-card" key={`${product.id}-${index}`}><ProductCover product={product} compact /><div><span className="product-category">{product.type}</span><h3>{product.title}</h3><div className="library-progress"><span><i style={{ width: `${progress[index] ?? 0}%` }} /></span><small>{progress[index] === 100 ? "Concluído" : `${progress[index] ?? 0}% concluído`}</small></div><button type="button" onClick={() => openProduct(product)}>{progress[index] === 100 ? "Rever conteúdo" : progress[index] ? "Continuar" : "Começar"}<ArrowIcon /></button></div></article>)}</div></div>
    </section>
  );
}

function ProducerView({ openDialog }: { openDialog: (dialog: Dialog) => void }) {
  return (
    <section className="workspace-view producer-view">
      <div className="workspace-top section-shell"><div><div className="producer-status"><span /> Perfil aprovado</div><h1>Painel do produtor</h1><p>Acompanhe seus produtos, alunos e resultados.</p></div><button className="button button-primary" type="button" onClick={() => openDialog("upload")}>＋ Novo conteúdo</button></div>
      <div className="metrics-grid section-shell"><article><span>Vendas no mês</span><b>R$ 8.420,60</b><small className="positive">↑ 18,4% no período</small></article><article><span>Novos alunos</span><b>84</b><small className="positive">↑ 12 esta semana</small></article><article><span>Produtos ativos</span><b>4</b><small>1 em análise</small></article><article><span>Avaliação média</span><b>4,9 <StarIcon /></b><small>236 avaliações</small></article></div>
      <div className="producer-grid section-shell">
        <article className="revenue-card"><div className="panel-heading"><div><span className="section-kicker">DESEMPENHO</span><h2>Receita nos últimos 7 meses</h2></div><select aria-label="Período do gráfico"><option>7 meses</option><option>30 dias</option></select></div><div className="bar-chart" aria-label="Gráfico de receita mensal"><div><i style={{ height: "34%" }} /><span>Fev</span></div><div><i style={{ height: "47%" }} /><span>Mar</span></div><div><i style={{ height: "41%" }} /><span>Abr</span></div><div><i style={{ height: "63%" }} /><span>Mai</span></div><div><i style={{ height: "55%" }} /><span>Jun</span></div><div><i style={{ height: "78%" }} /><span>Jul</span></div><div className="bar-current"><b>R$ 8,4 mil</b><i style={{ height: "92%" }} /><span>Ago</span></div></div></article>
        <article className="sales-card"><div className="panel-heading"><div><span className="section-kicker">ATIVIDADE</span><h2>Vendas recentes</h2></div></div>{[["01", "Comprador 01", "Núcleo de segurança", "R$ 219,90"], ["02", "Comprador 02", "Protocolos essenciais", "R$ 89,90"], ["03", "Comprador 03", "Indicadores hospitalares", "R$ 149,90"], ["04", "Comprador 04", "Terapia nutricional", "R$ 39,90"]].map(([initials, name, item, value]) => <div className="sale-row" key={name}><span>{initials}</span><div><b>{name}</b><small>{item}</small></div><strong>{value}</strong></div>)}</article>
      </div>
      <div className="product-management section-shell"><div className="workspace-section-heading"><div><span className="section-kicker">CATÁLOGO</span><h2>Seus conteúdos</h2></div><button className="outline-button" type="button" onClick={() => openDialog("upload")}>Adicionar produto</button></div><div className="management-table"><div className="table-head"><span>Produto</span><span>Status</span><span>Vendas</span><span>Receita</span><span /></div>{products.slice(0, 4).map((product, index) => <div className="table-row" key={product.id}><div><span className={`mini-cover cover-${product.tone}`}>{product.type.slice(0, 1)}</span><span><b>{product.title}</b><small>{product.type}</small></span></div><span><i className={index === 3 ? "status-review" : "status-live"}>{index === 3 ? "Em análise" : "Publicado"}</i></span><span>{[128, 94, 76, 0][index]}</span><span>{["R$ 19.187,20", "R$ 8.450,60", "R$ 4.552,40", "—"][index]}</span><button type="button" aria-label={`Mais opções para ${product.title}`}>•••</button></div>)}</div></div>
    </section>
  );
}

function AdminView() {
  const [period, setPeriod] = useState("Agosto de 2026");
  const [transactionQuery, setTransactionQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Todos");
  const [reviewStatus, setReviewStatus] = useState<Record<string, "pending" | "approved" | "rejected">>(() => Object.fromEntries(reviewQueue.map((item) => [item.id, "pending"])));

  const visibleTransactions = useMemo(() => {
    const term = transactionQuery.trim().toLocaleLowerCase("pt-BR");
    return adminTransactions.filter((transaction) => {
      const matchesTerm = !term || [transaction.id, transaction.buyer, transaction.product, transaction.producer].some((value) => value.toLocaleLowerCase("pt-BR").includes(term));
      const matchesStatus = statusFilter === "Todos" || transaction.status === statusFilter;
      return matchesTerm && matchesStatus;
    });
  }, [statusFilter, transactionQuery]);

  const exportTransactions = () => {
    const header = ["ID", "Data", "Comprador", "Produto", "Produtor", "Pagamento", "Valor bruto", "Comissão SaúdeHub", "Repasse", "Status"];
    const rows = adminTransactions.map((transaction) => [transaction.id, transaction.date, transaction.buyer, transaction.product, transaction.producer, transaction.method, transaction.gross, transaction.commission, transaction.producerNet, transaction.status]);
    const csv = [header, ...rows].map((row) => row.map((cell) => `"${cell.replaceAll('"', '""')}"`).join(";")).join("\n");
    const url = URL.createObjectURL(new Blob(["\ufeff", csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "saudehub-transacoes-agosto-2026.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const pendingReviews = reviewQueue.filter((item) => reviewStatus[item.id] === "pending").length;

  return (
    <section className="workspace-view admin-view" id="admin">
      <div className="workspace-top admin-top section-shell">
        <div>
          <div className="admin-role"><span>◆</span> Acesso administrativo</div>
          <h1>Visão geral da SaúdeHub</h1>
          <p>Controle financeiro, repasses e curadoria da plataforma.</p>
        </div>
        <div className="admin-top-actions">
          <label><span>Período</span><select aria-label="Selecionar período" value={period} onChange={(event) => setPeriod(event.target.value)}><option>Agosto de 2026</option><option>Julho de 2026</option><option>Últimos 90 dias</option><option>Todo o período</option></select></label>
          <button className="outline-button" type="button" onClick={exportTransactions}>↓ Exportar relatório</button>
        </div>
      </div>

      <div className="admin-demo-notice section-shell"><span>i</span><p><b>Painel demonstrativo.</b> Os valores abaixo simulam a operação da plataforma. Quando o pagamento for integrado, eles serão atualizados automaticamente.</p></div>

      <div className="metrics-grid admin-metrics section-shell">
        <article><div className="metric-title"><span>Vendas aprovadas</span><i>↗</i></div><b>R$ 47.982,60</b><small className="positive">↑ 16,8% em relação a julho</small><em>246 compras confirmadas</em></article>
        <article><div className="metric-title"><span>Comissão SaúdeHub</span><i>%</i></div><b>R$ 7.197,39</b><small>15% sobre vendas aprovadas</small><em>Receita bruta da plataforma</em></article>
        <article className="metric-highlight"><div className="metric-title"><span>Saldo líquido SaúdeHub</span><i>R$</i></div><b>R$ 5.042,22</b><small>Após taxas de pagamento</small><em>Disponível para transferência</em></article>
        <article><div className="metric-title"><span>Repasse aos produtores</span><i>⇄</i></div><b>R$ 40.785,21</b><small>85% das vendas aprovadas</small><em>R$ 12.480,30 agendados</em></article>
      </div>

      <div className="admin-financial-grid section-shell">
        <article className="finance-breakdown-card">
          <div className="panel-heading"><div><span className="section-kicker">CONCILIAÇÃO FINANCEIRA</span><h2>De onde vem o saldo recebido</h2></div><span className="reconciled-badge">✓ Conciliado</span></div>
          <div className="money-flow" aria-label="Distribuição das vendas aprovadas"><span className="flow-producers" style={{ width: "85%" }} title="Produtores: 85%" /><span className="flow-platform" style={{ width: "10.51%" }} title="SaúdeHub líquida: 10,51%" /><span className="flow-fees" style={{ width: "4.49%" }} title="Taxas: 4,49%" /></div>
          <div className="flow-legend"><span><i className="legend-producers" />Produtores <b>85%</b></span><span><i className="legend-platform" />SaúdeHub líquida <b>10,51%</b></span><span><i className="legend-fees" />Taxas <b>4,49%</b></span></div>
          <div className="finance-lines">
            <div><span>Faturamento bruto</span><b>R$ 48.760,40</b></div>
            <div className="negative-line"><span>(−) Reembolsos e chargebacks</span><b>R$ 777,80</b></div>
            <div className="subtotal-line"><span>Vendas aprovadas</span><b>R$ 47.982,60</b></div>
            <div className="negative-line"><span>(−) Repasse aos produtores</span><b>R$ 40.785,21</b></div>
            <div className="negative-line"><span>(−) Taxas de processamento</span><b>R$ 2.155,17</b></div>
            <div className="total-line"><span>Saldo líquido da SaúdeHub</span><b>R$ 5.042,22</b></div>
          </div>
        </article>

        <aside className="admin-side-stack">
          <article className="available-balance-card"><span className="section-kicker light">CONTA DA PLATAFORMA</span><small>Saldo demonstrativo</small><b>R$ 5.042,22</b><p>Valores fictícios já compensados e disponíveis para transferência.</p><div><span>Próximo repasse</span><strong>17/08/2026</strong></div><div><span>Conta cadastrada</span><strong>Banco demonstrativo · final 0000</strong></div><button type="button" onClick={() => document.querySelector("#transactions")?.scrollIntoView({ behavior: "smooth" })}>Ver movimentações <ArrowIcon /></button></article>
          <article className="operation-card"><div><span>Produtores ativos</span><b>38</b></div><div><span>Alunos ativos</span><b>1.284</b></div><div><span>Pendências na curadoria</span><b>{pendingReviews}</b></div><div><span>Reembolsos no mês</span><b>4</b></div></article>
        </aside>
      </div>

      <div className="admin-transactions section-shell" id="transactions">
        <div className="workspace-section-heading admin-table-heading">
          <div><span className="section-kicker">FINANCEIRO</span><h2>Transações recentes</h2><p>Confira quanto entrou, a comissão da plataforma e o valor de cada produtor.</p></div>
          <div className="transaction-filters"><label><SearchIcon /><input aria-label="Buscar transação" placeholder="Buscar venda ou comprador" value={transactionQuery} onChange={(event) => setTransactionQuery(event.target.value)} /></label><select aria-label="Filtrar status" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option>Todos</option><option>Aprovada</option><option>Pendente</option><option>Reembolsada</option></select></div>
        </div>
        <div className="admin-table-scroll">
          <div className="admin-transaction-table">
            <div className="admin-transaction-head"><span>Venda</span><span>Produto / produtor</span><span>Pagamento</span><span>Valor bruto</span><span>Comissão</span><span>Repasse</span><span>Status</span></div>
            {visibleTransactions.map((transaction) => <div className="admin-transaction-row" key={transaction.id}><div><b>{transaction.id}</b><small>{transaction.date}</small><em>{transaction.buyer}</em></div><div><b>{transaction.product}</b><small>{transaction.producer}</small></div><span>{transaction.method}</span><strong>{transaction.gross}</strong><strong className="commission-value">{transaction.commission}</strong><strong>{transaction.producerNet}</strong><i className={`payment-${transaction.status.toLocaleLowerCase("pt-BR").normalize("NFD").replace(/[\u0300-\u036f]/g, "")}`}>{transaction.status}</i></div>)}
            {visibleTransactions.length === 0 && <div className="admin-table-empty">Nenhuma transação encontrada com esses filtros.</div>}
          </div>
        </div>
        <div className="admin-table-footer"><span>Mostrando {visibleTransactions.length} de {adminTransactions.length} transações</span><button type="button" onClick={exportTransactions}>Baixar CSV completo</button></div>
      </div>

      <div className="admin-curation section-shell">
        <div className="workspace-section-heading"><div><span className="section-kicker">CURADORIA</span><h2>Aprovações pendentes</h2><p>Revise criadores e conteúdos antes de liberar a publicação.</p></div><span className="pending-count">{pendingReviews} pendentes</span></div>
        <div className="review-grid">{reviewQueue.map((item) => {
          const status = reviewStatus[item.id];
          return <article className={`review-card review-${status}`} key={item.id}><div className="review-card-top"><span>{item.kind === "Novo criador" ? "PF" : "DOC"}</span><i>{item.kind}</i></div><h3>{item.title}</h3><p>{item.subtitle}</p><small>{item.meta}</small>{status === "pending" ? <div className="review-actions"><button type="button" onClick={() => setReviewStatus((current) => ({ ...current, [item.id]: "rejected" }))}>Recusar</button><button type="button" onClick={() => setReviewStatus((current) => ({ ...current, [item.id]: "approved" }))}>Aprovar</button></div> : <div className={`review-result result-${status}`}>{status === "approved" ? "✓ Aprovado" : "× Recusado"}<button type="button" onClick={() => setReviewStatus((current) => ({ ...current, [item.id]: "pending" }))}>Desfazer</button></div>}</article>;
        })}</div>
      </div>
    </section>
  );
}

function ModalShell({ children, close, label, size = "medium" }: { children: React.ReactNode; close: () => void; label: string; size?: "small" | "medium" | "large" }) {
  return <div className="modal-backdrop" onMouseDown={(event) => { if (event.currentTarget === event.target) close(); }}><section className={`modal-card modal-${size}`} role="dialog" aria-modal="true" aria-label={label}><button className="modal-close" type="button" onClick={close} aria-label="Fechar"><CloseIcon /></button>{children}</section></div>;
}

function ProductDialog({ product, close, checkout }: { product: Product; close: () => void; checkout: () => void }) {
  return (
    <ModalShell close={close} label={`Detalhes de ${product.title}`} size="large">
      <div className="product-dialog-grid"><div className="dialog-cover-wrap"><ProductCover product={product} /><div className="preview-box"><span>▶</span><div><b>Prévia gratuita</b><small>Conheça o conteúdo antes de comprar</small></div></div></div><div className="dialog-product-copy"><span className="product-category">{product.category}</span><h2>{product.title}</h2><div className="dialog-rating"><span><StarIcon /> {product.rating}</span><small>{product.reviews} avaliações</small><i>•</i><small>{product.lessons}</small></div><p>{product.description}</p><div className="dialog-creator"><span className="creator-avatar">{product.creator.slice(0, 2).toUpperCase()}</span><div><small>Criado por</small><b>{product.creator} <i>✓</i></b></div></div><div className="included-list"><h3>O que você recebe</h3>{product.includes.map((item) => <span key={item}><b>✓</b>{item}</span>)}</div><div className="purchase-box"><div><small>Compra individual</small><b>{product.price}</b><span>{product.installments}</span></div><button className="button button-primary" type="button" onClick={checkout}>Comprar agora <ArrowIcon /></button></div><small className="secure-note">🔒 Acesso liberado após a confirmação do pagamento</small></div></div>
    </ModalShell>
  );
}

function SigninDialog({ close, navigate, openAdminLogin }: { close: () => void; navigate: (view: "library" | "producer") => void; openAdminLogin: () => void }) {
  return <ModalShell close={close} label="Entrar na SaúdeHub" size="small"><div className="simple-dialog"><span className="dialog-mark">SH</span><span className="demo-pill">DEMONSTRAÇÃO</span><h2>Bem-vindo à SaúdeHub</h2><p>Escolha uma área para conhecer a experiência da plataforma.</p><button className="role-option" type="button" onClick={() => navigate("library")}><span>▶</span><div><b>Entrar como aluno</b><small>Acesse cursos e materiais adquiridos</small></div><ArrowIcon /></button><button className="role-option" type="button" onClick={() => navigate("producer")}><span>▥</span><div><b>Entrar como produtor</b><small>Gerencie conteúdos e acompanhe vendas</small></div><ArrowIcon /></button><button className="role-option role-option-admin" type="button" onClick={openAdminLogin}><span>◆</span><div><b>Entrar como administrador</b><small>Acesso protegido por usuário e senha</small></div><ArrowIcon /></button><small className="dialog-disclaimer">O painel administrativo possui autenticação própria e sessão segura.</small></div></ModalShell>;
}

function AdminLoginDialog({ close, authenticated }: { close: () => void; authenticated: () => void }) {
  const [username, setUsername] = useState("admin");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState("");

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPending(true);
    setError("");

    try {
      const response = await fetch("/api/admin/login", {
        method: "POST",
        credentials: "same-origin",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const result = await response.json() as { authenticated?: boolean; error?: string };
      if (!response.ok || !result.authenticated) {
        setError(result.error ?? "Não foi possível validar o acesso.");
        return;
      }
      authenticated();
    } catch {
      setError("Não foi possível conectar ao servidor. Tente novamente.");
    } finally {
      setPending(false);
    }
  };

  return (
    <ModalShell close={close} label="Login administrativo" size="small">
      <form className="form-dialog admin-login-dialog" onSubmit={submit}>
        <span className="admin-login-mark" aria-hidden="true">◆</span>
        <span className="section-kicker">ÁREA RESTRITA</span>
        <h2>Login do administrador</h2>
        <p>Informe as credenciais administrativas para visualizar valores, repasses e aprovações.</p>
        <div className="form-grid admin-login-fields">
          <label className="full-field"><span>Usuário</span><input autoFocus required autoComplete="username" value={username} onChange={(event) => setUsername(event.target.value)} disabled={pending} /></label>
          <label className="full-field"><span>Senha</span><span className="password-field"><input required autoComplete="current-password" type={showPassword ? "text" : "password"} value={password} onChange={(event) => setPassword(event.target.value)} disabled={pending} /><button type="button" onClick={() => setShowPassword((current) => !current)} aria-label={showPassword ? "Ocultar senha" : "Mostrar senha"}>{showPassword ? "Ocultar" : "Mostrar"}</button></span></label>
        </div>
        {error && <div className="admin-login-error" role="alert" aria-live="polite"><span>!</span>{error}</div>}
        <button className="button button-primary form-submit" type="submit" disabled={pending}>{pending ? "Validando…" : <>Entrar no painel <ArrowIcon /></>}</button>
        <small className="admin-security-note">🔒 Sessão protegida por cookie seguro e encerrada após 8 horas.</small>
      </form>
    </ModalShell>
  );
}

function ApplicationDialog({ close, done }: { close: () => void; done: () => void }) {
  return <ModalShell close={close} label="Candidatura de produtor"><form className="form-dialog" onSubmit={(event) => { event.preventDefault(); done(); }}><span className="section-kicker">CURADORIA SAÚDEHUB</span><h2>Quero ser produtor</h2><p>Conte um pouco sobre sua experiência. Todo criador passa por uma análise antes de publicar.</p><div className="form-grid"><label><span>Nome completo</span><input required placeholder="Seu nome" /></label><label><span>E-mail profissional</span><input required type="email" placeholder="voce@exemplo.com" /></label><label><span>Área de atuação</span><select required defaultValue=""><option value="" disabled>Selecione</option><option>Enfermagem</option><option>Medicina</option><option>Gestão em saúde</option><option>Fisioterapia</option><option>Nutrição</option><option>Outra</option></select></label><label><span>O que pretende publicar?</span><select required defaultValue=""><option value="" disabled>Selecione</option><option>Curso com videoaulas</option><option>PDFs e documentos</option><option>Planilhas e modelos</option><option>Conteúdo misto</option></select></label><label className="full-field"><span>Resumo da proposta</span><textarea required placeholder="Descreva sua ideia em poucas linhas" rows={4} /></label></div><button className="button button-primary form-submit" type="submit">Enviar para análise <ArrowIcon /></button><small className="dialog-disclaimer">Formulário demonstrativo — nenhum dado será enviado.</small></form></ModalShell>;
}

function UploadDialog({ close, done }: { close: () => void; done: () => void }) {
  return <ModalShell close={close} label="Adicionar novo conteúdo"><form className="form-dialog" onSubmit={(event) => { event.preventDefault(); done(); }}><span className="section-kicker">NOVO PRODUTO</span><h2>Adicione seu conteúdo</h2><p>Crie um rascunho. A publicação só acontece depois da revisão da curadoria.</p><div className="form-grid"><label className="full-field"><span>Título do produto</span><input required placeholder="Ex.: Protocolos de segurança do paciente" /></label><label><span>Formato principal</span><select required defaultValue=""><option value="" disabled>Selecione</option><option>Curso com videoaulas</option><option>PDFs e documentos</option><option>Planilhas e modelos</option><option>Pacote misto</option></select></label><label><span>Preço sugerido</span><input required placeholder="R$ 0,00" /></label><label className="full-field"><span>Arquivos</span><div className="upload-zone"><span>↑</span><b>Selecione arquivos para enviar</b><small>PDF, DOCX, XLSX, MP4 ou ZIP · até 2 GB</small><input aria-label="Selecionar arquivos" type="file" multiple /></div></label></div><button className="button button-primary form-submit" type="submit">Salvar rascunho <ArrowIcon /></button><small className="dialog-disclaimer">Upload demonstrativo — os arquivos não serão armazenados.</small></form></ModalShell>;
}

function CheckoutDialog({ product, close, complete }: { product: Product; close: () => void; complete: () => void }) {
  return <ModalShell close={close} label="Finalizar compra"><div className="checkout-dialog"><span className="demo-pill">CHECKOUT DEMONSTRATIVO</span><h2>Finalize sua compra</h2><div className="checkout-product"><span className={`mini-cover cover-${product.tone}`}>{product.type.slice(0, 1)}</span><div><b>{product.title}</b><small>{product.creator}</small></div><strong>{product.price}</strong></div><div className="checkout-features"><span><b>✓</b>Acesso imediato após a compra</span><span><b>✓</b>Conteúdo disponível na biblioteca</span><span><b>✓</b>Pagamento único e seguro</span></div><div className="checkout-total"><span>Total</span><b>{product.price}</b></div><button className="button button-primary form-submit" type="button" onClick={complete}>Simular compra <ArrowIcon /></button><p className="checkout-warning">Nenhum pagamento será processado. A integração financeira será ativada na versão comercial.</p></div></ModalShell>;
}

function FeedbackDialog({ close, kind, goLibrary }: { close: () => void; kind: "success" | "draft"; goLibrary: () => void }) {
  return <ModalShell close={close} label={kind === "success" ? "Compra simulada" : "Rascunho salvo"} size="small"><div className="feedback-dialog"><span className="feedback-icon">✓</span><h2>{kind === "success" ? "Compra simulada com sucesso" : "Rascunho criado"}</h2><p>{kind === "success" ? "O conteúdo foi adicionado à sua biblioteca nesta demonstração." : "Seu produto aparece como rascunho na demonstração. Na versão comercial, os arquivos serão armazenados com segurança."}</p>{kind === "success" ? <button className="button button-primary" type="button" onClick={goLibrary}>Ir para minha biblioteca</button> : <button className="button button-primary" type="button" onClick={close}>Voltar ao painel</button>}</div></ModalShell>;
}

function Footer({ navigate }: { navigate: (view: View, anchor?: string) => void }) {
  return <footer><Brand onClick={() => navigate("home", "#top")} /><p>Conteúdo especializado para uma saúde cada vez melhor.</p><div><button type="button" onClick={() => navigate("home", "#marketplace")}>Explorar</button><button type="button" onClick={() => navigate("producer")}>Seja produtor</button><a href={androidAppDownload} download>Baixar app Android</a><button type="button" onClick={() => navigate("home", "#top")}>Ajuda</button></div><small>© 2026 SaúdeHub. Ambiente demonstrativo.</small></footer>;
}

export default function MarketplaceApp() {
  const [view, setView] = useState<View>("home");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("Todas");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [dialog, setDialog] = useState<Dialog>(null);
  const [purchased, setPurchased] = useState<number[]>([]);
  const [adminAuthenticated, setAdminAuthenticated] = useState(false);

  const visibleProducts = useMemo(() => {
    const term = query.trim().toLocaleLowerCase("pt-BR");
    return products.filter((product) => {
      const categoryMatch = category === "Todas" || product.category === category;
      const textMatch = !term || [product.title, product.type, product.category, product.creator].some((value) => value.toLocaleLowerCase("pt-BR").includes(term));
      return categoryMatch && textMatch;
    });
  }, [category, query]);

  const closeModal = () => { setDialog(null); setSelectedProduct(null); };
  const openAdminLogin = () => { setSelectedProduct(null); setDialog("admin-login"); };
  const enterAdmin = () => {
    closeModal();
    setAdminAuthenticated(true);
    setView("admin");
    window.history.replaceState(null, "", "#admin");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const navigate = (next: View, anchor?: string) => {
    if (next === "admin" && !adminAuthenticated) {
      openAdminLogin();
      return;
    }
    closeModal();
    setView(next);
    const destination = next === "admin" ? "#admin" : next === "producer" ? "#produtor" : next === "library" ? "#biblioteca" : anchor ?? "#top";
    window.history.replaceState(null, "", destination);
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (next === "home" && anchor) window.setTimeout(() => document.querySelector(anchor)?.scrollIntoView({ behavior: "smooth" }), 80);
  };

  useEffect(() => {
    const destination = window.location.hash;
    let active = true;
    const frame = window.requestAnimationFrame(() => {
      if (destination === "#produtor") setView("producer");
      if (destination === "#biblioteca") setView("library");
    });

    if (destination === "#admin") {
      fetch("/api/admin/session", { credentials: "same-origin", cache: "no-store" })
        .then((response) => response.json())
        .then((result: { authenticated?: boolean }) => {
          if (!active) return;
          if (result.authenticated) {
            setAdminAuthenticated(true);
            setView("admin");
          } else {
            window.history.replaceState(null, "", "#top");
            setDialog("admin-login");
          }
        })
        .catch(() => {
          if (!active) return;
          window.history.replaceState(null, "", "#top");
          setDialog("admin-login");
        });
    }

    return () => { active = false; window.cancelAnimationFrame(frame); };
  }, []);

  useEffect(() => {
    const isOpen = Boolean(dialog || selectedProduct);
    document.body.style.overflow = isOpen ? "hidden" : "";
    const onKeyDown = (event: KeyboardEvent) => { if (event.key === "Escape") closeModal(); };
    window.addEventListener("keydown", onKeyDown);
    return () => { document.body.style.overflow = ""; window.removeEventListener("keydown", onKeyDown); };
  }, [dialog, selectedProduct]);

  const completePurchase = () => {
    if (selectedProduct) setPurchased((current) => current.includes(selectedProduct.id) ? current : [...current, selectedProduct.id]);
    setDialog("success");
  };

  const logoutAdmin = async () => {
    try {
      await fetch("/api/admin/logout", { method: "POST", credentials: "same-origin" });
    } finally {
      setAdminAuthenticated(false);
      closeModal();
      setView("home");
      window.history.replaceState(null, "", "#top");
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <main>
      <Header view={view} navigate={navigate} openDialog={setDialog} logoutAdmin={logoutAdmin} />
      {view === "home" && <HomeView query={query} setQuery={setQuery} category={category} setCategory={setCategory} visibleProducts={visibleProducts} openProduct={setSelectedProduct} openDialog={setDialog} />}
      {view === "library" && <LibraryView purchased={purchased} openProduct={setSelectedProduct} />}
      {view === "producer" && <ProducerView openDialog={setDialog} />}
      {view === "admin" && adminAuthenticated && <AdminView />}
      <Footer navigate={navigate} />

      {selectedProduct && !dialog && <ProductDialog product={selectedProduct} close={closeModal} checkout={() => setDialog("checkout")} />}
      {dialog === "signin" && <SigninDialog close={closeModal} navigate={(next) => navigate(next)} openAdminLogin={openAdminLogin} />}
      {dialog === "admin-login" && <AdminLoginDialog close={closeModal} authenticated={enterAdmin} />}
      {dialog === "apply" && <ApplicationDialog close={closeModal} done={() => setDialog("draft")} />}
      {dialog === "upload" && <UploadDialog close={closeModal} done={() => setDialog("draft")} />}
      {dialog === "checkout" && selectedProduct && <CheckoutDialog product={selectedProduct} close={closeModal} complete={completePurchase} />}
      {dialog === "success" && <FeedbackDialog close={closeModal} kind="success" goLibrary={() => navigate("library")} />}
      {dialog === "draft" && <FeedbackDialog close={closeModal} kind="draft" goLibrary={() => navigate("library")} />}
    </main>
  );
}
