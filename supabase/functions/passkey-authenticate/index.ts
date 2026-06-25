import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from 'https://esm.sh/@simplewebauthn/server@10';

const RP_ID = 'humix.app';
const ORIGIN = 'https://humix.app';

const challenges = new Map<string, string>();

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const url = new URL(req.url);
  const path = url.pathname;

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
  );

  try {
    if (path.endsWith('/generate-options')) {
      const { userId } = await req.json();

      // Fetch all credential IDs for this user
      const { data: passkeys, error } = await supabase
        .from('passkeys')
        .select('credential_id')
        .eq('user_id', userId);

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const allowCredentials = (passkeys ?? []).map((p: { credential_id: string }) => ({
        id: p.credential_id,
        type: 'public-key' as const,
      }));

      const options = await generateAuthenticationOptions({
        rpID: RP_ID,
        userVerification: 'preferred',
        allowCredentials,
      });

      challenges.set(userId, options.challenge);

      return new Response(
        JSON.stringify({ options }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (path.endsWith('/verify')) {
      const { userId, authenticationResponse } = await req.json();
      const expectedChallenge = challenges.get(userId);
      if (!expectedChallenge) {
        return new Response(JSON.stringify({ error: 'Challenge not found or expired' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Look up passkey by credential_id
      const credentialId = authenticationResponse.id;
      const { data: passkey, error: pkError } = await supabase
        .from('passkeys')
        .select('*')
        .eq('credential_id', credentialId)
        .eq('user_id', userId)
        .single();

      if (pkError || !passkey) {
        return new Response(JSON.stringify({ error: 'Credential not found' }), {
          status: 404,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const publicKeyBytes = Uint8Array.from(
        atob(passkey.public_key.replace(/-/g, '+').replace(/_/g, '/')),
        c => c.charCodeAt(0),
      );

      const verification = await verifyAuthenticationResponse({
        response: authenticationResponse,
        expectedChallenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
        requireUserVerification: false,
        credential: {
          id: passkey.credential_id,
          publicKey: publicKeyBytes,
          counter: passkey.sign_count,
        },
      });

      if (!verification.verified) {
        return new Response(JSON.stringify({ verified: false }), {
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      // Update sign_count to prevent replay attacks
      await supabase
        .from('passkeys')
        .update({ sign_count: verification.authenticationInfo.newCounter })
        .eq('credential_id', credentialId);

      challenges.delete(userId);

      return new Response(
        JSON.stringify({ verified: true, userId }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    return new Response('Not found', { status: 404, headers: corsHeaders });
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
