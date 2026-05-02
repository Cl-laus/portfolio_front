"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export type FieldConfig = {
  key: string;
  placeholder: string;
};

type Item = { id: number; isNew?: boolean; [key: string]: any };

type Props = {
  title: string;
  items: Item[];
  fields: FieldConfig[];
  onUpdate: (id: number, field: string, value: string) => void;
  onRemove: (id: number) => void;
  onAdd: (name: string) => void;
  onSave: () => Promise<void>;
  isSaving?: boolean;
  addPlaceholder?: string;
};

export default function EditableList({
  title,
  items,
  fields,
  onUpdate,
  onRemove,
  onAdd,
  onSave,
  isSaving = false,
  addPlaceholder = "Nouveau...",
}: Props) {
  const [newName, setNewName] = useState("");

  function handleAdd() {
    if (!newName.trim()) return;
    onAdd(newName.trim());
    setNewName("");
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">

        {items.map((item) => (
          <div key={item.id} className="flex gap-2 items-center">
            {fields.map((field) => (
              <input
                key={field.key}
                className="border rounded px-1.5 py-1 flex-1 text-sm min-w-0"
                title={field.placeholder}
                value={item[field.key] || ""}
                onChange={(e) => onUpdate(item.id, field.key, e.target.value)}
              />
            ))}
            <Button
              variant="destructive"
              size="sm"
              onClick={() => onRemove(item.id)}
            >
              X
            </Button>
          </div>
        ))}

        {/* Champ ajout */}
        <div className="flex gap-2 mt-2">
          <input
            className="border rounded p-2 flex-1"
            placeholder={addPlaceholder}
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          />
          <Button onClick={handleAdd}>Ajouter</Button>
        </div>

        <Button onClick={onSave} disabled={isSaving}>
          {isSaving ? "Sauvegarde…" : `Sauvegarder ${title}`}
        </Button>

      </CardContent>
    </Card>
  );
}