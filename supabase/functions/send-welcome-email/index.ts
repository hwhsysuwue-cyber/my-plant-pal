import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface WelcomeEmailRequest {
  userId: string;
  email: string;
  fullName?: string;
}

const handler = async (req: Request): Promise<Response> => {
  console.log("send-welcome-email function called");

  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { userId, email, fullName }: WelcomeEmailRequest = await req.json();
    
    console.log(`Processing welcome email for user: ${userId}, email: ${email}`);

    if (!userId || !email) {
      console.error("Missing required fields: userId or email");
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Initialize Supabase client with service role
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if email was already sent
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("first_login_email_sent")
      .eq("user_id", userId)
      .single();

    if (profileError) {
      console.error("Error fetching profile:", profileError);
      return new Response(
        JSON.stringify({ error: "Failed to fetch profile" }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (profile?.first_login_email_sent) {
      console.log("Welcome email already sent for this user");
      return new Response(
        JSON.stringify({ message: "Email already sent" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Send welcome email
    const displayName = fullName || email.split("@")[0];
    
    const emailResponse = await resend.emails.send({
      from: "PlantCare <onboarding@resend.dev>",
      to: [email],
      subject: "Welcome to PlantCare! 🌱",
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #22c55e; margin: 0;">🌱 Welcome to PlantCare!</h1>
          </div>
          
          <p style="font-size: 18px;">Hi ${displayName},</p>
          
          <p>We're thrilled to have you join our community of plant enthusiasts! 🌿</p>
          
          <p>Here's what you can do with PlantCare:</p>
          
          <ul style="background: #f0fdf4; padding: 20px 40px; border-radius: 8px; border-left: 4px solid #22c55e;">
            <li><strong>Build Your Garden</strong> - Add and manage your plant collection</li>
            <li><strong>Set Reminders</strong> - Never forget to water or fertilize again</li>
            <li><strong>Search Plants</strong> - Discover new plants to add to your collection</li>
            <li><strong>Get Care Tips</strong> - Learn how to keep your plants thriving</li>
          </ul>
          
          <p>Ready to get started? Log in and start building your digital garden today!</p>
          
          <div style="text-align: center; margin: 30px 0;">
            <p style="color: #666; font-size: 14px;">Happy gardening! 🌻</p>
            <p style="color: #666; font-size: 14px;"><strong>The PlantCare Team</strong></p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #eee; margin: 30px 0;">
          
          <p style="color: #999; font-size: 12px; text-align: center;">
            This email was sent because you created an account on PlantCare.
          </p>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully:", emailResponse);

    // Update profile to mark email as sent
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ first_login_email_sent: true })
      .eq("user_id", userId);

    if (updateError) {
      console.error("Error updating profile:", updateError);
      // Don't fail the request, email was sent successfully
    }

    return new Response(
      JSON.stringify({ success: true, emailResponse }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  } catch (error: any) {
    console.error("Error in send-welcome-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
