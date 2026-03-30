import { createClient } from '@supabase/supabase-js'

// Run this script to invite an admin user to your project
// Usage: node scripts/invite_admin.js email@example.com

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY // NEEDS SERVICE ROLE KEY

if (!supabaseServiceKey) {
  console.error("Missing SUPABASE_SERVICE_ROLE_KEY! You find this in Settings -> API -> service_role key.")
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseServiceKey)

const email = process.argv[2] || process.env.NEXT_PUBLIC_ADMIN_EMAIL

async function invite() {
  console.log(`Inviting admin: ${email}...`)
  
  const { data, error } = await supabase.auth.admin.inviteUserByEmail(email)

  if (error) {
    console.error("Error inviting user:", error.message)
  } else {
    console.log("Success! Invitation sent. Check your email to set a password.")
    console.log("User details:", data.user.id)
  }
}

invite()
