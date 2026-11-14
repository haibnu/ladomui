import type { Metadata } from 'next';
import { DocPage } from '@/components/DocPage';
import { CodeBlock } from '@/components/docs/CodeBlock';
import { PropsTable } from '@/components/docs/ComponentDoc';
import { ForView, ViewProvider } from '@/components/docs/ViewSwitch';
import { getDictionary, type Locale } from '@/i18n';
import { AgendaPlayground } from './AgendaPlayground';

type Props = { params: Promise<{ lang: string }> };

const COPY = {
  en: {
    description: 'A full-page calendar: month, week, day and list views of events, with drag to create, move and resize. It fills its container.',
    behavior: 'Behavior',
    behaviorItems: [
      'The toolbar has Today, previous and next, the period and a Segment of the views. actions go before the Segment, e.g. a “New event” Button.',
      'Month: a row per week. All-day and multi-day events are bars across the days; one-day events show a dot, the start time and the title. When a day has more than fit, the last line is “+N more”, which opens the day. maxEvents="auto" fits the cell height.',
      'Week and day: the day headers, an all-day row and a grid of hours that scrolls to scrollToHour. Overlapping events sit side by side. A red line marks the current time in today’s column, with the time in the hour column.',
      'Split by resource: with resources the week and day views get a column per person, room or chair, with a colored dot and the name on top. Time outside its workingHours (per weekday, one or more ranges) and in its unavailable ranges is hatched; nothing can be created or dropped there, and a click there is not a free slot. Dragging an event to another column moves it to that resource. Many columns scroll sideways under a sticky hour column, and the current-time line crosses them all.',
      'List: the days of the month that have events, each with its events in time order.',
      'Colors: color 1–6 takes a chart color (--color-chart-1…6), so events follow the brand; any other string is used as a CSS color.',
      'Status: unconfirmed events are dashed, declined ones are struck through and muted, past events are faded, readOnly events cannot be moved, resized or deleted.',
      'Editing is on when its callback is set. With a mouse or pen, drag an empty slot to create, drag an event to move it (across days too) and drag its bottom edge to resize; times snap to snapMinutes. Escape cancels a drag. On touch screens drags stay off so the page can scroll; clicks still work.',
      'Clicking an event opens a details panel next to it with the time, place and description; renderEventDetails adds your content, such as Edit and Delete buttons.',
      'Names, the first day of the week and the clock follow the locale (Intl); weekStartsOn and hourCycle override them. timeZone shows today, the current time and events in that time zone; callbacks still get real Date instants.',
    ],
    usage: 'Usage',
    usageText:
      'Give the Agenda a parent with a height (a page section, 100dvh or a flex child). Keep events in your state and update them in the callbacks: Agenda never changes them itself. Pass labels for languages other than English.',
    keyboard: 'Keyboard',
    keyboardItems: [
      'Month: the arrow keys move between days, Home and End go to the ends of the week, Page Up and Page Down change the month, Enter opens the day.',
      'Events are buttons: Tab reaches them, Enter opens them.',
      'Alt + ↑ / ↓ moves a focused event by snapMinutes, Alt + ← / → by a day, Alt + Shift + ↑ / ↓ changes its end. Delete or Backspace calls onEventDelete.',
      'Escape closes the details panel and returns focus to the event.',
    ],
    api: 'API reference',
    a11y: 'Accessibility',
    a11yItems: [
      'The month is a grid of rows and cells; today has aria-current="date".',
      'Each day of the week view is a named group; each event button’s name has its title, time and status.',
      'The period title is a heading (headingLevel) and a polite live region, so moving to another period is announced.',
      'The details panel is a dialog named by the event title; it takes focus when it opens.',
    ],
    props: {
      events: '{ id, title, start, end, allDay?, color?, status?, readOnly?, location?, description? }. For all-day events end is the last day.',
      view: 'The view shown (controlled); defaultView for uncontrolled.',
      views: 'The views in the switch, in order; one view hides the switch.',
      date: 'A day in the period shown (controlled); defaultDate for uncontrolled.',
      locale: 'Locale for names, week start and clock.',
      resources: '{ id, name, color?, description?, workingHours?, unavailable? }: splits the week and day views into a column per resource. Events take it by resourceId; ranges carry it.',
      timeZone: 'IANA time zone for today, the current time and event times.',
      hourCycle: '12 or 24 hour clock.',
      weekStartsOn: '0 = Sunday … 6 = Saturday.',
      startHour: 'First and last hours of the time grid (endHour).',
      scrollToHour: 'The hour the time grid scrolls to.',
      snapMinutes: 'The step of drags and Alt + arrow moves.',
      maxEvents: 'Events per month cell before “+N more”.',
      onEventClick: 'An event was clicked.',
      onDayClick: 'An empty part of a month cell was clicked.',
      onSlotClick: 'An empty time slot or all-day cell was clicked; the range is defaultEventMinutes long.',
      onEventCreate: 'Turns on drag to create.',
      onEventMove: 'Turns on drag to move.',
      onEventResize: 'Turns on the resize handle.',
      onEventDelete: 'Delete or Backspace on a focused event.',
      selectedEventId: 'The selected event (controlled), with onEventSelect.',
      eventDetails: 'Opens the details panel on click.',
      renderEventDetails: 'Extra content of the details panel.',
      actions: 'In the toolbar, before the view switch.',
      toolbar: 'Shows the toolbar.',
      headingLevel: 'The level of the period title.',
      labels: 'Texts: today, previous, next, view, views, allDay, more(n), noEvents, close, unconfirmed, declined.',
    },
  },
  tr: {
    description: 'Tam sayfa bir takvim: etkinliklerin ay, hafta, gün ve liste görünümleri; sürükleyerek oluşturma, taşıma ve boyutlandırma. Bulunduğu alanı doldurur.',
    behavior: 'Davranış',
    behaviorItems: [
      'Araç çubuğunda Bugün, önceki ve sonraki, dönem başlığı ve görünümler için bir Segment vardır. actions Segment’ten önce gelir, örneğin “Yeni etkinlik” Button’ı.',
      'Ay: her hafta bir satırdır. Tüm gün ve çok günlü etkinlikler günler boyunca uzanan şeritlerdir; tek günlük etkinlikler nokta, başlangıç saati ve başlıkla görünür. Bir güne sığmayan etkinlik varsa son satır “+N daha” olur ve o günü açar. maxEvents="auto" hücre yüksekliğine göre sığdırır.',
      'Hafta ve gün: gün başlıkları, tüm gün satırı ve scrollToHour saatine kayan bir saat ızgarası. Çakışan etkinlikler yan yana durur. Bugünün sütununda kırmızı bir çizgi şu anki saati gösterir; saat sütununda da saat yazar.',
      'Kaynağa göre bölme: resources verildiğinde hafta ve gün görünümleri her kişi, oda ya da koltuk için bir sütun alır; üstünde renk noktası ve ad durur. workingHours (haftanın günlerine göre bir ya da birkaç aralık) dışındaki ve unavailable aralıklarındaki saatler taralıdır; oraya etkinlik oluşturulamaz ya da bırakılamaz, oraya tıklamak boş slot sayılmaz. Bir etkinliği başka sütuna sürüklemek onu o kaynağa taşır. Sütunlar sığmazsa yapışkan saat sütununun altında yana kayar; şu anki saat çizgisi hepsini keser.',
      'Liste: ayın etkinlik olan günleri, her biri saat sırasıyla etkinlikleriyle.',
      'Renkler: color 1–6 bir grafik rengi alır (--color-chart-1…6), böylece etkinlikler markaya uyar; başka bir metin CSS rengi olarak kullanılır.',
      'Durum: onaylanmamış etkinlikler kesik çizgilidir, reddedilenlerin üstü çizilir ve solar, geçmiş etkinlikler soluktur, readOnly etkinlikler taşınamaz, boyutlandırılamaz ve silinemez.',
      'Düzenleme, ilgili callback verildiğinde açılır. Fare ya da kalemle boş bir alanı sürükleyerek oluşturun, etkinliği sürükleyerek taşıyın (günler arasında da) ve alt kenarını sürükleyerek boyutlandırın; saatler snapMinutes adımına yapışır. Escape sürüklemeyi iptal eder. Dokunmatik ekranlarda sayfa kayabilsin diye sürükleme kapalıdır; tıklamalar çalışır.',
      'Bir etkinliğe tıklamak yanında saat, yer ve açıklamanın olduğu bir detay paneli açar; renderEventDetails kendi içeriğinizi ekler, örneğin Düzenle ve Sil butonları.',
      'Adlar, haftanın ilk günü ve saat biçimi yerel ayarı (Intl) izler; weekStartsOn ve hourCycle bunları değiştirir. timeZone bugünü, şu anki saati ve etkinlikleri o saat diliminde gösterir; callback’ler yine gerçek Date anları alır.',
    ],
    usage: 'Kullanım',
    usageText:
      'Agenda’ya yüksekliği olan bir üst öğe verin (bir sayfa bölümü, 100dvh ya da bir flex çocuğu). Etkinlikleri kendi state’inizde tutun ve callback’lerde güncelleyin: Agenda onları kendisi değiştirmez. İngilizce dışındaki diller için labels verin.',
    keyboard: 'Klavye',
    keyboardItems: [
      'Ay: ok tuşları günler arasında gezer, Home ve End haftanın uçlarına gider, Page Up ve Page Down ayı değiştirir, Enter günü açar.',
      'Etkinlikler butondur: Tab ile ulaşılır, Enter ile açılır.',
      'Alt + ↑ / ↓ odaktaki etkinliği snapMinutes kadar, Alt + ← / → bir gün kaydırır, Alt + Shift + ↑ / ↓ bitişini değiştirir. Delete ya da Backspace onEventDelete’i çağırır.',
      'Escape detay panelini kapatır ve odağı etkinliğe geri verir.',
    ],
    api: 'API',
    a11y: 'Erişilebilirlik',
    a11yItems: [
      'Ay görünümü satır ve hücrelerden oluşan bir grid’dir; bugün aria-current="date" taşır.',
      'Hafta görünümünün her günü adlandırılmış bir gruptur; her etkinlik butonunun adında başlığı, saati ve durumu vardır.',
      'Dönem başlığı bir başlık öğesi (headingLevel) ve kibar bir canlı bölgedir; başka döneme geçince duyurulur.',
      'Detay paneli etkinlik başlığıyla adlandırılan bir dialog’dur; açılınca odağı alır.',
    ],
    props: {
      events: '{ id, title, start, end, allDay?, color?, status?, readOnly?, location?, description? }. Tüm gün etkinliklerde end son gündür.',
      view: 'Gösterilen görünüm (kontrollü); kontrolsüz için defaultView.',
      views: 'Görünüm seçicideki görünümler, sırasıyla; tek görünüm seçiciyi gizler.',
      date: 'Gösterilen dönemdeki bir gün (kontrollü); kontrolsüz için defaultDate.',
      locale: 'Adlar, hafta başlangıcı ve saat için yerel ayar.',
      resources: '{ id, name, color?, description?, workingHours?, unavailable? }: hafta ve gün görünümlerini her kaynak için bir sütuna böler. Etkinlikler resourceId ile bağlanır; aralıklar onu taşır.',
      timeZone: 'Bugün, şu anki saat ve etkinlik saatleri için IANA saat dilimi.',
      hourCycle: '12 ya da 24 saat.',
      weekStartsOn: '0 = Pazar … 6 = Cumartesi.',
      startHour: 'Saat ızgarasının ilk ve son saatleri (endHour).',
      scrollToHour: 'Saat ızgarasının kaydığı saat.',
      snapMinutes: 'Sürüklemelerin ve Alt + ok hareketlerinin adımı.',
      maxEvents: '“+N daha”dan önce ay hücresindeki etkinlik sayısı.',
      onEventClick: 'Bir etkinliğe tıklandı.',
      onDayClick: 'Ay hücresinin boş bir yerine tıklandı.',
      onSlotClick: 'Boş bir saat aralığına ya da tüm gün hücresine tıklandı; aralık defaultEventMinutes uzunluğundadır.',
      onEventCreate: 'Sürükleyerek oluşturmayı açar.',
      onEventMove: 'Sürükleyerek taşımayı açar.',
      onEventResize: 'Boyutlandırma tutamacını açar.',
      onEventDelete: 'Odaktaki etkinlikte Delete ya da Backspace.',
      selectedEventId: 'Seçili etkinlik (kontrollü), onEventSelect ile.',
      eventDetails: 'Tıklayınca detay panelini açar.',
      renderEventDetails: 'Detay panelinin ek içeriği.',
      actions: 'Araç çubuğunda, görünüm seçiciden önce.',
      toolbar: 'Araç çubuğunu gösterir.',
      headingLevel: 'Dönem başlığının seviyesi.',
      labels: 'Metinler: today, previous, next, view, views, allDay, more(n), noEvents, close, unconfirmed, declined.',
    },
  },
};

export async function generateMetadata(): Promise<Metadata> {
  return { title: 'Agenda' };
}

export default async function AgendaPage({ params }: Props) {
  const lang = (await params).lang as Locale;
  const t = getDictionary(lang);
  const c = COPY[lang];
  return (
    <ViewProvider>
      <DocPage eyebrow={t.nav.molecules} title="Agenda" description={c.description}>
        <h2 id="playground">{t.component.playground}</h2>
        <AgendaPlayground />
        <h2 id="behavior">{c.behavior}</h2>
        <ul>
          {c.behaviorItems.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <h2 id="keyboard">{c.keyboard}</h2>
        <ul>
          {c.keyboardItems.map((a) => (
            <li key={a}>{a}</li>
          ))}
        </ul>
        <ForView view="developer">
          <h2 id="usage">{c.usage}</h2>
          <p>{c.usageText}</p>
          <CodeBlock
            code={`import { useState } from 'react';\nimport { Agenda, type AgendaEvent, type AgendaRange } from '@ladom/ui/pro';\n\nexport function TeamCalendar() {\n  const [events, setEvents] = useState<AgendaEvent[]>(initialEvents);\n  const update = (id: string, r: AgendaRange) =>\n    setEvents((list) => list.map((e) => (e.id === id ? { ...e, ...r } : e)));\n\n  return (\n    <div style={{ blockSize: '100dvh' }}>\n      <Agenda\n        events={events}\n        locale="tr-TR"\n        defaultView="week"\n        onEventCreate={(r) => setEvents((list) => [...list, { id: crypto.randomUUID(), title: 'New event', ...r }])}\n        onEventMove={(e, r) => update(e.id, r)}\n        onEventResize={(e, r) => update(e.id, r)}\n        onEventDelete={(e) => setEvents((list) => list.filter((x) => x.id !== e.id))}\n      />\n    </div>\n  );\n}`}
          />
          <h2 id="api">{c.api}</h2>
          <PropsTable
            props={[
              ['events', 'AgendaEvent[]', '—'],
              ['view', "'month' | 'week' | 'day' | 'list'", "'month'"],
              ['views', 'AgendaView[]', 'all four'],
              ['date', 'Date', 'today'],
              ['resources', 'AgendaResource[]', '—'],
              ['locale', 'string', 'browser'],
              ['timeZone', 'string', 'browser'],
              ['hourCycle', '12 | 24', 'locale'],
              ['weekStartsOn', '0 … 6', 'locale'],
              ['startHour', 'number', '0 / 24'],
              ['scrollToHour', 'number', '8'],
              ['snapMinutes', 'number', '15'],
              ['maxEvents', "number | 'auto'", "'auto'"],
              ['onEventClick', '(event) => void', '—'],
              ['onDayClick', '(date) => void', '—'],
              ['onSlotClick', '(range) => void', '—'],
              ['onEventCreate', '(range) => void', '—'],
              ['onEventMove', '(event, range) => void', '—'],
              ['onEventResize', '(event, range) => void', '—'],
              ['onEventDelete', '(event) => void', '—'],
              ['selectedEventId', 'string | null', '—'],
              ['eventDetails', 'boolean', 'true'],
              ['renderEventDetails', '(event, close) => ReactNode', '—'],
              ['actions', 'ReactNode', '—'],
              ['toolbar', 'boolean', 'true'],
              ['headingLevel', '2 | 3 | 4', '2'],
              ['labels', 'Partial<AgendaLabels>', 'English'],
            ]}
            descriptions={c.props}
          />
          <h2 id="accessibility">{c.a11y}</h2>
          <ul>
            {c.a11yItems.map((a) => (
              <li key={a}>{a}</li>
            ))}
          </ul>
        </ForView>
      </DocPage>
    </ViewProvider>
  );
}
