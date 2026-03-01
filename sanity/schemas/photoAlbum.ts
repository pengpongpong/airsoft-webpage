import { defineField, defineType } from 'sanity';

export const photoAlbum = defineType({
  name: 'photoAlbum',
  title: 'Photoalbum',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Albumtitel',
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
      title: 'Event-Datum',
      type: 'date',
    }),
    defineField({
      name: 'description',
      title: 'Beschreibung',
      type: 'text',
    }),
    defineField({
      name: 'images',
      title: 'Fotos',
      type: 'array',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            {
              name: 'caption',
              type: 'string',
              title: 'Bildunterschrift',
            },
            {
              name: 'alt',
              type: 'string',
              title: 'Alt-Text',
              description: 'Bild für Barrierefreiheit beschreiben',
            },
          ],
        },
      ],
    }),
  ],
  orderings: [
    {
      title: 'Event-Datum, neu',
      name: 'eventDateDesc',
      by: [{ field: 'eventDate', direction: 'desc' }],
    },
  ],
});
