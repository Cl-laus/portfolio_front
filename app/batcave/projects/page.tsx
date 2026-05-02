'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/types';
import { projectService } from '@/services/projectService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingPage from '@/app/batcave/loading';
import { useProtectedRoute } from '@/hooks/useProtectedRoute'; // <-- notre hook

export default function ProjectsPage() {
  const { isAuth, checkingAuth } = useProtectedRoute();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // ===================== DATA FETCH =====================
  useEffect(function () {
    if (!isAuth) return; // si pas auth, on ne fetch pas
    fetchProjects();
  }, [isAuth]);

  async function fetchProjects() {
    try {
      const data = await projectService.getAll();
      setProjects(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  // ===================== ACTIONS =====================
  function handleEdit(id: number) {
    router.push(`/batcave/projects/${id}`);
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce projet ?')) return;
    try {
      await projectService.delete(id);
      setProjects(function(prev) {
        return prev.filter(function(p) { return p.id !== id; });
      });
    } catch (error) {
      console.error(error);
    }
  }

  function handleCreate() {
    router.push('/batcave/projects/new');
  }

  function handleAdminInformations() {
    router.push('/batcave/informations');
  }

  // ===================== FILTERED DATA =====================
  function getVisibleProjects() {
    return projects.filter(function(p) { return p.displayOrder >= 1 && p.displayOrder <= 3; });
  }

  function getArchivedProjects() {
    return projects.filter(function(p) { return p.displayOrder < 1 || p.displayOrder > 3; });
  }

  // ===================== RENDER =====================
  if (checkingAuth || loading) {
    return <LoadingPage />;
  }

  if (!isAuth) {
    return null; // la redirection est gérée par le hook
  }

  const visible = getVisibleProjects();
  const archived = getArchivedProjects();

  return (
    <div className="p-4 space-y-6">
      <Button onClick={handleAdminInformations}>Admin Informations</Button>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Visibles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead className="w-24">Ordre</TableHead>
                  <TableHead className="w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Aucun projet
                    </TableCell>
                  </TableRow>
                ) : (
                  visible.map(function(project) {
                    return (
                      <TableRow key={project.id}>
                        <TableCell className="text-muted-foreground">{project.id}</TableCell>
                        <TableCell>{project.title}</TableCell>
                        <TableCell>{project.displayOrder}</TableCell>
                        <TableCell className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={function() { handleEdit(project.id); }}>
                            Éditer
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={function() { handleDelete(project.id); }}
                          >
                            Supprimer
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Archivés</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead className="w-24">Ordre</TableHead>
                  <TableHead className="w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {archived.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-muted-foreground">
                      Aucun projet
                    </TableCell>
                  </TableRow>
                ) : (
                  archived.map(function(project) {
                    return (
                      <TableRow key={project.id}>
                        <TableCell className="text-muted-foreground">{project.id}</TableCell>
                        <TableCell>{project.title}</TableCell>
                        <TableCell>{project.displayOrder}</TableCell>
                        <TableCell className="flex gap-1">
                          <Button variant="ghost" size="sm" onClick={function() { handleEdit(project.id); }}>
                            Éditer
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={function() { handleDelete(project.id); }}
                          >
                            Supprimer
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Button onClick={handleCreate}>+ Nouveau projet</Button>
    </div>
  );
}