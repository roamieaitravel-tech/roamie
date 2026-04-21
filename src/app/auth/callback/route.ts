import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    // Exchange the code for a session
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);
    
    if (!exchangeError) {
      // Fetch the currently authenticated user
      const { data: { user }, error: userError } = await supabase.auth.getUser();

      if (user && !userError) {
        // Check if the user profile exists in public.profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('onboarding_completed')
          .eq('user_id', user.id)
          .maybeSingle();
        
        // If profile does NOT exist (or fails to load), redirect to onboarding
        if (!profile) {
          return NextResponse.redirect(`${origin}/onboarding`);
        }

        // If YES (profile exists), redirect to /dashboard
        return NextResponse.redirect(`${origin}/dashboard`);
      }
    } else {
      console.error('Error exchanging oauth code:', exchangeError);
    }
  }

  // Proper error handling if OAuth fails or lacks code
  return NextResponse.redirect(`${origin}/login?error=authentication_failed`);
}
