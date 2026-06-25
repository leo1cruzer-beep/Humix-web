import { supabase } from '../lib/supabase';

export const useActivityLogger = () => {
  const userId = localStorage.getItem('humix_user_id');

  const logActivity = async (serviceName, category, preview) => {
    if (!userId) return;
    try {
      await supabase.from('conversations').insert({
        user_id: userId,
        service: serviceName,
        category: category,
        preview: preview?.slice(0, 100),
        created_at: new Date().toISOString(),
      });
    } catch (e) {
      console.error('Activity log failed:', e);
    }
  };

  return { logActivity };
};
