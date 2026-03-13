import { defineField, defineType } from 'sanity';

export const vorstandMember = defineType({
  name: 'vorstandMember',
  title: 'Vorstandsmitglied',
  type: 'object',
  fields: [
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'role',
      title: 'Funktion',
      type: 'string',
      description: 'z.B. 1. Vorsitzender, 2. Vorsitzender, Kassenwart, Schriftführer',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'E-Mail',
      type: 'string',
    }),
  ],
  preview: {
    select: { name: 'name', role: 'role' },
    prepare: ({ name, role }) => ({
      title: name,
      subtitle: role,
    }),
  },
});

export const vereinLegal = defineType({
  name: 'vereinLegal',
  title: 'Vereinsrechtliches',
  type: 'document',
  description: 'Vereinsnummer, Registergericht, Vorstand und rechtliche Angaben (Impressum, Datenschutz)',
  fields: [
    defineField({
      name: 'vereinsnummer',
      title: 'Vereinsnummer',
      type: 'string',
      description: 'VR-Nummer beim Amtsgericht (z.B. VR 12345)',
    }),
    defineField({
      name: 'registergericht',
      title: 'Registergericht',
      type: 'string',
      description: 'z.B. Amtsgericht Musterstadt',
    }),
    defineField({
      name: 'sitz',
      title: 'Sitz des Vereins',
      type: 'string',
      description: 'Ort des Vereinssitzes',
    }),
    defineField({
      name: 'vorstand',
      title: 'Vorstand',
      type: 'array',
      of: [{ type: 'vorstandMember' }],
      description: 'Vorstandsmitglieder mit Namen und Funktionen',
    }),
    defineField({
      name: 'steuernummer',
      title: 'Steuernummer',
      type: 'string',
      description: 'Falls gemeinnützig – optional',
    }),
    defineField({
      name: 'finanzamt',
      title: 'Finanzamt',
      type: 'string',
      description: 'Zuständiges Finanzamt – optional',
    }),
    defineField({
      name: 'satzungUrl',
      title: 'Satzung (URL)',
      type: 'url',
      description: 'Link zur Satzung als PDF – optional',
    }),
    defineField({
      name: 'impressum',
      title: 'Impressum',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Impressum gemäß § 5 TMG',
    }),
    defineField({
      name: 'datenschutz',
      title: 'Datenschutzerklärung',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Datenschutzerklärung gemäß DSGVO',
    }),
  ],
});
