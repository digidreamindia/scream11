
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uovkcmcenzkkilhfapqj.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVvdmtjbWNlbnpra2lsaGZhcHFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM4MzY3ODEsImV4cCI6MjA1OTQxMjc4MX0.koq_0g_h3cDXAiF-hMJ7sVVWjko4cxe0DSdk5epSTF4';

export const supabase = createClient(supabaseUrl, supabaseKey);
