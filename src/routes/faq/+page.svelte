<script lang="ts">
	import { goto } from '$app/navigation';
	import {
		ChevronLeft,
		Home,
		Search,
		HelpCircle,
		MessageCircle,
		ChevronDown,
		Mail,
		ArrowRight
	} from 'lucide-svelte';

	let searchQuery = $state('');
	let openIndex = $state<number | null>(0);

	const categories = [
		{ id: 'general', label: 'General' },
		{ id: 'account', label: 'Account' },
		{ id: 'safety', label: 'Safety' },
		{ id: 'privacy', label: 'Privacy' }
	];

	let activeCategory = $state('general');

	const faqs = [
		// General
		{
			category: 'general',
			question: 'What is Lezie?',
			answer:
				'Lezie is a community safety platform that connects neighbors through real-time incident reporting, safety alerts, and verified community communication. We help communities stay informed and protected through technology-driven neighborhood watch programs.'
		},
		{
			category: 'general',
			question: 'How does Lezie work?',
			answer:
				'Members can report safety incidents, receive instant alerts about nearby events, view live incident maps, and communicate with verified neighbors. Our platform uses location-based technology to ensure you only receive relevant, nearby alerts while maintaining your privacy.'
		},
		{
			category: 'general',
			question: 'Is Lezie free to use?',
			answer:
				'Yes, Lezie is completely free for individual community members. We also offer premium plans for neighborhood associations and local governments that need advanced features like analytics, custom branding, and dedicated support.'
		},
		{
			category: 'general',
			question: 'Which platforms support Lezie?',
			answer:
				'Lezie is available on iOS and Android mobile apps, as well as through any modern web browser at lezie.com. All platforms sync seamlessly so you can stay connected wherever you are.'
		},

		// Account
		{
			category: 'account',
			question: 'How do I create an account?',
			answer:
				'Download the Lezie app or visit our website, click "Sign Up," and follow the registration process. You\'ll need to provide your name, email, phone number, and verify your address to join your local community.'
		},
		{
			category: 'account',
			question: 'Can I change my community?',
			answer:
				'Yes, you can request to change your primary community if you move. Go to Settings > Community Settings and submit a change request. Our team will verify your new address within 24 hours.'
		},
		{
			category: 'account',
			question: 'How do I reset my password?',
			answer:
				'On the login screen, click "Forgot password?" and enter your email address. We\'ll send you a secure link to reset your password. For security, password reset links expire after 1 hour.'
		},
		{
			category: 'account',
			question: 'Can I have multiple accounts?',
			answer:
				'We recommend one account per person to maintain community trust and verification. However, you can belong to multiple communities (e.g., home and work) with a single account.'
		},

		// Safety
		{
			category: 'safety',
			question: 'How are incidents verified?',
			answer:
				'Incidents are initially reported by community members and marked as "Unverified." Other members can confirm or dispute reports. Lezie also uses automated checks and may contact local authorities for major incidents. Verified reports show a checkmark badge.'
		},
		{
			category: 'safety',
			question: 'What should I report on Lezie?',
			answer:
				"Report any safety-related incidents including suspicious activity, crimes, accidents, fires, severe weather damage, or missing persons. Do not report minor inconveniences or non-safety issues. When in doubt, report—it's better to over-communicate than under-communicate."
		},
		{
			category: 'safety',
			question: 'Will Lezie contact emergency services?',
			answer:
				'Lezie does not automatically contact emergency services. For immediate danger, always call your local emergency number (911 in the US, 112 in EU, etc.) first. You can then report the incident on Lezie to alert your neighbors.'
		},
		{
			category: 'safety',
			question: 'How do I stay safe while using Lezie?',
			answer:
				'Never approach active incidents alone. Use Lezie to stay informed, not to investigate. Always prioritize your personal safety. Share your location only with trusted contacts. Report suspicious app behavior immediately to support@lezie.com.'
		},

		// Privacy
		{
			category: 'privacy',
			question: 'Who can see my personal information?',
			answer:
				'Your exact address is never shared publicly. Other members see only your general neighborhood area and first name. You control what additional information appears on your public profile through Privacy Settings.'
		},
		{
			category: 'privacy',
			question: 'How is my location data used?',
			answer:
				'Your precise location is used only to send relevant nearby alerts and verify incident reports. We never sell location data or use it for advertising. You can disable precise location and use approximate area-only mode in settings.'
		},
		{
			category: 'privacy',
			question: 'Can I delete my account and data?',
			answer:
				'Yes. Go to Settings > Account > Delete Account. Your data will be permanently removed within 30 days, except for anonymized incident reports that remain for community safety records. You can request earlier deletion by contacting privacy@lezie.com.'
		},
		{
			category: 'privacy',
			question: 'Is my data encrypted?',
			answer:
				'Yes. All data is encrypted in transit using TLS 1.3 and at rest using AES-256. We implement industry-standard security practices and undergo regular third-party security audits. See our Security page for full details.'
		}
	];

	const filteredFaqs = $derived(
		searchQuery.trim()
			? faqs.filter(
					(f) =>
						f.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
						f.answer.toLowerCase().includes(searchQuery.toLowerCase())
				)
			: faqs.filter((f) => f.category === activeCategory)
	);

	function toggleFaq(index: number) {
		openIndex = openIndex === index ? null : index;
	}

	function setCategory(cat: string) {
		activeCategory = cat;
		openIndex = null;
		searchQuery = '';
	}
</script>

<svelte:head>
	<title>FAQ — Lezie</title>
	<meta
		name="description"
		content="Frequently asked questions about Lezie's community safety platform, account management, safety features, and privacy practices."
	/>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link
		href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&family=DM+Serif+Display:ital@0;1&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="fq-page">
	<!-- LEFT PANEL -->
	<aside class="fq-panel">
		<div class="fq-panel-inner">
			<a href="/" class="fq-logo-link">
				<img src="/icons/lz_logo_t.png" alt="Lezie" class="fq-logo-img" />
			</a>

			<div class="fq-panel-hero">
				<div class="fq-panel-badge">
					<HelpCircle size={14} />
					<span>Help Center</span>
				</div>
				<h2 class="fq-panel-headline">
					Questions?<br />
					<em>We have answers.</em>
				</h2>
				<p class="fq-panel-desc">
					Find answers to common questions about using Lezie, managing your account, staying safe,
					and protecting your privacy.
				</p>
			</div>

			<div class="fq-features">
				<div class="fq-feature-card">
					<div class="fq-feature-icon"><MessageCircle size={18} /></div>
					<div>
						<strong>Still need help?</strong>
						<span>Our support team is available 24/7</span>
					</div>
				</div>
				<div class="fq-feature-card">
					<div class="fq-feature-icon"><Mail size={18} /></div>
					<div>
						<strong>Email us</strong>
						<span>support@lezie.com</span>
					</div>
				</div>
			</div>

			<div class="fq-panel-footer">
				<p>Can't find what you're looking for?</p>
				<a href="/contact" class="fq-contact-btn">
					Contact Support <ArrowRight size={14} />
				</a>
			</div>
		</div>
		<div class="fq-panel-glow"></div>
	</aside>

	<!-- RIGHT PANEL -->
	<main class="fq-main">
		<div class="fq-form-shell">
			<button class="fq-back-home" onclick={() => goto('/')}>
				<ChevronLeft size={18} />
				<Home size={14} />
				<span>Back to Home</span>
			</button>

			<div class="fq-mobile-brand">
				<a href="/" class="fq-logo-link">
					<img src="/icons/lz_ico.png" alt="Lezie" class="fq-logo-img" />
				</a>
			</div>

			<div class="fq-form-header">
				<h1 class="fq-form-title">Frequently Asked Questions</h1>
				<p class="fq-form-subtitle">Find answers to common questions</p>
			</div>

			<!-- Search -->
			<div class="fq-search-wrap">
				<span class="fq-search-icon"><Search size={18} /></span>
				<input
					type="text"
					placeholder="Search for answers..."
					bind:value={searchQuery}
					class="fq-search-input"
				/>
				{#if searchQuery}
					<button type="button" class="fq-search-clear" onclick={() => (searchQuery = '')}>Clear</button>
				{/if}
			</div>

			<!-- Categories -->
			{#if !searchQuery}
				<div class="fq-categories">
					{#each categories as cat (cat.id)}
						<button
							class="fq-category-btn"
							class:active={activeCategory === cat.id}
							onclick={() => setCategory(cat.id)}
						>
							{cat.label}
						</button>
					{/each}
				</div>
			{/if}

			<!-- FAQ List -->
			<div class="fq-card">
				{#if filteredFaqs.length === 0}
					<div class="fq-empty">
						<HelpCircle size={48} />
						<h3>No results found</h3>
						<p>Try a different search term or browse by category</p>
					</div>
				{:else}
					<div class="fq-list">
						{#each filteredFaqs as faq, i (faq.question)}
							<div class="fq-item" class:open={openIndex === i}>
								<button class="fq-question" onclick={() => toggleFaq(i)}>
									<span>{faq.question}</span>
									<ChevronDown size={18} class="fq-chevron" />
								</button>
								<div class="fq-answer">
									<p>{faq.answer}</p>
								</div>
							</div>
						{/each}
					</div>
				{/if}
			</div>

			<p class="fq-footer-text">
				Still have questions? <a href="/contact" class="fq-link">Contact us</a>
			</p>
		</div>
	</main>
</div>

<style>
	:global(.fq-page *) {
		font-family: 'DM Sans', system-ui, sans-serif;
		box-sizing: border-box;
	}

	.fq-page {
		display: flex;
		min-height: 100vh;
		background: linear-gradient(135deg, #faf9ff 0%, #f3f0ff 100%);
	}

	/* LEFT PANEL - Exact match to sign-in page */
	.fq-panel {
		display: none;
		position: relative;
		width: 440px;
		flex-shrink: 0;
		background: linear-gradient(160deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%);
		overflow: hidden;
	}

	@media (min-width: 1024px) {
		.fq-panel {
			display: flex;
		}
	}

	.fq-panel-inner {
		position: relative;
		z-index: 2;
		display: flex;
		flex-direction: column;
		padding: 2.5rem;
		height: 100%;
	}

	.fq-panel-glow {
		position: absolute;
		inset: 0;
		z-index: 1;
		background: radial-gradient(
			ellipse 80% 60% at 50% 50%,
			rgba(139, 92, 246, 0.15) 0%,
			transparent 70%
		);
		pointer-events: none;
	}

	.fq-logo-link {
		display: inline-block;
		line-height: 0;
		margin-bottom: 2.5rem;
		transition:
			transform 0.2s,
			opacity 0.2s;
	}

	.fq-logo-link:hover {
		opacity: 0.85;
		transform: scale(1.02);
	}

	.fq-logo-img {
		width: 80px;
		height: 80px;
		object-fit: contain;
		display: block;
	}

	.fq-panel-badge {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.375rem 0.875rem;
		background: rgba(139, 92, 246, 0.2);
		border: 1px solid rgba(139, 92, 246, 0.3);
		border-radius: 100px;
		font-size: 0.75rem;
		color: #c4b5fd;
		margin-bottom: 1.5rem;
	}

	.fq-panel-headline {
		font-family: 'DM Serif Display', Georgia, serif;
		font-size: 2.5rem;
		line-height: 1.2;
		color: white;
		margin-bottom: 1rem;
	}

	.fq-panel-headline em {
		color: #c4b5fd;
		font-style: italic;
	}

	.fq-panel-desc {
		font-size: 0.875rem;
		line-height: 1.6;
		color: rgba(196, 181, 253, 0.85);
		margin-bottom: 2rem;
	}

	.fq-features {
		display: flex;
		flex-direction: column;
		gap: 1rem;
		margin-bottom: auto;
	}

	.fq-feature-card {
		display: flex;
		align-items: flex-start;
		gap: 0.875rem;
		padding: 0.875rem;
		background: rgba(255, 255, 255, 0.05);
		border-radius: 1rem;
		backdrop-filter: blur(10px);
		transition: background 0.2s;
	}

	.fq-feature-card:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	.fq-feature-icon {
		width: 36px;
		height: 36px;
		background: rgba(139, 92, 246, 0.2);
		border-radius: 10px;
		display: flex;
		align-items: center;
		justify-content: center;
		color: #c4b5fd;
		flex-shrink: 0;
	}

	.fq-feature-card strong {
		display: block;
		font-size: 0.813rem;
		font-weight: 600;
		color: white;
		margin-bottom: 0.25rem;
	}

	.fq-feature-card span {
		font-size: 0.75rem;
		color: rgba(196, 181, 253, 0.8);
		line-height: 1.4;
	}

	.fq-panel-footer {
		margin-top: 2rem;
		padding-top: 1.5rem;
		border-top: 1px solid rgba(255, 255, 255, 0.1);
	}

	.fq-panel-footer p {
		font-size: 0.875rem;
		color: rgba(196, 181, 253, 0.8);
		margin-bottom: 0.75rem;
	}

	.fq-contact-btn {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		padding: 0.625rem 1rem;
		background: rgba(139, 92, 246, 0.2);
		border: 1px solid rgba(139, 92, 246, 0.3);
		border-radius: 0.75rem;
		color: #c4b5fd;
		font-size: 0.875rem;
		font-weight: 600;
		text-decoration: none;
		transition: all 0.2s;
	}

	.fq-contact-btn:hover {
		background: rgba(139, 92, 246, 0.3);
		color: white;
	}

	/* RIGHT PANEL */
	.fq-main {
		flex: 1;
		display: flex;
		align-items: flex-start;
		justify-content: center;
		padding: 2rem 1.25rem;
		min-height: 100vh;
		overflow-y: auto;
	}

	.fq-form-shell {
		width: 100%;
		max-width: 640px;
		display: flex;
		flex-direction: column;
		gap: 1.25rem;
		padding-top: 1rem;
	}

	.fq-back-home {
		display: inline-flex;
		align-items: center;
		gap: 0.5rem;
		background: white;
		border: 1px solid #e5e7eb;
		border-radius: 100px;
		padding: 0.5rem 1rem;
		font-size: 0.813rem;
		font-weight: 500;
		color: #64748b;
		cursor: pointer;
		transition: all 0.2s;
		width: fit-content;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.fq-back-home:hover {
		border-color: #6a2c91;
		color: #6a2c91;
		background: #f3e8ff;
		transform: translateX(-2px);
	}

	.fq-mobile-brand {
		display: flex;
		justify-content: center;
	}

	.fq-mobile-brand .fq-logo-link {
		margin-bottom: 0;
	}

	.fq-mobile-brand .fq-logo-img {
		width: 80px;
		height: 80px;
	}

	@media (min-width: 1024px) {
		.fq-mobile-brand {
			display: none;
		}
	}

	.fq-form-header {
		text-align: center;
		margin-bottom: 0.5rem;
	}

	.fq-form-title {
		font-family: 'DM Serif Display', Georgia, serif;
		font-size: clamp(1.625rem, 4vw, 2rem);
		color: #1e1b4b;
		margin-bottom: 0.25rem;
		letter-spacing: -0.02em;
	}

	.fq-form-subtitle {
		font-size: 0.875rem;
		color: #64748b;
	}

	/* Search */
	.fq-search-wrap {
		position: relative;
		display: flex;
		align-items: center;
	}

	.fq-search-icon {
		position: absolute;
		left: 1rem;
		color: #9ca3af;
		pointer-events: none;
	}

	.fq-search-input {
		width: 100%;
		padding: 0.875rem 1rem 0.875rem 2.75rem;
		background: white;
		border: 1.5px solid #e5e7eb;
		border-radius: 1rem;
		font-size: 0.9375rem;
		color: #1e1b4b;
		outline: none;
		transition: all 0.2s;
		box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
	}

	.fq-search-input:hover {
		border-color: #c4b5fd;
	}

	.fq-search-input:focus {
		border-color: #6a2c91;
		box-shadow: 0 0 0 3px rgba(106, 44, 145, 0.1);
	}

	.fq-search-input::placeholder {
		color: #9ca3af;
	}

	.fq-search-clear {
		position: absolute;
		right: 1rem;
		padding: 0.375rem 0.75rem;
		background: #f3f4f6;
		border: none;
		border-radius: 0.5rem;
		font-size: 0.75rem;
		font-weight: 500;
		color: #6b7280;
		cursor: pointer;
		transition: all 0.2s;
	}

	.fq-search-clear:hover {
		background: #e5e7eb;
		color: #374151;
	}

	/* Categories */
	.fq-categories {
		display: flex;
		gap: 0.5rem;
		flex-wrap: wrap;
	}

	.fq-category-btn {
		padding: 0.5rem 1rem;
		background: white;
		border: 1.5px solid #e5e7eb;
		border-radius: 100px;
		font-size: 0.875rem;
		font-weight: 500;
		color: #64748b;
		cursor: pointer;
		transition: all 0.2s;
	}

	.fq-category-btn:hover {
		border-color: #c4b5fd;
		color: #6a2c91;
	}

	.fq-category-btn.active {
		background: #6a2c91;
		border-color: #6a2c91;
		color: white;
	}

	/* FAQ Card */
	.fq-card {
		background: white;
		border-radius: 1.5rem;
		border: 1px solid #e2e8f0;
		padding: clamp(1rem, 4vw, 1.5rem);
		box-shadow: 0 20px 35px -12px rgba(0, 0, 0, 0.1);
	}

	.fq-empty {
		text-align: center;
		padding: 3rem 1.5rem;
		color: #9ca3af;
	}

	.fq-empty :global(svg) {
		margin-bottom: 1rem;
		opacity: 0.5;
	}

	.fq-empty h3 {
		font-size: 1.125rem;
		font-weight: 600;
		color: #374151;
		margin-bottom: 0.5rem;
	}

	.fq-empty p {
		font-size: 0.875rem;
		color: #6b7280;
	}

	.fq-list {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
	}

	.fq-item {
		border: 1.5px solid #e5e7eb;
		border-radius: 1rem;
		overflow: hidden;
		transition: all 0.2s;
	}

	.fq-item:hover {
		border-color: #c4b5fd;
	}

	.fq-item.open {
		border-color: #6a2c91;
		box-shadow: 0 4px 12px rgba(106, 44, 145, 0.1);
	}

	.fq-question {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 1rem;
		width: 100%;
		padding: 1rem 1.25rem;
		background: white;
		border: none;
		font-size: 0.9375rem;
		font-weight: 600;
		color: #1e1b4b;
		text-align: left;
		cursor: pointer;
		transition: all 0.2s;
	}

	.fq-question:hover {
		color: #6a2c91;
	}

	.fq-item.open .fq-question {
		background: linear-gradient(135deg, #f3e8ff 0%, #f5f0ff 100%);
		color: #6a2c91;
	}

	.fq-chevron {
		color: #9ca3af;
		transition: transform 0.3s;
		flex-shrink: 0;
	}

	.fq-item.open .fq-chevron {
		transform: rotate(180deg);
		color: #6a2c91;
	}

	.fq-answer {
		max-height: 0;
		overflow: hidden;
		transition: max-height 0.3s ease-out;
	}

	.fq-item.open .fq-answer {
		max-height: 500px;
	}

	.fq-answer p {
		padding: 0 1.25rem 1.25rem;
		margin: 0;
		font-size: 0.875rem;
		line-height: 1.7;
		color: #4b5563;
	}

	/* Footer */
	.fq-footer-text {
		text-align: center;
		font-size: 0.875rem;
		color: #64748b;
		margin-top: 0.5rem;
	}

	.fq-link {
		color: #6a2c91;
		font-weight: 600;
		text-decoration: none;
	}

	.fq-link:hover {
		text-decoration: underline;
	}

	/* Responsive */
	@media (max-width: 640px) {
		.fq-main {
			padding: 1.5rem 1rem;
		}

		.fq-form-shell {
			gap: 1rem;
		}

		.fq-card {
			border-radius: 1.25rem;
			padding: 1rem;
		}

		.fq-question {
			padding: 0.875rem 1rem;
			font-size: 0.875rem;
		}

		.fq-answer p {
			padding: 0 1rem 1rem;
		}

		.fq-categories {
			gap: 0.375rem;
		}

		.fq-category-btn {
			padding: 0.375rem 0.75rem;
			font-size: 0.8125rem;
		}
	}
</style>
