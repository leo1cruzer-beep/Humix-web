import { supabase } from '../lib/supabase';

export const useActivityLogger = () => {
  const userId = localStorage.getItem('humix_user_id');

  const logActivity = async (serviceName, category, preview) => {
    if (!userId) return;

    await fetch('/api/create-profile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId }),
    }).catch(() => {});

    const { error } = await supabase.from('conversations').insert({
      user_id: userId,
      service: serviceName,
      category: category,
      preview: preview?.slice(0, 100),
      messages: [{ role: 'assistant', content: preview }],
      created_at: new Date().toISOString(),
    });
    if (error) {
      console.error('Supabase insert error:', JSON.stringify(error));
    }
  };

  return { logActivity };
};
