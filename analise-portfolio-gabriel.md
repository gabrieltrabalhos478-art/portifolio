# Análise Visual — Portfólio Gabriel

> Fontes preservadas: **Outfit** (títulos) · **Inter** (corpo)  
> Foco: cores sólidas, menu único, identidade visual diferenciada

---

## Diagnóstico Geral

O portfólio tem boa estrutura técnica e responsividade funcional. Os problemas são de identidade visual: o conjunto de escolhas (glassmorphism em todos os cards, gradiente indigo→roxo→pink, nav horizontal padrão, gradient-text no H1) forma exatamente o padrão mais comum em portfólios gerados automaticamente. Nenhuma dessas escolhas é errada individualmente — o problema é que aparecem juntas, sempre, em qualquer portfólio similar.

### Resumo de Problemas

| Prioridade | Quantidade | Área |
|-----------|-----------|------|
| 🔴 Crítico | 2 | Menu · Paleta de cores |
| 🟡 Alta | 2 | Glassmorphism · Hero typography |
| 🔵 Média | 2 | Skills · Cards de projeto |
| 🟢 Baixa | 1 | Cursor personalizado |

---

## 🔴 Crítico

### 1. Menu: substituir nav horizontal padrão por segmentado tipo pill-group

**Problema:** O nav atual usa links soltos com apenas um change de `color` no estado ativo. Sem container visual, sem separação, é o tratamento mais genérico possível.

**Proposta:** Agrupar os links dentro de um container com borda sólida e `overflow: hidden`, onde o item ativo tem `background` sólido — criando um efeito de "tablette" ou seletor segmentado.

```css
/* Adicionar ao .nav-list */
.nav-list {
  border: 1px solid rgba(99, 102, 241, 0.2);
  border-radius: 10px;
  overflow: hidden;
  display: flex;
  padding: 0;
}

.nav-link {
  padding: 0.5rem 1.1rem;
  border-right: 1px solid rgba(99, 102, 241, 0.15);
  color: #9ca3af;
  transition: all 0.2s;
}

.nav-link:last-child {
  border-right: none;
}

.nav-link.active {
  background: #6366f1; /* ou a cor primária escolhida */
  color: #ffffff;
}

.nav-link:hover:not(.active) {
  background: rgba(99, 102, 241, 0.1);
  color: #c7d2fe;
}
```

**Impacto estimado:** alto — é o primeiro elemento que o visitante vê e usa.

---

### 2. Cores: substituir gradiente genérico por paleta sólida

**Problema:** `linear-gradient(135deg, #6366f1 0%, #a855f7 50%, #ec4899 100%)` é a paleta mais usada em portfólios dark. Aparece no botão primário, no gradient-text do H1 e nas glow balls.

**Proposta:** Escolher **2 cores sólidas** com personalidade e aplicá-las com intenção.

#### Opção A — Azul elétrico + Âmbar (tech com energia)

```css
:root {
  --bg-color: #0d0f17;
  --surface: #11131d;
  --accent-primary: #2563eb;   /* azul elétrico */
  --accent-secondary: #f59e0b; /* âmbar — apenas para 1–2 elementos */
  --text-primary: #f0f1f5;
  --text-secondary: #6b7280;
  --card-border: rgba(255, 255, 255, 0.07);
}
```

#### Opção B — Verde neon + cinza profundo (terminal/dev)

```css
:root {
  --bg-color: #080c0a;
  --surface: #1e2a22;
  --accent-primary: #00e676;   /* verde neon */
  --accent-secondary: #b9f0c8; /* verde claro para texto */
  --text-primary: #e8f5e9;
  --text-secondary: #6b8f72;
  --card-border: rgba(0, 230, 118, 0.1);
}
```

**Regra:** a segunda cor deve aparecer em no máximo 2 elementos da página (ex: badge "disponível" + ícone ativo do nav). Toda a rest usa a cor primária.

---

## 🟡 Alta

### 3. Glassmorphism: reduzir aplicação — usar apenas onde importa

**Problema:** Todos os cards usam `.glass-card` com `backdrop-filter: blur(20px)`. Quando o efeito está em todo lugar, deixa de chamar atenção e se torna o visual padrão.

**Proposta:** Reservar glass apenas para o card da hero section. Todos os outros cards usam superfície sólida.

```css
/* Card padrão — sólido */
.card {
  background: #11131d;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: 14px;
  padding: 2rem;
}

/* Glass apenas no card hero */
.hero .main-card {
  background: rgba(22, 26, 42, 0.55);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(99, 102, 241, 0.2);
}

/* Hover nos cards de projeto: borda colorida, não blur */
.project-card:hover {
  border-color: var(--accent-primary);
  transform: translateY(-3px);
}
```

---

### 4. Hero: substituir gradient-text por tipografia sólida de impacto

**Problema:** `gradient-text` com clip é o tratamento mais clonado do design dark. Lê como template.

**Proposta:** Tipografia sólida grande com uma única palavra em cor sólida — sem gradiente.

```css
.hero-title {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4.2rem);
  font-weight: 800;
  line-height: 1.08;
  letter-spacing: -0.03em;
  color: #f0f1f5;
}

/* Uma única palavra, cor sólida */
.hero-title .accent-word {
  color: var(--accent-primary);
  /* sem background-clip, sem gradiente */
}
```

```html
<!-- No HTML, trocar: -->
<span class="gradient-text">extraordinárias</span>
<!-- Por: -->
<span class="accent-word">extraordinárias</span>
```

---

## 🔵 Média

### 5. Skills: grid de ícones grandes com hover por cor de tecnologia

**Problema:** Pills com ícone+texto (`.skill-pill`) são o padrão universal de skills em portfólios.

**Proposta:** Grid de ícones com a cor oficial de cada tecnologia no hover — HTML (laranja), CSS (azul), JS (amarelo), React (ciano), Node (verde).

```css
.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  gap: 1rem;
}

.skill-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 0.5rem;
  border-radius: 12px;
  border: 1px solid transparent;
  cursor: default;
  transition: all 0.2s;
  background: #11131d;
}

.skill-item i {
  font-size: 2rem;
}

.skill-item span {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Hover com cor oficial por tecnologia */
.skill-html5:hover  { border-color: rgba(228,77,38,0.4);  background: rgba(228,77,38,0.08);  }
.skill-css3:hover   { border-color: rgba(38,77,228,0.4);   background: rgba(38,77,228,0.08);  }
.skill-js:hover     { border-color: rgba(240,219,79,0.4);  background: rgba(240,219,79,0.08); }
.skill-react:hover  { border-color: rgba(97,218,251,0.4);  background: rgba(97,218,251,0.08); }
.skill-node:hover   { border-color: rgba(104,160,99,0.4);  background: rgba(104,160,99,0.08); }
```

---

### 6. Projetos: borda lateral sólida + número fantasma de fundo

**Problema:** Cards de projeto são glass genérico sem identidade visual própria.

**Proposta:** Fundo sólido escuro + borda esquerda colorida + número grande transparente como elemento de fundo.

```css
.project-card {
  background: #11131d;
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-left: 3px solid var(--accent-primary);
  border-radius: 0 14px 14px 0;
  position: relative;
  overflow: hidden;
  padding: 2rem;
}

/* Número fantasma de fundo */
.project-card::before {
  content: attr(data-num);
  position: absolute;
  right: 1.2rem;
  top: 0.5rem;
  font-family: 'Outfit', sans-serif;
  font-size: 6rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.025);
  line-height: 1;
  pointer-events: none;
  user-select: none;
}

/* Borda varia por tipo de projeto */
.project-card[data-type="web"]      { border-left-color: #2563eb; }
.project-card[data-type="frontend"] { border-left-color: #f59e0b; }
```

```html
<!-- Adicionar data-num e data-type no HTML -->
<div class="project-card" data-num="01" data-type="web">
```

---

## 🟢 Baixa

### 7. Cursor personalizado com dot seguidor

**Problema:** Nenhum detalhe interativo que diferencie a experiência de navegação.

**Proposta:** Adicionar um círculo pequeno que segue o cursor com leve delay — detalhe que distingue portfólios de devs criativos.

```javascript
// Adicionar ao final do DOMContentLoaded em script.js
// Só ativa em dispositivos com mouse
if (window.matchMedia('(pointer: fine)').matches) {
  const dot = document.createElement('div');
  Object.assign(dot.style, {
    width: '10px',
    height: '10px',
    background: 'var(--accent-primary, #2563eb)',
    borderRadius: '50%',
    position: 'fixed',
    pointerEvents: 'none',
    zIndex: '9999',
    transform: 'translate(-50%, -50%)',
    transition: 'width 0.2s, height 0.2s, opacity 0.2s',
    opacity: '0.8',
  });
  document.body.appendChild(dot);
  document.body.style.cursor = 'none';

  let mx = 0, my = 0, dx = 0, dy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX;
    my = e.clientY;
  });

  // Links e botões restauram o cursor padrão visualmente
  document.querySelectorAll('a, button').forEach(el => {
    el.addEventListener('mouseenter', () => {
      dot.style.width = '28px';
      dot.style.height = '28px';
      dot.style.opacity = '0.4';
    });
    el.addEventListener('mouseleave', () => {
      dot.style.width = '10px';
      dot.style.height = '10px';
      dot.style.opacity = '0.8';
    });
  });

  (function loop() {
    dx += (mx - dx) * 0.18;
    dy += (my - dy) * 0.18;
    dot.style.left = dx + 'px';
    dot.style.top = dy + 'px';
    requestAnimationFrame(loop);
  })();
}
```

---

## Ordem de Implementação Recomendada

1. **Paleta de cores** — define tudo que vem depois
2. **Menu segmentado** — primeira impressão
3. **Glassmorphism seletivo** — simplifica o CSS
4. **Hero tipografia** — impacto imediato
5. **Skills grid** — seção específica
6. **Cards de projeto** — seção específica
7. **Cursor** — detalhe final

---

## O que NÃO mudar

- ✅ Fontes: **Outfit** e **Inter** funcionam bem juntas — manter
- ✅ Estrutura HTML: sections, IDs, semântica — está correta
- ✅ Responsividade: breakpoints e grid responsivo — está sólido
- ✅ Scroll reveal logic: o JS de animação por scroll — funciona bem
- ✅ Badge "Disponível para novos projetos" — elemento de personalidade, manter

---

*Análise gerada com base no código-fonte do repositório `gabrieltrabalhos478-art/portifolio`*
