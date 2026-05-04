'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Project } from '@/types';
import { projectService } from '@/services/projectService';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import LoadingPage from '@/app/batcave/loading';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function ProjectsPage() {
  const { isAuth, checkingAuth } = useProtectedRoute();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(function () {
    if (!isAuth) return;
    fetchProjects();
  }, [isAuth]);

  async function fetchProjects() {
    try {
      const data = await projectService.getAll();
      setProjects(data.sort(function(a, b) { return a.displayOrder - b.displayOrder; }));
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  async function handleOrderChange(project: Project, inputEl: HTMLInputElement) {
    const newOrder = parseInt(inputEl.value, 10);
    if (!newOrder || newOrder === project.displayOrder) {
      inputEl.value = String(project.displayOrder);
      return;
    }
    try {
      await projectService.update(project.id, { displayOrder: newOrder });
      await fetchProjects();
    } catch (error) {
      console.error(error);
      inputEl.value = String(project.displayOrder);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce projet ?')) return;
    try {
      await projectService.delete(id);
      await fetchProjects();
    } catch (error) {
      console.error(error);
    }
  }

  if (checkingAuth || loading) return <LoadingPage />;
  if (!isAuth) return null;

  const sorted = [...projects].sort(function(a, b) { return a.displayOrder - b.displayOrder; });
  const visible = sorted.filter(function(p) { return p.displayOrder <= 3; });
  const archived = sorted.filter(function(p) { return p.displayOrder > 3; });

  function renderRows(list: Project[]) {
    if (list.length === 0) {
      return (
        <TableRow>
          <TableCell colSpan={4} className="text-center text-muted-foreground">Aucun projet</TableCell>
        </TableRow>
      );
    }
    return list.map(function(project) {
      return (
        <TableRow key={project.id}>
          <TableCell className="text-muted-foreground">{project.id}</TableCell>
          <TableCell>{project.title}</TableCell>
          <TableCell className="w-20">
            <input
              key={project.displayOrder}
              type="number"
              min={1}
              defaultValue={project.displayOrder}
              className="w-14 bg-transparent border border-input rounded px-1.5 py-0.5 text-sm text-center focus:outline-none focus:border-ring"
              onBlur={function(e) { handleOrderChange(project, e.currentTarget); }}
              onKeyDown={function(e) {
                if (e.key === 'Enter') e.currentTarget.blur();
                if (e.key === 'Escape') {
                  e.currentTarget.value = String(project.displayOrder);
                  e.currentTarget.blur();
                }
              }}
            />
          </TableCell>
          <TableCell className="flex gap-1">
            <Button variant="ghost" size="sm" onClick={function() { router.push(`/batcave/projects/${project.id}`); }}>
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
    });
  }

  return (
    <div className="p-4 space-y-6">
      <Button onClick={function() { router.push('/batcave/informations'); }}>Admin Informations</Button>

      <div className="space-y-6">
        <Card>
          <CardHeader><CardTitle>Visibles</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead className="w-20">Ordre</TableHead>
                  <TableHead className="w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderRows(visible)}</TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Archivés</CardTitle></CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16">ID</TableHead>
                  <TableHead>Titre</TableHead>
                  <TableHead className="w-20">Ordre</TableHead>
                  <TableHead className="w-40">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>{renderRows(archived)}</TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <Button onClick={function() { router.push('/batcave/projects/new'); }}>+ Nouveau projet</Button>
    </div>
  );
}
