import { SiteSection, SiteTemplate, SiteTheme } from './model';

const id = () => Math.random().toString(36).slice(2, 10);

const makeSection = (
  type: SiteSection['type'],
  title?: string,
  subtitle?: string,
  extras: Partial<SiteSection> = {}
): SiteSection => ({
  id: id(),
  type,
  title,
  subtitle,
  ...extras,
});

const template = (name: string, description: string, theme: SiteTheme, sections: SiteSection[]): SiteTemplate => ({
  id: id(),
  name,
  description,
  theme,
  sections,
});

export function generateTemplatesFromPrompt(prompt?: string): SiteTemplate[] {
  const p = (prompt || '').toLowerCase();
  const isPortfolio = ['portfolio', 'photography', 'designer'].some((k) => p.includes(k));
  const isBlog = ['blog', 'articles', 'news'].some((k) => p.includes(k));
  const isFood = ['restaurant', 'food', 'cafe', 'café'].some((k) => p.includes(k));

  if (isPortfolio) {
    return [
      template('Clean Portfolio', 'Showcase work with a clean gallery and contact CTA.', 'minimal', [
        makeSection('hero', 'Show your best work', 'A focused hero with your top project'),
        makeSection('gallery', 'Featured shots'),
        makeSection('about', 'About the artist'),
        makeSection('contact', 'Work together', undefined, { ctaLabel: 'Book a call' }),
      ]),
      template('Dark Focus', 'Bold dark visuals for photography or design.', 'dark', [
        makeSection('hero', 'A bold introduction', 'Lead with a striking image'),
        makeSection('gallery', 'Portfolio highlights'),
        makeSection('testimonials', 'Clients say', undefined, {
          items: [
            { id: id(), title: 'Great eye', text: 'Captured our brand perfectly.' },
            { id: id(), title: 'Responsive', text: 'Fast delivery and great edits.' },
          ],
        }),
        makeSection('contact', 'Let’s collaborate', undefined, { ctaLabel: 'Get in touch' }),
      ]),
      template('Playful Showcase', 'Colorful portfolio with personality.', 'playful', [
        makeSection('hero', 'Make it memorable', 'Add personality to your intro'),
        makeSection('gallery', 'Recent projects'),
        makeSection('about', 'Story & style'),
        makeSection('faq', 'Questions?'),
        makeSection('contact', 'Say hello', undefined, { ctaLabel: 'Message me' }),
      ]),
    ];
  }

  if (isBlog) {
    return [
      template('Modern Blog', 'Clean article-first layout.', 'light', [
        makeSection('hero', 'Latest insights', 'Your newest post featured up top'),
        makeSection('blog', 'All articles'),
        makeSection('about', 'About the author'),
        makeSection('contact', 'Subscribe or reach out', undefined, { ctaLabel: 'Subscribe' }),
      ]),
      template('Editorial', 'Magazine-style blog with highlights.', 'premium', [
        makeSection('hero', 'Today’s feature', 'Premium layout for hero story'),
        makeSection('blog', 'Top stories'),
        makeSection('faq', 'Reader questions'),
        makeSection('contact', 'Stay in touch'),
      ]),
      template('Minimal Notes', 'Simple writing-focused blog.', 'minimal', [
        makeSection('hero', 'Write clearly', 'No distractions'),
        makeSection('blog', 'Recent posts'),
        makeSection('about', 'Who you are'),
        makeSection('contact', 'Reach out'),
      ]),
    ];
  }

  if (isFood) {
    return [
      template('Bistro Landing', 'Restaurant-ready layout with menu and bookings.', 'premium', [
        makeSection('hero', 'Taste the experience', 'Highlight signature dishes', { ctaLabel: 'Book a table' }),
        makeSection('features', 'Menu highlights', undefined, {
          items: [
            { id: id(), title: 'Seasonal menu', text: 'Fresh, locally sourced.' },
            { id: id(), title: 'Chef specials', text: 'Signature plates daily.' },
          ],
        }),
        makeSection('testimonials', 'Guest reviews'),
        makeSection('contact', 'Find us', undefined, { ctaLabel: 'Reserve now' }),
      ]),
      template('Cafe Cozy', 'Warm, friendly cafe site.', 'playful', [
        makeSection('hero', 'Your daily ritual', 'Coffee, pastries, and good vibes'),
        makeSection('features', 'What’s on today'),
        makeSection('gallery', 'Inside the cafe'),
        makeSection('contact', 'Visit us', undefined, { ctaLabel: 'Get directions' }),
      ]),
      template('Food Truck', 'Bold street-food energy.', 'colorful', [
        makeSection('hero', 'Street flavors', 'Find us at the next stop', { ctaLabel: 'Track the truck' }),
        makeSection('features', 'Menu favorites'),
        makeSection('faq', 'Allergens & info'),
        makeSection('contact', 'Book the truck', undefined, { ctaLabel: 'Book now' }),
      ]),
    ];
  }

  return [
    template('SaaS Launch', 'Clean landing for a product launch.', 'light', [
      makeSection('hero', 'Launch your product', 'Clear CTA for signups', { ctaLabel: 'Get started' }),
      makeSection('features', 'Why it works'),
      makeSection('pricing', 'Plans'),
      makeSection('testimonials', 'Happy customers'),
      makeSection('contact', 'Talk to us', undefined, { ctaLabel: 'Book a demo' }),
    ]),
    template('Dark Landing', 'High-contrast landing page.', 'dark', [
      makeSection('hero', 'Make a bold statement', 'Great for tech or creative'),
      makeSection('features', 'Highlights'),
      makeSection('about', 'Story'),
      makeSection('contact', 'Reach out', undefined, { ctaLabel: 'Contact sales' }),
    ]),
    template('Playful Promo', 'Bright and friendly promo site.', 'playful', [
      makeSection('hero', 'Welcome in', 'Fun, colorful hero'),
      makeSection('features', 'Perks'),
      makeSection('faq', 'Questions'),
      makeSection('contact', 'Say hi', undefined, { ctaLabel: 'Message us' }),
    ]),
  ];
}
