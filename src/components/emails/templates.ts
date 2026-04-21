/**
 * HTML Email Generators for Roamie
 * Compatible directly with Resend without requiring React renderers avoiding runtime edge crashes.
 */

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

const getEmailBaseLayout = (content: string) => `
<!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
    <style>
      body {
        background-color: #111111;
        color: #ffffff;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
      }
      .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
      .header { text-align: center; margin-bottom: 40px; }
      .logo { font-size: 20px; font-weight: bold; letter-spacing: 0.24em; text-transform: uppercase; color: #ffffff; text-decoration: none; }
      .card { background-color: #1c1c1e; border-radius: 32px; padding: 48px 40px; border: 1px solid #2c2c2e; }
      .title { font-size: 28px; font-weight: bold; margin-bottom: 20px; color: #ffffff; line-height: 1.3; }
      .text { font-size: 16px; line-height: 26px; color: #a1a1aa; margin-bottom: 32px; }
      .button { display: inline-block; background-color: #FF6B35; color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 40px; font-weight: 600; font-size: 16px; margin: 10px 0; }
      .footer { text-align: center; margin-top: 40px; font-size: 13px; color: #52525b; line-height: 20px; }
      .accent { color: #FF6B35; }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <a href="${siteUrl}" class="logo">roamie</a>
      </div>
      <div class="card">
        ${content}
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Roamie Travel. All rights reserved.<br/>
        This notification was sent specifically to your account.
      </div>
    </div>
  </body>
</html>
`;

export const getWelcomeEmail = (name: string) => getEmailBaseLayout(`
  <h1 class="title">Welcome to Roamie, ${name}! 🌍</h1>
  <p class="text">We're thrilled to have you. Our AI is standing by ready to plan your perfect trips, find you incredible travel companions, and ensure you get the lowest possible rates on flights and hotels.</p>
  <div style="text-align: center;">
    <a href="${siteUrl}/onboarding" class="button">Build Your Profile</a>
  </div>
  <p class="text" style="font-size: 14px; margin-top: 32px;">If you have any questions or need help securely setting up your account, simply reply to this email.</p>
`);

export const getProfileLiveEmail = (name: string) => getEmailBaseLayout(`
  <h1 class="title">Your Profile is <span class="accent">Live</span> ✨</h1>
  <p class="text">Congratulations ${name}, your Roamie account is fully setup and authenticated! You can now access our AI companion mapping, generate global itineraries, and safely connect with like-minded travelers.</p>
  <div style="text-align: center;">
    <a href="${siteUrl}/plan" class="button">Plan a Trip Now</a>
  </div>
`);

export const getBookingConfirmationEmail = (name: string, tripName: string, confirmationPdfLink: string) => getEmailBaseLayout(`
  <h1 class="title">Booking Confirmed ✈️</h1>
  <p class="text">Great news ${name}, your booking for <strong>${tripName}</strong> was processed successfully. We've compiled all your receipts, explicit travel itineraries, and emergency contacts into a private PDF itinerary.</p>
  <div style="text-align: center;">
    <a href="${confirmationPdfLink}" class="button" style="background-color: #2c2c2e; border: 1px solid #52525b;">Download Itinerary PDF</a>
    <a href="${siteUrl}/trips" class="button" style="margin-left: 10px;">View in App</a>
  </div>
`);

export const getMatchNotificationEmail = (name: string, matchedUser: string) => getEmailBaseLayout(`
  <h1 class="title">New Travel Match Found! 🤝</h1>
  <p class="text">Hey ${name}, great news! Our algorithm has paired you with <strong>${matchedUser}</strong> for your upcoming travels. You both share a 90%+ compatibility score in travel style and budget preferences.</p>
  <div style="text-align: center;">
    <a href="${siteUrl}/matching" class="button">View Match Profile</a>
  </div>
  <p class="text" style="font-size: 14px; margin-top: 32px;">For your safety, always communicate initially directly via the internal Roamie Chat network.</p>
`);
