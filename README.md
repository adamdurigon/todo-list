# 📝 My Todo - Application de Gestion de Tâches

Une application moderne de gestion de tâches avec authentification, construite avec Next.js 15, TypeScript et shadcn/ui.

## ✨ Fonctionnalités

- 🔐 **Authentification complète** : Inscription, connexion avec validation sécurisée
- 📝 **Gestion des tâches** : Créer, modifier, supprimer et marquer comme terminées
- 💾 **Stockage hybride** : Synchronisation cloud pour les utilisateurs connectés, localStorage pour les visiteurs
- 📱 **Interface responsive** : Design adaptatif avec composants shadcn/ui

## 🚀 Technologies Utilisées

**Frontend :** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui.

**Backend :** Next.js API Routes, Prisma, MongoDB, NextAuth.js, Zod

**Développement :** Jest + Testing Library, ESLint, bcryptjs

## 🎯 Fonctionnement

### Pour les utilisateurs connectés

- Synchronisation des tâches en base de données
- Persistance entre sessions
- Authentification sécurisée

### Pour les visiteurs

- Stockage local des tâches
- Fonctionnalités complètes sans compte
- Possibilité de s'inscrire pour sauvegarder

## 🔒 Sécurité

- Validation Zod côté client et serveur
- Mots de passe hachés avec bcryptjs
- Headers de sécurité configurés
- Protection CSRF et XSS
