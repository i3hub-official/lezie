<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import { 
    Cookie, Shield, BarChart2, Target, Settings, ChevronRight, 
    ArrowLeft, ExternalLink, Lock, Zap, MapPin, TrendingUp 
  } from 'lucide-svelte';

  // Active section for sticky nav highlight
  let activeSection = $state('what-are-cookies');

  const sections = [
    { id: 'what-are-cookies', label: 'What Are Cookies' },
    { id: 'how-we-use',       label: 'How We Use Them'  },
    { id: 'types',            label: 'Cookie Types'     },
    { id: 'third-party',      label: 'Third Parties'    },
    { id: 'your-choices',     label: 'Your Choices'     },
    { id: 'updates',          label: 'Policy Updates'   },
    { id: 'contact',          label: 'Contact Us'        },
  ];

  const cookieTypes = [
    {
      icon:    Shield,
      color:   '#1a0b2e',
      bg:      'linear-gradient(135deg,#1a0b2e,#2d1b4e)',
      label:   'Strictly Necessary',
      tag:     'Always active',
      tagColor:'#6a2c91',
      tagBg:   '#f3e8ff',
      desc:    'These cookies are essential for Lezie to function. They handle authentication sessions, security tokens, and core platform operations. Without these, you cannot use the app.',
      examples:['Session authentication','CSRF protection tokens','Load balancer routing','User preference flags'],
      retention: 'Session / up to 1 year',
    },
    {
      icon:    BarChart2,
      color:   '#0369a1',
      bg:      'linear-gradient(135deg,#0369a1,#0284c7)',
      label:   'Analytics',
      tag:     'Optional',
      tagColor:'#0369a1',
      tagBg:   '#e0f2fe',
      desc:    'Help us understand how people navigate Lezie — which features they use most, where they encounter friction, and how to improve the experience for everyone in the community.',
      examples:['Page view tracking','Feature usage metrics','Error rate monitoring','Session duration data'],
      retention: 'Up to 2 years',
    },
    {
      icon:    Settings,
      color:   '#059669',
      bg:      'linear-gradient(135deg,#059669,#10b981)',
      label:   'Functional',
      tag:     'Optional',
      tagColor:'#059669',
      tagBg:   '#d1fae5',
      desc:    'Remember your preferences so Lezie feels tailored to you — your default map region, notification settings, language choice, and other saved configurations.',
      examples:['Map region preference','Language / locale setting','Notification preferences','Theme selection'],
      retention: 'Up to 1 year',
    },
    {
      icon:    Target,
      color:   '#b45309',
      bg:      'linear-gradient(135deg,#b45309,#d97706)',
      label:   'Marketing',
      tag:     'Optional',
      tagColor:'#b45309',
      tagBg:   '#fef3c7',
      desc:    'Used to deliver relevant safety updates, community announcements, and product news. We do not sell your data or use these for third-party advertising.',
      examples:['Re-engagement campaigns','Feature announcement targeting','Community event notifications','Product update comms'],
      retention: 'Up to 90 days',
    },
  ];

  const thirdParties = [
    { name:'Mapbox',      purpose:'Interactive safety maps and location services',      link:'https://www.mapbox.com/legal/privacy' },
    { name:'Sentry',      purpose:'Error monitoring and crash reporting',               link:'https://sentry.io/privacy/' },
    { name:'PostHog',     purpose:'Product analytics and feature usage insights',       link:'https://posthog.com/privacy' },
    { name:'Cloudflare',  purpose:'CDN, DDoS protection, and performance optimisation', link:'https://www.cloudflare.com/privacypolicy/' },
  ];

  // Intersection observer for nav highlight
  onMount(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) activeSection = entry.target.id;
        });
      },
      { rootMargin: '-30% 0px -60% 0px' }
    );
    sections.forEach(s => {
      const el = document.getElementById(s.id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  });

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
</script>