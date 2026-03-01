import { defineField, defineType } from 'sanity';

export const contactInfo = defineType({
  name: 'contactInfo',
  title: 'Kontaktdaten',
  type: 'document',
  fields: [
    defineField({
      name: 'email',
      title: 'E-Mail',
      type: 'string',
    }),
    defineField({
      name: 'phone',
      title: 'Telefon',
      type: 'string',
    }),
    defineField({
      name: 'address',
      title: 'Adresse',
      type: 'text',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Soziale Links',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'platform', title: 'Plattform', type: 'string' },
            { name: 'url', title: 'URL', type: 'url' },
          ],
        },
      ],
    }),
    defineField({
      name: 'contactMessage',
      title: 'Kontaktseiten-Nachricht',
      type: 'array',
      of: [{ type: 'block' }],
    }),
  ],
});
