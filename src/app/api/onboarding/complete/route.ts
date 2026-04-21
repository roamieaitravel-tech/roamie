import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user || userError) {
      return NextResponse.json({ error: 'Unauthorized: User not found' }, { status: 401 });
    }

    const formData = await request.json();

    // Check if profile exists first (requested logic)
    const { data: existingProfile } = await supabase
      .from('profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle();

    // The user requested upsert logic explicitly:
    const { data, error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id, // Explicitly using id as per the user instruction
        email: user.email,
        full_name: formData.name,
        travel_style: formData.travelStyle,
        vibe: formData.vibe,
        location: formData.location,
        avatar_url: formData.avatar_url,
        onboarding_completed: true,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.error('Supabase upsert error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Fire-and-forget async notification trigger for "Profile Live" Welcome email
    fetch(new URL('/api/notifications/send', request.url).href, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "PROFILE_LIVE",
        userId: user.id,
        data: {
          email: user.email,
          name: formData.name
        }
      })
    }).catch(e => console.error("Dispatch mapping failed", e));

    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
