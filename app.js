// ===== WEDDING MANAGER V2 - APP.JS =====
const APP_VERSION = 5;
const BUDGET_LIMIT = 51000;
const WEDDING_DATE = new Date('2026-08-29T16:30:00');

let state = {
  suppliers: [], guests: [], tasks: [], checklist: [], timeline: [],
  incomes: [], categories: [], currentPage: 'dashboard', budgetLimit: BUDGET_LIMIT, version: APP_VERSION
};

// Priority helpers
function priorityLabel(p) {
  const labels = { urgente: '🔴 Urgente', precisa: '🟡 Precisa ser feito', prazo_maior: '🟢 Prazo maior' };
  return labels[p] || p;
}
function priorityTag(p) {
  const cls = { urgente: 'tag-urgente', precisa: 'tag-precisa', prazo_maior: 'tag-prazo' };
  return cls[p] || 'tag-precisa';
}

// ===== INIT =====
function init() {
  loadState();
  // Purgar estrutura v1 incompatível
  if (!state.version || state.version < 3) {
    localStorage.removeItem('weddingManager');
    state = { suppliers:[], guests:[], tasks:[], checklist:[], timeline:[], incomes:[], categories:[], currentPage:'dashboard', budgetLimit:BUDGET_LIMIT, version:APP_VERSION };
  }
  state.version = APP_VERSION;
  seedDefaults();
  renderCountdown();
  navigateTo('dashboard');
  setInterval(renderCountdown, 60000);
}

function seedDefaults() {
  if (state.suppliers.length === 0) {
    state.suppliers = [
      { id: genId(), name: 'Paula Kadoche', category: '📋 Briefing & Planejamento', status: 'fechado', value: 4300, notes: 'Entrada + valor final a negociar', driveLink: '', phone: '', whatsapp: '', preferred: false, insta: '', images: [] },
      { id: genId(), name: 'Alto do Mirante', category: '📋 Briefing & Planejamento', status: 'fechado', value: 6300, notes: 'Anápolis. Comprovante de R$1.500 pago. Sex montagem 8-17h, Sáb making of 7h + evento 16:30-04:30, Dom desmontagem.', driveLink: '', phone: '', whatsapp: '', insta: '', preferred: true, images: [] },
      { id: genId(), name: 'Buffet (Volantes)', category: '🍽️ Buffet & Alimentação', status: 'pesquisando', value: 24000, notes: 'Orçamento R$200/pessoa c/ cerveja ou R$180 s/ cerveja. Inclui filet mignon, frango, massa, salada, lanche da madrugada. 6h de evento c/ equipe.', driveLink: '', phone: '', whatsapp: '', insta: '', preferred: false, images: [] },
      { id: genId(), name: 'Revoar Fotografia', category: '📸 Foto & Vídeo', status: 'negociando', value: 5076, notes: 'Proposta "Sim no Altar". 2 fotógrafos, making of noiva. Sem pré-wedding. Parcela em 5x s/ juros (1 + 4x 1015) via Pix.', driveLink: '', phone: '', whatsapp: '', insta: 'https://www.instagram.com/revoarfotografia', preferred: true, images: ['estrutura/00003046-PHOTO-2026-03-24-16-04-51.jpg', 'estrutura/00003051-PHOTO-2026-03-24-16-09-06.jpg'] },
      { id: genId(), name: 'RAVO Foto e Filme', category: '📸 Foto & Vídeo', status: 'pesquisando', value: 0, notes: '"esse já ta mais em conta" - Proposta 2026 com foto e filme.', driveLink: '', phone: '', whatsapp: '', insta: 'https://www.instagram.com/ravofoto_', preferred: false, images: [] },
      { id: genId(), name: 'Diemelo Foto', category: '📸 Foto & Vídeo', status: 'pesquisando', value: 0, notes: 'PACOTES 2026', driveLink: '', phone: '', whatsapp: '', insta: 'https://www.instagram.com/diemelofoto', preferred: false, images: [] },
      { id: genId(), name: 'Geraldo Caetano', category: '📸 Foto & Vídeo', status: 'pesquisando', value: 0, notes: 'Investimento.pdf', driveLink: 'Drive Casamento/Fotografia/Geraldo Caetano', insta: 'https://www.instagram.com/geraldocaetanofotografia', phone: '', whatsapp: '', preferred: false, images: [] },
      { id: genId(), name: 'SantaVica Fotografia', category: '📸 Foto & Vídeo', status: 'pesquisando', value: 0, notes: 'PROPOSTA 2025 02 new.pdf', driveLink: '', phone: '', whatsapp: '', insta: 'https://www.instagram.com/santavica_fotografia', preferred: false, images: [] },
      { id: genId(), name: '2Clickz Casamentos', category: '📸 Foto & Vídeo', status: 'pesquisando', value: 0, notes: 'Orçamento de Casamento 2026.pdf', driveLink: '', phone: '', whatsapp: '', insta: 'https://www.instagram.com/2clickzcasamentos', preferred: false, images: [] },
      { id: genId(), name: 'Photo Frame', category: '📸 Foto & Vídeo', status: 'pesquisando', value: 0, notes: 'Proposta 2025. Foto, Filme e StoreMaker', driveLink: '', phone: '', whatsapp: '', insta: 'https://instagram.com/photo_frame_noivas', preferred: false, images: [] },
      { id: genId(), name: 'Gustavo Satillo Films', category: '📸 Foto & Vídeo', status: 'pesquisando', value: 6000, notes: '"quase 6 mil por 20 minutos" (curta). Caro.', driveLink: '', phone: '', whatsapp: '', insta: 'https://www.instagram.com/gustavosatillofilms', preferred: false, images: ['estrutura/00003036-PHOTO-2026-03-24-13-51-35.jpg'] },
      { id: genId(), name: '1984 Films', category: '📸 Foto & Vídeo', status: 'negociando', value: 5800, notes: 'Pacote 1984 (Pré Wedding, Short Film, Trailer, Drone) por R$5.800. Ou Pacote 1961 (R$7.300) / 1988 (R$5.500)', driveLink: '', phone: '', whatsapp: '', insta: 'https://www.instagram.com/1984films', preferred: true, images: ['estrutura/00003102-PHOTO-2026-03-25-09-46-04.jpg', 'estrutura/00003103-PHOTO-2026-03-25-09-46-04.jpg'] },
      { id: genId(), name: 'Mendes Filmes', category: '📸 Foto & Vídeo', status: 'pesquisando', value: 0, notes: 'Proposta I Mendes Filmes I 2026.pdf', driveLink: '', phone: '', whatsapp: '', insta: 'https://www.instagram.com/mendesfilmess', preferred: false, images: [] },
      { id: genId(), name: 'Eventos4R', category: '🔒 Estrutura & Logística', status: 'pesquisando', value: 0, notes: 'Segurança e limpeza para o evento', driveLink: '', phone: '', whatsapp: '', insta: 'https://www.instagram.com/eventos4r/', preferred: false, images: [] },
      { id: genId(), name: 'Alemão Som/Iluminação', category: '🎵 Música & Entretenimento', status: 'pesquisando', value: 0, notes: 'pistas_evento.pdf / proposta_evento_completa.pdf', driveLink: 'https://docs.google.com/spreadsheets/d/1VhHHbMouIV3YbsjbvmFHzfXg3sgkqnW8Oju-S__m3QE/edit#gid=1031387754', phone: '', whatsapp: '', insta: '', preferred: false, images: [] },
      { id: genId(), name: 'Eduardo Galizi', category: '📋 Briefing & Planejamento', status: 'pesquisando', value: 0, notes: 'ANO 2025 - Orçamento Cerimonialista Eduardo Galizi - Assessoria & Ceriominal PACOTE 01 e 02.pdf', driveLink: 'Drive Casamento/Assessoria/Eduardo Galizi', insta: '', phone: '', whatsapp: '', preferred: false, images: [] },
      { id: genId(), name: 'Capella', category: '📋 Briefing & Planejamento', status: 'pesquisando', value: 0, notes: 'Capella.pdf', driveLink: 'Drive Casamento/Local/Capella', insta: '', phone: '', whatsapp: '', preferred: false, images: [] },
      { id: genId(), name: 'Ineditus Buffet', category: '🍽️ Buffet & Alimentação', status: 'pesquisando', value: 0, notes: 'Cardápio Ineditus Buffet.pdf - Cardápio bem completo e elogiado', driveLink: 'Drive Casamento/Buffet/Ineditus', insta: 'https://www.instagram.com/ineditus_buffet', phone: '', whatsapp: '', preferred: false, images: [] },
      { id: genId(), name: 'Elegance Buffet', category: '🍽️ Buffet & Alimentação', status: 'pesquisando', value: 0, notes: 'Buffet conversado dia 24/03', driveLink: '', insta: '', phone: '', whatsapp: '', preferred: false, images: [] },
      { id: genId(), name: 'Tô Noiva Eventos', category: '🎵 Música & Entretenimento', status: 'pesquisando', value: 0, notes: 'Pista de Dança e DJ_TÔ NOIVA EVENTOS.pdf', driveLink: 'Drive Casamento/Som e Iluminacao/To Noiva Eventos', insta: '', phone: '', whatsapp: '', preferred: false, images: [] },
      { id: genId(), name: 'Gabriela Baleeiro', category: '📸 Foto & Vídeo', status: 'pesquisando', value: 0, notes: 'Proposta - Gabriela Baleeiro .pdf', driveLink: 'Drive Casamento/Fotografia/Gabriela Baleeiro', insta: '', phone: '', whatsapp: '', preferred: false, images: [] },
      { id: genId(), name: 'Valente Filmes', category: '📸 Foto & Vídeo', status: 'pesquisando', value: 0, notes: '{Wedding} - Valente Filmes 2026 2027.pdf', driveLink: 'Drive Casamento/Filmagem/Valente Filmes', insta: '', phone: '', whatsapp: '', preferred: false, images: [] },
      { id: genId(), name: 'Ateliê', category: '👰 Noiva', status: 'pesquisando', value: 0, notes: 'Catálogo Ateliê - 2026.pdf', driveLink: 'Drive Casamento/Vestido da Noiva/Atelie', insta: '', phone: '', whatsapp: '', preferred: false, images: [] },
      { id: genId(), name: 'Caixas Padrinhos / Convites', category: '🎨 Identidade Visual & Papelaria', status: 'pesquisando', value: 1200, notes: '19 caixas. Porta joias e gravata COM BERCINHO (R$55 casais, R$45 indiv).', driveLink: '', insta: '', phone: '', whatsapp: '', preferred: true, images: [] },
      { id: genId(), name: 'Consórcio / Investimento Mensal', category: '💸 Pagamentos (Divididos e Acordos)', status: 'fechado', value: 900, notes: 'Samuel R$ 500, Karine R$ 400 (Depositados mensalmente na conta Caixa)', driveLink: '', insta: '', phone: '', whatsapp: '', preferred: true, images: [] },
      { id: genId(), name: 'Entrada Fornecedores (Local/Cerimonial)', category: '💸 Pagamentos (Divididos e Acordos)', status: 'fechado', value: 1500, notes: 'Entrada paga por Karine (19/03 - "Posso pagar os 1500 da entrada")', driveLink: '', insta: '', phone: '', whatsapp: '', preferred: true, images: [] }
    ];
  }

  state.suppliers.forEach(s => {
    if (s.whatsapp === undefined) s.whatsapp = '';
    if (s.preferred === undefined) s.preferred = false;
    if (s.images === undefined) s.images = [];
    if (s.insta === undefined) s.insta = '';
    
    if (s.driveLink && s.driveLink.includes('instagram.com')) {
      s.insta = s.driveLink;
      s.driveLink = '';
    }
  });

  if (state.checklist.length === 0) state.checklist = defaultChecklist();
  if (state.timeline.length === 0) state.timeline = defaultTimeline();
  if (state.tasks.length === 0) state.tasks = defaultTasks();
  
  if (!state.incomes || state.incomes.length === 0) {
    state.incomes = [
      { id: genId(), month: 'Junho/2026', value: 10000, received: false },
      { id: genId(), month: 'Julho/2026', value: 9315, received: false }
    ];
  }

  // Force categories to map checklist exactly
  if (!state.categories || state.categories.length === 0 || !state.categories.some(c => c.name === '💸 Pagamentos (Divididos e Acordos)')) {
    const cats = [
      '📋 Briefing & Planejamento', '⛪ Cerimônia', '🍽️ Buffet & Alimentação', 
      '🍰 Doces & Confeitaria', '🎵 Música & Entretenimento', '📸 Foto & Vídeo', 
      '💐 Decoração & Flores', '👰 Noiva', '🤵 Noivo', '🔒 Estrutura & Logística', 
      '🎨 Identidade Visual & Papelaria', '💸 Pagamentos (Divididos e Acordos)'
    ];
    state.categories = cats.map(name => ({ id: genId(), name: name, estimated: 0 }));
  }
  
  saveState();
}

function defaultChecklist() {
  const items = [
    { cat: '📋 Briefing & Planejamento', items: [
      { text: 'Definir data do evento', p: 'urgente' }, { text: 'Definir horário da cerimônia', p: 'urgente' },
      { text: 'Definir tipo de cerimônia (igreja/ar livre)', p: 'urgente' }, { text: 'Definir número de convidados (100-120)', p: 'urgente' },
      { text: 'Definir orçamento total (R$51k)', p: 'urgente' }, { text: 'Contratar assessoria/cerimonial', p: 'urgente' },
      { text: 'Escolher e fechar local do evento', p: 'urgente' }
    ]},
    { cat: '⛪ Cerimônia', items: [
      { text: 'Definir celebrante', p: 'urgente' }, { text: 'Definir quantidade de padrinhos/casais', p: 'precisa' },
      { text: 'Definir damas adultas e crianças', p: 'precisa' }, { text: 'Definir número de pessoas no altar', p: 'precisa' },
      { text: 'Definir pessoas na mesa da família', p: 'prazo_maior' }
    ]},
    { cat: '🍽️ Buffet & Alimentação', items: [
      { text: 'Pesquisar e contratar buffet', p: 'urgente' }, { text: 'Definir tipo de serviço (volante/empratado)', p: 'precisa' },
      { text: 'Mesa posta', p: 'precisa' }, { text: 'Mesa de frios', p: 'precisa' },
      { text: 'Mesa de café e licor', p: 'prazo_maior' }, { text: 'Bar / drinks', p: 'precisa' },
      { text: 'Degustação do buffet', p: 'precisa' }
    ]},
    { cat: '🍰 Doces & Confeitaria', items: [
      { text: 'Mesa de doces', p: 'precisa' }, { text: 'Definir cor da forminha e quantidade', p: 'prazo_maior' },
      { text: 'Definir tipo de peça', p: 'prazo_maior' }, { text: 'Definir número de peças', p: 'prazo_maior' },
      { text: 'Bolo / confeitaria / maquete', p: 'precisa' }
    ]},
    { cat: '🎵 Música & Entretenimento', items: [
      { text: 'Contratar músicos para cerimônia', p: 'urgente' }, { text: 'Definir quantidade de músicos', p: 'precisa' },
      { text: 'Contratar banda para festa', p: 'urgente' }, { text: 'Contratar DJ', p: 'urgente' },
      { text: 'Definir pista de dança (tipo/tamanho)', p: 'precisa' }, { text: 'Cabine fotográfica', p: 'prazo_maior' }
    ]},
    { cat: '📸 Foto & Vídeo', items: [
      { text: 'Contratar fotógrafo', p: 'urgente' }, { text: 'Contratar filmagem/videomaker', p: 'urgente' },
      { text: 'Definir estilo (documental, editorial, etc)', p: 'precisa' }
    ]},
    { cat: '💐 Decoração & Flores', items: [
      { text: 'Contratar decorador', p: 'urgente' }, { text: 'Definir estilo da decoração', p: 'precisa' },
      { text: 'Bouquet da noiva', p: 'precisa' }, { text: 'Arranjos de mesa', p: 'precisa' },
      { text: 'Iluminação decorativa', p: 'precisa' }, { text: 'Flores suspensas (blush/rosé)', p: 'prazo_maior' }
    ]},
    { cat: '👰 Noiva', items: [
      { text: 'Vestido da noiva', p: 'urgente' }, { text: 'Maquiadora', p: 'urgente' },
      { text: 'Cabeleireira', p: 'urgente' }, { text: 'Acessórios (véu, sapato, joias)', p: 'precisa' },
      { text: 'Making of (quarto da noiva reservado)', p: 'prazo_maior' }
    ]},
    { cat: '🤵 Noivo', items: [
      { text: 'Terno do noivo', p: 'urgente' }, { text: 'Sapato do noivo', p: 'precisa' },
      { text: 'Acessórios (gravata, abotoaduras)', p: 'prazo_maior' }
    ]},
    { cat: '🔒 Estrutura & Logística', items: [
      { text: 'Segurança', p: 'precisa' }, { text: 'Equipe de limpeza', p: 'precisa' },
      { text: 'Gerador', p: 'precisa' }, { text: 'Som e iluminação cênica', p: 'urgente' },
      { text: 'Transporte dos noivos', p: 'prazo_maior' }
    ]},
    { cat: '🎨 Identidade Visual & Papelaria', items: [
      { text: 'Criar logo do casamento', p: 'precisa' }, { text: 'Design do convite digital', p: 'urgente' },
      { text: 'Convites para padrinhos', p: 'precisa' }, { text: 'Aquarela do local', p: 'prazo_maior' },
      { text: 'Artes para redes sociais', p: 'prazo_maior' }, { text: 'Save the date', p: 'urgente' }
    ]},
    { cat: '🌐 Site & RSVP', items: [
      { text: 'Criar site do casamento', p: 'precisa' }, { text: 'Configurar RSVP online', p: 'urgente' },
      { text: 'Lista de presentes', p: 'prazo_maior' }
    ]},
    { cat: '📱 WhatsApp & Comunicação', items: [
      { text: 'Criar grupo de padrinhos', p: 'precisa' }, { text: 'Criar lista de transmissão convidados', p: 'precisa' },
      { text: 'Mensagem de save the date', p: 'urgente' }, { text: 'Mensagem de confirmação', p: 'precisa' }
    ]}
  ];
  let result = [];
  items.forEach(group => {
    group.items.forEach(item => {
      result.push({ id: genId(), category: group.cat, text: item.text, priority: item.p, done: false });
    });
  });
  const doneTexts = ['Definir data do evento', 'Definir orçamento total (R$51k)', 'Contratar assessoria/cerimonial', 'Escolher e fechar local do evento', 'Definir número de convidados (100-120)'];
  result.forEach(item => { if (doneTexts.includes(item.text)) item.done = true; });
  return result;
}

function defaultTimeline() {
  return [
    { id: genId(), time: 'Sexta 28/08 - 08:00', desc: 'Liberação do espaço para entrega de materiais e montagem' },
    { id: genId(), time: 'Sexta 28/08 - 17:00', desc: 'Fim da montagem do dia' },
    { id: genId(), time: 'Sábado 29/08 - 07:00', desc: 'Espaço disponível / Quarto da noiva liberado' },
    { id: genId(), time: 'Sábado 29/08 - 07:00-14:00', desc: 'Making of da noiva' },
    { id: genId(), time: 'Sábado 29/08 - 14:00-16:00', desc: 'Finalização montagem e testes de som/luz' },
    { id: genId(), time: 'Sábado 29/08 - 16:30', desc: '🎉 Início do evento / Cerimônia' },
    { id: genId(), time: 'Sábado 29/08 - 17:30', desc: 'Coquetel / Recepção' },
    { id: genId(), time: 'Sábado 29/08 - 19:00', desc: 'Jantar' },
    { id: genId(), time: 'Sábado 29/08 - 20:30', desc: 'Festa / Pista de dança' },
    { id: genId(), time: 'Sábado 29/08 - 04:30', desc: 'Encerramento do evento' },
    { id: genId(), time: 'Domingo 30/08', desc: 'Desmontagem e devolução de materiais' }
  ];
}

function defaultTasks() {
  return [
    { id: genId(), text: 'Pesquisar e cotar buffet (mínimo 3 orçamentos)', priority: 'urgente', done: false, due: '2026-05-01' },
    { id: genId(), text: 'Pesquisar fotógrafo + videomaker', priority: 'urgente', done: false, due: '2026-05-15' },
    { id: genId(), text: 'Definir estilo decoração e cotar decoradores', priority: 'precisa', done: false, due: '2026-05-01' },
    { id: genId(), text: 'Pesquisar DJ / Banda', priority: 'precisa', done: false, due: '2026-06-01' },
    { id: genId(), text: 'Criar logo e identidade visual do casamento', priority: 'precisa', done: false, due: '2026-04-30' },
    { id: genId(), text: 'Enviar Save the Date', priority: 'urgente', done: false, due: '2026-05-15' },
    { id: genId(), text: 'Vestido da noiva - pesquisar ateliês', priority: 'urgente', done: false, due: '2026-04-15' },
    { id: genId(), text: 'Terno do noivo - pesquisar', priority: 'precisa', done: false, due: '2026-06-15' },
    { id: genId(), text: 'Montar lista de convidados final', priority: 'urgente', done: false, due: '2026-04-30' },
    { id: genId(), text: 'Degustação do buffet', priority: 'precisa', done: false, due: '2026-06-01' },
    { id: genId(), text: 'Contratar segurança e limpeza', priority: 'prazo_maior', done: false, due: '2026-07-01' },
    { id: genId(), text: 'Criar convite para padrinhos', priority: 'precisa', done: false, due: '2026-05-01' },
    { id: genId(), text: 'Pesquisar aquarela do local para convite', priority: 'prazo_maior', done: false, due: '2026-05-15' },
    { id: genId(), text: 'Configurar RSVP e site do casamento', priority: 'urgente', done: false, due: '2026-06-01' },
    { id: genId(), text: 'Pesquisar gerador', priority: 'prazo_maior', done: false, due: '2026-07-15' }
  ];
}

// ===== PERSISTENCE =====
function saveState() { localStorage.setItem('weddingManager', JSON.stringify(state)); }
function loadState() { const s = localStorage.getItem('weddingManager'); if (s) state = JSON.parse(s); }

// ===== UTILS =====
function genId() { return Math.random().toString(36).substr(2, 9); }
function formatMoney(v) { return 'R$ ' + Number(v).toLocaleString('pt-BR', { minimumFractionDigits: 2 }); }
function getTotalSpent() { return state.suppliers.reduce((s, x) => s + (Number(x.value) || 0), 0); }
function getTotalIncome() { return state.incomes.reduce((s, x) => s + (Number(x.value) || 0), 0); }
function getRemaining() { return state.budgetLimit - getTotalSpent(); }
function getBudgetPercent() { return Math.min((getTotalSpent() / state.budgetLimit) * 100, 100); }

function showToast(msg, icon = '✅') {
  const c = document.getElementById('toast-container');
  const t = document.createElement('div'); t.className = 'toast';
  t.innerHTML = `<span>${icon}</span> ${msg}`;
  c.appendChild(t); setTimeout(() => t.remove(), 3000);
}

// ===== SUPPLIER CATEGORIES =====
const SUPPLIER_CATEGORIES = [
  '📋 Briefing & Planejamento', 
  '⛪ Cerimônia', 
  '🍽️ Buffet & Alimentação', 
  '🍰 Doces & Confeitaria', 
  '🎵 Música & Entretenimento', 
  '📸 Foto & Vídeo', 
  '💐 Decoração & Flores', 
  '👰 Noiva', 
  '🤵 Noivo', 
  '🔒 Estrutura & Logística', 
  '🎨 Identidade Visual & Papelaria',
  '💸 Pagamentos (Divididos e Acordos)'
];

function getSuppliersByCategory() {
  const cats = {};
  state.suppliers.forEach(s => {
    if (!cats[s.category]) cats[s.category] = [];
    cats[s.category].push(s);
  });
  return cats;
}

function getCategoryComparison(suppliers) {
  if (suppliers.length === 0) return {};
  const withValue = suppliers.filter(s => s.value > 0);
  if (withValue.length === 0) return {};
  const sorted = [...withValue].sort((a, b) => a.value - b.value);
  return {
    cheapest: sorted[0]?.id,
    expensive: sorted.length > 1 ? sorted[sorted.length - 1]?.id : null,
    preferred: suppliers.find(s => s.preferred)?.id
  };
}

// ===== NAVIGATION =====
function navigateTo(page) {
  state.currentPage = page;
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  const pe = document.getElementById('page-' + page);
  const ne = document.querySelector(`[data-page="${page}"]`);
  if (pe) pe.classList.add('active');
  if (ne) ne.classList.add('active');
  document.getElementById('page-title').textContent = getPageTitle(page);
  renderPage(page);
  document.querySelector('.sidebar')?.classList.remove('open');
}

function getPageTitle(p) {
  const t = { dashboard:'💒 Painel Geral', suppliers:'🏪 Fornecedores & Orçamentos', budget:'💰 Controle Financeiro',
    checklist:'✅ Checklist Completo', guests:'👥 Convidados & RSVP', tasks:'📋 Tarefas',
    timeline:'🕐 Cronograma do Dia', whatsapp:'📱 Orientações WhatsApp' };
  return t[p] || 'Casamento';
}

function renderPage(page) {
  const r = { dashboard:renderDashboard, suppliers:renderSuppliers, budget:renderBudget,
    checklist:renderChecklistPage, guests:renderGuests, tasks:renderTasks,
    timeline:renderTimeline, whatsapp:renderWhatsApp };
  if (r[page]) r[page]();
  updateBudgetPill();
}

function renderCountdown() {
  const diff = WEDDING_DATE - new Date();
  document.getElementById('countdown-days').textContent = Math.max(0, Math.floor(diff / 86400000));
}

function updateBudgetPill() {
  const el = document.getElementById('budget-pill');
  if (el) el.textContent = `${formatMoney(getTotalSpent())} / ${formatMoney(state.budgetLimit)}`;
}

// ===== DASHBOARD =====
function renderDashboard() {
  const total = getTotalSpent(), rem = getRemaining();
  const tg = state.guests.length, conf = state.guests.filter(g => g.status === 'confirmed').length;
  const td = state.tasks.filter(t => t.done).length;
  document.getElementById('dash-total-spent').textContent = formatMoney(total);
  document.getElementById('dash-remaining').textContent = formatMoney(rem);
  document.getElementById('dash-guests').textContent = `${conf}/${tg}`;
  document.getElementById('dash-tasks').textContent = `${td}/${state.tasks.length}`;
}

// ===== SUPPLIERS (TABS BY CATEGORY) =====
let currentSupplierTab = null;

function getCheapestInCategory(suppliers) {
  const withVal = suppliers.filter(s => s.value > 0 && !s.rejected);
  if (!withVal.length) return null;
  return withVal.reduce((min, s) => s.value < min.value ? s : min);
}

function getPreferredInCategory(suppliers) {
  return suppliers.filter(s => s.preferred && !s.rejected);
}

function countPreferredInCategory(suppliers) {
  return suppliers.filter(s => s.preferred && !s.rejected).length;
}

function renderSuppliers() {
  const cats = getSuppliersByCategory();
  const allCatNames = state.categories.map(c => c.name);

  // Build tab list: only categories that have suppliers
  const usedCats = allCatNames.filter(n => cats[n] && cats[n].length > 0);
  
  // Extra cats from suppliers not in state.categories
  Object.keys(cats).forEach(k => { if (!usedCats.includes(k)) usedCats.push(k); });

  if (!currentSupplierTab || !usedCats.includes(currentSupplierTab)) {
    currentSupplierTab = usedCats[0] || null;
  }

  // Render tab bar
  const tabBar = document.getElementById('tab-bar');
  tabBar.innerHTML = usedCats.map(cat => {
    const count = cats[cat] ? cats[cat].length : 0;
    const preferred = cats[cat] ? countPreferredInCategory(cats[cat]) : 0;
    const starDot = preferred > 0 ? ` <span style="color:var(--gold);font-size:0.75rem">${'⭐'.repeat(preferred)}</span>` : '';
    return `<div class="tab-item${cat === currentSupplierTab ? ' active' : ''}" onclick="switchSupplierTab('${cat.replace(/'/g,'\\\'')}')">
      <span class="tab-label" title="${cat}">${cat}</span>${starDot}
    </div>`;
  }).join('');

  // Render tab content
  const container = document.getElementById('tab-content');
  if (!currentSupplierTab || !cats[currentSupplierTab]) {
    container.innerHTML = '<div class="card" style="text-align:center;padding:40px;color:var(--ink-3)">Nenhum fornecedor cadastrado ainda. Clique em + Fornecedor para adicionar.</div>';
    document.getElementById('suppliers-total').textContent = formatMoney(getTotalSpent());
    document.getElementById('suppliers-count').textContent = state.suppliers.length;
    return;
  }

  const suppliers = cats[currentSupplierTab];
  const cheapest = getCheapestInCategory(suppliers);
  const preferred = getPreferredInCategory(suppliers);
  const catTotal = suppliers.reduce((s, x) => s + (Number(x.value) || 0), 0);

  // Mini-dashboard at top
  let miniDash = `<div class="supplier-overview">`;

  // Card: Mais Barato
  if (cheapest) {
    miniDash += `<div class="overview-card">
      <div class="overview-label">💰 Mais Barato</div>
      <div class="overview-name">${cheapest.name}</div>
      <div class="overview-price">${cheapest.value > 0 ? formatMoney(cheapest.value) : '—'}</div>
      ${cheapest.notes ? `<div class="overview-diff">${cheapest.notes.split('\n').slice(0,3).map(l => `<span>${l}</span>`).join('')}</div>` : ''}
    </div>`;
  } else {
    miniDash += `<div class="overview-card"><div class="overview-label">💰 Mais Barato</div><div class="no-overview">Sem valores informados</div></div>`;
  }

  // Card: Favoritos (até 2)
  miniDash += `<div class="overview-card gold-accent">
    <div class="overview-label">⭐ Favorito${preferred.length > 1 ? 's' : ''}</div>`;
  if (preferred.length === 0) {
    miniDash += `<div class="chosen-empty"><span class="chosen-star">☆</span>Marque até 2 fornecedores com ⭐ para definir seus favoritos</div>`;
  } else {
    preferred.forEach(p => {
      miniDash += `<div style="margin-bottom:10px">
        <div class="chosen-supplier-name">⭐ ${p.name}</div>
        <div class="chosen-supplier-price">${p.value > 0 ? formatMoney(p.value) : 'Valor a definir'}</div>
        ${p.notes ? `<div style="font-size:0.78rem;color:var(--ink-3);margin-top:4px">${p.notes.split('\n')[0]}</div>` : ''}
      </div>`;
    });
  }
  miniDash += `</div></div>`;

  // Supplier list
  let suppliersHtml = `<div class="card">
    <div class="card-header">
      <h3>${currentSupplierTab} <span style="font-size:0.8rem;font-weight:400;color:var(--ink-3)">(${suppliers.length} fornecedor${suppliers.length > 1 ? 'es' : ''})</span></h3>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="font-size:0.8rem;color:var(--ink-3)">Total: <strong>${formatMoney(catTotal)}</strong></span>
        <button class="btn btn-primary btn-sm" onclick="openSupplierModal(null, '${currentSupplierTab.replace(/'/g, '\\\'')}')" >+ Fornecedor aqui</button>
      </div>
    </div>`;

  suppliers.forEach(s => {
    const isCheapest = cheapest && cheapest.id === s.id;
    const preferredCount = countPreferredInCategory(suppliers);
    // WhatsApp manual link directly
    const waLink = s.whatsapp ? `<a href="${s.whatsapp.startsWith('http') ? s.whatsapp : 'https://' + s.whatsapp}" target="_blank" class="wa-link">📱 WhatsApp</a>` : '';
    const driveLink = s.driveLink && !s.driveLink.includes('instagram.com') ? `<a href="${s.driveLink.startsWith('http') ? s.driveLink : 'https://' + s.driveLink}" target="_blank" class="drive-link" title="Drive">📁 Drive</a>` : '';
    const instaLink = s.insta ? `<a href="${s.insta.startsWith('http') ? s.insta : 'https://' + s.insta}" target="_blank" class="drive-link" style="background:var(--blush);color:white;border:none">📷 Insta</a>` : '';

    let badges = '';
    if (isCheapest) badges += '<span class="badge badge-cheapest">💰 Mais Barato</span> ';
    if (s.preferred) badges += '<span class="badge badge-preferred">⭐ Favorito</span> ';

    let imagesHtml = '';
    if (s.images && s.images.length > 0) {
      imagesHtml = `<div class="supplier-images">${s.images.map((img, i) => `<img src="${img}" alt="Foto ${i+1}" onclick="openLightbox('${img}')">`) .join('')}</div>`;
    }

    // Star button: gray if already 2 favorites and this is not one
    const canStar = s.preferred || preferredCount < 2;
    const starTitle = s.preferred ? 'Remover favorito' : (preferredCount >= 2 ? 'Limite de 2 favoritos atingido' : 'Marcar como favorito');

    const rejectedStyle = s.rejected ? 'opacity:0.5; filter:grayscale(1);' : '';
    let rejectedBadge = s.rejected ? '<span class="badge" style="background:var(--ink-2);color:white">🚫 Descartado</span> ' : '';

    suppliersHtml += `<div class="supplier-card ${s.preferred ? 'is-preferred' : ''} ${isCheapest && !s.rejected ? 'is-cheapest' : ''}" style="${rejectedStyle}">
      <div class="supplier-card-top">
        <div class="supplier-card-info">
          <div class="supplier-card-name">${s.name} ${rejectedBadge}${badges}</div>
          <div class="supplier-card-meta">
            <span class="tag tag-${s.status}">${s.status}</span>
            ${waLink} ${driveLink} ${instaLink}
            ${s.phone ? `<span>📞 ${s.phone}</span>` : ''}
          </div>
          ${s.notes ? `<div class="supplier-card-notes">${s.notes}</div>` : ''}
          ${imagesHtml}
        </div>
        <div style="text-align:right;flex-shrink:0">
          <div class="supplier-card-value">${s.value > 0 ? formatMoney(s.value) : '—'}</div>
          <div class="supplier-card-actions">
            <button class="btn btn-outline btn-xs" title="Não compensa / Descartar" onclick="toggleRejected('${s.id}')">${s.rejected ? 'Restaurar' : '🚫 Descartar'}</button>
            <button class="star-btn ${s.preferred ? 'active' : ''}" onclick="togglePreferred('${s.id}')" title="${starTitle}" ${!canStar ? 'style="opacity:0.3;cursor:not-allowed"' : ''}>⭐</button>
            <button class="btn btn-outline btn-xs" onclick="addSupplierImage('${s.id}')" title="Adicionar imagem">🖼️</button>
            <button class="btn btn-outline btn-xs" onclick="editSupplier('${s.id}')">✏️</button>
            <button class="btn btn-danger btn-xs" onclick="deleteSupplier('${s.id}')">🗑</button>
          </div>
        </div>
      </div>
    </div>`;
  });

  suppliersHtml += '</div>';

  container.innerHTML = miniDash + suppliersHtml;
  document.getElementById('suppliers-total').textContent = formatMoney(getTotalSpent());
  document.getElementById('suppliers-count').textContent = state.suppliers.length;
}

function switchSupplierTab(cat) {
  currentSupplierTab = cat;
  renderSuppliers();
}

function togglePreferred(id) {
  const s = state.suppliers.find(x => x.id === id);
  if (!s) return;
  const categorySuppliers = state.suppliers.filter(x => x.category === s.category && !x.rejected);
  const preferredCount = categorySuppliers.filter(x => x.preferred).length;
  
  if (!s.preferred && preferredCount >= 2) {
    showToast('Limite de 2 favoritos por categoria atingido ⭐', '⚠️');
    return;
  }
  s.preferred = !s.preferred;
  saveState(); renderSuppliers();
  showToast(s.preferred ? 'Marcado como favorito ⭐' : 'Removido dos favoridos');
}

function toggleRejected(id) {
  const s = state.suppliers.find(x => x.id === id);
  if (!s) return;
  s.rejected = !s.rejected;
  if (s.rejected) s.preferred = false; // Se descartou, tira o favorito
  saveState(); renderSuppliers();
  showToast(s.rejected ? 'Fornecedor descartado 🚫' : 'Fornecedor restaurado ✅');
}

function addSupplierImage(id) {
  const url = prompt('Cole a URL da imagem (ou base64):');
  if (!url) return;
  const s = state.suppliers.find(x => x.id === id);
  if (s) { s.images.push(url); saveState(); renderSuppliers(); showToast('Imagem adicionada!', '🖼️'); }
}

function openLightbox(src) {
  const lb = document.getElementById('lightbox');
  document.getElementById('lightbox-img').src = src;
  lb.classList.add('active');
}

function closeLightbox() { document.getElementById('lightbox').classList.remove('active'); }

function openSupplierModal(id = null, defaultCat = '') {
  const modal = document.getElementById('modal-supplier');
  const form = document.getElementById('supplier-form');
  form.reset();
  if (id) {
    const s = state.suppliers.find(x => x.id === id);
    if (s) {
      form.elements['s-name'].value = s.name;
      form.elements['s-category'].value = s.category;
      form.elements['s-status'].value = s.status;
      form.elements['s-value'].value = s.value;
      form.elements['s-phone'].value = s.phone || '';
      form.elements['s-whatsapp'].value = s.whatsapp || '';
      form.elements['s-drive'].value = s.driveLink || '';
      form.elements['s-insta'].value = s.insta || '';
      form.elements['s-notes'].value = s.notes || '';
      form.elements['s-id'].value = s.id;
    }
  } else {
    form.elements['s-id'].value = '';
    if (defaultCat) form.elements['s-category'].value = defaultCat;
  }
  // Popula o select dinamicamente
  const select = form.elements['s-category'];
  select.innerHTML = state.categories.map(c => `<option value="${c.name}">${c.name}</option>`).join('');
  if (defaultCat) select.value = defaultCat;
  else if (id && state.suppliers.find(x => x.id === id)) select.value = state.suppliers.find(x => x.id === id).category;

  modal.classList.add('active');
}

function saveSupplier() {
  const form = document.getElementById('supplier-form');
  const id = form.elements['s-id'].value;
  const existing = id ? state.suppliers.find(x => x.id === id) : null;
  const data = {
    id: id || genId(),
    name: form.elements['s-name'].value,
    category: form.elements['s-category'].value,
    status: form.elements['s-status'].value,
    value: parseFloat(form.elements['s-value'].value) || 0,
    phone: form.elements['s-phone'].value,
    whatsapp: form.elements['s-whatsapp'].value,
    driveLink: form.elements['s-drive'].value,
    insta: form.elements['s-insta'].value,
    notes: form.elements['s-notes'].value,
    preferred: existing ? existing.preferred : false,
    rejected: existing ? existing.rejected : false,
    images: existing ? existing.images : []
  };
  if (!data.name) return showToast('Preencha o nome', '⚠️');
  // Check preferred limit on new supplier
  if (data.preferred) {
    const catPreferred = state.suppliers.filter(x => x.category === data.category && x.preferred && x.id !== data.id).length;
    if (catPreferred >= 2) data.preferred = false;
  }
  if (id) { const idx = state.suppliers.findIndex(x => x.id === id); if (idx >= 0) state.suppliers[idx] = data; }
  else state.suppliers.push(data);
  // Switch to the new supplier's category tab
  currentSupplierTab = data.category;
  saveState(); closeModal('modal-supplier'); renderSuppliers();
  showToast(id ? 'Fornecedor atualizado!' : 'Fornecedor adicionado!');
}

function editSupplier(id) { openSupplierModal(id); }
function deleteSupplier(id) {
  if (!confirm('Remover este fornecedor?')) return;
  state.suppliers = state.suppliers.filter(x => x.id !== id);
  saveState(); renderSuppliers(); showToast('Fornecedor removido', '🗑');
}

// ===== BUDGET =====
function renderBudget() {
  const total = getTotalSpent(), rem = getRemaining(), pct = getBudgetPercent();
  document.getElementById('budget-total-spent').textContent = formatMoney(total);
  document.getElementById('budget-remaining').textContent = formatMoney(rem);
  document.getElementById('budget-limit').textContent = formatMoney(state.budgetLimit);
  document.getElementById('budget-bar').style.width = pct + '%';
  document.getElementById('budget-bar').className = 'progress-fill ' + (pct > 90 ? 'danger' : pct > 70 ? 'gold' : 'olive');
  document.getElementById('budget-pct').textContent = pct.toFixed(1) + '% utilizado';
  document.getElementById('budget-limit-input').value = state.budgetLimit;

  // Income schedule
  const incomeHtml = state.incomes.map(inc => `
    <div class="income-row">
      <div><input type="checkbox" ${inc.received ? 'checked' : ''} onchange="toggleIncome('${inc.id}')"> <strong>${inc.month}</strong></div>
      <div style="display:flex;gap:8px;align-items:center">
        <span style="font-weight:600;color:${inc.received ? 'var(--success)' : 'var(--text-medium)'}">${formatMoney(inc.value)}</span>
        <button class="btn btn-danger btn-xs" onclick="deleteIncome('${inc.id}')">✕</button>
      </div>
    </div>
  `).join('');
  const totalIncome = getTotalIncome();
  const receivedIncome = state.incomes.filter(i => i.received).reduce((s, i) => s + i.value, 0);
  document.getElementById('income-list').innerHTML = incomeHtml;
  document.getElementById('income-total').textContent = formatMoney(totalIncome);
  document.getElementById('income-received').textContent = formatMoney(receivedIncome);

  // Breakdown by category (Editable)
  // Calculate total estimated from categories to use as "Total Reservado"
  const totalEstimated = state.categories.reduce((s, c) => s + (Number(c.estimated) || 0), 0);
  
  // Calculate actual spent per category
  const catsSpent = {};
  state.suppliers.forEach(s => {
    if (!catsSpent[s.category]) catsSpent[s.category] = { total: 0, items: [] };
    catsSpent[s.category].total += Number(s.value) || 0;
    catsSpent[s.category].items.push(s);
  });

  document.getElementById('budget-total-spent').textContent = formatMoney(totalEstimated);
  document.getElementById('budget-remaining').textContent = formatMoney(state.budgetLimit - totalEstimated);
  document.getElementById('budget-bar').style.width = (state.budgetLimit > 0 ? (totalEstimated / state.budgetLimit * 100) : 0) + '%';
  document.getElementById('budget-pct').textContent = (state.budgetLimit > 0 ? (totalEstimated / state.budgetLimit * 100) : 0).toFixed(1) + '% reservado';

  document.getElementById('budget-breakdown').innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:center;margin:16px 0;">
      <h3 style="margin:0">Estimativas por Categoria</h3>
      <button class="btn btn-primary btn-sm" onclick="addCategory()">+ Categoria</button>
    </div>
    <div class="card" style="padding:16px">
      <div style="display:table;width:100%;border-bottom:2px solid var(--beige-light);padding-bottom:8px;margin-bottom:8px;font-weight:bold;font-size:0.85rem;color:var(--text-medium)">
        <div style="display:table-cell;width:40%">Categoria / Fornecedores</div>
        <div style="display:table-cell;width:25%">Valor Estimado</div>
        <div style="display:table-cell;width:20%">Total Fornecedores</div>
        <div style="display:table-cell;width:15%;text-align:right">Ações</div>
      </div>
      ${state.categories.sort((a,b)=>a.name.localeCompare(b.name)).map(cat => {
        const spent = catsSpent[cat.name] ? catsSpent[cat.name].total : 0;
        const color = spent > cat.estimated ? 'var(--danger)' : 'var(--olive)';
        return `
          <div style="display:table;width:100%;padding:12px 0;border-bottom:1px solid var(--beige-light);align-items:center;">
            <div style="display:table-cell;vertical-align:middle;width:40%;font-weight:600;color:var(--text-dark)">${cat.name}</div>
            <div style="display:table-cell;vertical-align:middle;width:25%">
              <input type="number" class="form-control" style="width:100px;padding:4px;font-size:0.85rem" value="${cat.estimated}" onchange="updateCategoryValue('${cat.id}', this.value)" placeholder="0.00">
            </div>
            <div style="display:table-cell;vertical-align:middle;width:20%;font-weight:600;color:${color};font-size:0.9rem">
              ${formatMoney(spent)}
            </div>
            <div style="display:table-cell;vertical-align:middle;width:15%;text-align:right">
              <button class="btn btn-danger btn-xs" onclick="deleteCategory('${cat.id}')">✕</button>
            </div>
          </div>
          ${catsSpent[cat.name] ? catsSpent[cat.name].items.map(s => `<div style="font-size:0.8rem;color:var(--text-light);padding-left:12px;margin-bottom:4px;">↳ ${s.name} (${s.status}): ${formatMoney(s.value)}</div>`).join('') : ''}
        `;
      }).join('')}
      <div style="display:flex;justify-content:space-between;padding-top:16px;font-weight:bold;font-size:1.1rem">
        <span>Total Geral</span>
      </div>
    </div>
  `;
}

function addCategory() {
  const name = prompt('Nome da nova categoria:');
  if (!name) return;
  state.categories.push({ id: genId(), name: name, estimated: 0 });
  saveState(); renderBudget(); showToast('Categoria adicionada!');
}

function updateCategoryValue(id, val) {
  const c = state.categories.find(x => x.id === id);
  if (c) {
    c.estimated = parseFloat(val) || 0;
    saveState(); renderBudget();
  }
}

function deleteCategory(id) {
  const c = state.categories.find(x => x.id === id);
  if (!c) return;
  const inUse = state.suppliers.some(s => s.category === c.name);
  if (inUse) {
    alert('Não é possível excluir esta categoria porque existem fornecedores associados a ela. Remova ou altere os fornecedores primeiro.');
    return;
  }
  if (!confirm(`Remover a categoria ${c.name}?`)) return;
  state.categories = state.categories.filter(x => x.id !== id);
  saveState(); renderBudget(); showToast('Categoria removida!');
}

function updateBudgetLimit() {
  const v = parseFloat(document.getElementById('budget-limit-input').value);
  if (v > 0) { state.budgetLimit = v; saveState(); renderBudget(); showToast('Limite atualizado!'); }
}

function toggleIncome(id) {
  const i = state.incomes.find(x => x.id === id);
  if (i) { i.received = !i.received; saveState(); renderBudget(); }
}

function addIncome() {
  const month = prompt('Mês/Ano (ex: Agosto/2026):');
  if (!month) return;
  const value = parseFloat(prompt('Valor (R$):'));
  if (!value || value <= 0) return;
  state.incomes.push({ id: genId(), month, value, received: false });
  saveState(); renderBudget(); showToast('Entrada adicionada!');
}

function deleteIncome(id) {
  state.incomes = state.incomes.filter(x => x.id !== id);
  saveState(); renderBudget();
}

function renderChecklistPage() {
  const filter = document.getElementById('checklist-filter')?.value || 'all';
  const prioFilter = document.getElementById('checklist-priority-filter')?.value || 'all';
  const categories = [...new Set(state.checklist.map(c => c.category))];
  let filtered = state.checklist;
  if (filter === 'pending') filtered = filtered.filter(c => !c.done);
  if (filter === 'done') filtered = filtered.filter(c => c.done);
  if (prioFilter !== 'all') filtered = filtered.filter(c => c.priority === prioFilter);

  const container = document.getElementById('checklist-items');
  let html = '';
  categories.forEach(cat => {
    const items = filtered.filter(c => c.category === cat);
    const allCatItems = state.checklist.filter(c => c.category === cat);
    if (items.length === 0 && filter !== 'all') return;
    const catDoneTotal = allCatItems.filter(i => i.done).length;
    const catTotal = allCatItems.length;
    html += `<div class="checklist-category" style="display:flex;align-items:center;justify-content:space-between">
      <span>${cat} (${catDoneTotal}/${catTotal})</span>
      <button class="btn btn-ghost" style="font-size:0.7rem;padding:2px 8px" onclick="editChecklistCategory('${cat.replace(/'/g, '\\\'')}')" title="Renomear categoria">✏️ Renomear</button>
    </div>`;
    if (items.length === 0) {
      html += `<div style="padding:8px 14px;font-size:0.8rem;color:var(--ink-4)">Nenhum item nesta categoria com o filtro atual.</div>`;
      return;
    }
    items.forEach(item => {
      html += `<div class="checklist-item ${item.done ? 'done' : ''}">
        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="toggleChecklist('${item.id}')">
        <span class="tag ${priorityTag(item.priority)}">${priorityLabel(item.priority)}</span>
        <span class="checklist-text">${item.text}</span>
        <button class="btn btn-danger btn-xs" onclick="deleteChecklistItem('${item.id}')" style="opacity:0.6">✕</button>
      </div>`;
    });
  });
  container.innerHTML = html;

  const total = state.checklist.length, done = state.checklist.filter(c => c.done).length;
  document.getElementById('checklist-progress-text').textContent = `${done}/${total} concluídos`;
  document.getElementById('checklist-progress-bar').style.width = (total > 0 ? (done / total) * 100 : 0) + '%';
}

function toggleChecklist(id) { const i = state.checklist.find(c => c.id === id); if (i) { i.done = !i.done; saveState(); renderChecklistPage(); } }
function deleteChecklistItem(id) { state.checklist = state.checklist.filter(c => c.id !== id); saveState(); renderChecklistPage(); }
function addChecklistItem() {
  const cats = [...new Set(state.checklist.map(c => c.category))];
  const catOptions = cats.map((c, i) => `${i+1}. ${c}`).join('\n');
  const catInput = prompt(`Escolha a categoria (número ou nome):\n${catOptions}\nOu digite um nome novo:`);
  if (!catInput) return;
  let cat = catInput;
  const num = parseInt(catInput);
  if (!isNaN(num) && num >= 1 && num <= cats.length) cat = cats[num - 1];
  const text = prompt('Texto do item:');
  if (!text) return;
  const priority = prompt('Prioridade (urgente / precisa / prazo_maior):') || 'precisa';
  state.checklist.push({ id: genId(), category: cat, text, priority, done: false });
  saveState(); renderChecklistPage(); showToast('Item adicionado!');
}

function addChecklistCategory() {
  const name = prompt('Nome da nova categoria (pode incluir emoji, ex: 🎂 Bolo):');
  if (!name || !name.trim()) return;
  // Check if category already exists
  const exists = [...new Set(state.checklist.map(c => c.category))].includes(name.trim());
  if (exists) { showToast('Categoria já existe!', '⚠️'); return; }
  // Add a placeholder item so the category appears
  state.checklist.push({ id: genId(), category: name.trim(), text: '(clique ✏️ para editar este item)', priority: 'precisa', done: false });
  saveState(); renderChecklistPage(); showToast(`Categoria "${name.trim()}" criada!`, '✅');
}

function editChecklistCategory(oldName) {
  const newName = prompt('Novo nome para a categoria:', oldName);
  if (!newName || !newName.trim() || newName.trim() === oldName) return;
  state.checklist.forEach(item => { if (item.category === oldName) item.category = newName.trim(); });
  saveState(); renderChecklistPage(); showToast('Categoria renomeada!', '✅');
}

// ===== GUESTS / RSVP =====
function renderGuests() {
  const filter = document.getElementById('guest-filter')?.value || 'all';
  const search = (document.getElementById('guest-search')?.value || '').toLowerCase();
  let filtered = state.guests;
  if (filter === 'confirmed') filtered = filtered.filter(g => g.status === 'confirmed');
  if (filter === 'pending') filtered = filtered.filter(g => g.status === 'pending');
  if (filter === 'declined') filtered = filtered.filter(g => g.status === 'declined');
  if (search) filtered = filtered.filter(g => g.name.toLowerCase().includes(search));

  document.getElementById('guests-list').innerHTML = filtered.map(g => `
    <div class="rsvp-card">
      <div style="display:flex;justify-content:space-between;align-items:center">
        <div>
          <div class="guest-name">${g.name}</div>
          <div class="guest-info">${g.phone || ''} ${g.companions > 0 ? `· +${g.companions} acompanhante(s)` : ''}</div>
          ${g.notes ? `<div class="guest-info">${g.notes}</div>` : ''}
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          <span class="tag tag-${g.status}">${g.status === 'confirmed' ? 'Confirmado' : g.status === 'declined' ? 'Recusado' : 'Pendente'}</span>
          <button class="btn btn-outline btn-sm" onclick="editGuest('${g.id}')">✏️</button>
          <button class="btn btn-danger btn-sm" onclick="deleteGuest('${g.id}')">✕</button>
        </div>
      </div>
    </div>
  `).join('') || '<p style="color:var(--text-light);text-align:center;padding:24px">Nenhum convidado adicionado</p>';

  const total = state.guests.length, conf = state.guests.filter(g => g.status === 'confirmed').length;
  const comp = state.guests.reduce((s, g) => s + (Number(g.companions) || 0), 0);
  document.getElementById('guests-total').textContent = total;
  document.getElementById('guests-confirmed').textContent = conf;
  document.getElementById('guests-companions').textContent = comp;
  document.getElementById('guests-total-people').textContent = total + comp;
}

function openGuestModal(id = null) {
  const modal = document.getElementById('modal-guest');
  const form = document.getElementById('guest-form');
  form.reset();
  if (id) {
    const g = state.guests.find(x => x.id === id);
    if (g) { form.elements['g-name'].value=g.name; form.elements['g-phone'].value=g.phone||''; form.elements['g-status'].value=g.status; form.elements['g-companions'].value=g.companions||0; form.elements['g-notes'].value=g.notes||''; form.elements['g-id'].value=g.id; }
  } else { form.elements['g-id'].value = ''; }
  modal.classList.add('active');
}

function saveGuest() {
  const form = document.getElementById('guest-form');
  const id = form.elements['g-id'].value;
  const data = { id: id || genId(), name: form.elements['g-name'].value, phone: form.elements['g-phone'].value,
    status: form.elements['g-status'].value, companions: parseInt(form.elements['g-companions'].value) || 0,
    notes: form.elements['g-notes'].value };
  if (!data.name) return showToast('Preencha o nome', '⚠️');
  if (id) { const idx = state.guests.findIndex(x => x.id === id); if (idx >= 0) state.guests[idx] = data; }
  else state.guests.push(data);
  saveState(); closeModal('modal-guest'); renderGuests();
  showToast(id ? 'Convidado atualizado!' : 'Convidado adicionado!');
}

function editGuest(id) { openGuestModal(id); }
function deleteGuest(id) { if (!confirm('Remover?')) return; state.guests = state.guests.filter(x => x.id !== id); saveState(); renderGuests(); }

// ===== TASKS =====
function renderTasks() {
  const filter = document.getElementById('task-filter')?.value || 'all';
  let filtered = state.tasks;
  if (filter === 'pending') filtered = filtered.filter(t => !t.done);
  if (filter === 'done') filtered = filtered.filter(t => t.done);
  if (filter === 'urgente') filtered = filtered.filter(t => t.priority === 'urgente' && !t.done);
  filtered.sort((a, b) => { if (a.done !== b.done) return a.done ? 1 : -1; const p = { urgente:0, precisa:1, prazo_maior:2 }; return (p[a.priority]||2) - (p[b.priority]||2); });

  document.getElementById('tasks-list').innerHTML = filtered.map(t => `
    <div class="checklist-item ${t.done ? 'done' : ''}">
      <input type="checkbox" ${t.done ? 'checked' : ''} onchange="toggleTask('${t.id}')">
      <span class="tag ${priorityTag(t.priority)}">${priorityLabel(t.priority)}</span>
      <span class="checklist-text">${t.text}</span>
      <span style="font-size:0.75rem;color:var(--text-light)">${t.due || ''}</span>
      <button class="btn btn-outline btn-xs" onclick="editTask('${t.id}')">✏️</button>
      <button class="btn btn-danger btn-xs" onclick="deleteTask('${t.id}')">✕</button>
    </div>
  `).join('');
  document.getElementById('tasks-progress').textContent = `${state.tasks.filter(t => t.done).length}/${state.tasks.length} concluídas`;
}

function toggleTask(id) { const t = state.tasks.find(x => x.id === id); if (t) { t.done = !t.done; saveState(); renderTasks(); } }
function openTaskModal(id = null) {
  const modal = document.getElementById('modal-task');
  const form = document.getElementById('task-form');
  form.reset();
  if (id) { const t = state.tasks.find(x => x.id === id); if (t) { form.elements['t-text'].value=t.text; form.elements['t-priority'].value=t.priority; form.elements['t-due'].value=t.due||''; form.elements['t-id'].value=t.id; } }
  else { form.elements['t-id'].value = ''; }
  modal.classList.add('active');
}
function saveTask() {
  const form = document.getElementById('task-form'); const id = form.elements['t-id'].value;
  const data = { id: id || genId(), text: form.elements['t-text'].value, priority: form.elements['t-priority'].value, due: form.elements['t-due'].value, done: false };
  if (!data.text) return showToast('Descreva a tarefa', '⚠️');
  if (id) { const idx = state.tasks.findIndex(x => x.id === id); if (idx >= 0) { data.done = state.tasks[idx].done; state.tasks[idx] = data; } }
  else state.tasks.push(data);
  saveState(); closeModal('modal-task'); renderTasks(); showToast(id ? 'Tarefa atualizada!' : 'Tarefa criada!');
}
function editTask(id) { openTaskModal(id); }
function deleteTask(id) { if (!confirm('Remover?')) return; state.tasks = state.tasks.filter(x => x.id !== id); saveState(); renderTasks(); }

// ===== TIMELINE (FULLY EDITABLE) =====
function renderTimeline() {
  document.getElementById('timeline-items').innerHTML = state.timeline.map(t => `
    <div class="timeline-item">
      <div class="timeline-time">${t.time}
        <span class="timeline-actions">
          <button class="btn btn-outline btn-xs" onclick="editTimelineItem('${t.id}')">✏️</button>
          <button class="btn btn-danger btn-xs" onclick="deleteTimelineItem('${t.id}')">✕</button>
        </span>
      </div>
      <div class="timeline-desc">${t.desc}</div>
    </div>
  `).join('');
}

function addTimelineItem() {
  const time = prompt('Horário (ex: Sábado 29/08 - 18:00):');
  if (!time) return;
  const desc = prompt('Descrição:');
  if (!desc) return;
  state.timeline.push({ id: genId(), time, desc });
  saveState(); renderTimeline(); showToast('Item adicionado ao cronograma!');
}

function editTimelineItem(id) {
  const item = state.timeline.find(x => x.id === id);
  if (!item) return;
  const time = prompt('Horário:', item.time);
  if (time === null) return;
  const desc = prompt('Descrição:', item.desc);
  if (desc === null) return;
  item.time = time; item.desc = desc;
  saveState(); renderTimeline(); showToast('Cronograma atualizado!');
}

function deleteTimelineItem(id) {
  if (!confirm('Remover?')) return;
  state.timeline = state.timeline.filter(x => x.id !== id);
  saveState(); renderTimeline();
}

// ===== WHATSAPP =====
function renderWhatsApp() {}

// ===== MODALS =====
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// ===== EXPORT/IMPORT =====
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a'); a.href = URL.createObjectURL(blob);
  a.download = 'casamento-backup-' + new Date().toISOString().slice(0, 10) + '.json';
  a.click(); showToast('Backup exportado!', '💾');
}
function importData() {
  const input = document.createElement('input'); input.type = 'file'; input.accept = '.json';
  input.onchange = e => {
    const reader = new FileReader();
    reader.onload = ev => { try { state = JSON.parse(ev.target.result); saveState(); navigateTo('dashboard'); showToast('Dados importados!', '📥'); } catch { showToast('Erro ao importar', '❌'); } };
    reader.readAsText(e.target.files[0]);
  }; input.click();
}
function resetAllData() {
  if (!confirm('⚠️ Resetar TODOS os dados?')) return;
  localStorage.removeItem('weddingManager');
  state = { suppliers:[], guests:[], tasks:[], checklist:[], timeline:[], incomes:[], currentPage:'dashboard', budgetLimit:BUDGET_LIMIT };
  seedDefaults(); navigateTo('dashboard'); showToast('Dados resetados', '🔄');
}
function toggleSidebar() { document.querySelector('.sidebar').classList.toggle('open'); }

document.addEventListener('DOMContentLoaded', init);
