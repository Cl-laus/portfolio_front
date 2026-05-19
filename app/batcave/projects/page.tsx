'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare, faTrashCan, faPlus } from '@fortawesome/free-solid-svg-icons';
import { Project } from '@/types';
import { projectService } from '@/services/projectService';
import { statsService } from '@/services/statsService';
import AdminCard from '@/components/AdminCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export default function ProjectsPage() {
  const { isAuth, checkingAuth } = useProtectedRoute();
  const [projects, setProjects] = useState<Project[]>([]);
  const [stats, setStats] = useState<Map<number, number>>(new Map());
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (!isAuth) return;
    fetchProjects();
    fetchStats();
  }, [isAuth]);

  async function fetchProjects() {
    try {
      const data = await projectService.getAll();
      setProjects(data.sort((a, b) => a.displayOrder - b.displayOrder));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function fetchStats() {
    try {
      setStats(await statsService.getProjectStats());
    } catch {
      // stats are non-critical
    }
  }

  async function handleOrderChange(project: Project, input: HTMLInputElement) {
    const newOrder = parseInt(input.value, 10);
    if (!newOrder || newOrder === project.displayOrder) {
      input.value = String(project.displayOrder);
      return;
    }
    try {
      await projectService.update(project.id, { displayOrder: newOrder });
      await fetchProjects();
    } catch (err) {
      console.error(err);
      input.value = String(project.displayOrder);
    }
  }

  async function handleDelete(id: number) {
    if (!confirm('Supprimer ce projet ?')) return;
    try {
      await projectService.delete(id);
      await fetchProjects();
    } catch (err) {
      console.error(err);
    }
  }

  if (checkingAuth || loading) return <LoadingSpinner />;
  if (!isAuth) return null;

  const visible  = projects.filter(p => p.displayOrder <= 3);
  const archived = projects.filter(p => p.displayOrder > 3);

  function renderRows(list: Project[]) {
    if (list.length === 0) {
      return (
        <tr>
          <td colSpan={6} className="adm-empty">Aucun projet</td>
        </tr>
      );
    }
    return list.map(project => (
      <tr key={project.id}>
        <td className="adm-col-id" data-label="ID">
          {String(project.id).padStart(2, '0')}
        </td>
        <td className="adm-col-title" data-label="Titre">
          <button className="title-link" onClick={() => router.push(`/batcave/projects/${project.id}`)}>
            {project.title}
          </button>
        </td>
        <td className="adm-col-status" data-label="Statut">
          <span className={`adm-pill ${project.displayOrder <= 3 ? 'adm-pill--visible' : ''}`}>
            <span className="dot" />
            {project.displayOrder <= 3 ? 'Visible' : 'Archivé'}
          </span>
        </td>
        <td className="adm-col-views" data-label="Vues">
          {stats.get(project.id) ?? 0}
        </td>
        <td className="adm-col-order" data-label="Ordre">
          <input
            className="adm-order-input"
            type="number"
            min={1}
            defaultValue={project.displayOrder}
            key={project.displayOrder}
            onBlur={e => handleOrderChange(project, e.currentTarget)}
            onKeyDown={e => {
              if (e.key === 'Enter') e.currentTarget.blur();
              if (e.key === 'Escape') {
                e.currentTarget.value = String(project.displayOrder);
                e.currentTarget.blur();
              }
            }}
          />
        </td>
        <td className="adm-col-actions" data-label="Actions">
          <div className="inline-flex gap-2.5 justify-end">
            <button className="adm-icon-btn" onClick={() => router.push(`/batcave/projects/${project.id}`)} title="Éditer">
              <FontAwesomeIcon icon={faPenToSquare} />
            </button>
            <button className="adm-icon-btn adm-icon-btn--danger" onClick={() => handleDelete(project.id)} title="Supprimer">
              <FontAwesomeIcon icon={faTrashCan} />
            </button>
          </div>
        </td>
      </tr>
    ));
  }

  const tableHead = (
    <tr>
      <th className="adm-col-id">ID</th>
      <th className="adm-col-title">Titre</th>
      <th className="adm-col-status">Statut</th>
      <th className="adm-col-views">Vues</th>
      <th className="adm-col-order">Ordre</th>
      <th className="adm-col-actions">Actions</th>
    </tr>
  );

  return (
    <main className="adm-page">
        <div className="adm-page-header">
          <div className="lead">
            <h1>Projets.</h1>
            <p className="subtitle">Gère l&apos;ordre, la visibilité et le contenu de chaque projet du portfolio.</p>
          </div>
          <div className="actions">
            <Link className="adm-btn" href="/batcave/informations">
              <FontAwesomeIcon icon={faPenToSquare} />
              Informations globales
            </Link>
            <button className="adm-btn" onClick={() => router.push('/batcave/projects/new')}>
              <FontAwesomeIcon icon={faPlus} />
              Nouveau projet
            </button>
          </div>
        </div>

        <AdminCard title="Visibles" right={<span className="count">{String(visible.length).padStart(2, '0')} projets</span>}>
          <table className="adm-table">
            <thead>{tableHead}</thead>
            <tbody>{renderRows(visible)}</tbody>
          </table>
        </AdminCard>

        <AdminCard title="Archivés" muted right={<span className="count">{String(archived.length).padStart(2, '0')} projets</span>}>
          <table className="adm-table">
            <thead>{tableHead}</thead>
            <tbody>{renderRows(archived)}</tbody>
          </table>
        </AdminCard>
    </main>
  );
}
