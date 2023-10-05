import { createClient } from '@supabase/supabase-js';

export const initializeSupabase = () => {
  const supabaseUrl = process.env.VIZHUB_SUPABASE_URL;
  const supabaseKey = process.env.VIZHUB_SUPABASE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error('Missing Supabase URL or key');
  }

  // Create a single supabase client for interacting with your database
  const supabase = createClient(supabaseUrl, supabaseKey);

  // // Store the vector in Postgres
  // const { data, error } = await supabase
  //   .from('posts')
  //   .insert({
  //     title,
  //     body,
  //     embedding,
  //   });
  return supabase;
};