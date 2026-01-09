import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  BookOpen,
  Sparkles,
  Shield,
  Users,
  FileText,
  Wand2,
  CheckCircle,
  XCircle,
  Activity
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

export const Homepage: React.FC = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleGetStarted = () => {
    if (currentUser) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Navigation Header */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-gray-900/80 backdrop-blur-lg shadow-lg'
            : 'bg-transparent'
        }`}
      >
        <nav className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Sparkles className="h-8 w-8 text-blue-400" />
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full animate-pulse" />
            </div>
            <span className="text-xl font-serif font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              NovelArchitect
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-300 hover:text-white transition">
              Comment ça marche
            </a>
            <a href="#pricing" className="text-gray-300 hover:text-white transition">
              Tarifs
            </a>
            {currentUser ? (
              <Button onClick={() => navigate('/dashboard')}>
                Tableau de bord
              </Button>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/login')}>
                  Se connecter
                </Button>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  onClick={handleGetStarted}
                >
                  Commencer l'écriture
                </Button>
              </>
            )}
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center space-y-8">
            <h1 className="text-5xl md:text-7xl font-serif font-bold leading-tight">
              Écrivez{' '}
              <TypeAnimation
                sequence={[
                  'un Thriller',
                  2000,
                  'une Romance',
                  2000,
                  'de la Fantasy',
                  2000,
                  'un Chef-d\'œuvre',
                  3000,
                ]}
                wrapper="span"
                speed={50}
                className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                repeat={Infinity}
              />
              <br />
              <span className="text-white">Sans incohérences.</span>
              <br />
              <span className="text-white">Sans blocages.</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              La première plateforme d'écriture assistée par <span className="text-blue-400 font-semibold">Gemini 1.5 Pro</span> qui mémorise tout votre univers.
              Importez vos notes en vrac ou partez de zéro : nous gérons la structure, vous gardez le contrôle.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Button
                size="lg"
                className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg hover:shadow-blue-500/50 transition-all"
                onClick={handleGetStarted}
              >
                <Wand2 className="mr-2 h-5 w-5" />
                Créer mon premier livre gratuitement
              </Button>
            </div>
            <p className="text-sm text-gray-400">
              Pas de carte bancaire requise • Clé API perso acceptée
            </p>
          </div>

          {/* Hero Visual */}
          <div className="mt-16 relative">
            <div className="relative rounded-2xl overflow-hidden border border-gray-700 shadow-2xl">
              <div className="bg-gradient-to-br from-gray-800 to-gray-900 p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Bible Panel */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold text-blue-400 mb-3">Bible des Personnages</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-400">Jean</span>
                          <Activity className="h-4 w-4 text-green-400" />
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Santé:</span>
                          <span className="text-red-400">Blessé ↓</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-gray-500">Localisation:</span>
                          <span className="text-blue-400">Paris</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Editor Panel */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold text-purple-400 mb-3">Chapitre 5</h3>
                      <p className="text-xs text-gray-400 leading-relaxed">
                        Jean grimaça en s'appuyant sur sa jambe valide. La balle reçue au chapitre précédent le ralentissait...
                      </p>
                    </CardContent>
                  </Card>

                  {/* AI Chat Panel */}
                  <Card className="bg-gray-800/50 border-gray-700">
                    <CardContent className="p-4">
                      <h3 className="text-sm font-semibold text-green-400 mb-3">L'Auditeur IA</h3>
                      <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-2">
                        <p className="text-xs text-yellow-300">
                          ⚠️ Au chapitre 3, la voiture était bleue. Ici elle est rouge.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </div>
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl blur opacity-20 -z-10" />
          </div>
        </div>
      </section>

      {/* Problem Agitation Section */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-serif font-bold text-center mb-16">
            Pourquoi les outils d'IA classiques échouent à écrire un livre ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Problem 1 */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold">L'Amnésie</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2 text-red-400">
                    <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>Les autres oublient le début de l'histoire après 3 chapitres</p>
                  </div>
                  <div className="flex items-start space-x-2 text-green-400">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong className="text-blue-400">NovelArchitect:</strong> Grâce à Gemini 1.5 et notre système RAG,
                      l'IA se souvient de tout, du premier au dernier mot
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem 2 */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold">Le Chaos</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2 text-red-400">
                    <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>Un simple chat sans structure</p>
                  </div>
                  <div className="flex items-start space-x-2 text-green-400">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong className="text-blue-400">NovelArchitect:</strong> Un espace de travail structuré :
                      Plan, Chapitres, Fiches Personnages dynamiques
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Problem 3 */}
            <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center">
                  <XCircle className="h-6 w-6 text-red-400" />
                </div>
                <h3 className="text-xl font-bold">Les Hallucinations</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-start space-x-2 text-red-400">
                    <XCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>Inventent des faits contradictoires</p>
                  </div>
                  <div className="flex items-start space-x-2 text-green-400">
                    <CheckCircle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                    <p>
                      <strong className="text-blue-400">NovelArchitect:</strong> L'Auditeur vérifie chaque paragraphe
                      et vous signale les conflits avant validation
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Feature Showcase */}
      <section id="features" className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-serif font-bold text-center mb-4">
            Deux façons de commencer. Un seul résultat professionnel.
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Que vous ayez des notes détaillées ou juste une idée, NovelArchitect s'adapte à votre méthode
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Mode Import */}
            <Card className="bg-gradient-to-br from-purple-900/30 to-gray-900 border-purple-500/30 hover:border-purple-500 transition-all">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-purple-500/20 flex items-center justify-center">
                  <FileText className="h-8 w-8 text-purple-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">Le Visionnaire</h3>
                  <p className="text-lg text-purple-400 mb-4">Mode Import Rapide</p>
                  <p className="text-gray-400">
                    Vous avez des notes plein le téléphone ? Collez tout en vrac,
                    l'IA structure automatiquement votre univers.
                  </p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-xs text-gray-400">
                  <p>"C'est l'histoire de Jean, un boulanger qui...</p>
                  <p className="mt-2 text-center text-purple-400">↓ ✨ Magie IA ✨ ↓</p>
                  <p className="mt-2 text-green-400">✓ 20 chapitres structurés</p>
                  <p className="text-green-400">✓ 5 personnages avec fiches</p>
                </div>
              </CardContent>
            </Card>

            {/* Mode Guidé */}
            <Card className="bg-gradient-to-br from-blue-900/30 to-gray-900 border-blue-500/30 hover:border-blue-500 transition-all">
              <CardContent className="p-8 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-blue-500/20 flex items-center justify-center">
                  <Wand2 className="h-8 w-8 text-blue-400" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">L'Explorateur</h3>
                  <p className="text-lg text-blue-400 mb-4">Mode Guidé</p>
                  <p className="text-gray-400">
                    Juste une vague idée ? Répondez à quelques questions simples,
                    l'IA génère tout l'univers pour vous.
                  </p>
                </div>
                <div className="bg-gray-900 rounded-lg p-4 space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-400">Genre : Thriller</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-400">Tonalité : Sombre</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-blue-400" />
                    <span className="text-gray-400">Pitch : 3 phrases...</span>
                  </div>
                  <p className="text-center text-blue-400 mt-2">↓</p>
                  <p className="text-green-400 text-center">Plan complet généré!</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Living Bible Demo */}
      <section className="py-20 px-4 bg-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-serif font-bold text-center mb-4">
            Vos personnages prennent vie (littéralement)
          </h2>
          <p className="text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            La fonctionnalité unique qui fait toute la différence : la gestion d'état dynamique
          </p>

          <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-8 border border-gray-700">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-4">
                <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-blue-400 mb-2">1. Vous écrivez</h4>
                  <p className="text-sm text-gray-300">
                    "Jean reçut une balle dans la jambe"
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-purple-400 mb-2">2. Mise à jour auto</h4>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Santé:</span>
                      <span className="text-red-400">Bonne → Blessé</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Démarche:</span>
                      <span className="text-red-400">Normale → Boiteuse</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
                  <h4 className="text-sm font-semibold text-green-400 mb-2">3. Cohérence garantie</h4>
                  <p className="text-sm text-gray-300">
                    "Jean grimaça en s'appuyant sur sa jambe valide..."
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Use Cases */}
      <section className="py-20 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl font-serif font-bold text-center mb-16">
            Pour qui est-ce fait ?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-900 border-gray-700 hover:border-blue-500 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <Sparkles className="h-6 w-6 text-blue-400" />
                </div>
                <h3 className="text-xl font-bold">Le Romancier de Fantasy</h3>
                <p className="text-gray-400">
                  Gérez des mondes complexes avec plusieurs races, systèmes de magie et chronologies
                  sans jamais perdre le fil.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-purple-500 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <Shield className="h-6 w-6 text-purple-400" />
                </div>
                <h3 className="text-xl font-bold">L'Auteur de Thriller</h3>
                <p className="text-gray-400">
                  Tenez vos intrigues et cliffhangers d'une main de maître.
                  L'IA garde la trace de chaque indice et rebondissement.
                </p>
              </CardContent>
            </Card>

            <Card className="bg-gray-900 border-gray-700 hover:border-green-500 transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="w-12 h-12 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Users className="h-6 w-6 text-green-400" />
                </div>
                <h3 className="text-xl font-bold">Le Rôliste (JDR)</h3>
                <p className="text-gray-400">
                  Créez des campagnes cohérentes pour vos joueurs avec des PNJ qui évoluent
                  et un monde qui réagit à leurs actions.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900/30 to-purple-900/30">
        <div className="container mx-auto max-w-4xl text-center space-y-8">
          <h2 className="text-5xl font-serif font-bold">
            Prêt à écrire votre chef-d'œuvre ?
          </h2>
          <p className="text-xl text-gray-300">
            Rejoignez les auteurs qui ont choisi la puissance de l'IA combinée à la structure
          </p>
          <Button
            size="lg"
            className="text-lg px-8 py-6 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 shadow-lg"
            onClick={handleGetStarted}
          >
            <BookOpen className="mr-2 h-5 w-5" />
            Commencer gratuitement
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
            {/* Column 1 */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <Sparkles className="h-6 w-6 text-blue-400" />
                <span className="text-lg font-serif font-bold">NovelArchitect</span>
              </div>
              <p className="text-sm text-gray-400">
                L'architecture de votre imagination
              </p>
            </div>

            {/* Column 2 */}
            <div className="space-y-4">
              <h4 className="font-semibold">Produit</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#features" className="hover:text-white transition">Fonctionnalités</a></li>
                <li><a href="#" className="hover:text-white transition">Changelog</a></li>
                <li><a href="#" className="hover:text-white transition">Roadmap</a></li>
              </ul>
            </div>

            {/* Column 3 */}
            <div className="space-y-4">
              <h4 className="font-semibold">Légal</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li><a href="#" className="hover:text-white transition">CGU</a></li>
                <li><a href="#" className="hover:text-white transition">Confidentialité</a></li>
                <li>
                  <p className="text-green-400">
                    ✓ Vos livres vous appartiennent à 100%
                  </p>
                </li>
              </ul>
            </div>

            {/* Column 4 */}
            <div className="space-y-4">
              <h4 className="font-semibold">Technologie</h4>
              <p className="text-sm text-gray-400">
                Powered by Google Gemini
              </p>
            </div>
          </div>

          <div className="pt-8 border-t border-gray-800 text-center text-sm text-gray-500">
            © 2026 NovelArchitect. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
};
