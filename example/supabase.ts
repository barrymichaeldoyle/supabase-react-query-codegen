import { createClient } from '@supabase/supabase-js';

import type { Database } from './database.types';

export const supabase = createClient<Database>('supabsase-url', 'supabase-key');
