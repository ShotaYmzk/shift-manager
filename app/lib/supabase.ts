import { createClient } from '@supabase/supabase-js';

// SupabaseのURLとAPIキーを環境変数から読み込む
const SUPABASE_URL = "https://pjvxcneopejcxwzoxkdq.supabase.co"
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBqdnhjbmVvcGVqY3h3em94a2RxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg4NzExNDEsImV4cCI6MjA1NDQ0NzE0MX0.wPjByO-1igsrY1cBhKlz7_lWwlWBnhA9Rhwwyl-asw0"

// Supabaseクライアントを作成
export const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);