'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faPlus, faTrashCan, faFloppyDisk, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { informationService } from '@/services/informationService';
import { socialNetworkService } from '@/services/socialNetworkService';
import { technologyService } from '@/services/technologyService';
import { Information, SocialNetwork, Technology } from '@/types';
import AdminCard from '@/components/AdminCard';
import AdminField from '@/components/AdminField';
import LoadingSpinner from '@/components/LoadingSpinner';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

type SocialNetworkForm = SocialNetwork & { isNew?: boolean };
type TechnologyForm    = Technology    & { isNew?: boolean };

export default function InformationsPage() {
  const { isAuth, checkingAuth } = useProtectedRoute();

  const [information,    setInformation]    = useState<Information | null>(null);
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworkForm[]>([]);
  const [technologies,   setTechnologies]   = useState<TechnologyForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving,  setSaving]  = useState(false);

  const [newName,     setNewName]     = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [newIcon,     setNewIcon]     = useState('');

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
    } catch (err) {
      console.error(err);
    }
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
    } catch (err) {
      console.error(err);
    }
  }
  function addTech() {
    if (!newName.trim()) return;
    setTechnologies(prev => [
      ...prev,
      { id: Date.now(), name: newName.trim(), category: newCategory.trim(), icon: newIcon.trim(), visible: true, isNew: true },
    ]);
    setNewName(''); setNewCategory(''); setNewIcon('');
  }
  async function deleteTech(id: number, isNew?: boolean) {
    if (isNew) { setTechnologies(prev => prev.filter(t => t.id !== id)); return; }
    if (!confirm('Supprimer cette technologie ?')) return;
    try {
      await technologyService.delete(id);
      setTechnologies(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error(err);
    }
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
    } finally {
      setSaving(false);
    }
  }

  if (checkingAuth || loading) return <LoadingSpinner />;
  if (!isAuth) return null;

  return (
    <main className="adm-page">
        <div className="adm-page-header">
          <div className="lead">
            <h1>Informations.</h1>
            <p className="subtitle">Identité du portfolio — nom, métier, baseline, contact et textes.</p>
          </div>
          <div className="actions">
            <Link className="adm-btn" href="/batcave/projects">
              <FontAwesomeIcon icon={faTableList} />
              Projets
            </Link>
          </div>
        </div>

        <form onSubmit={e => { e.preventDefault(); handleSave(); }}>

          <AdminCard title="Identité">
            <div className="adm-card-body">
              <div className="adm-grid-2">
                <AdminField label="Nom complet" htmlFor="fullName">
                  <input className="adm-input" id="fullName" type="text"
                    value={information?.fullName ?? ''} placeholder="Prénom Nom"
                    onChange={e => handleInfoChange('fullName', e.target.value)} />
                </AdminField>
                <AdminField label="Titre" htmlFor="jobTitle">
                  <input className="adm-input" id="jobTitle" type="text"
                    value={information?.jobTitle ?? ''} placeholder="Ex. Designer & Developer"
                    onChange={e => handleInfoChange('jobTitle', e.target.value)} />
                </AdminField>
                <AdminField label="Tag line" htmlFor="tagLine">
                  <input className="adm-input" id="tagLine" type="text"
                    value={information?.tagLine ?? ''} placeholder="Une phrase courte de présentation"
                    onChange={e => handleInfoChange('tagLine', e.target.value)} />
                </AdminField>
                <AdminField label="Titre À propos" htmlFor="aboutTitle">
                  <input className="adm-input" id="aboutTitle" type="text"
                    value={information?.aboutTitle ?? ''} placeholder="Ex. À propos de moi"
                    onChange={e => handleInfoChange('aboutTitle', e.target.value)} />
                </AdminField>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Contact">
            <div className="adm-card-body">
              <div className="adm-grid-2">
                <AdminField label="Email" htmlFor="email">
                  <input className="adm-input" id="email" type="email"
                    value={information?.email ?? ''} placeholder="contact@exemple.fr"
                    onChange={e => handleInfoChange('email', e.target.value)} />
                </AdminField>
                <AdminField label="CV (lien)" htmlFor="cv">
                  <input className="adm-input" id="cv" type="url"
                    value={information?.cv ?? ''} placeholder="https://..."
                    onChange={e => handleInfoChange('cv', e.target.value)} />
                </AdminField>
              </div>
            </div>
          </AdminCard>

          <AdminCard title="Textes">
            <div className="adm-card-body">
              <AdminField label="Introduction" htmlFor="introText" hint="— page d'accueil">
                <textarea className="adm-textarea" id="introText"
                  value={information?.introText ?? ''} placeholder="Le texte qui apparaît en page d'accueil."
                  onChange={e => handleInfoChange('introText', e.target.value)} />
              </AdminField>
              <AdminField label="À propos" htmlFor="aboutText" hint="— page À propos">
                <textarea className="adm-textarea" id="aboutText"
                  value={information?.aboutText ?? ''} placeholder="Le texte long, sur la page À propos."
                  onChange={e => handleInfoChange('aboutText', e.target.value)} />
              </AdminField>
            </div>
          </AdminCard>

          <AdminCard title="Réseaux">
            <div className="adm-card-body">
              {socialNetworks.map(sn => (
                <div key={sn.id} className="adm-social-row">
                  <input className="adm-input" type="text" value={sn.name} placeholder="Plateforme"
                    onChange={e => updateSocial(sn.id, 'name', e.target.value)} />
                  <input className="adm-input" type="url" value={sn.url} placeholder="https://..."
                    onChange={e => updateSocial(sn.id, 'url', e.target.value)} />
                  <button className="adm-icon-btn adm-icon-btn--danger" type="button"
                    onClick={() => removeSocial(sn.id, sn.isNew)} title="Supprimer">
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              ))}
              <button className="adm-add-link" type="button" onClick={addSocial}>
                <FontAwesomeIcon icon={faPlus} />
                Ajouter un réseau
              </button>
            </div>
          </AdminCard>

          <AdminCard title="Technologies" right={<span className="hint">Nom · Catégorie · Icône</span>}>
            <div className="adm-card-body">
              {technologies.map(tech => (
                <div key={tech.id} className="adm-tech-row">
                  <input className="adm-input" type="text" value={tech.name} placeholder="Nom"
                    onChange={e => updateTech(tech.id, 'name', e.target.value)} />
                  <input className="adm-input" type="text" value={tech.category} placeholder="Catégorie (ex: Front, Back, 3D…)"
                    onChange={e => updateTech(tech.id, 'category', e.target.value)} />
                  <input className="adm-input" type="text" value={tech.icon} placeholder="Icône (optionnel)"
                    onChange={e => updateTech(tech.id, 'icon', e.target.value)} />
                  <button
                    className={`adm-icon-btn ${!tech.visible ? 'adm-icon-btn--amber' : ''}`}
                    type="button"
                    onClick={() => !tech.isNew && toggleTechVisibility(tech)}
                    title={tech.visible ? 'Visible — cliquer pour masquer' : 'Masqué — cliquer pour rendre visible'}
                  >
                    <FontAwesomeIcon icon={tech.visible ? faEye : faEyeSlash} />
                  </button>
                  <button className="adm-icon-btn adm-icon-btn--danger" type="button"
                    onClick={() => deleteTech(tech.id, tech.isNew)} title="Supprimer">
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              ))}
              <div className="adm-tech-add">
                <input className="adm-input" type="text" value={newName} placeholder="Nouveau nom"
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} />
                <input className="adm-input" type="text" value={newCategory} placeholder="Catégorie"
                  onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} />
                <input className="adm-input" type="text" value={newIcon} placeholder="Icône (optionnel)"
                  onChange={e => setNewIcon(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }} />
                <button className="adm-icon-btn" type="button" onClick={addTech} title="Ajouter">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>
            </div>
          </AdminCard>

          <div className="adm-form-actions">
            <Link className="adm-btn-link" href="/batcave/projects">Annuler</Link>
            <button className="adm-btn adm-btn-amber" type="submit" disabled={saving}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {saving ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
          </div>

        </form>
    </main>
  );
}
