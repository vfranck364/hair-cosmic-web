/**
 * ============================================
 * HAIR Chatbot - Supabase Edge Function
 * ============================================
 * Envoi de notification email + Telegram pour nouveau lead
 * 
 * Déploiement :
 * 1. npm install -g supabase
 * 2. supabase login
 * 3. supabase link --project-ref mpiphbawxqybrehzklkr
 * 4. supabase functions new send-lead-notification
 * 5. Copiez ce code dans le fichier créé
 * 6. supabase functions deploy send-lead-notification
 * 
 * Variables d'environnement à configurer dans Supabase Dashboard :
 * - TELEGRAM_BOT_TOKEN
 * - TELEGRAM_CHAT_ID
 * - RESEND_API_KEY (optionnel, pour email)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

// Configuration
const TELEGRAM_BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN') || ''
const TELEGRAM_CHAT_ID = Deno.env.get('TELEGRAM_CHAT_ID') || ''
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') || ''
const ADMIN_EMAIL = 'vfranck364@gmail.com'

// Handler principal
serve(async (req) => {
  try {
    // Récupérer les données du lead
    const { lead } = await req.json()
    
    if (!lead) {
      return new Response(
        JSON.stringify({ error: 'Lead data required' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }
    
    console.log('🔔 Notification pour lead:', lead.full_name)
    
    // Envoyer les notifications en parallèle
    const [emailResult, telegramResult] = await Promise.allSettled([
      sendEmailNotification(lead),
      sendTelegramNotification(lead)
    ])
    
    // Résultat
    const result = {
      success: true,
      lead_id: lead.id,
      notifications: {
        email: emailResult.status === 'fulfilled' ? emailResult.value : 'failed',
        telegram: telegramResult.status === 'fulfilled' ? telegramResult.value : 'failed'
      }
    }
    
    console.log('✅ Notifications envoyées:', result)
    
    return new Response(
      JSON.stringify(result),
      { 
        status: 200,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
        }
      }
    )
    
  } catch (error) {
    console.error('❌ Erreur notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500,
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      }
    )
  }
})

/**
 * Envoyer notification par email (via Resend)
 */
async function sendEmailNotification(lead) {
  if (!RESEND_API_KEY) {
    console.log('⚠️ Resend API key not configured, skipping email')
    return 'skipped'
  }
  
  const emailSubject = `🔔 NOUVEAU LEAD HAIR - ${lead.full_name} - ${lead.service_wanted}`
  
  const emailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #8B5CF6, #3B82F6); color: white; padding: 20px; border-radius: 10px 10px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 10px 10px; }
    .section { margin-bottom: 20px; }
    .label { font-weight: bold; color: #8B5CF6; }
    .score { display: inline-block; background: ${getScoreColor(lead.score)}; color: white; padding: 5px 15px; border-radius: 20px; font-weight: bold; }
    .footer { text-align: center; margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; color: #666; }
    .button { display: inline-block; background: #8B5CF6; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; margin-top: 10px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1 style="margin: 0;">🔔 NOUVEAU LEAD HAIR</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Lead qualifié détecté</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2 style="color: #8B5CF6; margin-top: 0;">👤 INFORMATIONS CLIENT</h2>
        <p><span class="label">Nom :</span> ${escapeHtml(lead.full_name || 'N/A')}</p>
        <p><span class="label">Email :</span> <a href="mailto:${escapeHtml(lead.email)}">${escapeHtml(lead.email)}</a></p>
        <p><span class="label">Téléphone :</span> <a href="tel:${escapeHtml(lead.phone)}">${escapeHtml(lead.phone || 'N/A')}</a></p>
        <p><span class="label">Entreprise :</span> ${escapeHtml(lead.company || 'N/A')}</p>
      </div>
      
      <div class="section">
        <h2 style="color: #8B5CF6; margin-top: 0;">💼 DEMANDE</h2>
        <p><span class="label">Service voulu :</span> ${escapeHtml(lead.service_wanted)}</p>
        <p><span class="label">Budget :</span> ${escapeHtml(lead.budget)}</p>
        <p><span class="label">Volume :</span> ${escapeHtml(lead.volume)}</p>
        <p><span class="label">Urgence :</span> ${escapeHtml(lead.urgency)}</p>
      </div>
      
      <div class="section">
        <h2 style="color: #8B5CF6; margin-top: 0;">📊 SCORE DE QUALIFICATION</h2>
        <p><span class="score">${lead.score}/100</span></p>
        <p style="font-size: 0.9em; color: #666;">
          ${getScoreAdvice(lead.score)}
        </p>
      </div>
      
      <div class="section">
        <h2 style="color: #8B5CF6; margin-top: 0;">💬 CONVERSATION</h2>
        <pre style="background: white; padding: 15px; border-radius: 5px; overflow-x: auto; font-size: 0.9em;">${escapeHtml(JSON.stringify(lead.conversation_json, null, 2))}</pre>
      </div>
      
      <div class="section">
        <p><span class="label">📅 Date :</span> ${new Date(lead.created_at).toLocaleString('fr-FR')}</p>
        <p><span class="label">🌐 Source :</span> ${lead.source || 'chatbot'}</p>
      </div>
      
      <div style="text-align: center; margin-top: 30px;">
        <a href="https://mpiphbawxqybrehzklkr.supabase.co/project/mpiphbawxqybrehzklkr/editor/leads" class="button">
          👉 Voir dans Supabase
        </a>
      </div>
      
      <div class="footer">
        <p><strong>👉 Action requise :</strong> Contacter le client sous 24h</p>
        <p>HAIR - Home of AI Revolutions | Yaoundé, Cameroun</p>
        <p>vfranck364@gmail.com | +237 6 83 12 16 54</p>
      </div>
    </div>
  </div>
</body>
</html>
  `
  
  // Appel à Resend API
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${RESEND_API_KEY}`
    },
    body: JSON.stringify({
      from: 'HAIR Chatbot <noreply@hair-fr.com>',
      to: ADMIN_EMAIL,
      subject: emailSubject,
      html: emailHtml
    })
  })
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Resend API error: ${error}`)
  }
  
  const result = await response.json()
  console.log('✅ Email envoyé:', result.id)
  return 'sent'
}

/**
 * Envoyer notification par Telegram
 */
async function sendTelegramNotification(lead) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.log('⚠️ Telegram credentials not configured, skipping')
    return 'skipped'
  }
  
  const message = `
🔔 *NOUVEAU LEAD HAIR*

👤 *Nom :* ${escapeMarkdown(lead.full_name || 'N/A')}
📧 *Email :* ${escapeMarkdown(lead.email)}
📱 *Téléphone :* ${escapeMarkdown(lead.phone || 'N/A')}
🏢 *Entreprise :* ${escapeMarkdown(lead.company || 'N/A')}

💼 *DEMANDE*
🤖 *Service :* ${escapeMarkdown(lead.service_wanted)}
💰 *Budget :* ${escapeMarkdown(lead.budget)}
📊 *Volume :* ${escapeMarkdown(lead.volume)}
⚡ *Urgence :* ${escapeMarkdown(lead.urgency)}

📊 *Score de qualification :* *${lead.score}/100*
${getScoreEmoji(lead.score)}

📅 *Date :* ${new Date(lead.created_at).toLocaleString('fr-FR')}
🌐 *Source :* ${lead.source || 'chatbot'}

━━━━━━━━━━━━━━━━━━━━━

👉 *Action requise :* Contactez le client sous 24h !

🔗 Voir dans Supabase :
https://mpiphbawxqybrehzklkr.supabase.co/project/mpiphbawxqybrehzklkr/editor/leads
  `.trim()
  
  // Appel à Telegram API
  const response = await fetch(
    `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown'
      })
    }
  )
  
  if (!response.ok) {
    const error = await response.text()
    throw new Error(`Telegram API error: ${error}`)
  }
  
  const result = await response.json()
  console.log('✅ Telegram envoyé:', result.result.message_id)
  return 'sent'
}

/**
 * Helpers
 */
function escapeHtml(text) {
  if (!text) return ''
  return String(text)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function escapeMarkdown(text) {
  if (!text) return ''
  return String(text)
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/!/g, '\\!')
}

function getScoreColor(score) {
  if (score >= 80) return '#22c55e'  // Vert
  if (score >= 60) return '#eab308'  // Jaune
  if (score >= 40) return '#f97316'  // Orange
  return '#ef4444'  // Rouge
}

function getScoreEmoji(score) {
  if (score >= 80) return '🔥 Lead très chaud ! Priorité maximale'
  if (score >= 60) return '✅ Lead qualifié, à contacter rapidement'
  if (score >= 40) return '⚠️ Lead moyen, à qualifier'
  return '❄️ Lead froid, nurturing requis'
}

function getScoreAdvice(score) {
  if (score >= 80) return 'Ce lead est très qualifié. Contactez-le immédiatement pour maximiser les chances de conversion.'
  if (score >= 60) return 'Bon lead avec un potentiel intéressant. Priorisez-le dans vos appels de la journée.'
  if (score >= 40) return 'Lead à qualifier davantage. Posez des questions pour mieux cerner le besoin et le budget.'
  return 'Lead peu qualifié pour le moment. Mettez-le en nurturing et recontactez-le ultérieurement.'
}
