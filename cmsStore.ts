import fs from 'fs';
import path from 'path';

export interface ServiceItem {
  icon: string;
  title: string;
  desc: string;
}

export interface Service {
  id: number;
  title: string;
  badge?: string;
  description: string;
  icon_name: string;
  items: string | ServiceItem[];
  link_text: string;
  link_url: string;
  color_theme: string;
  order_index: number;
  created_at?: string;
}

export interface Testimonial {
  id: number;
  quote: string;
  author: string;
  role: string;
  company: string;
  created_at?: string;
}

export interface Retreat {
  id: number;
  title: string;
  date: string;
  location: string;
  city: string;
  tags: string | string[];
  description: string;
  image_url: string;
  price: string;
  signup_url?: string;
  seats_available?: string;
  agenda_url?: string;
  payment_details?: string;
  custom_form_schema?: string;
  created_at?: string;
}

export interface Product {
  id: number;
  title: string;
  description: string;
  price: string;
  image_url: string;
  download_url: string;
  category: string;
  created_at?: string;
}

export interface Reservation {
  id: number;
  retreat_id: number;
  retreat_title?: string;
  name: string;
  email: string;
  phone?: string;
  message?: string;
  answers?: string;
  status: string;
  created_at?: string;
}

export interface CmsData {
  settings: Record<string, string>;
  services: Service[];
  testimonials: Testimonial[];
  retreats: Retreat[];
  products: Product[];
  reservations: Reservation[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'cms_data.json');

const defaultData: CmsData = {
  settings: {
    hero_video_url: 'https://drive.google.com/file/d/1m8nUWm5US-8l63U0lolu0JZBK7OVmX0k/view?usp=sharing',
    hero_title: 'OWN YOUR',
    hero_title_italic: 'NARRATIVE.',
    hero_desc: 'Empowering high-impact leaders to command their space with unshakeable clarity and authentic authority.',
    about_badge: 'About Clarisma',
    about_heading1: 'Clarify your charisma.',
    about_heading2: 'Magnify your impact.',
    about_body_p1: 'Clarisma is a personal and professional empowerment platform created by Professor Dr. Claris Harbon. We help professionals in different fields, disciplines and schools, and at any stage of their career, such as, but not exclusively limited to, law, to academia, and human rights, reclaim their confidence and chart intentional career paths.',
    about_body_p2: 'Our mission is to fuse legal wisdom, storytelling, and leadership into a transformational journey that honors your expertise while empowering your next chapter.',
    about_founder_name: 'Dr. Claris Harbon',
    about_founder_title: 'Associate Professor in International Law and in Gender Studies.',
    about_founder_image_url: 'https://aui.ma/hs-fs/hubfs/Faculty/Harbon%20Claris-1.jpg?width=385&height=385&name=Harbon%20Claris-1.jpg',
    services_title_1: 'LEVEL UP',
    services_title_2: 'YOUR',
    services_title_highlight: 'IMPACT.',
    services_desc: "Modern tools for the modern professional. We don't just coach; we catalyze your career trajectory with precision.",
    methodology_badge: 'Our Methodology',
    methodology_heading: 'A Blueprint for Professional Mastery',
    methodology_desc: "We don't believe in one-size-fits-all. Our structured approach is designed to adapt to your unique challenges while maintaining a rigorous focus on results.",
    show_hero: 'true',
    show_about: 'true',
    show_services: 'true',
    show_target_audience: 'true',
    show_specialized_programs: 'true',
    show_process: 'true',
    show_ikigai: 'true',
    show_testimonials: 'true',
    show_contact: 'true',
    target_audience_badge: 'Target Audience',
    target_audience_heading: "Who It's For",
    target_audience_desc: "Clarisma serves early and mid-career professionals who are ready to reclaim their narrative and step into their full potential.",
    contact_booking_url: "https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1yhkKwB4s2LYWJBw0qFheEvjNwgyGiXgYg8KZsoaMbPndGdLhpYmBJKPayNG6_PdtiIe-xBuDW",
    contact_email: "clarisma.info@gmail.com"
  },
  services: [
    {
      id: 1,
      title: 'RECLAIM YOUR CAREER',
      badge: 'One-on-One Coaching',
      description: 'Personalized coaching for professionals at all stages—from students to seasoned experts—navigating career transitions with visibility and recognition.',
      icon_name: 'User',
      items: JSON.stringify([
        { icon: 'Compass', title: 'Career Clarity', desc: 'Strengths assessment & roadmapping' },
        { icon: 'GraduationCap', title: 'Academic Edge', desc: 'PhD defense & research strategies' },
        { icon: 'Heart', title: 'Resilience', desc: 'Burnout recovery & self-care' },
        { icon: 'Eye', title: 'Visibility', desc: 'Strategic personal branding' }
      ]),
      link_text: 'Book a Session',
      link_url: 'https://calendar.google.com/calendar/u/0/appointments/schedules/AcZssZ1yhkKwB4s2LYWJBw0qFheEvjNwgyGiXgYg8KZsoaMbPndGdLhpYmBJKPayNG6_PdtiIe-xBuDW',
      color_theme: 'gold',
      order_index: 1,
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'COLLECTIVE GROWTH',
      badge: 'Group Programs',
      description: 'Transformative workshops and retreats designed to build confidence and foster supportive communities.',
      icon_name: 'Users',
      items: JSON.stringify([
        { icon: 'Mic', title: 'Confidence', desc: 'Public speaking & EQ' },
        { icon: 'Briefcase', title: 'Leadership', desc: 'Career navigation' },
        { icon: 'BookOpen', title: 'Academic', desc: 'Thesis & research' },
        { icon: 'Megaphone', title: 'Advocacy', desc: "Women's empowerment" }
      ]),
      link_text: 'View Retreats',
      link_url: 'retreats',
      color_theme: 'orange',
      order_index: 2,
      created_at: new Date().toISOString()
    }
  ],
  testimonials: [
    {
      id: 1,
      quote: "Working with Dr. Harbon was one of the most meaningful experiences of my studies. Through our projects, and my volunteering to promote equality and discuss women’s rights in Morocco, I learned the power of creating spaces where women can grow, learn, and be heard. Her fiery soul, constant energy, and ability to find meaning in everything around her have shaped the way I approach challenges and purpose.",
      author: "Kenza Sifi",
      role: "Student of International Relations & Affair",
      company: "University Al Akhawayn",
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      quote: "At Startup Olympus, we look for founders who are solving real problems with passion. Dr. Claris Harbon is the embodiment of that spirit. Through Clarisma, she is redefining what it means to be empowered in both life and business. Her energy is infectious, and her dedication to helping others unlock their potential is genuine. Dr. Harbon is a force of nature.",
      author: "Abderrahim Hamidine",
      role: "Director",
      company: "Startup Olympus",
      created_at: new Date().toISOString()
    }
  ],
  retreats: [
    {
      id: 1,
      title: 'The Narrative Sovereignty Retreat',
      date: 'October 14 – 19, 2026',
      location: 'Kasbah Bab Ourika, Ourika Valley',
      city: 'Marrakech, Morocco',
      tags: JSON.stringify(['Executive Leadership', 'Legal Storytelling', 'Radical Presence']),
      description: 'An intimate 5-day immersive journey at the foothills of the Atlas Mountains designed for high-impact leaders, legal advocates, and changemakers to reclaim their authentic voice, dismantle imposter anxiety, and align their career trajectory.',
      image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80',
      price: '$3,850',
      signup_url: '',
      seats_available: '8 Seats Available',
      agenda_url: '#',
      payment_details: 'Deposit of $1,000 required to hold your seat. Remaining balance due 30 days prior.',
      custom_form_schema: JSON.stringify([
        { id: '1', label: 'Dietary Preferences or Allergies', type: 'text', required: false },
        { id: '2', label: 'What is your primary breakthrough goal for this retreat?', type: 'textarea', required: true }
      ]),
      created_at: new Date().toISOString()
    }
  ],
  products: [
    {
      id: 1,
      title: 'Legal Storytelling Whitepaper',
      description: 'A comprehensive guide for lawyers on using narrative techniques to build more persuasive cases and command the courtroom.',
      price: '49.00',
      image_url: 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80',
      download_url: '#',
      category: 'Intelligence Library',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'The Charisma Blueprint',
      description: 'A defining e-book on reclaiming your professional narrative and building unshakeable confidence.',
      price: '29.99',
      image_url: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80',
      download_url: '#',
      category: 'Intelligence Library',
      created_at: new Date().toISOString()
    },
    {
      id: 3,
      title: 'Advocacy Toolkit',
      description: 'Essential templates, checklists, and frameworks for transitioning research into impactful public advocacy.',
      price: '45.00',
      image_url: 'https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&q=80',
      download_url: '#',
      category: 'Professional Toolkit',
      created_at: new Date().toISOString()
    },
    {
      id: 4,
      title: 'Academic Impact Guide',
      description: 'A step-by-step guide to managing your PhD research while building a strategic public profile.',
      price: '35.00',
      image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&q=80',
      download_url: '#',
      category: 'Intelligence Library',
      created_at: new Date().toISOString()
    },
    {
      id: 5,
      title: 'Confidence Affirmation Audio',
      description: 'A guided audio experience designed to program your mindset for authority and presence before high-stakes talks.',
      price: '19.99',
      image_url: 'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&q=80',
      download_url: '#',
      category: 'Clarisma Collection',
      created_at: new Date().toISOString()
    },
    {
      id: 6,
      title: 'Maximum Impact Bundle',
      description: 'Includes the Intelligence Library and the Professional Toolkit at a curated price for total career transformation.',
      price: '99.00',
      image_url: 'https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?auto=format&fit=crop&q=80',
      download_url: '#',
      category: 'Curated Experience Bundles',
      created_at: new Date().toISOString()
    }
  ],
  reservations: []
};

class CmsStoreManager {
  private data: CmsData;

  constructor() {
    this.data = this.loadData();
  }

  private loadData(): CmsData {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        // Merge with defaults in case new fields exist
        return {
          settings: { ...defaultData.settings, ...(parsed.settings || {}) },
          services: Array.isArray(parsed.services) && parsed.services.length > 0 ? parsed.services : defaultData.services,
          testimonials: Array.isArray(parsed.testimonials) && parsed.testimonials.length > 0 ? parsed.testimonials : defaultData.testimonials,
          retreats: Array.isArray(parsed.retreats) && parsed.retreats.length > 0 ? parsed.retreats : defaultData.retreats,
          products: Array.isArray(parsed.products) && parsed.products.length > 0 ? parsed.products : defaultData.products,
          reservations: Array.isArray(parsed.reservations) ? parsed.reservations : []
        };
      }
    } catch (e) {
      console.warn('[CmsStore] Error reading file, using default data:', e);
    }
    this.saveData(defaultData);
    return JSON.parse(JSON.stringify(defaultData));
  }

  private saveData(data: CmsData): void {
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('[CmsStore] Error writing file:', e);
    }
  }

  // --- Settings ---
  public getSettings(): Record<string, string> {
    return { ...this.data.settings };
  }

  public updateSettings(incoming: Record<string, any>): Record<string, string> {
    const stringified: Record<string, string> = {};
    for (const [key, val] of Object.entries(incoming)) {
      stringified[key] = val === undefined || val === null ? '' : String(val);
    }
    this.data.settings = { ...this.data.settings, ...stringified };
    this.saveData(this.data);
    return this.getSettings();
  }

  // --- Services ---
  public getServices(): Service[] {
    return [...this.data.services].sort((a, b) => (a.order_index ?? 0) - (b.order_index ?? 0) || a.id - b.id);
  }

  public getServiceById(id: number): Service | null {
    return this.data.services.find(s => s.id === id) || null;
  }

  public createService(input: Partial<Service>): Service {
    const nextId = this.data.services.length > 0
      ? Math.max(...this.data.services.map(s => s.id)) + 1
      : 1;

    const newService: Service = {
      id: nextId,
      title: input.title || 'New Service',
      badge: input.badge || '',
      description: input.description || '',
      icon_name: input.icon_name || 'User',
      items: typeof input.items === 'string' ? input.items : JSON.stringify(input.items || []),
      link_text: input.link_text || 'Book a Session',
      link_url: input.link_url || '#',
      color_theme: input.color_theme || 'gold',
      order_index: input.order_index ?? (this.data.services.length + 1),
      created_at: new Date().toISOString()
    };

    this.data.services.push(newService);
    this.saveData(this.data);
    return newService;
  }

  public updateService(id: number, input: Partial<Service>): Service | null {
    const idx = this.data.services.findIndex(s => s.id === id);
    if (idx === -1) return null;

    const current = this.data.services[idx];
    const updated: Service = {
      ...current,
      title: input.title ?? current.title,
      badge: input.badge ?? current.badge,
      description: input.description ?? current.description,
      icon_name: input.icon_name ?? current.icon_name,
      items: input.items !== undefined ? (typeof input.items === 'string' ? input.items : JSON.stringify(input.items)) : current.items,
      link_text: input.link_text ?? current.link_text,
      link_url: input.link_url ?? current.link_url,
      color_theme: input.color_theme ?? current.color_theme,
      order_index: input.order_index ?? current.order_index
    };

    this.data.services[idx] = updated;
    this.saveData(this.data);
    return updated;
  }

  public deleteService(id: number): boolean {
    const initialLen = this.data.services.length;
    this.data.services = this.data.services.filter(s => s.id !== id);
    if (this.data.services.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Testimonials ---
  public getTestimonials(): Testimonial[] {
    return [...this.data.testimonials].sort((a, b) => a.id - b.id);
  }

  public createTestimonial(input: Partial<Testimonial>): Testimonial {
    const nextId = this.data.testimonials.length > 0
      ? Math.max(...this.data.testimonials.map(t => t.id)) + 1
      : 1;

    const newTestimonial: Testimonial = {
      id: nextId,
      quote: input.quote || '',
      author: input.author || 'Anonymous',
      role: input.role || '',
      company: input.company || '',
      created_at: new Date().toISOString()
    };

    this.data.testimonials.push(newTestimonial);
    this.saveData(this.data);
    return newTestimonial;
  }

  public updateTestimonial(id: number, input: Partial<Testimonial>): Testimonial | null {
    const idx = this.data.testimonials.findIndex(t => t.id === id);
    if (idx === -1) return null;

    const current = this.data.testimonials[idx];
    const updated: Testimonial = {
      ...current,
      quote: input.quote ?? current.quote,
      author: input.author ?? current.author,
      role: input.role ?? current.role,
      company: input.company ?? current.company
    };

    this.data.testimonials[idx] = updated;
    this.saveData(this.data);
    return updated;
  }

  public deleteTestimonial(id: number): boolean {
    const initialLen = this.data.testimonials.length;
    this.data.testimonials = this.data.testimonials.filter(t => t.id !== id);
    if (this.data.testimonials.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Retreats ---
  public getRetreats(): Retreat[] {
    return [...this.data.retreats].sort((a, b) => b.id - a.id);
  }

  public getRetreatById(id: number): Retreat | null {
    return this.data.retreats.find(r => r.id === id) || null;
  }

  public createRetreat(input: Partial<Retreat>): Retreat {
    const nextId = this.data.retreats.length > 0
      ? Math.max(...this.data.retreats.map(r => r.id)) + 1
      : 1;

    const newRetreat: Retreat = {
      id: nextId,
      title: input.title || 'New Retreat',
      date: input.date || '',
      location: input.location || '',
      city: input.city || '',
      tags: typeof input.tags === 'string' ? input.tags : JSON.stringify(input.tags || []),
      description: input.description || '',
      image_url: input.image_url || 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&q=80',
      price: input.price || '',
      signup_url: input.signup_url || '',
      seats_available: input.seats_available || '',
      agenda_url: input.agenda_url || '',
      payment_details: input.payment_details || '',
      custom_form_schema: typeof input.custom_form_schema === 'string' ? input.custom_form_schema : JSON.stringify(input.custom_form_schema || []),
      created_at: new Date().toISOString()
    };

    this.data.retreats.push(newRetreat);
    this.saveData(this.data);
    return newRetreat;
  }

  public updateRetreat(id: number, input: Partial<Retreat>): Retreat | null {
    const idx = this.data.retreats.findIndex(r => r.id === id);
    if (idx === -1) return null;

    const current = this.data.retreats[idx];
    const updated: Retreat = {
      ...current,
      title: input.title ?? current.title,
      date: input.date ?? current.date,
      location: input.location ?? current.location,
      city: input.city ?? current.city,
      tags: input.tags !== undefined ? (typeof input.tags === 'string' ? input.tags : JSON.stringify(input.tags)) : current.tags,
      description: input.description ?? current.description,
      image_url: input.image_url ?? current.image_url,
      price: input.price ?? current.price,
      signup_url: input.signup_url ?? current.signup_url,
      seats_available: input.seats_available ?? current.seats_available,
      agenda_url: input.agenda_url ?? current.agenda_url,
      payment_details: input.payment_details ?? current.payment_details,
      custom_form_schema: input.custom_form_schema !== undefined ? (typeof input.custom_form_schema === 'string' ? input.custom_form_schema : JSON.stringify(input.custom_form_schema)) : current.custom_form_schema
    };

    this.data.retreats[idx] = updated;
    this.saveData(this.data);
    return updated;
  }

  public deleteRetreat(id: number): boolean {
    const initialLen = this.data.retreats.length;
    this.data.retreats = this.data.retreats.filter(r => r.id !== id);
    if (this.data.retreats.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Products ---
  public getProducts(): Product[] {
    return [...this.data.products].sort((a, b) => b.id - a.id);
  }

  public createProduct(input: Partial<Product>): Product {
    const nextId = this.data.products.length > 0
      ? Math.max(...this.data.products.map(p => p.id)) + 1
      : 1;

    const newProduct: Product = {
      id: nextId,
      title: input.title || 'New Product',
      description: input.description || '',
      price: input.price || '0.00',
      image_url: input.image_url || 'https://images.unsplash.com/photo-1505664194779-8beaceb93744?auto=format&fit=crop&q=80',
      download_url: input.download_url || '#',
      category: input.category || 'Digital',
      created_at: new Date().toISOString()
    };

    this.data.products.push(newProduct);
    this.saveData(this.data);
    return newProduct;
  }

  public updateProduct(id: number, input: Partial<Product>): Product | null {
    const idx = this.data.products.findIndex(p => p.id === id);
    if (idx === -1) return null;

    const current = this.data.products[idx];
    const updated: Product = {
      ...current,
      title: input.title ?? current.title,
      description: input.description ?? current.description,
      price: input.price ?? current.price,
      image_url: input.image_url ?? current.image_url,
      download_url: input.download_url ?? current.download_url,
      category: input.category ?? current.category
    };

    this.data.products[idx] = updated;
    this.saveData(this.data);
    return updated;
  }

  public deleteProduct(id: number): boolean {
    const initialLen = this.data.products.length;
    this.data.products = this.data.products.filter(p => p.id !== id);
    if (this.data.products.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Reservations ---
  public getReservations(): Reservation[] {
    return [...this.data.reservations].sort((a, b) => b.id - a.id);
  }

  public createReservation(input: Partial<Reservation>): Reservation {
    const nextId = this.data.reservations.length > 0
      ? Math.max(...this.data.reservations.map(r => r.id)) + 1
      : 1;

    const retreat = this.getRetreatById(Number(input.retreat_id));

    const newRes: Reservation = {
      id: nextId,
      retreat_id: Number(input.retreat_id) || 1,
      retreat_title: retreat ? retreat.title : 'Retreat',
      name: input.name || '',
      email: input.email || '',
      phone: input.phone || '',
      message: input.message || '',
      answers: typeof input.answers === 'string' ? input.answers : JSON.stringify(input.answers || {}),
      status: input.status || 'pending',
      created_at: new Date().toISOString()
    };

    this.data.reservations.push(newRes);
    this.saveData(this.data);
    return newRes;
  }

  public updateReservationStatus(id: number, status: string): Reservation | null {
    const idx = this.data.reservations.findIndex(r => r.id === id);
    if (idx === -1) return null;

    this.data.reservations[idx].status = status;
    this.saveData(this.data);
    return this.data.reservations[idx];
  }
}

export const cmsStore = new CmsStoreManager();
