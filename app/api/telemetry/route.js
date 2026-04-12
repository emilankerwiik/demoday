import { createClient } from '@supabase/supabase-js';
import crypto from 'crypto';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function POST(request) {
  try {
    // Only accept POST requests
    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Validate Supabase config
    if (!supabaseUrl || !supabaseAnonKey) {
      console.error('Missing Supabase configuration');
      return new Response(JSON.stringify({ error: 'Server configuration error' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Parse request body
    const body = await request.json();

    // Validate required fields
    const { event, version, os, duration_ms, flow_types = [], success } = body;

    if (!event || !version || !os || typeof duration_ms !== 'number' || typeof success !== 'boolean') {
      return new Response(JSON.stringify({ error: 'Missing or invalid required fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Hash IP for optional deduplication (not storing raw IP)
    const ip = request.headers.get('x-forwarded-for') || request.headers.get('cf-connecting-ip') || 'unknown';
    const ipHash = crypto.createHash('sha256').update(ip + process.env.IP_SALT || 'salt').digest('hex').substring(0, 16);

    // Initialize Supabase client with anon key (allows RLS policies)
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // Insert telemetry record
    const { data, error } = await supabase
      .from('telemetry')
      .insert({
        event,
        version,
        os,
        duration_ms,
        flow_types: Array.isArray(flow_types) ? flow_types : [],
        success,
        ip_hash: ipHash,
      });

    if (error) {
      console.error('Supabase insert error:', error);
      return new Response(JSON.stringify({ error: 'Failed to store telemetry' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Return success response
    return new Response(JSON.stringify({ success: true, id: data?.[0]?.id }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Telemetry endpoint error:', err);
    // Silently fail - never block user's workflow on telemetry errors
    return new Response(JSON.stringify({ success: true }), {
      status: 201,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
