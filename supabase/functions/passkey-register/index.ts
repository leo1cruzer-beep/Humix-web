import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from 'https://esm.sh/@simplewebauthn/server@10';

const RP_ID = 'humix.app';
const RP_NAME = 'Humix Identity';
const ORIGIN = 'https://humix.app';

// In-memory challenge store (per cold-start instance)
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

  try {
    if (path.endsWith('/generate-options')) {
      const { userId, displayName } = await req.json();
      const uid = userId ?? crypto.randomUUID();

      const options = await generateRegistrationOptions({
        rpName: RP_NAME,
        rpID: RP_ID,
        userID: new TextEncoder().encode(uid),
        userName: displayName ?? `user_${uid.slice(0, 8)}`,
        attestationType: 'none',
        authenticatorSelection: {
          residentKey: 'preferred',
          userVerification: 'preferred',
        },
      });

      challenges.set(uid, options.challenge);

      return new Response(
        JSON.stringify({ options, userId: uid }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    if (path.endsWith('/verify')) {
      const { userId, registrationResponse } = await req.json();
      const expectedChallenge = challenges.get(userId);
      if (!expectedChallenge) {
        return new Response(JSON.stringify({ error: 'Challenge not found or expired' }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const verification = await verifyRegistrationResponse({
        response: registrationResponse,
        expectedChallenge,
        expectedOrigin: ORIGIN,
        expectedRPID: RP_ID,
        requireUserVerification: false,
      });

      if (!verification.verified || !verification.registrationInfo) {
        return new Response(JSON.stringify({ verified: false }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

      const { credential } = verification.registrationInfo;

      const supabase = createClient(
        Deno.env.get('SUPABASE_URL') ?? '',
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      );

      const credentialIdB64 = Buffer.from(credential.id).toString('base64url');
      const publicKeyB64 = Buffer.from(credential.publicKey).toString('base64url');

      const { error } = await supabase.from('passkeys').insert({
        credential_id: credentialIdB64,
        public_key: publicKeyB64,
        user_id: userId,
        sign_count: credential.counter,
      });

      if (error) {
        return new Response(JSON.stringify({ error: error.message }), {
          status: 500,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }

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
