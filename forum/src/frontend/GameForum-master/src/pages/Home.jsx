import { useContext, useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { ForumLayout } from "../components/layout/ForumLayout";
import { CategoryCard } from "../components/home/CategoryCard";
import { apiRequest } from "../api";
import { AnimatePresence } from "framer-motion";
import { AuthContext } from "../auth/AuthContext";
import { Link } from "react-router-dom";

import NavalBackground from "../assets/Backgrounds/NavalBackground.jpg";
import BattleBackground from "../assets/Backgrounds/BattleBackground.jpg";
import DefenseBackground from "../assets/Backgrounds/DefenseBackground.jpg";
import VillageBackground from "../assets/Backgrounds/VillageBackground.jpg";
import MenuBackground from "../assets/Backgrounds/MenuBackground.jpg";

import {
  Plus,
  Scroll,
  Swords,
  Flag,
  Handshake,
  Wrench,
  X,
  Check,
  Image as ImageIcon,
  Edit3,
  Trash2,
  Crown,
  Shield,
  UserPlus,
} from "lucide-react";

const ICON_OPTIONS = [
  { name: "Scroll", icon: Scroll },
  { name: "Swords", icon: Swords },
  { name: "Flag", icon: Flag },
  { name: "Handshake", icon: Handshake },
  { name: "Wrench", icon: Wrench },
  { name: "Crown", icon: Crown },
  { name: "Shield", icon: Shield },
];

const DEFAULT_BACKGROUNDS = [
  NavalBackground,
  BattleBackground,
  DefenseBackground,
  VillageBackground,
  MenuBackground,
];

const emptyForm = {
  title: "",
  description: "",
  iconName: "Scroll",
  backgroundImage: DEFAULT_BACKGROUNDS[0],
};

export function Home() {
  const auth = useContext(AuthContext);

  const role = useMemo(() => String(auth?.user?.role || auth?.user?.userRole || "").toUpperCase(), [auth?.user]);
  const isAdmin = role === "ADMIN" || role === "ROLE_ADMIN";
  
  const [categories, setCategories] = useState([]);
  const [stats, setStats] = useState({ members: 0, posts: 0 });
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  const createCategory = async (payload) => {
    return await apiRequest("/api/category", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      token: auth?.token,
      body: JSON.stringify(payload),
    });
  };

  const updateCategory = async (id, payload) => {
    return await apiRequest(`/api/category/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      token: auth?.token,
      body: JSON.stringify(payload),
    });
  };

  const deleteCategory = async (id) => {
    return await apiRequest(`/api/category/${id}`, { method: "DELETE", token: auth?.token });
  };

  useEffect(() => {
    let canceled = false;
    (async () => {
      try {
        const data = await apiRequest("/api/category");
        if (canceled) return;

        const mapped = (data || []).map((c) => ({
          id: String(c.categoryId),
          title: c.categoryName,
          description: c.categoryDescription || "",
          iconName: c.categoryIconName || "Scroll",
          topicCount: c.topicCount ?? 0,
          postCount: c.postCount ?? 0,
          backgroundImage: c.categoryPhoto || DEFAULT_BACKGROUNDS[0],
        }));

        setCategories(mapped);
      } catch {
        if (!canceled) setCategories([]);
      }
    })();

    return () => {
      canceled = true;
    };
  }, []);

  useEffect(() => {
    let canceled = false;

    (async () => {
      try {
        const data = await apiRequest("/api/stats");
        if (canceled) return;

        setStats({
          members: Number(data?.members ?? 0),
          posts: Number(data?.posts ?? 0),
        });
      } catch {
        if (!canceled) setStats({ members: 0, posts: 0 });
      }
    })();

    return () => {
      canceled = true;
    };
  }, []);

  const openCreate = () => {
    if (!isAdmin) return;
    setEditingId(null);
    setForm(emptyForm);
    setErrors({});
    setModalOpen(true);
  };

  const openEdit = (cat) => {
    if (!isAdmin) return;
    setEditingId(String(cat.id));
    setForm({
      title: cat.title,
      description: cat.description,
      iconName: cat.iconName || "Scroll",
      backgroundImage: cat.backgroundImage || DEFAULT_BACKGROUNDS[0],
    });
    setErrors({});
    setModalOpen(true);
  };

  const handleSave = async () => {
    if (!isAdmin) return;
    const newErrors = {};
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (Object.keys(newErrors).length) return setErrors(newErrors);

    const payload = {
      categoryName: form.title,
      categoryDescription: form.description,
      categoryIconName: form.iconName,
      categoryPhoto: form.backgroundImage,
    };

    try {
      if (editingId) {
        const updated = await updateCategory(editingId, payload);

        setCategories((prev) =>
          prev.map((c) =>
            c.id === String(editingId)
              ? {
                  ...c,
                  id: String(updated.categoryId ?? editingId),
                  title: updated.categoryName ?? form.title,
                  description: updated.categoryDescription ?? form.description,
                  iconName: updated.categoryIconName ?? form.iconName,
                  backgroundImage:
                    updated.categoryPhoto ?? form.backgroundImage ?? DEFAULT_BACKGROUNDS[0],
                  topicCount: updated.topicCount ?? c.topicCount ?? 0,
                  postCount: updated.postCount ?? c.postCount ?? 0,
                }
              : c
          )
        );
      } else {
        const created = await createCategory(payload);

        const mapped = {
          id: String(created.categoryId),
          title: created.categoryName,
          description: created.categoryDescription || "",
          iconName: created.categoryIconName || "Scroll",
          topicCount: created.topicCount ?? 0,
          postCount: created.postCount ?? 0,
          backgroundImage: created.categoryPhoto || DEFAULT_BACKGROUNDS[0],
        };

        setCategories((prev) => [mapped, ...prev]);
      }

      setModalOpen(false);
    } catch {
      setErrors({ title: "Server error. Try again." });
    }
  };

  const handleDelete = async (id) => {
    if (!isAdmin) return;
    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== String(id)));
      setDeleteConfirm(null);
    } catch {
      // optional
    }
  };


  const getIconComponent = (iconName, className) => {
    const opt = ICON_OPTIONS.find((o) => o.name === iconName);
    const Icon = opt?.icon || Scroll;
    return <Icon className={className} />;
  };

  return (
    <ForumLayout>
      <div className="space-y-8">

        <div className="text-center mb-12 relative">


          <div className="absolute right-0 top-0 flex items-center gap-2">

            {isAdmin ? (
              <button
                onClick={openCreate}
                className="w-10 h-10 rounded-sm border border-gold-600 bg-wood-900/80 text-gold-400 hover:bg-wood-800 transition flex items-center justify-center text-2xl leading-none"
                aria-label="Add category"
                title="Add category"
              >
                +
              </button>
            ) : null}
          </div>

          <div className="absolute left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 w-3/4 h-32 bg-black/40 blur-3xl -z-10 rounded-full" />

          <h1 className="text-4xl md:text-5xl font-display font-bold text-gold-400 mb-4 text-shadow-black">
            Imperial Council
          </h1>

          <p className="text-xl text-parchment-200 font-serif max-w-2xl mx-auto text-shadow-black">
            Gather, commanders. Discuss strategies, share tales of conquest, and shape the history of the New World.
          </p>

          <div className="flex items-center justify-center gap-4 mt-8 opacity-80">
            <div className="h-px w-24 bg-linear-to-r from-transparent to-gold-500" />
            <div className="w-2 h-2 rotate-45 bg-gold-500" />
            <div className="h-px w-24 bg-linear-to-l from-transparent to-gold-500" />
          </div>
        </div>

        {/* Categories */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  {categories.map((category, index) => (
    <div key={category.id} className="relative group">
      <div className="relative h-full">
        <Link
          to={`/category/${category.id}`}
          className="absolute inset-0 z-10 rounded-sm"
          aria-label={`Open category ${category.title}`}
        />

        <div className="relative z-0 h-full">
          <CategoryCard {...category} index={index} />
        </div>

        {isAdmin ? (
          <div className="absolute top-2 right-2 z-30 flex gap-2 pointer-events-auto">
            <button
              type="button"
              onMouseDown={(e) => {
                e.preventDefault()
                e.stopPropagation()
              }}
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                openEdit(category)
              }}
              className="p-2 bg-wood-900/80 border border-wood-600 rounded-sm text-parchment-300 hover:text-gold-400 hover:border-gold-500 transition-colors"
              title="Edit"
            >
              <Edit3 size={16} />
            </button>

            {deleteConfirm === category.id ? (
              <>
                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    handleDelete(category.id)
                  }}
                  className="p-2 bg-red-900/40 border border-red-600 rounded-sm text-red-300 hover:bg-red-900/60 transition-colors"
                  title="Confirm delete"
                >
                  <Check size={16} />
                </button>

                <button
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    setDeleteConfirm(null)
                  }}
                  className="p-2 bg-wood-900/80 border border-wood-600 rounded-sm text-parchment-300 hover:text-parchment-100 transition-colors"
                  title="Cancel"
                >
                  <X size={16} />
                </button>
              </>
            ) : (
              <button
                type="button"
                onMouseDown={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation()
                  setDeleteConfirm(category.id)
                }}
                className="p-2 bg-wood-900/80 border border-wood-600 rounded-sm text-parchment-300 hover:text-red-400 hover:border-red-600 transition-colors"
                title="Delete"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  ))}
</div>


        {/* Stats */}
        <div className="mt-12 bg-wood-900/80 border border-wood-600 p-6 rounded-sm backdrop-blur-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left">
            <div>
              <h3 className="text-gold-400 font-display font-bold text-lg mb-1">Forum Statistics</h3>
              <p className="text-parchment-400 text-sm">Our growing empire in numbers</p>
            </div>

            <div className="flex gap-8 md:gap-12">
              <div>
                <span className="block text-2xl font-bold text-parchment-200 font-display">
                  {Number(stats.members || 0).toLocaleString()}
                </span>
                <span className="text-xs text-wood-500 uppercase tracking-widest">Members</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-parchment-200 font-display">
                  {Number(stats.posts || 0).toLocaleString()}
                </span>
                <span className="text-xs text-wood-500 uppercase tracking-widest">Posts</span>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL */}
        {createPortal(
          <AnimatePresence>
            {modalOpen && isAdmin && (
              <>
                {/* Backdrop */}
                <div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setModalOpen(false)}
                  className="fixed inset-0 bg-black/70 z-99998"
                />

                {/* Modal */}
                <div
                  initial={{ opacity: 0, scale: 0.9, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 40 }}
                  transition={{ type: "spring", damping: 25, stiffness: 300 }}
                  className="fixed inset-0 z-99999 flex items-center justify-center p-4"
                >
                  <div
                    className="bg-wood-900 border-2 border-gold-700 rounded-sm shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {/* Header */}
                    <div className="bg-wood-800 border-b border-gold-700 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gold-600 rounded-full flex items-center justify-center">
                          {editingId ? (
                            <Edit3 size={16} className="text-wood-900" />
                          ) : (
                            <Plus size={18} className="text-wood-900" strokeWidth={3} />
                          )}
                        </div>
                        <h2 className="text-2xl font-display font-bold text-parchment-100">
                          {editingId ? "Edit Category" : "Create New Category"}
                        </h2>
                      </div>
                      <button
                        onClick={() => setModalOpen(false)}
                        className="p-2 text-wood-400 hover:text-parchment-200 transition-colors"
                        aria-label="Close"
                      >
                        <X size={20} />
                      </button>
                    </div>

                    {/* Body */}
                    <div className="p-6 space-y-6">
                      {/* Title */}
                      <div>
                        <label className="block text-sm font-display font-bold text-parchment-300 uppercase tracking-wider mb-2">
                          Category Title
                        </label>
                        <input
                          type="text"
                          value={form.title}
                          onChange={(e) => setForm({ ...form, title: e.target.value })}
                          placeholder="e.g. Naval Warfare"
                          className={`w-full bg-parchment-200 border-2 text-wood-900 px-4 py-3 rounded-sm font-display font-bold text-lg placeholder:text-wood-400 placeholder:font-serif placeholder:italic placeholder:font-normal focus:outline-none transition-colors shadow-inner ${
                            errors.title ? "border-red-600" : "border-wood-600 focus:border-gold-500"
                          }`}
                        />
                        {errors.title && (
                          <p className="mt-1 text-sm text-red-400 font-serif">{errors.title}</p>
                        )}
                      </div>

                      {/* Description */}
                      <div>
                        <label className="block text-sm font-display font-bold text-parchment-300 uppercase tracking-wider mb-2">
                          Description
                        </label>
                        <textarea
                          value={form.description}
                          onChange={(e) => setForm({ ...form, description: e.target.value })}
                          placeholder="Describe what this category is about..."
                          rows={3}
                          className={`w-full bg-parchment-200 border-2 text-wood-900 px-4 py-3 rounded-sm font-serif text-base placeholder:text-wood-400 placeholder:italic focus:outline-none transition-colors shadow-inner resize-none ${
                            errors.description
                              ? "border-red-600"
                              : "border-wood-600 focus:border-gold-500"
                          }`}
                        />
                        {errors.description && (
                          <p className="mt-1 text-sm text-red-400 font-serif">{errors.description}</p>
                        )}
                      </div>

                      {/* Icon Picker */}
                      <div>
                        <label className="block text-sm font-display font-bold text-parchment-300 uppercase tracking-wider mb-3">
                          Category Icon
                        </label>
                        <div className="flex flex-wrap gap-3">
                          {ICON_OPTIONS.map((opt) => {
                            const Icon = opt.icon;
                            const selected = form.iconName === opt.name;
                            return (
                              <button
                                key={opt.name}
                                type="button"
                                onClick={() => setForm({ ...form, iconName: opt.name })}
                                className={`w-14 h-14 rounded-sm border-2 flex items-center justify-center transition-all ${
                                  selected
                                    ? "bg-gold-600/20 border-gold-500 shadow-glow-gold"
                                    : "bg-wood-800 border-wood-600 hover:border-gold-600"
                                }`}
                                title={opt.name}
                              >
                                <Icon
                                  className={`w-6 h-6 ${
                                    selected ? "text-gold-400" : "text-parchment-400"
                                  }`}
                                />
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Background Picker */}
                      <div>
                        <label className="block text-sm font-display font-bold text-parchment-300 uppercase tracking-wider mb-3">
                          <span className="flex items-center gap-2">
                            <ImageIcon size={14} />
                            Background Image
                          </span>
                        </label>

                        <div className="grid grid-cols-5 gap-2 mb-3">
                          {DEFAULT_BACKGROUNDS.map((bg) => {
                            const selected = form.backgroundImage === bg;
                            return (
                              <button
                                key={String(bg)}
                                type="button"
                                onClick={() => setForm({ ...form, backgroundImage: bg })}
                                className={`relative aspect-video rounded-sm overflow-hidden border-2 transition-all ${
                                  selected
                                    ? "border-gold-500 shadow-glow-gold ring-1 ring-gold-400"
                                    : "border-wood-600 hover:border-gold-600 opacity-70 hover:opacity-100"
                                }`}
                              >
                                <img src={bg} alt="" className="w-full h-full object-cover" />
                                {selected && (
                                  <div className="absolute inset-0 bg-gold-500/20 flex items-center justify-center">
                                    <Check className="w-5 h-5 text-gold-400 drop-shadow-lg" />
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      {/* Preview */}
                      <div>
                        <label className="block text-sm font-display font-bold text-parchment-300 uppercase tracking-wider mb-3">
                          Preview
                        </label>

                        <div className="relative h-32 rounded-sm border border-wood-600 overflow-hidden">
                          <img
                            src={form.backgroundImage}
                            alt=""
                            className="w-full h-full object-cover opacity-40"
                          />
                          <div className="absolute inset-0 bg-linear-to-t from-wood-900 via-wood-900/70 to-transparent" />
                          <div className="absolute bottom-0 left-0 p-4 flex items-end gap-3">
                            <div className="w-10 h-10 bg-wood-800/80 border border-gold-700 rounded-full flex items-center justify-center">
                              {getIconComponent(form.iconName, "w-5 h-5 text-gold-500")}
                            </div>
                            <div>
                              <h4 className="font-display font-bold text-parchment-200 text-lg text-shadow-black">
                                {form.title || "Category Title"}
                              </h4>
                              <p className="text-parchment-400 text-xs font-serif">
                                {form.description || "Category description..."}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="px-6 py-4 border-t border-wood-700 flex flex-col sm:flex-row gap-3 bg-wood-800/50">
                      <button
                        onClick={handleSave}
                        className="flex-1 flex items-center justify-center gap-2 bg-gold-600 text-wood-900 px-6 py-3 rounded-sm font-bold font-display shadow-glow-gold border border-gold-400 hover:bg-gold-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
                      >
                        <Check size={18} />
                        {editingId ? "Save Changes" : "Create Category"}
                      </button>

                      <button
                        onClick={() => setModalOpen(false)}
                        className="sm:w-auto flex items-center justify-center gap-2 bg-wood-800 text-parchment-300 px-6 py-3 rounded-sm font-bold font-display border border-wood-600 hover:border-parchment-400 hover:text-parchment-200 transition-colors"
                      >
                        <X size={18} />
                        Cancel
                      </button>
                    </div>
                  </div>
                </div>
              </>
            )}
          </AnimatePresence>,
          document.body
        )}
      </div>
    </ForumLayout>
  );
}
