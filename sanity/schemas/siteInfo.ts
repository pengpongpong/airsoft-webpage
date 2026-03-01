import { defineField, defineType } from 'sanity';

export const siteInfo = defineType({
  name: 'siteInfo',
  title: 'Seiten-Info',
  type: 'document',
  fields: [
    defineField({
      name: 'clubName',
      title: 'Vereinsname',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Slogan',
      type: 'string',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero-Bild',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'infoContent',
      title: 'Info-Seiten-Inhalt',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'gameSchedule',
      title: 'Spielplan',
      type: 'text',
      description: 'Kommende Spiele und Events',
    }),
    defineField({
      name: 'rules',
      title: 'Regeln & Richtlinien',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});
