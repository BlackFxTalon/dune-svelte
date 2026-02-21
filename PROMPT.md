# Промпт для разработки: Dune Imperium — фан-сайт настольной игры

## Обзор проекта

Создать фан-сайт настольной игры "Дюна: Империя" (Dune Imperium). Референс: https://dune-imperium.ru/. Проект с нуля.

## Технологический стек

- **Framework**: Svelte 5+ с TypeScript (strict mode)
- **Meta-Framework**: SvelteKit 2+
- **State Management**: Svelte 5 Runes (`$state`, `$derived`, `$effect`) + Stores (`writable`, `readable`, `derived`)
- **Routing**: SvelteKit File-based Routing
- **Styling**: SCSS Modules + Global SCSS
- **HTTP**: Native Fetch API + моковые данные через JSON-файлы
- **Анимации**: Svelte Transitions + Native CSS Animations (@keyframes)
- **Линтинг**: ESLint
- **Package Manager**: npm

---

## Структура проекта

```
dune-svelte/
├── static/
│   ├── favicon.svg
│   ├── robots.txt
│   ├── sitemap.xml
│   └── images/
│       ├── cards/
│       ├── leaders/
│       ├── sets/
│       ├── factions/
│       └── backgrounds/
├── src/
│   ├── lib/
│   │   ├── components/          # Переиспользуемые компоненты
│   │   │   ├── Header/
│   │   │   │   ├── Header.svelte
│   │   │   │   └── Header.scss
│   │   │   ├── Footer/
│   │   │   ├── Card/
│   │   │   ├── FilterPanel/
│   │   │   ├── SearchInput/
│   │   │   ├── Loader/
│   │   │   ├── SEO/
│   │   │   ├── LazyImage/
│   │   │   └── index.ts         # Barrel exports
│   │   ├── stores/              # Svelte stores
│   │   │   ├── cards.ts
│   │   │   ├── leaders.ts
│   │   │   ├── sets.ts
│   │   │   ├── rating.ts
│   │   │   ├── factions.ts
│   │   │   ├── news.ts
│   │   │   └── ui.ts
│   │   ├── types/               # TypeScript интерфейсы
│   │   │   ├── card.ts
│   │   │   ├── leader.ts
│   │   │   ├── set.ts
│   │   │   ├── faction.ts
│   │   │   ├── player.ts
│   │   │   └── article.ts
│   │   ├── utils/
│   │   │   ├── constants.ts
│   │   │   ├── helpers.ts
│   │   │   └── scroll-reveal.ts
│   │   └── index.ts
│   ├── routes/                  # SvelteKit роутинг
│   │   ├── +layout.svelte       # Layout для всех страниц
│   │   ├── +page.svelte         # Главная страница
│   │   ├── +page.scss
│   │   ├── cards/
│   │   │   ├── +page.svelte     # Каталог карт
│   │   │   └── +page.scss
│   │   ├── leaders/
│   │   │   ├── +page.svelte
│   │   │   └── +page.scss
│   │   ├── sets/
│   │   │   ├── +page.svelte
│   │   │   └── +page.scss
│   │   ├── rating/
│   │   │   ├── +page.svelte
│   │   │   └── +page.scss
│   │   ├── factions/
│   │   │   ├── +page.svelte
│   │   │   └── +page.scss
│   │   ├── faq/
│   │   │   ├── +page.svelte
│   │   │   └── +page.scss
│   │   ├── news/
│   │   │   ├── +page.svelte
│   │   │   └── +page.scss
│   │   ├── news/
│   │   │   └── [slug]/
│   │   │       ├── +page.svelte # Страница статьи
│   │   │       └── +page.scss
│   │   └── +error.svelte        # 404 страница
│   ├── data/                    # Mock JSON данные
│   │   ├── cards.json
│   │   ├── leaders.json
│   │   ├── sets.json
│   │   ├── factions.json
│   │   ├── players.json
│   │   └── articles.json
│   ├── styles/
│   │   ├── _variables.scss      # Цвета, шрифты, breakpoints
│   │   ├── _mixins.scss         # SCSS миксины
│   │   ├── _animations.scss     # Общие @keyframes
│   │   ├── _reset.scss          # CSS reset
│   │   └── global.scss          # Глобальные стили
│   ├── app.html                 # HTML шаблон
│   ├── app.d.ts                 # TypeScript declarations
│   └── hooks.server.ts          # Server hooks (опционально)
├── eslint.config.js
├── svelte.config.js
├── tsconfig.json
├── vite.config.ts
└── package.json
```

---

## Дизайн-система и визуальный стиль

### Цветовая палитра

Тёмная пустынная тематика, вдохновлённая вселенной Дюны:

```scss
// Основные цвета
$color-primary: #f4cf8b;           // Золотистый (акцент, бордеры, заголовки)
$color-primary-dark: #c9a458;      // Тёмное золото
$color-primary-light: #ffe4b5;     // Светлое золото

// Фоны
$color-bg-primary: #1a1206;        // Основной тёмный фон
$color-bg-secondary: #332306;      // Вторичный фон (карточки)
$color-bg-tertiary: #2a1d0a;       // Третичный (хедер, футер)
$color-bg-card: #332306;           // Фон карточек

// Текст
$color-text-primary: #e8dcc8;      // Основной текст
$color-text-secondary: #a89878;    // Вторичный текст
$color-text-accent: #f4cf8b;       // Акцентный текст

// Дополнительные
$color-border: rgba(244, 207, 139, 0.3);
$color-shadow: rgba(244, 207, 139, 0.15);
$color-overlay: rgba(0, 0, 0, 0.7);

// Цвета фракций
$color-emperor: #c41e3a;           // Император — красный
$color-spacing-guild: #4a90d9;     // Гильдия Космогации — синий
$color-bene-gesserit: #7b5ea7;     // Бене Гессерит — фиолетовый
$color-fremen: #d4a847;            // Фримены — песочный
```

### Типографика

```scss
// Шрифты
$font-heading: 'Cinzel', serif;         // Заголовки — элегантный serif
$font-body: 'Inter', sans-serif;        // Основной текст
$font-accent: 'Cinzel Decorative', serif; // Логотип, спецэлементы

// Размеры (mobile-first)
$font-size-xs: 0.75rem;     // 12px
$font-size-sm: 0.875rem;    // 14px
$font-size-base: 1rem;      // 16px
$font-size-md: 1.125rem;    // 18px
$font-size-lg: 1.5rem;      // 24px
$font-size-xl: 2rem;        // 32px
$font-size-2xl: 2.5rem;     // 40px
$font-size-3xl: 3rem;       // 48px
```

### Breakpoints (Mobile-First)

```scss
$breakpoint-sm: 576px;
$breakpoint-md: 768px;
$breakpoint-lg: 992px;
$breakpoint-xl: 1200px;
$breakpoint-xxl: 1400px;
```

### Spacing

```scss
$spacing-xs: 0.25rem;   // 4px
$spacing-sm: 0.5rem;    // 8px
$spacing-md: 1rem;      // 16px
$spacing-lg: 1.5rem;    // 24px
$spacing-xl: 2rem;      // 32px
$spacing-2xl: 3rem;     // 48px
$spacing-3xl: 4rem;     // 64px
```

---

## Инструкции по использованию frontend-design skill

При создании проекта используй принципы из frontend-design skill (https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md):
- Современный, чистый дизайн
- Согласованность визуальных элементов
- Внимание к деталям (spacing, typography, colors)
- Mobile-first подход
- Анимации для улучшения UX
- Accessibility best practices

---

## Описание страниц

### 1. Главная страница (HomePage)

**Hero-секция:**
- Полноэкранный баннер с фоновым изображением пустыни Арракиса
- Заголовок "Дюна: Империя" шрифтом Cinzel, с золотистым свечением (text-shadow)
- Подзаголовок "Фан-сайт настольной игры Dune Imperium"
- CTA-кнопка "Смотреть карты" → ведёт на `/cards`
- Parallax-эффект при скролле (CSS `transform: translateZ()` + `perspective`)

**Секция "Последние новости":**
- Горизонтальная прокрутка карточек (3-4 карточки, на мобильном — 1)
- Каждая карточка: изображение, дата, заголовок, краткий текст
- Hover-эффект: лёгкий подъём + золотая тень (CSS transition)
- Ссылка "Все новости" → `/news`

**Секция "Популярные карты":**
- Сетка 4 карты (на мобильном — 2 колонки)
- Клик → модальное окно с увеличенным изображением
- Анимация появления при скролле (Svelte `fade` + `fly` transitions)

**Секция "О проекте":**
- Краткое описание сообщества
- Ссылки на Telegram-канал и Boosty
- Иконки социальных сетей

### 2. Каталог карт (CardsPage) — ключевая страница

**Панель фильтров (FilterPanel):**
- **По сетам**: кнопки-теги (Дюна Империя, Расцвет Иксианцев, Бессмертие, Восстание, Кровные узы, фанатские сеты)
- **По фракциям**: кнопки с иконками (Император, Гильдия Космогации, Бене Гессерит, Фримены)
- **По ячейкам**: Ландсраад, Населённый пункт, Пустыня, Шпион, Другое
- **По свойствам**: чекбоксы (Бонус при покупке, Баласт, Сращивание, Тлейлаксу, Приказ, Командная, КООАМ)
- **Сортировка**: по названию (A-Z / Z-A), по стоимости (возрастание / убывание)
- **Кнопка "Сбросить фильтры"**
- На мобильных: панель фильтров сворачивается в выдвижную боковую панель

**Сетка карт:**
- CSS Grid: 5 колонок (desktop), 3 (tablet), 2 (mobile)
- Размер карточки: ~216x300px
- Hover: scale(1.05) + золотая рамка (CSS transition)
- Клик: модальное окно (lightbox) с полноразмерным изображением
- Анимация при фильтрации: Svelte `animate:flip` из `svelte/animate`

**Store CardsStore:**
```typescript
// src/lib/stores/cards.ts
import { writable, derived } from 'svelte/store';

export interface ICard {
  id: number;
  name: string;
  nameEn: string;
  cost: number;
  set: SetType;
  faction: FactionType | null;
  cell: CellType;
  properties: PropertyType[];
  imageUrl: string;
  isOfficial: boolean;
}

interface FilterState {
  selectedSets: SetType[];
  selectedFactions: FactionType[];
  selectedCells: CellType[];
  selectedProperties: PropertyType[];
  sortField: 'name' | 'cost';
  sortDirection: 'asc' | 'desc';
  searchQuery: string;
}

function createCardsStore() {
  const cards = writable<ICard[]>([]);
  const filters = writable<FilterState>({
    selectedSets: [],
    selectedFactions: [],
    selectedCells: [],
    selectedProperties: [],
    sortField: 'name',
    sortDirection: 'asc',
    searchQuery: ''
  });

  const filteredCards = derived([cards, filters], ([$cards, $filters]) => {
    // Логика фильтрации и сортировки
    let result = [...$cards];
    
    // Фильтрация
    if ($filters.selectedSets.length) {
      result = result.filter(c => $filters.selectedSets.includes(c.set));
    }
    // ... остальные фильтры
    
    // Поиск
    if ($filters.searchQuery) {
      const query = $filters.searchQuery.toLowerCase();
      result = result.filter(c => 
        c.name.toLowerCase().includes(query) ||
        c.nameEn.toLowerCase().includes(query)
      );
    }
    
    // Сортировка
    result.sort((a, b) => {
      const dir = $filters.sortDirection === 'asc' ? 1 : -1;
      if ($filters.sortField === 'name') {
        return dir * a.name.localeCompare(b.name, 'ru');
      }
      return dir * (a.cost - b.cost);
    });
    
    return result;
  });

  return {
    cards,
    filters,
    filteredCards,
    setFilter: (type: keyof FilterState, value: any) => { /* ... */ },
    resetFilters: () => { /* ... */ },
    setSorting: (field: 'name' | 'cost', direction: 'asc' | 'desc') => { /* ... */ },
    loadCards: async () => { /* загрузка данных */ }
  };
}

export const cardsStore = createCardsStore();
```

### 3. Лидеры (LeadersPage)

- Сетка карточек персонажей (3 колонки desktop, 2 tablet, 1 mobile)
- Каждая карточка: изображение лидера, имя, фракция, краткое описание способностей
- Фильтр по фракциям
- Клик → модальное окно или отдельная страница с подробным описанием
- Анимация появления карточек при скролле (stagger-эффект через CSS `animation-delay`)

**Модель:**
```typescript
// src/lib/types/leader.ts
export interface ILeader {
  id: number;
  name: string;
  nameEn: string;
  faction: FactionType;
  ability: string;
  sigilAbility: string;
  set: SetType;
  imageUrl: string;
  description: string;
}
```

### 4. Сеты/Дополнения (SetsPage)

**Верхняя панель:** мини-обложки всех сетов (~105x153px), горизонтальная прокрутка на мобильных. Hover: scale(1.1).

**Основной контент (при выборе сета):**
- Левая часть (30%): крупное изображение лидера/обложки сета
- Правая часть (70%): сетка карт, входящих в сет
- Анимация "разлёта" карт при переключении между сетами (CSS @keyframes cardSpread)

**Модель:**
```typescript
// src/lib/types/set.ts
export interface ISet {
  id: number;
  name: string;
  nameEn: string;
  description: string;
  releaseYear: number;
  cardCount: number;
  coverImageUrl: string;
  leaderImageUrl: string;
  cards: ICard[];
  isOfficial: boolean;
}
```

### 5. Рейтинг игроков (RatingPage)

**Вкладки:** "Империя" | "Восстание" (переключаемые табы, компонент из `src/lib/components`)

**Таблица рейтинга:**
- Колонки: Место (#), Никнейм, Кол-во игр, 1 место, 2 место, 3 место, 4 место, Винрейт (%), Коэффициент
- Сортировка по каждой колонке (клик на заголовок)
- Hover на строке: подсветка золотым
- Топ-3 игрока выделены визуально (золото, серебро, бронза — иконки медалей)
- Пагинация или infinite scroll
- Адаптив: на мобильном — горизонтальный скролл таблицы или карточный вид

**Секция "Общая статистика":**
- Суммарное число игр, среднее количество игроков, средний винрейт

**Модель:**
```typescript
// src/lib/types/player.ts
export interface IPlayer {
  id: number;
  nickname: string;
  gamesPlayed: number;
  places: { first: number; second: number; third: number; fourth: number };
  winRate: number;
  efficiency: number;
  mode: 'imperium' | 'uprising';
}
```

### 6. Фракции/Дома (FactionsPage)

- 4 основные фракции: Император, Гильдия Космогации, Бене Гессерит, Фримены
- Каждая фракция — крупная карточка с уникальным цветом фракции
- Содержание: иконка, название, описание, связанные лидеры, связанные карты
- Hover-анимация: карточка "раскрывается" показывая детали (CSS transition)
- Клик → подробная страница фракции или раскрытие на месте (accordion-стиль)

**Модель:**
```typescript
// src/lib/types/faction.ts
export interface IFaction {
  id: number;
  name: string;
  nameEn: string;
  color: string;
  iconUrl: string;
  description: string;
  leaders: ILeader[];
  relatedCards: ICard[];
}
```

### 7. FAQ (FAQPage)

- Поле поиска сверху (фильтрация по тексту вопросов и ответов, debounce 300ms)
- Список вопросов-ответов в формате аккордеона (клик раскрывает ответ с Svelte transition)
- Секция "Эррата" — исправления правил, визуально отделена
- Подсветка найденных слов при поиске

**Модель:**
```typescript
// src/lib/types/article.ts
export interface IFaqItem {
  id: number;
  question: string;
  answer: string;
  category: 'rules' | 'errata' | 'general';
}
```

### 8. Новости (NewsPage)

- Сетка карточек новостей (2 колонки desktop, 1 mobile)
- Каждая: изображение, дата, заголовок, превью текста
- Пагинация
- Фильтр по категориям (новости / статьи)

### 9. Страница статьи (ArticlePage)

- Полноширинное изображение-баннер
- Заголовок, дата, автор
- Контент (поддержка Markdown или rich HTML)
- Блок "Похожие статьи" внизу
- Динамический роут: `/news/[slug]`

### 10. 404 (NotFoundPage)

- Тематическая иллюстрация (песчаный червь в пустыне)
- Текст: "Эта территория ещё не исследована..."
- Кнопка "Вернуться на главную"
- Файл: `src/routes/+error.svelte`

---

## Header (общий)

- Фиксированный сверху (sticky), с полупрозрачным фоном при скролле
- Логотип слева → ссылка на главную
- Навигация: Карты | Лидеры | Сеты | Фракции | Рейтинг | Новости | FAQ
- На мобильных: бургер-меню → выдвижная панель справа (CSS transition)
- Активный пункт меню подчёркнут золотым
- Анимация при скролле: хедер становится компактнее (CSS transition через класс `.scrolled`)
- Компонент: `src/lib/components/Header/Header.svelte`

## Footer (общий)

- Логотип + короткое описание проекта
- Навигационные ссылки (дублирование основных разделов)
- Социальные иконки: Telegram, Boosty, VK
- Копирайт: (c) 2025 Dune Imperium Fan Project
- Дисклеймер: "Фан-проект. Не аффилирован с Dire Wolf Digital."
- Компонент: `src/lib/components/Footer/Footer.svelte`

---

## Анимации

### Svelte Transitions (встроенные)

Использовать встроенные переходы из `svelte/transition`:
- `fade` — для плавного появления/исчезновения
- `fly` — для выезжающих элементов
- `slide` — для аккордеонов и выдвижных панелей
- `scale` — для модальных окон
- `draw` — для SVG-анимаций

```svelte
<script>
  import { fade, fly } from 'svelte/transition';
</script>

{#if visible}
  <div transition:fade={{ duration: 300 }}>
    Контент
  </div>
{/if}

<div in:fly={{ y: 20, duration: 500 }}>
  Карточка
</div>
```

### Svelte Animate (flip-анимации)

Для анимации списков (фильтрация карт, сортировка):

```svelte
<script>
  import { flip } from 'svelte/animate';
</script>

{#each filteredCards as card (card.id)}
  <div animate:flip={{ duration: 300 }} class="card">
    {card.name}
  </div>
{/each}
```

### Общие @keyframes (файл `_animations.scss`)

```scss
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeInScale {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

@keyframes slideInRight {
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
}

@keyframes cardSpread {
  from {
    opacity: 0;
    transform: scale(0.8) translateY(-20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}
```

### Scroll-reveal утилита

```typescript
// src/lib/utils/scroll-reveal.ts
import { onMount } from 'svelte';

export function useScrollReveal(
  node: HTMLElement,
  options: IntersectionObserverInit = { threshold: 0.1 }
) {
  let isVisible = false;

  const observer = new IntersectionObserver(([entry]) => {
    if (entry.isIntersecting) {
      isVisible = true;
      node.classList.add('visible');
      observer.disconnect();
    }
  }, options);

  onMount(() => {
    observer.observe(node);
    return () => observer.disconnect();
  });
}
```

Использование в компоненте:

```svelte
<div use:useScrollReveal class="reveal-element">
  Контент
</div>

<style>
  .reveal-element {
    opacity: 0;
    transform: translateY(20px);
    transition: opacity 0.6s ease, transform 0.6s ease;
    
    &.visible {
      opacity: 1;
      transform: translateY(0);
    }
  }
</style>
```

### Принцип `prefers-reduced-motion`

```scss
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## SEO

SvelteKit предоставляет встроенные возможности для SEO:

```svelte
<!-- src/routes/cards/+page.svelte -->
<script lang="ts">
  import { page } from '$app/stores';
  import { browser } from '$app/environment';
</script>

<svelte:head>
  <title>Каталог карт — Dune Imperium</title>
  <meta name="description" content="Полный каталог карт настольной игры Дюна: Империя с фильтрацией по сетам, фракциям и типам" />
  <meta property="og:title" content="Каталог карт — Dune Imperium" />
  <meta property="og:description" content="Полный каталог карт настольной игры Дюна: Империя" />
  <meta property="og:image" content="/images/og/cards.jpg" />
  <meta property="og:url" content="{$page.url.origin}/cards" />
  <link rel="canonical" href="{$page.url.origin}/cards" />
</svelte:head>

<!-- Контент страницы -->
```

- Каждая страница имеет уникальные title, description, OG tags через `<svelte:head>`
- `robots.txt` и `sitemap.xml` в `static/`
- Structured data (JSON-LD) для FAQ-страницы
- SvelteKit автоматически генерирует правильные meta-теги для SSR

---

## Accessibility (WCAG AA)

- Семантические теги: `<header>`, `<nav>`, `<main>`, `<article>`, `<section>`, `<aside>`, `<footer>`
- `aria-label` на всех интерактивных элементах (кнопки фильтров, навигация, модалки)
- `aria-expanded` на аккордеонах FAQ и бургер-меню
- `role="dialog"` и `aria-modal="true"` на модальных окнах
- Все `<img>` с информативным `alt`
- Keyboard navigation: Tab/Shift+Tab по всем интерактивным элементам
- Focus trap в модальных окнах (использовать `svelte:action`)
- Escape закрывает модалки и выдвижные панели (обработчик `onkeydown`)
- Контрастность: `#e8dcc8` на `#1a1206` = ratio ~12:1 (AAA)
- Focus-visible стили: золотой outline (`outline: 2px solid $color-primary`)
- Skip-to-content ссылка
- `prefers-reduced-motion` — отключение анимаций

---

## Performance

- **Code splitting**: SvelteKit автоматически разделяет код по роутам
- **Lazy loading**: Ленивая загрузка изображений через `loading="lazy"`
- **SSR/SSG**: SvelteKit поддерживает SSR и статическую генерацию
- **Виртуализация списков**: Для больших списков использовать `@tanstack/virtual-svelte`
- **Debounce**: На поиск и фильтрацию (300ms)
- **Мемоизация**: `$derived` для вычисляемых значений
- **Оптимизация изображений**: WebP с fallback, srcset для retina
- **Минификация**: Vite production build
- **Tree-shaking**: Svelte автоматически удаляет неиспользуемый код
- **Preload**: Критических ресурсов через `<link rel="preload">`
- **Нативные CSS-анимации + Svelte Transitions**: GPU-ускорение через `transform` и `opacity`

Target метрики: FCP < 1.5s, TTI < 3.5s, CLS < 0.1

---

## Svelte Stores архитектура

### Stores для данных

```typescript
// src/lib/stores/cards.ts
import { writable, derived } from 'svelte/store';
import type { ICard } from '$lib/types/card';

function createCardsStore() {
  const cards = writable<ICard[]>([]);
  const filters = writable<FilterState>({ /* ... */ });
  
  const filteredCards = derived([cards, filters], ([$cards, $filters]) => {
    // Вычисляемое значение
  });

  return {
    cards,
    filters,
    filteredCards,
    setFilter: (type: string, value: any) => { /* action */ },
    resetFilters: () => { /* action */ },
    setSorting: (field: string, direction: string) => { /* action */ },
    loadCards: async () => { /* загрузка */ }
  };
}

export const cardsStore = createCardsStore();
```

### Использование в компонентах

```svelte
<script lang="ts">
  import { cardsStore } from '$lib/stores/cards';
  
  // Подписка на store
  $: filteredCards = $cardsStore.filteredCards;
  $: filters = $cardsStore.filters;
  
  function handleFilterChange(type: string, value: any) {
    cardsStore.setFilter(type, value);
  }
</script>

{#each filteredCards as card (card.id)}
  <Card {card} />
{/each}
```

---

## Моковые данные

Подготовить JSON-файлы в `src/data/` со следующим минимальным объёмом:
- `cards.json` — 30-40 карт с разными сетами, фракциями, стоимостью
- `leaders.json` — 10-12 лидеров
- `sets.json` — 6-8 сетов (5 официальных + 2-3 фанатских)
- `factions.json` — 4 основные фракции
- `players.json` — 20-30 игроков с рейтингом
- `articles.json` — 5-6 новостей/статей

Использовать плейсхолдеры изображений (https://placehold.co/ с тематическими размерами) или SVG-заглушки.

---

## Порядок реализации (рекомендуемый)

### Этап 0. Подготовка и инфраструктура
1. Инициализация проекта: `npm create svelte@latest` (SvelteKit + TypeScript).
2. Установка зависимостей: `sass`, `@tanstack/virtual-svelte` (опционально), утилиты для classnames и формата дат.
3. Базовая настройка качества: ESLint, `tsconfig` alias (`$lib/`), единый стиль импортов.
4. Подготовка структуры директорий из раздела «Структура проекта».
5. Проверка, что `npm run dev` и `npm run build` успешно выполняются.

### Этап 1. Дизайн-система и foundation UI
6. Реализация SCSS токенов: цвета, типографика, spacing, breakpoints.
7. Подключение шрифтов и глобальных стилей (`_reset.scss`, `_base.scss`, `_typography.scss`).
8. Создание `_animations.scss` + базовые utility-классы для появления элементов.
9. Реализация UI-kit атомов: `Button`, `Badge`, `Tag`, `Input`, `Select`, `Tabs`, `Card`.
10. Подготовка единого контейнера (`.container`) и сетки секций для всех страниц.

### Этап 2. Архитектура состояния и моковые данные
11. Создание всех JSON в `src/data/` и TypeScript-интерфейсов для каждой сущности.
12. Реализация stores: cards, leaders, sets, rating, factions, news, ui.
13. Для `cardsStore` реализовать полный pipeline: фильтрация -> поиск -> сортировка -> итоговый список.
14. Добавить синхронизацию фильтров каталога с query params URL (через `$page.url.searchParams`).
15. Добавить метод `resetFilters()` и покрыть бизнес-логику карточек unit-тестами.

### Этап 3. Каркас приложения и маршрутизация
16. Реализация `+layout.svelte` с общими `Header` и `Footer`.
17. Создание роутов для всех страниц через файловую структуру `src/routes/`.
18. Добавление `+error.svelte` для 404 страницы.
19. Реализация навигационных паттернов (активные ссылки, хлебные крошки).

### Этап 4. Реализация страниц (по приоритету)
20. `HomePage`: hero, блоки «о проекте», быстрые переходы, превью разделов.
21. `CardsPage` (ключевая): панель фильтров, поиск, сортировка, карточки, empty-state, reset.
22. `LeadersPage`: сетка лидеров, фильтры/группировки по фракциям.
23. `SetsPage`: карточки сетов + анимация переключения/раскрытия деталей.
24. `RatingPage`: таблица игроков, вкладки сезонов/режимов, сортировка.
25. `FactionsPage`: карточки домов с сильными/слабыми сторонами и стратегиями.
26. `FAQPage`: аккордеон + клиентский поиск по вопросам.
27. `NewsPage` + `News/[slug]Page`: список статей, роут по slug, блок «похожие статьи».
28. `+error.svelte`: понятный fallback + CTA для возврата в каталог или на главную.

### Этап 5. Анимации, доступность, SEO, производительность
29. Подключить `useScrollReveal` для секций/карточек с единым API.
30. Реализовать `prefers-reduced-motion` и отключение интенсивных анимаций.
31. Добавить SEO через `<svelte:head>` для всех страниц: title, description, OG, canonical.
32. Добавить `robots.txt`, `sitemap.xml`, FAQ `JSON-LD`.
33. Провести accessibility-аудит: aria-атрибуты, keyboard nav, фокус, контраст, skip-link.
34. Провести performance-аудит: Lighthouse, оптимизация изображений, мемоизация через `$derived`.

### Этап 6. Финализация и релиз
35. Сборка: `npm run build` — проверить отсутствие ошибок.
36. Preview: `npm run preview` — проверить работу в production-режиме.
37. Финальное тестирование на разных устройствах и браузерах.

### Критерии готовности (Definition of Done)

- [ ] Все 10 страниц реализованы и работают
- [ ] Фильтрация и сортировка карт работают корректно
- [ ] Мобильная адаптация для всех страниц
- [ ] Анимации работают плавно (60fps)
- [ ] Accessibility: все элементы доступны с клавиатуры, aria-атрибуты на месте
- [ ] SEO: title, description, OG tags на каждой странице
- [ ] Performance: Lighthouse score > 90 для Performance, Accessibility, Best Practices, SEO
- [ ] Код чистый, без ESLint ошибок
- [ ] TypeScript: нет ошибок типов, strict mode включён
- [ ] Документация: README с инструкциями по запуску
