import { SiteSection, SiteTemplate } from './model';

export type AishapeAssistantResult = {
  updatedTemplate: SiteTemplate;
  assistantMessage: string;
};

const cloneTemplate = (tpl: SiteTemplate): SiteTemplate => ({
  ...tpl,
  sections: tpl.sections.map((s) => ({ ...s, items: s.items ? s.items.map((i) => ({ ...i })) : undefined })),
});

const findSection = (tpl: SiteTemplate, type: SiteSection['type']) =>
  tpl.sections.find((s) => s.type === type);

const addSection = (tpl: SiteTemplate, section: SiteSection) => {
  return { ...tpl, sections: [...tpl.sections, section] };
};

const removeSection = (tpl: SiteTemplate, type: SiteSection['type']) => {
  return { ...tpl, sections: tpl.sections.filter((s) => s.type !== type) };
};

const moveSectionBefore = (tpl: SiteTemplate, type: SiteSection['type'], before: SiteSection['type']) => {
  const sections = [...tpl.sections];
  const fromIdx = sections.findIndex((s) => s.type === type);
  const toIdx = sections.findIndex((s) => s.type === before);
  if (fromIdx === -1 || toIdx === -1) return tpl;
  const [removed] = sections.splice(fromIdx, 1);
  sections.splice(toIdx, 0, removed);
  return { ...tpl, sections };
};

export function applyUserInstructionToSite(message: string, current: SiteTemplate): AishapeAssistantResult {
  let tpl = cloneTemplate(current);
  const msg = message.toLowerCase();
  const changes: string[] = [];

  if (msg.includes('hero title') || msg.includes('change title')) {
    const hero = findSection(tpl, 'hero');
    if (hero) {
      hero.title = message;
      hero.subtitle = `Updated by AISHAPE: ${message}`;
      changes.push('Updated hero title/subtitle');
    }
  }

  if (msg.includes('cta') || msg.includes('button') || msg.includes('call to action')) {
    const hero = findSection(tpl, 'hero') || findSection(tpl, 'features');
    if (hero) {
      hero.ctaLabel = 'Updated CTA';
      hero.ctaHref = '#updated';
      changes.push('Updated CTA label');
    }
  }

  if (msg.includes('add pricing')) {
    if (!findSection(tpl, 'pricing')) {
      tpl = addSection(tpl, {
        id: Math.random().toString(36).slice(2, 8),
        type: 'pricing',
        title: 'Simple pricing',
        subtitle: 'Choose your plan',
        items: [
          { id: 'p1', title: 'Starter', text: '$19/mo' },
          { id: 'p2', title: 'Pro', text: '$49/mo' },
        ],
      });
      changes.push('Added pricing section');
    }
  }

  if (msg.includes('remove contact')) {
    if (findSection(tpl, 'contact')) {
      tpl = removeSection(tpl, 'contact');
      changes.push('Removed contact section');
    }
  }

  if (msg.includes('dark mode') || msg.includes('dark theme') || msg.includes('make it dark')) {
    tpl = { ...tpl, theme: 'dark' };
    changes.push('Switched theme to dark');
  }

  if (msg.includes('make it more minimal') || msg.includes('minimal')) {
    tpl = { ...tpl, theme: 'minimal', sections: tpl.sections.slice(0, 3) };
    changes.push('Made layout more minimal');
  }

  if (msg.includes('add faq')) {
    if (!findSection(tpl, 'faq')) {
      tpl = addSection(tpl, {
        id: Math.random().toString(36).slice(2, 8),
        type: 'faq',
        title: 'FAQ',
        items: [
          { id: 'q1', title: 'Question one', text: 'Answer one' },
          { id: 'q2', title: 'Question two', text: 'Answer two' },
          { id: 'q3', title: 'Question three', text: 'Answer three' },
        ],
      });
      changes.push('Added FAQ section');
    }
  }

  if (msg.includes('move gallery above about')) {
    tpl = moveSectionBefore(tpl, 'gallery', 'about');
    changes.push('Moved gallery above about');
  }

  const assistantMessage =
    changes.length > 0
      ? `I applied these changes: ${changes.join(', ')}.`
      : 'I did not detect a specific change; try being more specific.';
  return { updatedTemplate: tpl, assistantMessage };
}

export function suggestImprovements(goal: string, current: SiteTemplate): AishapeAssistantResult {
  let tpl = cloneTemplate(current);
  const g = goal.toLowerCase();
  const changes: string[] = [];

  if (g.includes('professional')) {
    tpl.theme = 'minimal';
    tpl.sections = tpl.sections.filter((s) => ['hero', 'features', 'testimonials', 'contact'].includes(s.type));
    changes.push('Made it more professional with minimal theme and core sections.');
  } else if (g.includes('playful')) {
    tpl.theme = 'playful';
    if (!findSection(tpl, 'testimonials')) {
      tpl = addSection(tpl, { id: Math.random().toString(36).slice(2, 8), type: 'testimonials', title: 'Happy clients' });
    }
    changes.push('Added playful theme and testimonials.');
  } else if (g.includes('minimal')) {
    tpl.theme = 'minimal';
    tpl.sections = tpl.sections.filter((s) => ['hero', 'about', 'contact'].includes(s.type));
    changes.push('Simplified layout to minimal.');
  } else if (g.includes('premium') || g.includes('luxury')) {
    tpl.theme = 'premium';
    if (!findSection(tpl, 'pricing')) {
      tpl = addSection(tpl, { id: Math.random().toString(36).slice(2, 8), type: 'pricing', title: 'Premium plans' });
    }
    if (!findSection(tpl, 'faq')) {
      tpl = addSection(tpl, { id: Math.random().toString(36).slice(2, 8), type: 'faq', title: 'FAQ' });
    }
    changes.push('Set premium theme and added pricing/FAQ.');
  } else {
    changes.push('Kept current style; no specific improvement keyword detected.');
  }

  return { updatedTemplate: tpl, assistantMessage: changes.join(' ') };
}
