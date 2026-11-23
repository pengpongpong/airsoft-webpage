#!/usr/bin/env node
/**
 * Befüllt Sanity mit Platzhalter-Inhalten (Dummy-Texte).
 *
 * Voraussetzung in .env:
 *   PUBLIC_SANITY_PROJECT_ID=...
 *   PUBLIC_SANITY_DATASET=production
 *   SANITY_API_WRITE_TOKEN=...   (Token mit "Editor"-Rechten, https://sanity.io/manage → API → Tokens)
 *
 * Aufruf:
 *   node scripts/seed-sanity.mjs              → füllt nur LEERE Felder / legt fehlende Dokumente an
 *   node scripts/seed-sanity.mjs --overwrite  → ersetzt auch bestehende Texte durch die Platzhalter
 *
 * Das Script ist idempotent: mehrfaches Ausführen legt nichts doppelt an.
 */
import { loadEnv } from 'vite';
import { createClient } from '@sanity/client';
import { createReadStream } from 'fs';
import { resolve, basename } from 'path';

const env = loadEnv('development', process.cwd(), '');
const projectId = env.PUBLIC_SANITY_PROJECT_ID;
const dataset = env.PUBLIC_SANITY_DATASET || 'production';
const token = env.SANITY_API_WRITE_TOKEN;
const overwrite = process.argv.includes('--overwrite');

if (!projectId || !token) {
  console.error(
    'Fehlt in .env: ' +
      [!projectId && 'PUBLIC_SANITY_PROJECT_ID', !token && 'SANITY_API_WRITE_TOKEN'].filter(Boolean).join(', ')
  );
  process.exit(1);
}

const client = createClient({ projectId, dataset, token, apiVersion: '2024-01-01', useCdn: false });

/* ------------------------------------------------------------ Helpers */

let k = 0;
const key = () => `seed${Date.now().toString(36)}${(++k).toString(36)}`;

const block = (text, style = 'normal', listItem) => ({
  _type: 'block',
  _key: key(),
  style,
  ...(listItem ? { listItem, level: 1 } : {}),
  markDefs: [],
  children: [{ _type: 'span', _key: key(), text, marks: [] }],
});

/** Portable Text: "## " → Zwischenüberschrift (h3), "- " → Aufzählung, sonst Absatz. */
const pt = (...lines) =>
  lines.map((l) =>
    l.startsWith('## ') ? block(l.slice(3), 'h3') : l.startsWith('- ') ? block(l.slice(2), 'normal', 'bullet') : block(l)
  );

const slug = (current) => ({ _type: 'slug', current });

const assetCache = new Map();
async function image(file, extra = {}) {
  if (!assetCache.has(file)) {
    const asset = await client.assets.upload('image', createReadStream(resolve('public/Photos', file)), {
      filename: basename(file),
    });
    assetCache.set(file, asset._id);
  }
  return { _type: 'image', asset: { _type: 'reference', _ref: assetCache.get(file) }, ...extra };
}

/** Singleton (z. B. siteInfo): vorhandenes Dokument patchen oder neu anlegen. */
async function upsertSingleton(type, data) {
  const existingId = await client.fetch(`*[_type == $type && !(_id in path("drafts.**"))][0]._id`, { type });
  if (!existingId) {
    await client.create({ _type: type, ...data });
    console.log(`+ ${type} angelegt`);
    return;
  }
  const patch = client.patch(existingId);
  await (overwrite ? patch.set(data) : patch.setIfMissing(data)).commit();
  console.log(`~ ${type} ${overwrite ? 'überschrieben' : 'ergänzt (nur leere Felder)'}`);
}

/** Dokument mit fester ID (Events, Alben). */
async function upsertDoc(doc) {
  if (overwrite) await client.createOrReplace(doc);
  else await client.createIfNotExists(doc);
  console.log(`${overwrite ? '~' : '+'} ${doc._type} „${doc.title}“`);
}

/* --------------------------------------------------------------- Inhalte */

const TELEGRAM_URL = 'https://t.me/+RPahXTngC-tch6rs';

await upsertSingleton('siteInfo', {
  clubName: 'Airsoft Panthers Graz',
  tagline: 'Taktisches Airsoft in der Steiermark',
  telegramUrl: TELEGRAM_URL,
  infoContent: pt(
    'Die Airsoft Panthers Graz sind ein Verein für taktisches Airsoft in der Steiermark. Wir spielen regelmäßig auf Outdoor- und CQB-Geländen und legen großen Wert auf Sicherheit, Fairplay und Kameradschaft.',
    'Neue Spielerinnen und Spieler sind jederzeit willkommen – auch ohne eigene Ausrüstung. Leihausrüstung kann nach Absprache gestellt werden. Melde dich einfach vorab über unsere Telegram-Gruppe oder per E-Mail.',
    '## Teilnahmevoraussetzungen',
    '- Mindestalter 18 Jahre (ab 14 Jahren mit Einverständnis der Erziehungsberechtigten)',
    '- Gültiger Lichtbildausweis beim Check-in',
    '- Unterschriebene Haftungsverzichtserklärung'
  ),
  gameSchedule: `Sonntagsspiele
Jeden 1. und 3. Sonntag im Monat, 09:00 – 16:00 Uhr
Treffpunkt: Spielfeld Nord, Parkplatz am Waldrand

CQB-Training
Jeden Mittwoch, 18:30 – 21:00 Uhr
Halle Süd (nur nach Anmeldung)

Schnuppertag für Neueinsteiger
Jeden letzten Samstag im Monat, 10:00 – 14:00 Uhr`,
  rules: pt(
    '- Augenschutz (Schutzbrille nach EN 166) ist auf dem Spielfeld jederzeit Pflicht',
    '- Chrono-Limits: AEG max. 1,2 J, DMR max. 1,9 J (Mindestabstand 20 m), Sniper max. 2,3 J (Mindestabstand 30 m)',
    '- Treffer werden laut mit „HIT!“ angesagt – Ehrlichkeit ist Grundlage des Spiels',
    '- Kein Körperkontakt, keine Nahkampfwaffen aus hartem Material',
    '- Waffen außerhalb des Spielfelds nur im Safe-Modus und mit entferntem Magazin',
    '- Den Anweisungen der Spielleitung ist jederzeit Folge zu leisten'
  ),
});

await upsertSingleton('aboutPage', {
  title: 'Über uns',
  content: pt(
    'Wir sind eine Gemeinschaft von Airsoft-Enthusiasten aus Graz und Umgebung, die sich für sicheres, faires und spaßiges taktisches Spielen einsetzt. Ob du neu im Sport bist oder bereits jahrelange Erfahrung mitbringst – bei uns bist du willkommen.',
    'Was als kleine Gruppe von Freunden begann, ist heute ein eingetragener Verein mit eigenem Spielbetrieb, regelmäßigen Trainings und Teilnahmen an Großevents in ganz Österreich.',
    '## Was uns ausmacht',
    '- Abwechslungsreiche Szenarien von schnellen CQB-Runden bis zu ganztägigen Milsim-Spielen',
    '- Ein starkes Team, das Neulinge aktiv unterstützt',
    '- Klare Regeln und geschulte Spielleitung für maximale Sicherheit'
  ),
  mission:
    'Airsoft als fairen Teamsport in der Steiermark fördern und einen sicheren Rahmen für Spieler aller Erfahrungsstufen schaffen.',
  founded: '2018',
  membersCount: '45+',
});

await upsertSingleton('contactInfo', {
  email: 'info@beispiel-verein.at',
  phone: '+43 000 0000000',
  address: 'Musterstraße 1\n8010 Graz',
  socialLinks: [
    { _key: key(), platform: 'Facebook', url: 'https://www.facebook.com/AirsoftPanthersGraz/' },
    { _key: key(), platform: 'YouTube', url: 'https://www.youtube.com/@AirsoftPanthersGraz' },
    { _key: key(), platform: 'Instagram', url: 'https://www.instagram.com/airsoft_panthers_graz' },
    { _key: key(), platform: 'Telegram', url: TELEGRAM_URL },
  ],
  contactMessage: pt(
    'Hast du Fragen zu unserem Verein, kommenden Spielen oder wie du beitreten kannst? Melde dich – wir freuen uns, von dir zu hören.',
    'Für Schnuppertage bitten wir um eine kurze Anmeldung mindestens drei Tage im Voraus. Gib dabei bitte an, ob du Leihausrüstung benötigst.'
  ),
});

await upsertSingleton('vereinLegal', {
  vereinsnummer: 'ZVR 000000000',
  registergericht: 'Landespolizeidirektion Steiermark (Vereinsbehörde)',
  sitz: 'Graz',
  steuernummer: '00 000/0000',
  finanzamt: 'Finanzamt Österreich',
  vorstand: [
    { _key: key(), _type: 'vorstandMember', name: 'Max Mustermann', role: 'Obmann', email: 'obmann@beispiel-verein.at' },
    { _key: key(), _type: 'vorstandMember', name: 'Erika Musterfrau', role: 'Obmann-Stellvertreterin' },
    { _key: key(), _type: 'vorstandMember', name: 'Jonas Beispiel', role: 'Kassier' },
    { _key: key(), _type: 'vorstandMember', name: 'Lena Platzhalter', role: 'Schriftführerin' },
  ],
  impressum: pt(
    'Airsoft Panthers Graz – Verein zur Förderung des Airsoftsports',
    'Musterstraße 1, 8010 Graz, Österreich',
    'E-Mail: info@beispiel-verein.at',
    'Vertretungsberechtigt: Max Mustermann (Obmann)',
    'Inhaltlich verantwortlich gemäß § 25 MedienG: Vorstand der Airsoft Panthers Graz'
  ),
  datenschutz: pt(
    'Der Schutz deiner persönlichen Daten ist uns ein besonderes Anliegen. Wir verarbeiten deine Daten ausschließlich auf Grundlage der gesetzlichen Bestimmungen (DSGVO, TKG 2021).',
    '## Kontakt mit uns',
    'Wenn du per E-Mail Kontakt mit uns aufnimmst, werden deine angegebenen Daten zwecks Bearbeitung der Anfrage und für den Fall von Anschlussfragen sechs Monate bei uns gespeichert. Diese Daten geben wir nicht ohne deine Einwilligung weiter.',
    '## Deine Rechte',
    'Dir stehen grundsätzlich die Rechte auf Auskunft, Berichtigung, Löschung, Einschränkung, Datenübertragbarkeit, Widerruf und Widerspruch zu. Wende dich dazu an die oben angegebene E-Mail-Adresse.'
  ),
});

/* ---------------------------------------------------------------- Events */

const events = [
  {
    _id: 'seed-event-operation-winterwolf',
    title: 'Operation Winterwolf',
    slug: 'operation-winterwolf',
    eventDate: '2027-01-17T07:00:00.000Z',
    location: 'Spielfeld Nord, Graz-Umgebung',
    description:
      'Ganztägiges Milsim-Szenario im Schnee: zwei Fraktionen, wechselnde Missionsziele und eine nächtliche Abschlussphase.',
    image: 'landscape-photo.png',
    content: pt(
      'Zum Jahresauftakt laden wir zu unserem großen Winter-Event. Zwei Fraktionen kämpfen über den ganzen Tag um strategische Punkte auf dem Gelände.',
      '## Ablauf',
      '- 08:00 Check-in und Chrono',
      '- 09:00 Briefing',
      '- 09:30 – 16:00 Spielbetrieb mit Missionswechseln',
      '- 16:30 Nachtphase (optional)',
      '## Kosten',
      'Mitglieder 15 €, Gäste 25 €. Verpflegung vor Ort erhältlich.'
    ),
  },
  {
    _id: 'seed-event-cqb-night',
    title: 'CQB Night',
    slug: 'cqb-night',
    eventDate: '2026-12-12T17:00:00.000Z',
    location: 'Halle Süd, Graz',
    description: 'Schnelle Runden auf engem Raum – Teamtaktik, Raumklärung und jede Menge Action in der Halle.',
    image: 'team photo.png',
    content: pt(
      'Unsere CQB Night bietet kurze, intensive Runden in verschiedenen Spielmodi. Ideal, um Teamkommunikation und Bewegungsabläufe zu trainieren.',
      'Achtung: In der Halle gilt ein reduziertes Energielimit von 0,5 J. Pyrotechnik ist nicht erlaubt.'
    ),
  },
  {
    _id: 'seed-event-schnuppertag',
    title: 'Schnuppertag für Neueinsteiger',
    slug: 'schnuppertag',
    eventDate: '2026-11-28T09:00:00.000Z',
    location: 'Spielfeld Nord, Graz-Umgebung',
    description:
      'Du wolltest Airsoft schon immer ausprobieren? Leihausrüstung, Einweisung und erste Spielrunden mit erfahrenen Mitgliedern.',
    image: 'panther-mobil.png',
    content: pt(
      'Beim Schnuppertag lernst du die Grundlagen des Airsoftsports kennen: Sicherheitsregeln, Ausrüstung, Kommunikation im Team und einfache Spielmodi.',
      'Leihausrüstung (Replika, Schutzbrille, Weste) ist inklusive. Bitte festes Schuhwerk und wetterfeste Kleidung mitbringen.'
    ),
  },
];

for (const e of events) {
  await upsertDoc({ ...e, _type: 'event', slug: slug(e.slug), image: await image(e.image) });
}

/* ---------------------------------------------------------------- Alben */

const photoSet = [
  { file: 'team photo.png', alt: 'Teamfoto', caption: 'Gruppenfoto nach dem Spiel' },
  { file: 'landscape-photo.png', alt: 'Spielgelände', caption: 'Blick über das Spielfeld' },
  { file: 'panther-mobil.png', alt: 'Panther-Mobil', caption: 'Unser Panther-Mobil' },
];

const albums = [
  {
    _id: 'seed-album-herbstoffensive-2026',
    title: 'Herbstoffensive 2026',
    slug: 'herbstoffensive-2026',
    eventDate: '2026-10-18',
    description: 'Impressionen von unserem großen Herbst-Event mit über 60 Teilnehmern.',
    photos: [photoSet[1], photoSet[0], photoSet[2]],
  },
  {
    _id: 'seed-album-sommerturnier-2026',
    title: 'Sommerturnier',
    slug: 'sommerturnier-2026',
    eventDate: '2026-07-12',
    description: 'Teams aus der ganzen Steiermark beim Sommerturnier.',
    photos: photoSet,
  },
  {
    _id: 'seed-album-vereinsleben',
    title: 'Vereinsleben',
    slug: 'vereinsleben',
    eventDate: '2026-05-01',
    description: 'Trainings, Grillabende und alles, was neben dem Spielfeld passiert.',
    photos: [photoSet[2], photoSet[0], photoSet[1]],
  },
];

for (const { photos, ...a } of albums) {
  const images = [];
  for (const p of photos) images.push({ _key: key(), ...(await image(p.file, { alt: p.alt, caption: p.caption })) });
  await upsertDoc({ ...a, _type: 'photoAlbum', slug: slug(a.slug), images });
}

console.log('\nFertig.');
