'use client';

import { useEffect, useState } from 'react';
import { informationService } from '@/services/informationService';
import { socialNetworkService } from '@/services/socialNetworkService';
import { technologyService } from '@/services/technologyService';
import { Information, SocialNetwork, Technology } from '@/types';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

export type SocialNetworkForm = SocialNetwork & { isNew?: boolean };
export type TechnologyForm    = Technology    & { isNew?: boolean };

export function useInformationsPage() {
  const { isAuth, checkingAuth } = useProtectedRoute();

  const [information,    setInformation]    = useState<Information | null>(null);
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworkForm[]>([]);
  const [technologies,   setTechnologies]   = useState<TechnologyForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);
  const [newTech, setNewTech] = useState({ name: '', category: '', icon: '' });

  useEffect(() => {
    if (!isAuth) return;
    async function fetchData() {
      try {
        const [info, socials, techs] = await Promise.all([
          informationService.get(),
          socialNetworkService.getAll(),
          technologyService.getAll(),
        ]);
        setInformation(info);
        setSocialNetworks(socials);
        setTechnologies(techs);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAuth]);

  // ── Information ───────────────────────────────────────────────
  function handleInfoChange(field: keyof Information, value: string) {
    if (!information) return;
    setInformation({ ...information, [field]: value });
  }

  // ── Social networks ──────────────────────────────────────────
  function updateSocial(id: number, field: string, value: string) {
    setSocialNetworks(prev => prev.map(sn => sn.id === id ? { ...sn, [field]: value } : sn));
  }
  function addSocial() {
    setSocialNetworks(prev => [...prev, { id: Date.now(), name: '', icon: '', url: '', isNew: true }]);
  }
  async function removeSocial(id: number, isNew?: boolean) {
    if (isNew) { setSocialNetworks(prev => prev.filter(sn => sn.id !== id)); return; }
    if (!confirm('Supprimer ce réseau social ?')) return;
    try {
      await socialNetworkService.delete(id);
      setSocialNetworks(prev => prev.filter(sn => sn.id !== id));
    } catch (err) { console.error(err); }
  }

  // ── Technologies ─────────────────────────────────────────────
  function updateTech(id: number, field: keyof Technology, value: string) {
    setTechnologies(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  }
  async function toggleTechVisibility(tech: TechnologyForm) {
    const updated = { ...tech, visible: !tech.visible };
    try {
      await technologyService.update(updated);
      setTechnologies(prev => prev.map(t => t.id === tech.id ? updated : t));
    } catch (err) { console.error(err); }
  }
  function addTech() {
    if (!newTech.name.trim()) return;
    setTechnologies(prev => [
      ...prev,
      { id: Date.now(), name: newTech.name.trim(), category: newTech.category.trim(), icon: newTech.icon.trim(), visible: true, isNew: true },
    ]);
    setNewTech({ name: '', category: '', icon: '' });
  }
  async function deleteTech(id: number, isNew?: boolean) {
    if (isNew) { setTechnologies(prev => prev.filter(t => t.id !== id)); return; }
    if (!confirm('Supprimer cette technologie ?')) return;
    try {
      await technologyService.delete(id);
      setTechnologies(prev => prev.filter(t => t.id !== id));
    } catch (err) { console.error(err); }
  }

  // ── Save ─────────────────────────────────────────────────────
  async function handleSave() {
    if (saving || !information) return;
    setSaving(true);
    try {
      await informationService.update(information);
      for (const sn of socialNetworks) {
        if (sn.isNew) await socialNetworkService.create({ name: sn.name, icon: sn.icon, url: sn.url });
        else          await socialNetworkService.update(sn);
      }
      for (const tech of technologies) {
        if (tech.isNew) await technologyService.create({ name: tech.name, icon: tech.icon, category: tech.category });
        else            await technologyService.update(tech);
      }
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde. Vérifiez votre connexion et réessayez.');
    } finally {
      setSaving(false);
    }
  }

  return {
    isAuth, checkingAuth, loading, saving,
    information, handleInfoChange,
    socialNetworks, updateSocial, addSocial, removeSocial,
    technologies, updateTech, toggleTechVisibility, addTech, deleteTech,
    newTech, setNewTech,
    handleSave,
  };
}
