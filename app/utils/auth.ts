import { supabase } from '../lib/supabase';

// ユーザー認証を行う関数
export const signInUser = async (email: string, password: string) => {
  const { data: user, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) {
    console.error('ログインエラー:', error.message);
    return null;
  }
  return user;
};