import { defineField, defineType } from 'sanity';

export const event = defineType({
  name: 'event',
  title: 'Event',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Titel',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'eventDate',
      title: 'Datum',
      type: 'datetime',
      description: 'Datum und Uhrzeit des Events',
    }),
    defineField({
      name: 'location',
      title: 'Ort',
      type: 'string',
      description: 'Spielort oder Treffpunkt',
    }),
    defineField({
      name: 'description',
      title: 'Kurzbeschreibung',
      type: 'text',
      description: 'Kurze Beschreibung für die Übersicht',
    }),
    defineField({
      name: 'image',
      title: 'Bild',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'content',
      title: 'Details',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Ausführliche Event-Beschreibung',
    }),
  ],
  orderings: [
    {
      title: 'Datum, neu',
      name: 'eventDateDesc',
      by: [{ field: 'eventDate', direction: 'desc' }],
    },
    {
      title: 'Datum, alt',
      name: 'eventDateAsc',
      by: [{ field: 'eventDate', direction: 'asc' }],
    },
  ],
});
