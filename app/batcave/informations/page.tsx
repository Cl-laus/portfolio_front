'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import EditableList from '@/components/ui/EditableList';

import { informationService } from '@/services/informationService';
import { socialNetworkService } from '@/services/socialNetworkService';
import { technologyService } from '@/services/technologyService';

import { Information, SocialNetwork, Technology } from '@/types';
import LoadingPage from '@/app/batcave/loading';
import { useProtectedRoute } from '@/hooks/useProtectedRoute'; // <-- notre hook

type SocialNetworkForm = SocialNetwork & { isNew?: boolean };
type TechnologyForm = Technology & { isNew?: boolean };

export default function InformationsPage() {
  const { isAuth, checkingAuth } = useProtectedRoute();
  const router = useRouter();

  // ===================== STATE =====================
  const [information, setInformation] = useState<Information | null>(null);
  const [socialNetworks, setSocialNetworks] = useState<SocialNetworkForm[]>([]);
  const [technologies, setTechnologies] = useState<TechnologyForm[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSavingInfo, setSavingInfo] = useState(false);
  const [isSavingSocial, setSavingSocial] = useState(false);
  const [isSavingTech, setSavingTech] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [photoFile, setPhotoFile] = useState<File | null>(null);

  // ===================== DATA FETCH =====================
  useEffect(() => {
    if (!isAuth) return; // si pas auth, on ne fetch pas

    async function fetchData() {
      try {
        const info = await informationService.get();
        const socials = await socialNetworkService.getAll();
        const techs = await technologyService.getAll();
        setInformation(info);
        setSocialNetworks(socials);
        setTechnologies(techs);
        setPhotoPreview(info.photoPath || null);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [isAuth]);

  // ===================== INFORMATION =====================
  function handleInfoChange(field: keyof Information, value: string) {
    if (!information) return;
    setInformation({ ...information, [field]: value });
  }

  function handlePhotoChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFile(file);
    setPhotoPreview(URL.createObjectURL(file));
  }

  async function saveInformation() {
    if (!information || isSavingInfo) return;
    setSavingInfo(true);
    try {
      let updatedInfo = information;
      if (photoFile) {
        updatedInfo = await informationService.uploadPhoto(
          information.id,
          photoFile,
        );
      }
      await informationService.update(updatedInfo);
      alert('Informations sauvegardées !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde des informations.');
    } finally {
      setSavingInfo(false);
    }
  }

  // ===================== SOCIAL NETWORKS =====================
  function addSocialNetwork(name: string) {
    setSocialNetworks((prev) => [
      ...prev,
      { id: Date.now(), name, icon: '', url: '', isNew: true },
    ]);
  }

  function updateSocialNetwork(id: number, field: string, value: string) {
    setSocialNetworks((prev) =>
      prev.map((sn) => (sn.id === id ? { ...sn, [field]: value } : sn)),
    );
  }

  async function removeSocialNetwork(id: number) {
    if (isSavingSocial) return;
    setSavingSocial(true);
    try {
      await socialNetworkService.delete(id);
      setSocialNetworks((prev) => prev.filter((sn) => sn.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression du réseau social.');
    } finally {
      setSavingSocial(false);
    }
  }

  async function saveSocialNetworks() {
    if (isSavingSocial) return;
    setSavingSocial(true);
    try {
      for (const sn of socialNetworks) {
        if (sn.isNew) {
          await socialNetworkService.create({
            name: sn.name,
            icon: sn.icon,
            url: sn.url,
          });
        } else {
          await socialNetworkService.update(sn);
        }
      }
      alert('Réseaux sociaux sauvegardés !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde des réseaux sociaux.');
    } finally {
      setSavingSocial(false);
    }
  }

  // ===================== TECHNOLOGIES =====================
  function addTechnology(name: string) {
    setTechnologies((prev) => [
      ...prev,
      { id: Date.now(), name, icon: '', category: '', isNew: true },
    ]);
  }

  function updateTechnology(id: number, field: string, value: string) {
    setTechnologies((prev) =>
      prev.map((t) => (t.id === id ? { ...t, [field]: value } : t)),
    );
  }

  async function removeTechnology(id: number) {
    if (isSavingTech) return;
    setSavingTech(true);
    try {
      await technologyService.delete(id);
      setTechnologies((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la suppression de la technologie.');
    } finally {
      setSavingTech(false);
    }
  }

  async function saveTechnologies() {
    if (isSavingTech) return;
    setSavingTech(true);
    try {
      for (const tech of technologies) {
        if (tech.isNew) {
          await technologyService.create({
            name: tech.name,
            icon: tech.icon,
            category: tech.category,
          });
        } else {
          await technologyService.update(tech);
        }
      }
      alert('Technologies sauvegardées !');
    } catch (err) {
      console.error(err);
      alert('Erreur lors de la sauvegarde des technologies.');
    } finally {
      setSavingTech(false);
    }
  }

  // ===================== LOADING UI =====================
  if (checkingAuth || loading) {
    return <LoadingPage />;
  }

  if (!isAuth) {
    return null; // la redirection est gérée par le hook
  }

  // ===================== RENDER =====================
  return (
    <div className="p-4 space-y-6">
      <Button onClick={() => router.push('/batcave/projects')}>
        Admin Projets
      </Button>

      {/* ===== INFORMATIONS ===== */}
      <Card>
        <CardHeader>
          <CardTitle>Informations</CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          <FieldGroup className="grid grid-cols-2 gap-4">
            <Field>
              <FieldLabel htmlFor="fullName">Nom complet</FieldLabel>
              <Input id="fullName" value={information?.fullName ?? ''} onChange={(e) => handleInfoChange('fullName', e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="jobTitle">Titre</FieldLabel>
              <Input id="jobTitle" value={information?.jobTitle ?? ''} onChange={(e) => handleInfoChange('jobTitle', e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="tagLine">Tag line</FieldLabel>
              <Input id="tagLine" value={information?.tagLine ?? ''} onChange={(e) => handleInfoChange('tagLine', e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="aboutTitle">Titre À propos</FieldLabel>
              <Input id="aboutTitle" value={information?.aboutTitle ?? ''} onChange={(e) => handleInfoChange('aboutTitle', e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input id="email" type="email" value={information?.email ?? ''} onChange={(e) => handleInfoChange('email', e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="cv">CV (lien)</FieldLabel>
              <Input id="cv" value={information?.cv ?? ''} onChange={(e) => handleInfoChange('cv', e.target.value)} />
            </Field>
          </FieldGroup>

          <Separator />

          <FieldGroup className="grid grid-cols-1 gap-4">
            <Field>
              <FieldLabel htmlFor="introText">Introduction</FieldLabel>
              <Textarea id="introText" className="h-28 resize-none" value={information?.introText ?? ''} onChange={(e) => handleInfoChange('introText', e.target.value)} />
            </Field>
            <Field>
              <FieldLabel htmlFor="aboutText">À propos</FieldLabel>
              <Textarea id="aboutText" className="h-28 resize-none" value={information?.aboutText ?? ''} onChange={(e) => handleInfoChange('aboutText', e.target.value)} />
            </Field>
          </FieldGroup>

          <Separator />

          <Field className="w-fit">
            <FieldLabel>Photo</FieldLabel>
            {photoPreview && (
              <img
                src={photoPreview.startsWith('http') ? photoPreview : `${process.env.NEXT_PUBLIC_API_URL}${photoPreview}`}
                className="w-32 h-32 object-cover rounded-md border"
                alt="Aperçu photo de profil"
              />
            )}
            <Input type="file" accept="image/*" onChange={handlePhotoChange} />
          </Field>

          <Button onClick={saveInformation} disabled={isSavingInfo}>
            {isSavingInfo ? 'Sauvegarde…' : 'Sauvegarder les informations'}
          </Button>
        </CardContent>
      </Card>

      {/* ===== TECHNOLOGIES + SOCIAL NETWORKS ===== */}
      <div className="grid grid-cols-2 gap-6">
        <EditableList
          title="Technologies"
          items={technologies}
          fields={[
            { key: 'name', placeholder: 'Nom' },
            { key: 'category', placeholder: 'Catégorie' },
          ]}
          onUpdate={updateTechnology}
          onRemove={removeTechnology}
          onAdd={addTechnology}
          onSave={saveTechnologies}
          isSaving={isSavingTech}
          addPlaceholder="Nouvelle technologie"
        />

        <EditableList
          title="Réseaux sociaux"
          items={socialNetworks}
          fields={[
            { key: 'name', placeholder: 'Nom' },
            { key: 'icon', placeholder: 'URL icône' },
            { key: 'url', placeholder: 'URL' },
          ]}
          onUpdate={updateSocialNetwork}
          onRemove={removeSocialNetwork}
          onAdd={addSocialNetwork}
          onSave={saveSocialNetworks}
          isSaving={isSavingSocial}
          addPlaceholder="Nouveau réseau social"
        />
      </div>
    </div>
  );
}