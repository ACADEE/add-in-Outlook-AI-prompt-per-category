import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { BookOpen, Plus, Settings, LogOut, Trash2, Edit, Download, CheckCircle } from 'lucide-react';
import { ProjectService, Project } from '@/services/project.service';
import { ExportService } from '@/services/export.service';

export const Dashboard: React.FC = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProjects();
  }, [currentUser]);

  const loadProjects = async () => {
    if (!currentUser) return;

    try {
      setLoading(true);
      const userProjects = await ProjectService.getUserProjects(currentUser.uid);
      setProjects(userProjects);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Êtes-vous sûr de vouloir supprimer ce projet?')) return;

    try {
      await ProjectService.deleteProject(projectId);
      await loadProjects();
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Erreur lors de la suppression du projet');
    }
  };

  const handleMarkAsCompleted = async (projectId: string) => {
    try {
      await ProjectService.markAsCompleted(projectId);
      await loadProjects();
    } catch (error) {
      console.error('Error marking as completed:', error);
      alert('Erreur lors de la validation du projet');
    }
  };

  const handleExportProject = async (project: Project) => {
    try {
      await ExportService.exportToWord(project);
    } catch (error) {
      console.error('Error exporting project:', error);
      alert('Erreur lors de l\'export du projet');
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === 'completed') {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
          <CheckCircle className="w-3 h-3 mr-1" />
          Terminé
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
        En cours
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">AI Novel Architect</h1>
            <p className="text-sm text-gray-600">Bienvenue, {currentUser?.email}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon">
              <Settings className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon" onClick={handleLogout}>
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Vos Projets</h2>
          <p className="text-gray-600">Gérez vos romans en cours d'écriture</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Create New Project Card */}
            <Card
              className="cursor-pointer hover:shadow-lg transition-shadow border-2 border-dashed border-gray-300 hover:border-blue-500"
              onClick={() => navigate('/onboarding')}
            >
              <CardContent className="flex flex-col items-center justify-center h-64 space-y-4">
                <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center">
                  <Plus className="h-8 w-8 text-blue-600" />
                </div>
                <div className="text-center">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Nouveau Projet</h3>
                  <p className="text-sm text-gray-600">Commencez l'écriture d'un nouveau roman</p>
                </div>
              </CardContent>
            </Card>

            {/* Existing Projects */}
            {projects.map((project) => (
              <Card
                key={project.id}
                className="hover:shadow-lg transition-shadow relative group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center space-x-3 flex-1">
                      <BookOpen className="h-6 w-6 text-blue-600" />
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-lg truncate">{project.title}</CardTitle>
                      </div>
                    </div>
                    {getStatusBadge(project.status)}
                  </div>
                  <CardDescription className="line-clamp-2">
                    {project.book_metadata?.pitch || 'Aucune description'}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3 text-sm text-gray-600">
                    <div className="flex justify-between">
                      <span>Chapitres:</span>
                      <span className="font-medium">
                        {project.outline?.filter((c) => c.content).length || 0}/
                        {project.outline?.length || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Progression:</span>
                      <span className="font-medium">{project.progress || 0}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all"
                        style={{ width: `${project.progress || 0}%` }}
                      ></div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/project/${project.id}`)}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        {project.status === 'completed' ? 'Voir' : 'Continuer'}
                      </Button>

                      <div className="flex items-center space-x-2">
                        {project.status === 'in_progress' && project.progress === 100 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleMarkAsCompleted(project.id)}
                            title="Marquer comme terminé"
                          >
                            <CheckCircle className="w-4 h-4" />
                          </Button>
                        )}

                        {project.status === 'completed' && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleExportProject(project)}
                            title="Exporter en WORD"
                          >
                            <Download className="w-4 h-4" />
                          </Button>
                        )}

                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          title="Supprimer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}

            {projects.length === 0 && (
              <div className="col-span-full text-center py-12">
                <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Aucun projet pour le moment
                </h3>
                <p className="text-gray-600 mb-4">
                  Commencez votre premier roman en cliquant sur "Nouveau Projet"
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
};
