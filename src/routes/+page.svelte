<script lang="ts">
	import { Badge, Button } from '$lib/components';
	import type { Article } from '$lib/types/article';
	import type { Card } from '$lib/types/card';
	import { useScrollReveal } from '$lib/utils';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	import articlesData from '../data/articles.json';
	import cardsData from '../data/cards.json';

	interface QuickLink {
		href: '/cards' | '/leaders' | '/sets' | '/rating' | '/factions' | '/faq' | '/news';
		title: string;
		description: string;
	}

	const dateFormatter = new Intl.DateTimeFormat('ru-RU', {
		day: '2-digit',
		month: 'long',
		year: 'numeric'
	});

	const latestArticles = [...(articlesData as Article[])]
		.sort((left, right) => right.publishedAt.localeCompare(left.publishedAt))
		.slice(0, 3);

	const popularCards = [...(cardsData as Card[])]
		.sort((left, right) => right.cost - left.cost || left.name.localeCompare(right.name))
		.slice(0, 4);

	const quickLinks: QuickLink[] = [
		{
			href: '/cards',
			title: 'Каталог карт',
			description: 'Фильтры по сетам, фракциям, свойствам и цене.'
		},
		{
			href: '/leaders',
			title: 'Лидеры',
			description: 'Подборка лидеров по стилю игры и фракции.'
		},
		{
			href: '/sets',
			title: 'Сеты',
			description: 'Официальные и фанатские наборы с деталями.'
		},
		{
			href: '/rating',
			title: 'Рейтинг',
			description: 'Текущая таблица игроков и сезонов.'
		},
		{
			href: '/factions',
			title: 'Фракции',
			description: 'Сильные стороны домов и рекомендации.'
		},
		{
			href: '/faq',
			title: 'FAQ',
			description: 'Ответы на типовые вопросы новичков и турниров.'
		},
		{
			href: '/news',
			title: 'Новости',
			description: 'Патч-заметки, анонсы событий и мета-обзоры.'
		}
	];

	const projectHighlights = [
		'Карты, лидеры, сеты и фракции в одном каталоге.',
		'Материалы сообщества: обзоры меты, гайды и новости.',
		'Поддержка мобильных устройств и быстрый доступ к ключевым разделам.'
	];

	function formatDate(value: string): string {
		return dateFormatter.format(new Date(value));
	}
</script>

<svelte:head>
	<title>Дюна: Империя | Фан-сайт сообщества</title>
	<meta
		name="description"
		content="Фан-сайт Dune Imperium: каталог карт, новости, лидеры, фракции и материалы сообщества."
	/>
</svelte:head>

<main class="page-main home-page">
	<section class="home-hero u-reveal" use:useScrollReveal>
		<div class="container home-hero__inner">
			<p class="eyebrow">Фан-сайт Dune Imperium</p>
			<h1>Дюна: Империя</h1>
			<p class="home-hero__lead">
				Материалы для игроков: каталог карт, обзоры меты, рейтинги и практические гайды для
				подготовки к партиям и турнирам.
			</p>

			<div class="home-hero__actions">
				<Button size="lg" onclick={() => goto(resolve('/cards'))}>Смотреть карты</Button>
				<Button size="lg" variant="secondary" onclick={() => goto(resolve('/news'))}>
					Открыть новости
				</Button>
			</div>

			<ul class="home-hero__stats">
				<li>
					<strong>{cardsData.length}</strong>
					<span>карты в каталоге</span>
				</li>
				<li>
					<strong>{articlesData.length}</strong>
					<span>статей и анонсов</span>
				</li>
				<li>
					<strong>{quickLinks.length}</strong>
					<span>разделов для навигации</span>
				</li>
			</ul>
		</div>
	</section>

	<section class="container section u-reveal" use:useScrollReveal>
		<div class="section-title home-heading">
			<div>
				<p class="eyebrow">Навигация</p>
				<h2>Быстрые переходы по разделам</h2>
			</div>
		</div>

		<div class="quick-links">
			{#each quickLinks as link (link.href)}
				<a class="quick-link" href={resolve(link.href)}>
					<h3>{link.title}</h3>
					<p>{link.description}</p>
					<span>Перейти в раздел</span>
				</a>
			{/each}
		</div>
	</section>

	<section class="container section u-reveal" use:useScrollReveal>
		<div class="section-title home-heading">
			<div>
				<p class="eyebrow">Новости сообщества</p>
				<h2>Последние материалы</h2>
			</div>
			<a class="section-link" href={resolve('/news')}>Все новости</a>
		</div>

		<div class="news-preview" role="list">
			{#each latestArticles as article (article.id)}
				<article class="news-card" role="listitem">
					<a class="news-card__image" href={resolve('/news/[slug]', { slug: article.slug })}>
						<img src={article.imageUrl} alt={article.title} loading="lazy" />
					</a>
					<div class="news-card__body">
						<p class="news-card__meta">{formatDate(article.publishedAt)} · {article.author}</p>
						<h3>
							<a href={resolve('/news/[slug]', { slug: article.slug })}>{article.title}</a>
						</h3>
						<p>{article.excerpt}</p>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="container section u-reveal" use:useScrollReveal>
		<div class="section-title home-heading">
			<div>
				<p class="eyebrow">Карточный пул</p>
				<h2>Популярные карты</h2>
			</div>
			<a class="section-link" href={resolve('/cards')}>В каталог карт</a>
		</div>

		<div class="cards-preview">
			{#each popularCards as card (card.id)}
				<article class="card-preview">
					<img src={card.imageUrl} alt={card.name} loading="lazy" />
					<div class="card-preview__body">
						<div class="card-preview__meta">
							<Badge tone={card.isOfficial ? 'primary' : 'info'}>
								{card.isOfficial ? 'Официальная' : 'Фанатская'}
							</Badge>
							<Badge tone="neutral">Стоимость {card.cost}</Badge>
						</div>
						<h3>{card.name}</h3>
						<p>{card.text}</p>
					</div>
				</article>
			{/each}
		</div>
	</section>

	<section class="container section u-reveal" use:useScrollReveal>
		<article class="about-project">
			<div class="about-project__body">
				<p class="eyebrow">О проекте</p>
				<h2>Сообщество игроков Dune Imperium</h2>
				<p>
					Проект собирает в одном месте базу материалов по игре: карточный каталог, лидеров, наборы,
					аналитику меты и ответы на частые вопросы. Контент регулярно обновляется по результатам игр
					и обсуждений сообщества.
				</p>
				<ul>
					{#each projectHighlights as highlight (highlight)}
						<li>{highlight}</li>
					{/each}
				</ul>
			</div>
			<div class="about-project__links">
				<a href="https://t.me/" target="_blank" rel="noreferrer">Telegram</a>
				<a href="https://boosty.to/" target="_blank" rel="noreferrer">Boosty</a>
			</div>
		</article>
	</section>
</main>

<style lang="scss">
	@use './+page.scss' as *;
</style>
