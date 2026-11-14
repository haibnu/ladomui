import { NotFound } from '@/components/NotFound';
import { defaultLocale } from '@/i18n';

// notFound() inside a page: rendered in the [lang] layout; the language comes from the URL.
export default function LangNotFound() {
  return <NotFound fallback={defaultLocale} />;
}
