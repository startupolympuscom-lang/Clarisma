export interface Service {
  id: string;
  title: string;
  description: string;
  icon: string;
}

export interface Testimonial {
  id: string;
  quote: string;
  author: string;
  role: string;
  company: string;
}

export interface Retreat {
  id: number;
  title: string;
  date: string;
  location: string;
  city: string;
  tags: string[];
  description: string;
  image_url: string;
  price: string;
  signup_url: string;
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
  phone: string;
  message: string;
  answers: string;
  status: string;
  created_at: string;
}
