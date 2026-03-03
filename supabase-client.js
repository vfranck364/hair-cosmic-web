/**
 * ============================================
 * HAIR Chatbot - Supabase Client
 * ============================================
 * Gestion de la base de données, authentification et notifications
 * 
 * Configuration :
 * - Project URL : https://mpiphbawxqybrehzklkr.supabase.co
 * - Anon Key : sb_publishable_nSI6jFWmnkuyuURzThPQew_2Xifbmrb
 */

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

// Configuration Supabase
const SUPABASE_URL = 'https://mpiphbawxqybrehzklkr.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_nSI6jFWmnkuyuURzThPQew_2Xifbmrb'

// Initialisation du client Supabase
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

/**
 * Calculer le score de qualification d'un lead (0-100)
 * @param {Object} lead - Données du lead
 * @returns {number} Score de 0 à 100
 */
function calculateLeadScore(lead) {
    let score = 0
    
    // Email valide (+10 points)
    if (lead.email && lead.email.includes('@') && lead.email.includes('.')) {
        score += 10
    }
    
    // Téléphone valide (+10 points)
    if (lead.phone && lead.phone.replace(/\s/g, '').length >= 8) {
        score += 10
    }
    
    // Nom complet (+10 points)
    if (lead.full_name && lead.full_name.trim().length >= 3) {
        score += 10
    }
    
    // Service spécifique (+20 points)
    if (lead.service_wanted && lead.service_wanted !== 'Non spécifié') {
        score += 20
    }
    
    // Budget spécifié (+20 points)
    if (lead.budget && lead.budget !== 'Non spécifié') {
        score += 20
    }
    
    // Volume spécifié (+10 points)
    if (lead.volume && lead.volume !== 'Non spécifié') {
        score += 10
    }
    
    // Urgence (+30 points max)
    if (lead.urgency === 'Immédiatement') {
        score += 30
    } else if (lead.urgency === 'Cette semaine') {
        score += 20
    } else if (lead.urgency === 'Ce mois-ci') {
        score += 10
    }
    
    return Math.min(score, 100)  // Maximum 100
}

/**
 * Sauvegarder un lead dans Supabase
 * @param {Object} leadData - Données complètes du lead
 * @returns {Promise<Object>} Résultat de l'opération
 */
export async function saveLead(leadData) {
    try {
        console.log('💾 Sauvegarde du lead:', leadData)
        
        // Calculer automatiquement le score
        const score = calculateLeadScore(leadData)
        
        // Préparer les données
        const leadToSave = {
            email: leadData.email,
            phone: leadData.phone || null,
            full_name: leadData.full_name || null,
            company: leadData.company || null,
            service_wanted: leadData.service_wanted || 'Non spécifié',
            budget: leadData.budget || 'Non spécifié',
            volume: leadData.volume || 'Non spécifié',
            urgency: leadData.urgency || 'Non spécifié',
            score: score,
            source: 'chatbot',
            status: 'nouveau',
            conversation_json: leadData.conversation || []
        }
        
        // Insérer dans la table leads
        const { data, error } = await supabase
            .from('leads')
            .insert([leadToSave])
            .select()
        
        if (error) {
            console.error('❌ Erreur sauvegarde lead:', error)
            return { 
                success: false, 
                error: error.message,
                message: 'Erreur lors de la sauvegarde du lead'
            }
        }
        
        console.log('✅ Lead sauvegardé avec succès!', data)
        
        // Déclencher les notifications
        if (data && data[0]) {
            await triggerNotifications(data[0])
        }
        
        return { 
            success: true, 
            data: data,
            message: 'Lead sauvegardé avec succès'
        }
        
    } catch (error) {
        console.error('❌ Erreur inattendue:', error)
        return { 
            success: false, 
            error: error.message,
            message: 'Erreur inattendue lors de la sauvegarde'
        }
    }
}

/**
 * Sauvegarder une conversation dans Supabase
 * @param {Object} conversationData - Données de la conversation
 * @returns {Promise<Object>} Résultat de l'opération
 */
export async function saveConversation(conversationData) {
    try {
        const { data, error } = await supabase
            .from('conversations')
            .insert([{
                lead_id: conversationData.lead_id,
                user_id: conversationData.user_id || null,
                message_user: conversationData.message_user,
                message_bot: conversationData.message_bot,
                session_id: conversationData.session_id || generateSessionId()
            }])
        
        if (error) {
            console.error('❌ Erreur sauvegarde conversation:', error)
            return { success: false, error: error.message }
        }
        
        console.log('✅ Conversation sauvegardée')
        return { success: true, data }
        
    } catch (error) {
        console.error('❌ Erreur inattendue:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Envoyer un Magic Link pour connexion sans mot de passe
 * @param {string} email - Email de l'utilisateur
 * @returns {Promise<Object>} Résultat de l'opération
 */
export async function sendMagicLink(email) {
    try {
        const { data, error } = await supabase.auth.signInWithOtp({
            email: email
        })
        
        if (error) {
            console.error('❌ Erreur envoi Magic Link:', error)
            return { 
                success: false, 
                error: error.message,
                message: 'Erreur lors de l\'envoi du lien de connexion'
            }
        }
        
        console.log('✅ Magic Link envoyé à:', email)
        return { 
            success: true, 
            data,
            message: 'Lien de connexion envoyé à ' + email
        }
        
    } catch (error) {
        console.error('❌ Erreur inattendue:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Vérifier si un utilisateur est connecté
 * @returns {Promise<Object|null>} Utilisateur connecté ou null
 */
export async function getCurrentUser() {
    try {
        const { data: { user } } = await supabase.auth.getUser()
        return user
    } catch (error) {
        console.error('❌ Erreur récupération utilisateur:', error)
        return null
    }
}

/**
 * Se déconnecter
 * @returns {Promise<Object>} Résultat de l'opération
 */
export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) throw error
        console.log('✅ Déconnexion réussie')
        return { success: true }
    } catch (error) {
        console.error('❌ Erreur déconnexion:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Déclencher les notifications pour un nouveau lead
 * @param {Object} lead - Données du lead
 */
async function triggerNotifications(lead) {
    try {
        // Appel à la Edge Function pour les notifications
        const { error } = await supabase.functions.invoke('send-lead-notification', {
            body: { lead }
        })
        
        if (error) {
            console.error('⚠️ Erreur notification:', error)
            // Continue même si notification échoue
        } else {
            console.log('✅ Notifications déclenchées')
        }
    } catch (error) {
        console.error('⚠️ Erreur déclenchement notifications:', error)
        // Non bloquant - le lead est sauvegardé même sans notification
    }
}

/**
 * Générer un ID de session unique
 * @returns {string} ID de session
 */
function generateSessionId() {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9)
}

/**
 * Récupérer tous les leads (pour dashboard admin)
 * @param {string} status - Filtre par statut (optionnel)
 * @returns {Promise<Array>} Liste des leads
 */
export async function getLeads(status = null) {
    try {
        let query = supabase
            .from('leads')
            .select('*')
            .order('created_at', { ascending: false })
        
        if (status) {
            query = query.eq('status', status)
        }
        
        const { data, error } = await query
        
        if (error) {
            console.error('❌ Erreur récupération leads:', error)
            return []
        }
        
        return data || []
        
    } catch (error) {
        console.error('❌ Erreur inattendue:', error)
        return []
    }
}

/**
 * Mettre à jour le statut d'un lead
 * @param {string} leadId - ID du lead
 * @param {string} newStatus - Nouveau statut
 * @returns {Promise<Object>} Résultat de l'opération
 */
export async function updateLeadStatus(leadId, newStatus) {
    try {
        const { data, error } = await supabase
            .from('leads')
            .update({ status: newStatus })
            .eq('id', leadId)
            .select()
        
        if (error) {
            console.error('❌ Erreur mise à jour statut:', error)
            return { success: false, error: error.message }
        }
        
        console.log('✅ Statut mis à jour:', newStatus)
        return { success: true, data }
        
    } catch (error) {
        console.error('❌ Erreur inattendue:', error)
        return { success: false, error: error.message }
    }
}

/**
 * Exporter les leads en CSV
 * @returns {string} Contenu CSV
 */
export function exportLeadsToCSV(leads) {
    const headers = ['Date', 'Nom', 'Email', 'Téléphone', 'Entreprise', 'Service', 'Budget', 'Volume', 'Urgence', 'Score', 'Statut']
    const rows = leads.map(lead => [
        new Date(lead.created_at).toLocaleDateString('fr-FR'),
        lead.full_name || '',
        lead.email || '',
        lead.phone || '',
        lead.company || '',
        lead.service_wanted || '',
        lead.budget || '',
        lead.volume || '',
        lead.urgency || '',
        lead.score || 0,
        lead.status || ''
    ])
    
    return [
        headers.join(','),
        ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
    ].join('\n')
}

// Exporter les fonctions pour utilisation dans le chatbot
window.HAIRSupabase = {
    supabase,
    saveLead,
    saveConversation,
    sendMagicLink,
    getCurrentUser,
    signOut,
    getLeads,
    updateLeadStatus,
    exportLeadsToCSV,
    calculateLeadScore
}

console.log('✅ HAIR Supabase Client initialisé')
