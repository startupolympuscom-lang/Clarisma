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

export interface UserRecord {
  id: number;
  email: string;
  password_hash: string;
  name: string;
  role: 'admin' | 'client';
  created_at: string;
}

export interface TaskRecord {
  id: number;
  title: string;
  description: string;
  assignee_id: number;
  assignee_name?: string;
  created_by: number;
  created_by_name?: string;
  due_date: string;
  status: 'todo' | 'in_progress' | 'done';
  created_at: string;
}

export interface TaskCommentRecord {
  id: number;
  task_id: number;
  author_id: number;
  author_name?: string;
  author_role?: string;
  body: string;
  created_at: string;
}

export interface MaterialRecord {
  id: number;
  title: string;
  description: string;
  file_name: string;
  file_mime: string;
  file_data?: string; // base64
  created_by?: number;
  created_at: string;
  assigned_client_ids: number[];
}

export interface SubmissionRecord {
  id: number;
  client_id: number;
  client_name?: string;
  client_email?: string;
  material_id: number | null;
  material_title?: string | null;
  file_name: string;
  file_mime: string;
  file_data?: string; // base64
  status: 'pending' | 'approved' | 'rejected';
  feedback: string;
  submitted_at: string;
  reviewed_at: string | null;
}

export interface CmsData {
  settings: Record<string, string>;
  services: Service[];
  testimonials: Testimonial[];
  retreats: Retreat[];
  products: Product[];
  reservations: Reservation[];
  users: UserRecord[];
  tasks: TaskRecord[];
  task_comments: TaskCommentRecord[];
  materials: MaterialRecord[];
  submissions: SubmissionRecord[];
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DATA_FILE = path.join(DATA_DIR, 'cms_data.json');
const UPLOADS_DIR = path.join(DATA_DIR, 'uploads');

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
  reservations: [],
  users: [
    {
      id: 1,
      email: 'admin@clarisma.com',
      password_hash: '',
      name: 'Dr. Claris Harbon',
      role: 'admin',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      email: 'sarah.client@clarisma.com',
      password_hash: '',
      name: 'Sarah Benali',
      role: 'client',
      created_at: new Date().toISOString()
    }
  ],
  tasks: [
    {
      id: 1,
      title: 'Review submitted strengths assessment',
      description: 'Analyze executive presence and provide detailed narrative feedback.',
      assignee_id: 1,
      assignee_name: 'Dr. Claris Harbon',
      created_by: 1,
      created_by_name: 'Dr. Claris Harbon',
      due_date: '2026-10-15',
      status: 'in_progress',
      created_at: new Date().toISOString()
    },
    {
      id: 2,
      title: 'Complete Narrative Sovereignty Workbook',
      description: 'Work through modules 1 and 2 before the upcoming 1-on-1 coaching session.',
      assignee_id: 2,
      assignee_name: 'Sarah Benali',
      created_by: 1,
      created_by_name: 'Dr. Claris Harbon',
      due_date: '2026-10-20',
      status: 'todo',
      created_at: new Date().toISOString()
    }
  ],
  task_comments: [],
  materials: [],
  submissions: []
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
      if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
      }
      if (fs.existsSync(DATA_FILE)) {
        const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
        const parsed = JSON.parse(fileContent);
        return {
          settings: { ...defaultData.settings, ...(parsed.settings || {}) },
          services: Array.isArray(parsed.services) ? parsed.services : defaultData.services,
          testimonials: Array.isArray(parsed.testimonials) ? parsed.testimonials : defaultData.testimonials,
          retreats: Array.isArray(parsed.retreats) ? parsed.retreats : defaultData.retreats,
          products: Array.isArray(parsed.products) ? parsed.products : defaultData.products,
          reservations: Array.isArray(parsed.reservations) ? parsed.reservations : [],
          users: Array.isArray(parsed.users) && parsed.users.length > 0 ? parsed.users : defaultData.users,
          tasks: Array.isArray(parsed.tasks) ? parsed.tasks : defaultData.tasks,
          task_comments: Array.isArray(parsed.task_comments) ? parsed.task_comments : [],
          materials: Array.isArray(parsed.materials) ? parsed.materials : [],
          submissions: Array.isArray(parsed.submissions) ? parsed.submissions : []
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
    return this.data.services.find(s => Number(s.id) === Number(id) || String(s.id) === String(id)) || null;
  }

  public createService(input: Partial<Service>): Service {
    const nextId = input.id && typeof input.id === 'number' && !this.data.services.some(s => s.id === input.id)
      ? input.id
      : (this.data.services.length > 0
        ? Math.max(...this.data.services.map(s => Number(s.id) || 0)) + 1
        : 1);

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

  public updateService(id: number, input: Partial<Service>): Service {
    const idx = this.data.services.findIndex(s => Number(s.id) === Number(id) || String(s.id) === String(id));
    if (idx === -1) {
      return this.createService({ ...input, id: Number(id) || undefined });
    }

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
    this.data.services = this.data.services.filter(s => Number(s.id) !== Number(id) && String(s.id) !== String(id));
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
    const nextId = input.id && typeof input.id === 'number' && !this.data.testimonials.some(t => t.id === input.id)
      ? input.id
      : (this.data.testimonials.length > 0
        ? Math.max(...this.data.testimonials.map(t => Number(t.id) || 0)) + 1
        : 1);

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

  public updateTestimonial(id: number, input: Partial<Testimonial>): Testimonial {
    const idx = this.data.testimonials.findIndex(t => Number(t.id) === Number(id) || String(t.id) === String(id));
    if (idx === -1) {
      return this.createTestimonial({ ...input, id: Number(id) || undefined });
    }

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
    this.data.testimonials = this.data.testimonials.filter(t => Number(t.id) !== Number(id) && String(t.id) !== String(id));
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
    return this.data.retreats.find(r => Number(r.id) === Number(id) || String(r.id) === String(id)) || null;
  }

  public createRetreat(input: Partial<Retreat>): Retreat {
    const nextId = input.id && typeof input.id === 'number' && !this.data.retreats.some(r => r.id === input.id)
      ? input.id
      : (this.data.retreats.length > 0
        ? Math.max(...this.data.retreats.map(r => Number(r.id) || 0)) + 1
        : 1);

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

  public updateRetreat(id: number, input: Partial<Retreat>): Retreat {
    const idx = this.data.retreats.findIndex(r => Number(r.id) === Number(id) || String(r.id) === String(id));
    if (idx === -1) {
      return this.createRetreat({ ...input, id: Number(id) || undefined });
    }

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
    this.data.retreats = this.data.retreats.filter(r => Number(r.id) !== Number(id) && String(r.id) !== String(id));
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
    const nextId = input.id && typeof input.id === 'number' && !this.data.products.some(p => p.id === input.id)
      ? input.id
      : (this.data.products.length > 0
        ? Math.max(...this.data.products.map(p => Number(p.id) || 0)) + 1
        : 1);

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

  public updateProduct(id: number, input: Partial<Product>): Product {
    const idx = this.data.products.findIndex(p => Number(p.id) === Number(id) || String(p.id) === String(id));
    if (idx === -1) {
      return this.createProduct({ ...input, id: Number(id) || undefined });
    }

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
    this.data.products = this.data.products.filter(p => Number(p.id) !== Number(id) && String(p.id) !== String(id));
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

  // --- Users / Clients ---
  public getUsers(): UserRecord[] {
    return [...this.data.users];
  }

  public getClients(): { id: number; email: string; name: string; created_at: string }[] {
    return this.data.users
      .filter(u => u.role === 'client')
      .map(u => ({ id: u.id, email: u.email, name: u.name, created_at: u.created_at }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  public getUserById(id: number): UserRecord | null {
    return this.data.users.find(u => Number(u.id) === Number(id)) || null;
  }

  public getUserByEmail(email: string): UserRecord | null {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  }

  public createUser(input: Partial<UserRecord>): UserRecord {
    const nextId = this.data.users.length > 0
      ? Math.max(...this.data.users.map(u => u.id)) + 1
      : 1;

    const newUser: UserRecord = {
      id: nextId,
      email: (input.email || '').trim().toLowerCase(),
      password_hash: input.password_hash || '',
      name: input.name || 'User',
      role: input.role === 'admin' ? 'admin' : 'client',
      created_at: new Date().toISOString()
    };

    this.data.users.push(newUser);
    this.saveData(this.data);
    return newUser;
  }

  // --- Tasks (Kanban) ---
  public getTasks(userId?: number, role?: string): TaskRecord[] {
    let list = [...this.data.tasks];
    if (role !== 'admin' && userId) {
      list = list.filter(t => t.assignee_id === userId);
    }
    // Enrich with names
    return list.map(t => {
      const assignee = this.getUserById(t.assignee_id);
      const creator = this.getUserById(t.created_by);
      return {
        ...t,
        assignee_name: assignee ? assignee.name : t.assignee_name || 'Unassigned',
        created_by_name: creator ? creator.name : t.created_by_name || 'Admin'
      };
    }).sort((a, b) => b.id - a.id);
  }

  public getTaskById(id: number): TaskRecord | null {
    const t = this.data.tasks.find(x => x.id === id);
    if (!t) return null;
    const assignee = this.getUserById(t.assignee_id);
    const creator = this.getUserById(t.created_by);
    return {
      ...t,
      assignee_name: assignee ? assignee.name : t.assignee_name || 'Unassigned',
      created_by_name: creator ? creator.name : t.created_by_name || 'Admin'
    };
  }

  public createTask(input: Partial<TaskRecord>): TaskRecord {
    const nextId = this.data.tasks.length > 0
      ? Math.max(...this.data.tasks.map(t => t.id)) + 1
      : 1;

    const assignee = input.assignee_id ? this.getUserById(input.assignee_id) : null;
    const creator = input.created_by ? this.getUserById(input.created_by) : null;

    const newTask: TaskRecord = {
      id: nextId,
      title: input.title || 'New Task',
      description: input.description || '',
      assignee_id: input.assignee_id || 1,
      assignee_name: assignee ? assignee.name : 'Dr. Claris Harbon',
      created_by: input.created_by || 1,
      created_by_name: creator ? creator.name : 'Dr. Claris Harbon',
      due_date: input.due_date || '',
      status: (input.status as any) || 'todo',
      created_at: new Date().toISOString()
    };

    this.data.tasks.push(newTask);
    this.saveData(this.data);
    return newTask;
  }

  public updateTask(id: number, input: Partial<TaskRecord>): TaskRecord | null {
    const idx = this.data.tasks.findIndex(t => t.id === id);
    if (idx === -1) return null;

    const current = this.data.tasks[idx];
    const assignee = input.assignee_id ? this.getUserById(input.assignee_id) : (current.assignee_id ? this.getUserById(current.assignee_id) : null);

    const updated: TaskRecord = {
      ...current,
      title: input.title ?? current.title,
      description: input.description ?? current.description,
      assignee_id: input.assignee_id ?? current.assignee_id,
      assignee_name: assignee ? assignee.name : current.assignee_name,
      due_date: input.due_date ?? current.due_date,
      status: (input.status as any) ?? current.status
    };

    this.data.tasks[idx] = updated;
    this.saveData(this.data);
    return updated;
  }

  public deleteTask(id: number): boolean {
    const initialLen = this.data.tasks.length;
    this.data.tasks = this.data.tasks.filter(t => t.id !== id);
    this.data.task_comments = this.data.task_comments.filter(c => c.task_id !== id);
    if (this.data.tasks.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Task Comments ---
  public getTaskComments(taskId: number): TaskCommentRecord[] {
    return this.data.task_comments
      .filter(c => c.task_id === taskId)
      .map(c => {
        const author = this.getUserById(c.author_id);
        return {
          ...c,
          author_name: author ? author.name : c.author_name || 'User',
          author_role: author ? author.role : c.author_role || 'user'
        };
      })
      .sort((a, b) => a.id - b.id);
  }

  public createTaskComment(input: Partial<TaskCommentRecord>): TaskCommentRecord {
    const nextId = this.data.task_comments.length > 0
      ? Math.max(...this.data.task_comments.map(c => c.id)) + 1
      : 1;

    const author = input.author_id ? this.getUserById(input.author_id) : null;

    const newComment: TaskCommentRecord = {
      id: nextId,
      task_id: Number(input.task_id),
      author_id: Number(input.author_id) || 1,
      author_name: author ? author.name : 'Dr. Claris Harbon',
      author_role: author ? author.role : 'admin',
      body: input.body || '',
      created_at: new Date().toISOString()
    };

    this.data.task_comments.push(newComment);
    this.saveData(this.data);
    return newComment;
  }

  // --- Materials (LMS) ---
  public getMaterials(userId?: number, role?: string): MaterialRecord[] {
    let list = [...this.data.materials];
    if (role !== 'admin' && userId) {
      list = list.filter(m => Array.isArray(m.assigned_client_ids) && m.assigned_client_ids.includes(userId));
    }
    return list.sort((a, b) => b.id - a.id);
  }

  public getMaterialById(id: number): MaterialRecord | null {
    return this.data.materials.find(m => m.id === id) || null;
  }

  public createMaterial(input: Partial<MaterialRecord>, clientIds?: number[]): MaterialRecord {
    const nextId = this.data.materials.length > 0
      ? Math.max(...this.data.materials.map(m => m.id)) + 1
      : 1;

    const newMaterial: MaterialRecord = {
      id: nextId,
      title: input.title || 'Untitled Material',
      description: input.description || '',
      file_name: input.file_name || 'document.pdf',
      file_mime: input.file_mime || 'application/pdf',
      file_data: input.file_data || '',
      created_by: input.created_by || 1,
      created_at: new Date().toISOString(),
      assigned_client_ids: Array.isArray(clientIds) ? clientIds : (input.assigned_client_ids || [])
    };

    this.data.materials.push(newMaterial);
    this.saveData(this.data);
    return newMaterial;
  }

  public updateMaterial(id: number, input: Partial<MaterialRecord>): MaterialRecord | null {
    const idx = this.data.materials.findIndex(m => m.id === id);
    if (idx === -1) return null;

    this.data.materials[idx] = {
      ...this.data.materials[idx],
      title: input.title ?? this.data.materials[idx].title,
      description: input.description ?? this.data.materials[idx].description,
      assigned_client_ids: input.assigned_client_ids ?? this.data.materials[idx].assigned_client_ids
    };

    this.saveData(this.data);
    return this.data.materials[idx];
  }

  public assignMaterial(id: number, clientIds: number[]): boolean {
    const idx = this.data.materials.findIndex(m => m.id === id);
    if (idx === -1) return false;
    this.data.materials[idx].assigned_client_ids = clientIds;
    this.saveData(this.data);
    return true;
  }

  public deleteMaterial(id: number): boolean {
    const initialLen = this.data.materials.length;
    this.data.materials = this.data.materials.filter(m => m.id !== id);
    if (this.data.materials.length !== initialLen) {
      this.saveData(this.data);
      return true;
    }
    return false;
  }

  // --- Submissions (LMS) ---
  public getSubmissions(userId?: number, role?: string): SubmissionRecord[] {
    let list = [...this.data.submissions];
    if (role !== 'admin' && userId) {
      list = list.filter(s => s.client_id === userId);
    }
    return list.map(s => {
      const client = this.getUserById(s.client_id);
      const material = s.material_id ? this.getMaterialById(s.material_id) : null;
      return {
        ...s,
        client_name: client ? client.name : s.client_name || 'Client',
        client_email: client ? client.email : s.client_email || '',
        material_title: material ? material.title : s.material_title || null
      };
    }).sort((a, b) => b.id - a.id);
  }

  public getSubmissionById(id: number): SubmissionRecord | null {
    return this.data.submissions.find(s => s.id === id) || null;
  }

  public createSubmission(input: Partial<SubmissionRecord>): SubmissionRecord {
    const nextId = this.data.submissions.length > 0
      ? Math.max(...this.data.submissions.map(s => s.id)) + 1
      : 1;

    const client = input.client_id ? this.getUserById(input.client_id) : null;
    const material = input.material_id ? this.getMaterialById(input.material_id) : null;

    const newSub: SubmissionRecord = {
      id: nextId,
      client_id: input.client_id || 1,
      client_name: client ? client.name : 'Client',
      client_email: client ? client.email : '',
      material_id: input.material_id || null,
      material_title: material ? material.title : null,
      file_name: input.file_name || 'submission.pdf',
      file_mime: input.file_mime || 'application/pdf',
      file_data: input.file_data || '',
      status: 'pending',
      feedback: '',
      submitted_at: new Date().toISOString(),
      reviewed_at: null
    };

    this.data.submissions.push(newSub);
    this.saveData(this.data);
    return newSub;
  }

  public reviewSubmission(id: number, status: 'approved' | 'rejected', feedback: string): SubmissionRecord | null {
    const idx = this.data.submissions.findIndex(s => s.id === id);
    if (idx === -1) return null;

    this.data.submissions[idx].status = status;
    this.data.submissions[idx].feedback = feedback;
    this.data.submissions[idx].reviewed_at = new Date().toISOString();

    this.saveData(this.data);
    return this.data.submissions[idx];
  }
}

export const cmsStore = new CmsStoreManager();
