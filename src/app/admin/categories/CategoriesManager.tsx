"use client";

import { useState } from "react";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "./actions";
import { IconEdit, IconDelete } from "@/components/admin/ActionIcons";

type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
};

export function CategoriesManager({
  categories: initialCategories,
}: {
  categories: Category[];
}) {
  const [categories, setCategories] = useState(initialCategories);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleCreate(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError("");
    setMessage("");
    const form = e.currentTarget;
    const formData = new FormData(form);
    const result = await createCategory(formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage("Category created.");
    form.reset();
    setCategories((prev) => {
      const name = (formData.get("name") as string)?.trim() || "";
      const slug = (formData.get("slug") as string)?.trim() || name.toLowerCase().replace(/\s+/g, "-");
      return [...prev, { id: "new", name, slug, description: null, created_at: new Date().toISOString() }];
    });
    // Refresh will happen via revalidatePath; for instant UI we could refetch. Rely on refresh.
    window.location.reload();
  }

  async function handleUpdate(e: React.FormEvent<HTMLFormElement>, id: string) {
    e.preventDefault();
    setError("");
    setMessage("");
    const formData = new FormData(e.currentTarget);
    const result = await updateCategory(id, formData);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage("Category updated.");
    setEditingId(null);
    window.location.reload();
  }

  async function handleDelete(id: string) {
    setError("");
    setMessage("");
    if (!confirm("Delete this category? Posts will be unlinked.")) return;
    const result = await deleteCategory(id);
    if (result.error) {
      setError(result.error);
      return;
    }
    setMessage("Category deleted.");
    setCategories((prev) => prev.filter((c) => c.id !== id));
    window.location.reload();
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="bg-red-50 text-red-700 p-3 rounded-lg text-sm">
          {error}
        </div>
      )}
      {message && (
        <div className="bg-green-50 text-green-800 p-3 rounded-lg text-sm">
          {message}
        </div>
      )}

      <form onSubmit={handleCreate} className="flex flex-wrap items-end gap-4 p-4 bg-white rounded-lg border border-grey/20">
        <div>
          <label className="block text-sm font-medium text-earthy mb-1">Name</label>
          <input
            type="text"
            name="name"
            required
            className="w-48 border border-grey/20 rounded-lg px-3 py-2"
            placeholder="e.g. Luxury Living"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earthy mb-1">Slug (optional)</label>
          <input
            type="text"
            name="slug"
            className="w-48 border border-grey/20 rounded-lg px-3 py-2"
            placeholder="luxury-living"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-earthy mb-1">Description (optional)</label>
          <input
            type="text"
            name="description"
            className="w-64 border border-grey/20 rounded-lg px-3 py-2"
            placeholder="Short description"
          />
        </div>
        <button
          type="submit"
          className="bg-primary text-white font-medium px-4 py-2 rounded-lg hover:bg-primary/90"
        >
          Add category
        </button>
      </form>

      <ul className="divide-y divide-grey/20 bg-white rounded-lg border border-grey/20 overflow-hidden">
        {categories.length === 0 ? (
          <li className="p-6 text-grey text-sm">No categories yet. Add one above.</li>
        ) : (
          categories.map((cat) => (
            <li key={cat.id} className="p-4 flex items-center justify-between gap-4">
              {editingId === cat.id ? (
                <form
                  onSubmit={(e) => handleUpdate(e, cat.id)}
                  className="flex flex-wrap items-center gap-3 flex-1"
                >
                  <input
                    type="text"
                    name="name"
                    defaultValue={cat.name}
                    className="border border-grey/20 rounded-lg px-3 py-2 w-40"
                  />
                  <input
                    type="text"
                    name="slug"
                    defaultValue={cat.slug}
                    className="border border-grey/20 rounded-lg px-3 py-2 w-40"
                  />
                  <input
                    type="text"
                    name="description"
                    defaultValue={cat.description ?? ""}
                    className="border border-grey/20 rounded-lg px-3 py-2 w-48"
                    placeholder="Description"
                  />
                  <button type="submit" className="text-sm text-primary font-medium">
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingId(null)}
                    className="text-sm text-grey"
                  >
                    Cancel
                  </button>
                </form>
              ) : (
                <>
                  <div>
                    <span className="font-medium text-earthy">{cat.name}</span>
                    <span className="text-grey text-sm ml-2">/{cat.slug}</span>
                    {cat.description && (
                      <span className="text-grey text-sm block mt-0.5">{cat.description}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setEditingId(cat.id)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-slate-500 hover:text-primary hover:bg-primary/10 transition-colors"
                      title="Edit"
                      aria-label="Edit"
                    >
                      <IconEdit />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(cat.id)}
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg text-red-600 hover:text-red-700 hover:bg-red-50 transition-colors"
                      title="Delete"
                      aria-label="Delete"
                    >
                      <IconDelete />
                    </button>
                  </div>
                </>
              )}
            </li>
          ))
        )}
      </ul>
    </div>
  );
}
