<script lang="ts">
	import { Badge, Button, Card, Input, Select, Tabs, Tag } from '$lib/components';

	import { goto } from '$app/navigation';
	import { resolve } from '$app/paths';

	const tabs = [
		{ id: 'official', label: 'Official sets' },
		{ id: 'fan', label: 'Fan sets' },
		{ id: 'events', label: 'Events' }
	];
</script>

<svelte:head>
	<title>Dune Svelte</title>
	<meta name="description" content="Dune Imperium fan site scaffold." />
</svelte:head>

<main class="page-main">
	<section class="container section hero u-rise-in">
		<p class="eyebrow">Dune Imperium Foundation</p>
		<h1>Stage 1 Design System</h1>
		<p class="hero__lead">
			Typography, tokens, animations, and reusable UI-kit atoms are ready for the next implementation stages.
		</p>
		<div class="hero__actions">
			<Button onclick={() => goto(resolve('/cards'))} variant="primary">Open cards catalog</Button>
			<Button onclick={() => goto(resolve('/news'))} variant="secondary">Read news</Button>
		</div>
	</section>

	<section class="container section">
		<div class="section-title">
			<p class="eyebrow">Components</p>
			<h2>UI-kit atoms</h2>
		</div>

		<div class="section-grid u-stagger">
			<Card title="Buttons and badges" description="Color and hierarchy tokens.">
				<div class="stack">
					<div class="inline">
						<Button size="sm">Primary</Button>
						<Button size="sm" variant="secondary">Secondary</Button>
						<Button size="sm" variant="ghost">Ghost</Button>
					</div>
					<div class="inline">
						<Badge tone="primary">Official</Badge>
						<Badge tone="info">Guild</Badge>
						<Badge tone="danger">Danger</Badge>
					</div>
				</div>
			</Card>

			<Card title="Inputs and selects" description="Base form controls.">
				<div class="stack">
					<Input id="search" label="Search card" placeholder="Type card name..." />
					<Select
						id="set"
						label="Choose set"
						options={[
							{ value: 'base', label: 'Dune Imperium' },
							{ value: 'ix', label: 'Rise of Ix' },
							{ value: 'immortality', label: 'Immortality' }
						]}
					/>
				</div>
			</Card>

			<Card title="Tabs and tags" description="Compact navigation patterns." highlight={true}>
				<div class="stack">
					<Tabs items={tabs} />
					<div class="inline">
						<Tag selected={true}>Fremen</Tag>
						<Tag>Spacing Guild</Tag>
						<Tag>Bene Gesserit</Tag>
					</div>
				</div>
			</Card>
		</div>
	</section>
</main>

<style lang="scss">
	@use './+page.scss' as *;
</style>
