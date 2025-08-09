import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.VITE_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const { username, email } = req.body
  if (!username || !email) {
    return res.status(400).json({ error: 'Missing fields' })
  }

  const { data, error } = await supabase.from('profiles').insert([{ username, email }])

  if (error) return res.status(400).json({ error: error.message })
  return res.status(200).json({ data })
}
