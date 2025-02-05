
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://bkhfpjckozgowcfcmbji.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJraGZwamNrb3pnb3djZmNtYmppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzczNjU1NDUsImV4cCI6MjA1Mjk0MTU0NX0.yNcAVIKFYNCsm-fuYEGayim8x4qQpnBnJUMIIdR_LGE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
