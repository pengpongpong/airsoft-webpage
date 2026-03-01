import { defineField, defineType } from 'sanity';

export const aboutPage = defineType({
  name: 'aboutPage',
  title: 'Über uns',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Seitentitel',
      type: 'string',
      initialValue: 'Über uns',
    }),
    defineField({
      name: 'heroImage',
      title: 'Hero-Bild',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'content',
      title: 'Über-uns-Inhalt',
      type: 'array',
      of: [{ type: 'block' }],
    }),
    defineField({
      name: 'mission',
      title: 'Unsere Mission',
      type: 'text',
    }),
    defineField({
      name: 'founded',
      title: 'Gegründet',
      type: 'string',
      description: 'Jahr oder Datum der Vereinsgründung',
    }),
    defineField({
      name: 'membersCount',
      title: 'Mitglieder',
      type: 'string',
      description: 'Ungefähre Mitgliederzahl oder Bereich',
    }),
  ],
});
