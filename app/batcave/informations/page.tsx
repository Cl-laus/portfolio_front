'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faTableList, faPlus, faTrashCan, faFloppyDisk, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';

import { informationService } from '@/services/informationService';
import { socialNetworkService } from '@/services/socialNetworkService';
import { technologyService } from '@/services/technologyService';
import { Information, SocialNetwork, Technology } from '@/types';
import LoadingPage from '@/app/batcave/loading';
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

  // ── Fetch ──────────────────────────────────────────────────
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

  // ── Information ─────────────────────────────────────────────
  function handleInfoChange(field: keyof Information, value: string) {
    if (!information) return;
    setInformation({ ...information, [field]: value });
  }

  // ── Social networks ─────────────────────────────────────────
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
    setNewName('');
    setNewCategory('');
    setNewIcon('');
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

  if (checkingAuth || loading) return <LoadingPage />;
  if (!isAuth) return null;

  return (
    <>
      <header className="adm-topbar">
        <div className="adm-crumb">
          <span className="dash" />
          <span>Admin · Informations</span>
        </div>
        <Link className="adm-back-link" href="/">
          <FontAwesomeIcon icon={faArrowLeft} />
          <span>Back to home</span>
        </Link>
      </header>

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

          {/* ── Identité ── */}
          <section className="adm-card">
            <div className="adm-card-head">
              <h2><span className="hairline" />Identité</h2>
            </div>
            <div className="adm-card-body">
              <div className="adm-grid-2">
                <div className="adm-field">
                  <label className="adm-field-label" htmlFor="fullName">Nom complet</label>
                  <input className="adm-input" id="fullName" type="text"
                    value={information?.fullName ?? ''}
                    onChange={e => handleInfoChange('fullName', e.target.value)}
                    placeholder="Prénom Nom" />
                </div>
                <div className="adm-field">
                  <label className="adm-field-label" htmlFor="jobTitle">Titre</label>
                  <input className="adm-input" id="jobTitle" type="text"
                    value={information?.jobTitle ?? ''}
                    onChange={e => handleInfoChange('jobTitle', e.target.value)}
                    placeholder="Ex. Designer & Developer" />
                </div>
                <div className="adm-field">
                  <label className="adm-field-label" htmlFor="tagLine">Tag line</label>
                  <input className="adm-input" id="tagLine" type="text"
                    value={information?.tagLine ?? ''}
                    onChange={e => handleInfoChange('tagLine', e.target.value)}
                    placeholder="Une phrase courte de présentation" />
                </div>
                <div className="adm-field">
                  <label className="adm-field-label" htmlFor="aboutTitle">Titre À propos</label>
                  <input className="adm-input" id="aboutTitle" type="text"
                    value={information?.aboutTitle ?? ''}
                    onChange={e => handleInfoChange('aboutTitle', e.target.value)}
                    placeholder="Ex. À propos de moi" />
                </div>
              </div>
            </div>
          </section>

          {/* ── Contact ── */}
          <section className="adm-card">
            <div className="adm-card-head">
              <h2><span className="hairline" />Contact</h2>
            </div>
            <div className="adm-card-body">
              <div className="adm-grid-2">
                <div className="adm-field">
                  <label className="adm-field-label" htmlFor="email">Email</label>
                  <input className="adm-input" id="email" type="email"
                    value={information?.email ?? ''}
                    onChange={e => handleInfoChange('email', e.target.value)}
                    placeholder="contact@exemple.fr" />
                </div>
                <div className="adm-field">
                  <label className="adm-field-label" htmlFor="cv">CV (lien)</label>
                  <input className="adm-input" id="cv" type="url"
                    value={information?.cv ?? ''}
                    onChange={e => handleInfoChange('cv', e.target.value)}
                    placeholder="https://..." />
                </div>
              </div>
            </div>
          </section>

          {/* ── Textes ── */}
          <section className="adm-card">
            <div className="adm-card-head">
              <h2><span className="hairline" />Textes</h2>
            </div>
            <div className="adm-card-body">
              <div className="adm-field">
                <label className="adm-field-label" htmlFor="introText">
                  Introduction <span className="adm-field-hint">— page d'accueil</span>
                </label>
                <textarea className="adm-textarea" id="introText"
                  value={information?.introText ?? ''}
                  onChange={e => handleInfoChange('introText', e.target.value)}
                  placeholder="Le texte qui apparaît en page d'accueil." />
              </div>
              <div className="adm-field">
                <label className="adm-field-label" htmlFor="aboutText">
                  À propos <span className="adm-field-hint">— page À propos</span>
                </label>
                <textarea className="adm-textarea" id="aboutText"
                  value={information?.aboutText ?? ''}
                  onChange={e => handleInfoChange('aboutText', e.target.value)}
                  placeholder="Le texte long, sur la page À propos." />
              </div>
            </div>
          </section>

          {/* ── Réseaux ── */}
          <section className="adm-card">
            <div className="adm-card-head">
              <h2><span className="hairline" />Réseaux</h2>
            </div>
            <div className="adm-card-body">
              {socialNetworks.map(sn => (
                <div key={sn.id} className="adm-social-row">
                  <input className="adm-input" type="text"
                    value={sn.name}
                    onChange={e => updateSocial(sn.id, 'name', e.target.value)}
                    placeholder="Plateforme" />
                  <input className="adm-input" type="url"
                    value={sn.url}
                    onChange={e => updateSocial(sn.id, 'url', e.target.value)}
                    placeholder="https://..." />
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
          </section>

          {/* ── Technologies ── */}
          <section className="adm-card">
            <div className="adm-card-head">
              <h2><span className="hairline" />Technologies</h2>
              <span className="hint">Nom · Catégorie · Icône</span>
            </div>
            <div className="adm-card-body">

              {/* Existing techs */}
              {technologies.map(tech => (
                <div key={tech.id} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto auto', gap: 12, alignItems: 'center', marginBottom: 10 }}>
                  <input className="adm-input" type="text"
                    value={tech.name}
                    onChange={e => updateTech(tech.id, 'name', e.target.value)}
                    placeholder="Nom" />
                  <input className="adm-input" type="text"
                    value={tech.category}
                    onChange={e => updateTech(tech.id, 'category', e.target.value)}
                    placeholder="Catégorie (ex: Front, Back, 3D…)" />
                  <input className="adm-input" type="text"
                    value={tech.icon}
                    onChange={e => updateTech(tech.id, 'icon', e.target.value)}
                    placeholder="Icône (optionnel)" />
                  <button
                    className="adm-icon-btn"
                    type="button"
                    onClick={() => !tech.isNew && toggleTechVisibility(tech)}
                    title={tech.visible ? 'Visible — cliquer pour masquer' : 'Masqué — cliquer pour rendre visible'}
                    style={{ borderColor: tech.visible ? undefined : 'var(--amber)', color: tech.visible ? undefined : 'var(--amber)' }}
                  >
                    <FontAwesomeIcon icon={tech.visible ? faEye : faEyeSlash} />
                  </button>
                  <button className="adm-icon-btn adm-icon-btn--danger" type="button"
                    onClick={() => deleteTech(tech.id, tech.isNew)} title="Supprimer">
                    <FontAwesomeIcon icon={faTrashCan} />
                  </button>
                </div>
              ))}

              {/* Add new tech */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr auto', gap: 12, alignItems: 'center', marginTop: 16, paddingTop: 16, borderTop: '1px solid var(--hairline)' }}>
                <input className="adm-input" type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                  placeholder="Nouveau nom" />
                <input className="adm-input" type="text"
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                  placeholder="Catégorie" />
                <input className="adm-input" type="text"
                  value={newIcon}
                  onChange={e => setNewIcon(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addTech(); } }}
                  placeholder="Icône (optionnel)" />
                <button className="adm-icon-btn" type="button" onClick={addTech} title="Ajouter">
                  <FontAwesomeIcon icon={faPlus} />
                </button>
              </div>

            </div>
          </section>

          {/* ── Actions ── */}
          <div className="adm-form-actions">
            <Link className="adm-btn-link" href="/batcave/projects">Annuler</Link>
            <button className="adm-btn adm-btn-amber" type="submit" disabled={saving}>
              <FontAwesomeIcon icon={faFloppyDisk} />
              {saving ? 'Sauvegarde…' : 'Sauvegarder'}
            </button>
          </div>

        </form>
      </main>
    </>
  );
}
