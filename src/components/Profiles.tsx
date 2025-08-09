import { useState } from 'react'
import { supabase } from '../supabaseClient'

export default function Profiles() {
  const [profiles, setProfiles] = useState<any[]>([])
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')

  async function loadProfiles() {
    const { data, error } = await supabase.from('profiles').select('*')
    if (error) console.error(error)
    else setProfiles(data || [])
  }

  async function addProfile() {
    const res = await fetch('/api/addProfile', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email })
    })
    const json = await res.json()
    console.log(json)
    loadProfiles()
  }

  return (
    <div>
      <h2>Profiles</h2>
      <div>
        <input
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Username"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
        />
        <button onClick={addProfile}>Добавить</button>
      </div>
      <button onClick={loadProfiles}>Загрузить</button>
      <ul>
        {profiles.map((p) => (
          <li key={p.id}>
            {p.username} - {p.email}
          </li>
        ))}
      </ul>
    </div>
  )
}
