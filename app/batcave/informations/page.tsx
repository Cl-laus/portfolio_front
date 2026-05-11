'use client';

import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTableList, faPlus, faTrashCan, faFloppyDisk, faEye, faEyeSlash } from '@fortawesome/free-solid-svg-icons';
import { Technology } from '@/types';
import { useInformationsPage, SocialNetworkForm, TechnologyForm } from '@/hooks/useInformationsPage';
import AdminCard from '@/components/AdminCard';
import AdminField from '@/components/AdminField';
import LoadingSpinner from '@/components/LoadingSpinner';

// ── Subcomponents ────────────────────────────────────────────

function SocialRow({ sn, onUpdate, onRemove }: {
  sn: SocialNetworkForm;
  onUpdate: (field: string, value: string) => void;
  onRemove: () => void;
}) {
  return (
    <div className="adm-social-row">
      <input className="adm-input" type="text" value={sn.name} placeholder="Plateforme"
        onChange={e => onUpdate('name', e.target.value)} />
      <input className="adm-input" type="url" value={sn.url} placeholder="https://..."
        onChange={e => onUpdate('url', e.target.value)} />
      <button className="adm-icon-btn adm-icon-btn--danger" type="button" onClick={onRemove} title="Supprimer">
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  );
}

function TechRow({ tech, onUpdate, onToggle, onDelete }: {
  tech: TechnologyForm;
  onUpdate: (field: keyof Technology, value: string) => void;
  onToggle: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="adm-tech-row">
      <input className="adm-input" type="text" value={tech.name} placeholder="Nom"
        onChange={e => onUpdate('name', e.target.value)} />
      <input className="adm-input" type="text" value={tech.category} placeholder="Catégorie"
        onChange={e => onUpdate('category', e.target.value)} />
      <input className="adm-input" type="text" value={tech.icon} placeholder="Icône (optionnel)"
        onChange={e => onUpdate('icon', e.target.value)} />
      <button
        className={`adm-icon-btn ${!tech.visible ? 'adm-icon-btn--amber' : ''}`}
        type="button" onClick={onToggle}
        title={tech.visible ? 'Visible — cliquer pour masquer' : 'Masqué'}
      >
        <FontAwesomeIcon icon={tech.visible ? faEye : faEyeSlash} />
      </button>
      <button className="adm-icon-btn adm-icon-btn--danger" type="button" onClick={onDelete} title="Supprimer">
        <FontAwesomeIcon icon={faTrashCan} />
      </button>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────

export default function InformationsPage() {
  const {
    isAuth, checkingAuth, loading, saving,
    information, handleInfoChange,
    socialNetworks, updateSocial, addSocial, removeSocial,
    technologies, updateTech, toggleTechVisibility, addTech, deleteTech,
    newTech, setNewTech,
    handleSave,
  } = useInformationsPage();

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

        <AdminCard title="Identité" body>
          <div className="grid grid-cols-2 gap-4">
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
                value={information?.tagLine ?? ''} placeholder="Une phrase courte"
                onChange={e => handleInfoChange('tagLine', e.target.value)} />
            </AdminField>
          </div>
        </AdminCard>

        <AdminCard title="Contact" body>
          <div className="grid grid-cols-2 gap-4">
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
        </AdminCard>

        <AdminCard title="Textes" body>
          <AdminField label="Introduction Hero" htmlFor="introText" hint="— affiché sous le nom en page d'accueil">
            <textarea className="adm-textarea" id="introText"
              value={information?.introText ?? ''} placeholder="Ex. Développeur Full Stack&#10;Lyon · FR&#10;Disponible"
              onChange={e => handleInfoChange('introText', e.target.value)} />
          </AdminField>
          <AdminField label="Titre À propos" htmlFor="aboutTitle" hint="— h2 du bloc Hello">
            <input className="adm-input" id="aboutTitle" type="text"
              value={information?.aboutTitle ?? ''} placeholder="Ex. Designer-turned-developer."
              onChange={e => handleInfoChange('aboutTitle', e.target.value)} />
          </AdminField>
          <AdminField label="Texte À propos" htmlFor="aboutText" hint="— paragraphe du bloc Hello">
            <textarea className="adm-textarea" id="aboutText"
              value={information?.aboutText ?? ''} placeholder="Quelques lignes de présentation…"
              onChange={e => handleInfoChange('aboutText', e.target.value)} />
          </AdminField>
          <AdminField label="Titre Parcours" htmlFor="careerTitle" hint="— h2 du bloc Parcours">
            <input className="adm-input" id="careerTitle" type="text"
              value={information?.careerTitle ?? ''} placeholder="Ex. From Cinema 4D to TypeScript."
              onChange={e => handleInfoChange('careerTitle', e.target.value)} />
          </AdminField>
          <AdminField label="Texte Parcours" htmlFor="careerText" hint="— paragraphe du bloc Parcours">
            <textarea className="adm-textarea" id="careerText"
              value={information?.careerText ?? ''} placeholder="Décris ton parcours professionnel…"
              onChange={e => handleInfoChange('careerText', e.target.value)} />
          </AdminField>
        </AdminCard>

        <AdminCard title="Réseaux" body>
          {socialNetworks.map(sn => (
            <SocialRow key={sn.id} sn={sn}
              onUpdate={(f, v) => updateSocial(sn.id, f, v)}
              onRemove={() => removeSocial(sn.id, sn.isNew)}
            />
          ))}
          <button className="adm-add-link" type="button" onClick={addSocial}>
            <FontAwesomeIcon icon={faPlus} />
            Ajouter un réseau
          </button>
        </AdminCard>

        <AdminCard title="Technologies" right={<span className="hint">Nom · Catégorie · Icône</span>} body>
          {technologies.map(tech => (
            <TechRow key={tech.id} tech={tech}
              onUpdate={(f, v) => updateTech(tech.id, f, v)}
              onToggle={() => !tech.isNew && toggleTechVisibility(tech)}
              onDelete={() => deleteTech(tech.id, tech.isNew)}
            />
          ))}
          <div className="adm-tech-add">
            <input className="adm-input" type="text" value={newTech.name} placeholder="Nouveau nom"
              onChange={e => setNewTech({ ...newTech, name: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} />
            <input className="adm-input" type="text" value={newTech.category} placeholder="Catégorie"
              onChange={e => setNewTech({ ...newTech, category: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} />
            <input className="adm-input" type="text" value={newTech.icon} placeholder="Icône (optionnel)"
              onChange={e => setNewTech({ ...newTech, icon: e.target.value })}
              onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTech())} />
            <button className="adm-icon-btn" type="button" onClick={addTech} title="Ajouter">
              <FontAwesomeIcon icon={faPlus} />
            </button>
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
