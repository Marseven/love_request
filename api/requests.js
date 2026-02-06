/**
 * POST /api/requests — Créer une nouvelle demande
 * Body: { senderName, valentineName, personalMessage, dateInfo?, note?, theme? }
 * Returns: { id, link }
 */
import { createClient } from '@supabase/supabase-js'
import crypto from 'crypto'

function getSupabase() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_KEY
  if (!url || !key) return null
  return createClient(url, key)
}

export default async function handler(req, res) {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  const supabase = getSupabase()
  if (!supabase) {
    return res.status(500).json({ error: 'Database not configured' })
  }

  try {
    const { senderName, valentineName, personalMessage, dateInfo, note, theme } = req.body

    if (!senderName || !valentineName || !personalMessage) {
      return res.status(400).json({ error: 'senderName, valentineName et personalMessage sont requis' })
    }

    const id = crypto.randomBytes(4).toString('hex')

    const { error } = await supabase.from('love_requests').insert({
      id,
      sender_name: senderName.slice(0, 50),
      valentine_name: valentineName.slice(0, 50),
      personal_message: personalMessage.slice(0, 500),
      date_info: dateInfo?.slice(0, 100) || null,
      note: note?.slice(0, 150) || null,
      theme: theme || 'rose',
    })

    if (error) {
      console.error('Supabase insert error:', error)
      return res.status(500).json({ error: 'Erreur lors de la création' })
    }

    return res.status(201).json({ id })
  } catch (err) {
    console.error('API error:', err)
    return res.status(500).json({ error: 'Erreur serveur' })
  }
}
