import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { BookOpen, FileText, ArrowLeft } from 'lucide-react';

type OnboardingMode = 'choice' | 'wizard' | 'raw';

export const Onboarding: React.FC = () => {
  const [mode, setMode] = useState<OnboardingMode>('choice');
  const navigate = useNavigate();

  const handleBack = () => {
    if (mode === 'choice') {
      navigate('/dashboard');
    } else {
      setMode('choice');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 pb-20">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center space-x-4">
          <Button variant="ghost" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Créer un Nouveau Projet</h1>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {mode === 'choice' && (
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Comment souhaitez-vous commencer?
              </h2>
              <p className="text-lg text-gray-600">
                Choisissez la méthode qui vous convient le mieux
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Wizard Option */}
              <Card
                className="cursor-pointer hover:shadow-2xl transition-all hover:scale-105 border-2 hover:border-blue-500"
                onClick={() => setMode('wizard')}
              >
                <CardContent className="flex flex-col items-center p-8 space-y-6">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center">
                    <BookOpen className="h-12 w-12 text-blue-600" />
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">Création Guidée</h3>
                    <p className="text-gray-600">
                      Répondez à quelques questions simples pour structurer votre roman étape par étape
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                      Commencer le Wizard
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Raw Import Option */}
              <Card
                className="cursor-pointer hover:shadow-2xl transition-all hover:scale-105 border-2 hover:border-purple-500"
                onClick={() => setMode('raw')}
              >
                <CardContent className="flex flex-col items-center p-8 space-y-6">
                  <div className="w-24 h-24 rounded-full bg-purple-100 flex items-center justify-center">
                    <FileText className="h-12 w-12 text-purple-600" />
                  </div>
                  <div className="text-center space-y-3">
                    <h3 className="text-2xl font-bold text-gray-900">Import Rapide</h3>
                    <p className="text-gray-600">
                      Collez vos notes existantes et laissez l'IA structurer automatiquement votre projet
                    </p>
                  </div>
                  <div className="pt-4">
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white">
                      Importer mes Notes
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {mode === 'wizard' && <WizardMode />}
        {mode === 'raw' && <RawImportMode />}
      </main>
    </div>
  );
};

// Wizard Mode Component
const WizardMode: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    pitch: '',
    genre: '',
    targetAudience: '',
    tone: '',
    pov: '',
    targetLength: '',
    inspirations: '',
  });

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNext = () => {
    if (step < 4) setStep(step + 1);
  };

  const handlePrevious = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async () => {
    // TODO: Call API to create project
    console.log('Creating project with data:', formData);
  };

  return (
    <div className="max-w-3xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>Étape {step} sur 4</CardTitle>
            <div className="flex space-x-2">
              {[1, 2, 3, 4].map((s) => (
                <div
                  key={s}
                  className={`w-3 h-3 rounded-full ${
                    s <= step ? 'bg-blue-600' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {step === 1 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Informations de base</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Titre du roman</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Le titre de votre chef-d'œuvre"
                  value={formData.title}
                  onChange={(e) => updateField('title', e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Pitch (3 phrases)</label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  rows={4}
                  placeholder="Résumez votre histoire en quelques phrases..."
                  value={formData.pitch}
                  onChange={(e) => updateField('pitch', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Genre et Public</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Genre</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={formData.genre}
                  onChange={(e) => updateField('genre', e.target.value)}
                >
                  <option value="">Sélectionnez un genre</option>
                  <option value="thriller">Thriller</option>
                  <option value="romance">Romance</option>
                  <option value="fantasy">Fantasy</option>
                  <option value="sci-fi">Science-Fiction</option>
                  <option value="mystery">Mystère</option>
                  <option value="horror">Horreur</option>
                  <option value="literary">Littérature générale</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Public cible</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={formData.targetAudience}
                  onChange={(e) => updateField('targetAudience', e.target.value)}
                >
                  <option value="">Sélectionnez un public</option>
                  <option value="young-adult">Young Adult</option>
                  <option value="adult">Adulte</option>
                  <option value="middle-grade">Jeunesse (8-12 ans)</option>
                  <option value="children">Enfants</option>
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Paramètres narratifs</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Tonalité</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={formData.tone}
                  onChange={(e) => updateField('tone', e.target.value)}
                >
                  <option value="">Sélectionnez une tonalité</option>
                  <option value="serious">Sérieux</option>
                  <option value="humorous">Humoristique</option>
                  <option value="dark">Sombre</option>
                  <option value="lighthearted">Léger</option>
                  <option value="dramatic">Dramatique</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Point de vue (POV)</label>
                <select
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  value={formData.pov}
                  onChange={(e) => updateField('pov', e.target.value)}
                >
                  <option value="">Sélectionnez un POV</option>
                  <option value="first-person">Première personne</option>
                  <option value="third-person-limited">Troisième personne limitée</option>
                  <option value="third-person-omniscient">Troisième personne omnisciente</option>
                  <option value="multiple">Multiple</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">Longueur cible (mots)</label>
                <input
                  type="number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  placeholder="Ex: 80000"
                  value={formData.targetLength}
                  onChange={(e) => updateField('targetLength', e.target.value)}
                />
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <h3 className="text-xl font-semibold">Inspirations</h3>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Livres, films ou œuvres qui vous inspirent (optionnel)
                </label>
                <textarea
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  rows={5}
                  placeholder="Ex: Le Seigneur des Anneaux, Harry Potter, Game of Thrones..."
                  value={formData.inspirations}
                  onChange={(e) => updateField('inspirations', e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="flex justify-between pt-6">
            {step > 1 && (
              <Button variant="outline" onClick={handlePrevious}>
                Précédent
              </Button>
            )}
            {step < 4 ? (
              <Button className="ml-auto bg-blue-600 hover:bg-blue-700 text-white" onClick={handleNext}>
                Suivant
              </Button>
            ) : (
              <Button className="ml-auto bg-green-600 hover:bg-green-700 text-white" onClick={handleSubmit}>
                Créer le Projet
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

// Raw Import Mode Component
const RawImportMode: React.FC = () => {
  const [rawText, setRawText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    setIsProcessing(true);
    // TODO: Call API to process raw text
    console.log('Processing raw text:', rawText);
    setTimeout(() => {
      setIsProcessing(false);
    }, 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle>Importez vos notes</CardTitle>
          <CardDescription>
            Collez toutes vos notes, idées et brouillons. L'IA va analyser et structurer automatiquement votre projet.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-700">
              Vos notes (personnages, histoire, chapitres, tout!)
            </label>
            <textarea
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent font-mono text-sm"
              rows={20}
              placeholder="C'est l'histoire de Jean, un boulanger qui tue des gens... Il a une cicatrice... Le chapitre 1 se passe à Paris..."
              value={rawText}
              onChange={(e) => setRawText(e.target.value)}
            />
          </div>

          {isProcessing && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-6 space-y-3">
              <div className="flex items-center space-x-3">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-purple-600"></div>
                <span className="font-medium text-purple-900">Analyse en cours...</span>
              </div>
              <div className="space-y-2 text-sm text-purple-800">
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  <span>Analyse de votre univers...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  <span>Extraction des personnages...</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-2 h-2 bg-purple-600 rounded-full animate-pulse"></div>
                  <span>Structuration des chapitres...</span>
                </div>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <Button
              className="bg-purple-600 hover:bg-purple-700 text-white"
              onClick={handleSubmit}
              disabled={!rawText || isProcessing}
            >
              {isProcessing ? 'Analyse en cours...' : 'Analyser et Créer'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
