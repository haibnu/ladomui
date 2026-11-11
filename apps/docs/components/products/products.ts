import type { ComponentType } from 'react';
import { IconContacts, IconDateTime, IconLead, IconShopping, IconTransactions } from '@ladom/icons';
import type { Locale } from '@/i18n';

/** Demo admin panels built with Ladom UI, one per industry. Those without a path are coming soon. */
export type Product = {
  key: string;
  icon: ComponentType<{ size?: number }>;
  path?: string;
  name: Record<Locale, string>;
  description: Record<Locale, string>;
};

export const PRODUCTS: Product[] = [
  {
    key: 'hr',
    icon: IconContacts,
    path: '/products/hr',
    name: { en: 'HR app', tr: 'İK Uygulaması' },
    description: {
      en: 'Employees, leave, timesheets and payroll.',
      tr: 'Personel, izin, puantaj ve bordro.',
    },
  },
  {
    key: 'ecommerce',
    icon: IconShopping,
    name: { en: 'E-commerce panel', tr: 'E-ticaret paneli' },
    description: {
      en: 'Orders, products, stock and customers.',
      tr: 'Sipariş, ürün, stok ve müşteri.',
    },
  },
  {
    key: 'crm',
    icon: IconLead,
    name: { en: 'CRM / Sales', tr: 'CRM / Satış' },
    description: {
      en: 'Deals, accounts and quotes.',
      tr: 'Fırsat, müşteri ve teklif.',
    },
  },
  {
    key: 'accounting',
    icon: IconTransactions,
    name: { en: 'Accounting / Invoicing', tr: 'Muhasebe / Fatura' },
    description: {
      en: 'Invoices, collections and expenses.',
      tr: 'Fatura, tahsilat ve gider.',
    },
  },
  {
    key: 'clinic',
    icon: IconDateTime,
    name: { en: 'Clinic / Appointments', tr: 'Klinik / Randevu' },
    description: {
      en: 'Appointments, patients and calendar.',
      tr: 'Randevu, hasta ve takvim.',
    },
  },
];
