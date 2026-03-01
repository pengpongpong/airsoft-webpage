import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemas';

export default defineConfig({
  name: 'airsoft-club',
  title: 'Airsoft Club Verwaltung',
  projectId: import.meta.env.PUBLIC_SANITY_PROJECT_ID ?? 'your-project-id',
  dataset: import.meta.env.PUBLIC_SANITY_DATASET ?? 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
