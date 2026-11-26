// Server-side helper for recording security events (3 types only).
//
// Fail-open by design: if the security_events table / function does not
// exist yet (SQL draft not applied) or the call errors, recording is
// silently skipped and the request continues exactly as before. This
// helper never throws and never logs anything.
//
// No email is sent here. No PII is stored: callers pass short fixed
// labels only — never passwords, tokens, emails, or IP addresses.
// No service_role key is used; the SECURITY DEFINER function
// record_security_event() is called with the anon key.

const EVENT_TYPES = ['failed_login', 'blocked_attempt', 'admin_grant']

export async function recordSecurityEvent(supabase, eventType, detail, actorId, targetId) {
  try {
    if (!supabase || !EVENT_TYPES.includes(eventType)) return
    await supabase.rpc('record_security_event', {
      p_event_type: eventType,
      p_detail: detail || '',
      p_actor_id: actorId || null,
      p_target_id: targetId || null,
    })
  } catch {
    // Recording must never break the request it observes.
  }
}
