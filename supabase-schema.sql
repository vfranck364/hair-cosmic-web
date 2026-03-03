-- ============================================
-- HAIR Chatbot - Supabase Database Schema
-- ============================================
-- Exécutez ce script dans Supabase SQL Editor
-- https://mpiphbawxqybrehzklkr.supabase.co
-- ============================================

-- Activer l'extension UUID
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: users (Clients qui se connectent)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    full_name TEXT,
    company TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_login TIMESTAMP WITH TIME ZONE
);

-- Index pour recherche rapide
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at DESC);

-- Comments
COMMENT ON TABLE users IS 'Utilisateurs/clients qui interagissent avec le chatbot';
COMMENT ON COLUMN users.email IS 'Email unique pour connexion Magic Link';
COMMENT ON COLUMN users.full_name IS 'Nom complet du client';

-- ============================================
-- TABLE: leads (Tous les leads générés)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    phone TEXT,
    full_name TEXT,
    company TEXT,
    service_wanted TEXT NOT NULL,
    budget TEXT DEFAULT 'Non spécifié',
    volume TEXT DEFAULT 'Non spécifié',
    urgency TEXT DEFAULT 'Non spécifié',
    status TEXT DEFAULT 'nouveau',
    score INTEGER DEFAULT 0,
    source TEXT DEFAULT 'chatbot',
    conversation_json JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour requêtes rapides
CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_score ON leads(score DESC);
CREATE INDEX IF NOT EXISTS idx_leads_service ON leads(service_wanted);

-- Comments
COMMENT ON TABLE leads IS 'Tous les leads générés par le chatbot';
COMMENT ON COLUMN leads.status IS 'nouveau, contacté, en_cours, converti, perdu';
COMMENT ON COLUMN leads.score IS 'Score de qualification 0-100';
COMMENT ON COLUMN leads.conversation_json IS 'Historique complet de la conversation';

-- ============================================
-- TABLE: conversations (Historique détaillé)
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    message_user TEXT,
    message_bot TEXT,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    session_id TEXT
);

-- Index
CREATE INDEX IF NOT EXISTS idx_conversations_lead_id ON conversations(lead_id);
CREATE INDEX IF NOT EXISTS idx_conversations_user_id ON conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_conversations_timestamp ON conversations(timestamp DESC);
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);

-- Comments
COMMENT ON TABLE conversations IS 'Historique détaillé de toutes les conversations';
COMMENT ON COLUMN conversations.session_id IS 'ID unique pour regrouper une conversation complète';

-- ============================================
-- TABLE: notifications (Suivi des notifications)
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID REFERENCES leads(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    sent_at TIMESTAMP WITH TIME ZONE,
    error_message TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index
CREATE INDEX IF NOT EXISTS idx_notifications_lead_id ON notifications(lead_id);
CREATE INDEX IF NOT EXISTS idx_notifications_status ON notifications(status);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);

-- Comments
COMMENT ON TABLE notifications IS 'Suivi des notifications envoyées (email, Telegram, WhatsApp)';
COMMENT ON COLUMN notifications.type IS 'email, telegram, whatsapp, sms';
COMMENT ON COLUMN notifications.status IS 'pending, sent, failed';

-- ============================================
-- TRIGGER: Mise à jour automatique updated_at
-- ============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_leads_updated_at ON leads;
CREATE TRIGGER update_leads_updated_at
    BEFORE UPDATE ON leads
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TRIGGER: Notification automatique nouveau lead
-- ============================================
CREATE OR REPLACE FUNCTION notify_new_lead()
RETURNS TRIGGER AS $$
BEGIN
    -- Insérer notification email
    INSERT INTO notifications (lead_id, type, status)
    VALUES (NEW.id, 'email', 'pending');
    
    -- Insérer notification Telegram
    INSERT INTO notifications (lead_id, type, status)
    VALUES (NEW.id, 'telegram', 'pending');
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_notify_new_lead ON leads;
CREATE TRIGGER trigger_notify_new_lead
    AFTER INSERT ON leads
    FOR EACH ROW
    EXECUTE FUNCTION notify_new_lead();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Activer RLS sur toutes les tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Policy users : Les utilisateurs ne voient que leurs données
CREATE POLICY "Users can view own data"
    ON users FOR SELECT
    USING (auth.uid() = id);

-- Policy leads : Public peut créer (chatbot), seulement auth pour voir
CREATE POLICY "Anyone can create leads"
    ON leads FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view leads"
    ON leads FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy conversations : Public peut créer, seulement auth pour voir
CREATE POLICY "Anyone can create conversations"
    ON conversations FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Authenticated users can view conversations"
    ON conversations FOR SELECT
    USING (auth.role() = 'authenticated');

-- Policy notifications : Seulement auth pour voir
CREATE POLICY "Authenticated users can view notifications"
    ON notifications FOR SELECT
    USING (auth.role() = 'authenticated');

-- ============================================
-- VUES UTILES (Dashboard)
-- ============================================

-- Vue : Leads par statut
CREATE OR REPLACE VIEW leads_by_status AS
SELECT 
    status,
    COUNT(*) as count,
    ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER (), 2) as percentage
FROM leads
GROUP BY status
ORDER BY count DESC;

-- Vue : Leads par service
CREATE OR REPLACE VIEW leads_by_service AS
SELECT 
    service_wanted,
    COUNT(*) as count,
    AVG(score) as avg_score,
    MIN(created_at) as first_lead,
    MAX(created_at) as last_lead
FROM leads
GROUP BY service_wanted
ORDER BY count DESC;

-- Vue : Leads par mois
CREATE OR REPLACE VIEW leads_by_month AS
SELECT 
    DATE_TRUNC('month', created_at) as month,
    COUNT(*) as count,
    AVG(score) as avg_score,
    COUNT(CASE WHEN status = 'converti' THEN 1 END) as converted
FROM leads
GROUP BY DATE_TRUNC('month', created_at)
ORDER BY month DESC;

-- Vue : Top leads (score élevé)
CREATE OR REPLACE VIEW top_leads AS
SELECT 
    id,
    full_name,
    email,
    phone,
    company,
    service_wanted,
    budget,
    score,
    status,
    created_at
FROM leads
WHERE score >= 70
ORDER BY score DESC, created_at DESC
LIMIT 50;

-- ============================================
-- DONNÉES DE TEST (Optionnel)
-- ============================================

-- Uncomment to insert test data
/*
INSERT INTO leads (email, full_name, phone, company, service_wanted, budget, volume, urgency, score, status) VALUES
('test1@example.com', 'Jean Mbarga', '+237 677 12 34 56', 'Mbarga Corp', 'Chatbot IA', '1500€', '50 clients/jour', 'Immédiatement', 90, 'nouveau'),
('test2@example.com', 'Marie Dupont', '+33 6 12 34 56 78', 'Salon Coiff''Beauty', 'Chatbot WhatsApp', '1000€', '20 RDV/jour', 'Cette semaine', 85, 'nouveau'),
('test3@example.com', 'Paul Atangana', '+237 699 87 65 43', 'Atangana Tech', 'Automatisation', '2500€', '100 workflows/mois', 'Ce mois-ci', 75, 'contacté');
*/

-- ============================================
-- INFORMATIONS
-- ============================================

-- Afficher les tables créées
SELECT 
    tablename,
    tableowner,
    hasindexes,
    hasrules,
    hastriggers
FROM pg_tables 
WHERE schemaname = 'public'
ORDER BY tablename;

-- Afficher le nombre de lignes par table
SELECT 
    'users' as table_name, COUNT(*) as row_count FROM users
UNION ALL
SELECT 'leads', COUNT(*) FROM leads
UNION ALL
SELECT 'conversations', COUNT(*) FROM conversations
UNION ALL
SELECT 'notifications', COUNT(*) FROM notifications;

-- ============================================
-- FIN DU SCRIPT
-- ============================================
