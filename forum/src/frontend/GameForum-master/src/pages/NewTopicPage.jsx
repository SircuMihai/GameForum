import React, { useContext, useEffect, useMemo, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { apiRequest } from "../api";
import { ArrowLeft, Send, X } from "lucide-react";
import { AuthContext } from "../auth/AuthContext";
import { RichTextEditor } from "../components/newTopic/RichTextEditor";

export function NewTopicPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const preselectedCategory = searchParams.get("category");

  const { token, user, isAuthed } = useContext(AuthContext) || {};

  const [categories, setCategories] = useState([]);

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

  const defaultCategoryId = useMemo(() => {
    if (preselectedCategory) return preselectedCategory;
    return categories[0]?.id || "";
  }, [preselectedCategory, categories]);

  const [formData, setFormData] = useState({
    category: "",
    title: "",
    message: "",
    subjectPhoto: null,
  });

  const effectiveCategory = formData.category || defaultCategoryId;

  const [errors, setErrors] = useState({
    title: "",
    message: "",
    subjectPhoto: "",
  });

  const fileToDataUrl = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(String(reader.result || ""));
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsDataURL(file);
    });

  const plainText = (html) =>
    (html || "")
      .replace(/<[^>]*>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const msgText = plainText(formData.message);

    const newErrors = {
      title: formData.title.trim() === "" ? "A topic title is required" : "",
      message: msgText === "" ? "Message content is required" : "",
      subjectPhoto: "",
    };

    setErrors(newErrors);

    if (!newErrors.title && !newErrors.message) {
      if (!isAuthed || !user?.userId) {
        navigate("/login");
        return;
      }

      try {
        const now = new Date().toISOString();

        const createdSubject = await apiRequest("/api/subject", {
          token,
          method: "POST",
          body: JSON.stringify({
            subjectName: formData.title,
            subjectText: formData.message,
            subjectPhoto: formData.subjectPhoto,
            subjectLikes: "0",
            createdAt: now,
            categoryId: Number(effectiveCategory),
            userId: user.userId,
          }),
        });

        await apiRequest("/api/message", {
          token,
          method: "POST",
          body: JSON.stringify({
            messageText: formData.message,
            messagesPhoto: null,
            messageLikes: "0",
            createdAt: now,
            subjectId: createdSubject.subjectId,
            userId: user.userId,
          }),
        });

        navigate(`/category/${effectiveCategory}`);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const selectedCategory = categories.find((c) => c.id === effectiveCategory);

  return (

<div className="max-w-4xl mx-auto">

        <div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 text-wood-400 hover:text-gold-400 mb-4 transition-colors text-sm font-bold uppercase tracking-wider"
          >
            <ArrowLeft size={14} /> Back
          </button>

          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gold-400 mb-3 text-shadow-black">
              Create New Topic
            </h1>
            <p className="text-parchment-200 font-serif text-lg">
              Share your strategies and insights with fellow commanders
            </p>
          </div>
        </div>

        <div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-wood-900 border-2 border-gold-700 rounded-sm shadow-2xl overflow-hidden"
        >
          <div className="h-2 bg-linear-to-r from-wood-900 via-gold-600 to-wood-900" />

          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            <div>
              <label className="block text-lg font-display font-bold text-parchment-200 mb-3">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                className="w-full bg-parchment-300 border-2 border-wood-600 text-wood-900 px-4 py-3 rounded-sm font-display font-bold text-lg focus:border-gold-500 focus:outline-none transition-colors cursor-pointer shadow-inner"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.title}
                  </option>
                ))}
              </select>

              {selectedCategory && (
                <p className="mt-2 text-sm text-parchment-400 font-serif italic">
                  {selectedCategory.description}
                </p>
              )}
            </div>

            <div>
              <label className="block text-lg font-display font-bold text-parchment-200 mb-3">
                Topic Photo
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  e.target.value = "";
                  if (!file) return;
                  const dataUrl = await fileToDataUrl(file);
                  setFormData((p) => ({ ...p, subjectPhoto: dataUrl }));
                }}
                className="w-full bg-wood-800 text-parchment-200 border border-wood-600 rounded-sm px-3 py-2"
              />
            </div>

            <div>
              <label className="block text-lg font-display font-bold text-parchment-200 mb-3">
                Topic Title
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Enter a descriptive title for your topic..."
                className={`
                  w-full bg-parchment-200 border-2 text-wood-900 px-4 py-3 rounded-sm 
                  font-display font-bold text-lg placeholder:text-wood-400 placeholder:font-serif placeholder:italic
                  focus:outline-none transition-colors shadow-inner
                  ${
                    errors.title
                      ? "border-red-600 focus:border-red-500"
                      : "border-wood-600 focus:border-gold-500"
                  }
                `}
              />
              {errors.title && (
                <p className="mt-2 text-sm text-red-400 font-serif flex items-center gap-2">
                  <X size={14} />
                  {errors.title}
                </p>
              )}
            </div>

            <div>
              <label className="block text-lg font-display font-bold text-parchment-200 mb-3">
                Message
              </label>

              <RichTextEditor
                value={formData.message}
                onChange={(html) =>
                  setFormData((p) => ({ ...p, message: html }))
                }
                error={!!errors.message}
                uploadImage={async () => {
                  return null;
                }}
                uploadFile={async () => {
                  return null;
                }}
              />

              {errors.message && (
                <p className="mt-2 text-sm text-red-400 font-serif flex items-center gap-2">
                  <X size={14} />
                  {errors.message}
                </p>
              )}

              <p className="mt-2 text-xs text-parchment-400 font-serif">
                Minimum 10 characters. Be respectful and follow the forum
                guidelines.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-wood-700">
              <button
                type="submit"
                className="flex-1 flex items-center justify-center gap-3 bg-gold-600 text-wood-900 px-8 py-4 rounded-sm font-bold font-display text-lg shadow-glow-gold border-2 border-gold-400 hover:bg-gold-500 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Send size={20} />
                Post Topic
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-3 bg-wood-800 text-parchment-300 px-8 py-4 rounded-sm font-bold font-display text-lg border-2 border-wood-600 hover:border-gold-500 hover:text-gold-400 transition-all"
              >
                <X size={20} />
                Cancel
              </button>
            </div>
          </form>

          <div className="h-2 bg-linear-to-r from-wood-900 via-gold-600 to-wood-900" />
        </div>

        <div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8 bg-wood-900/80 border border-wood-600 rounded-sm p-6"
        >
          <h3 className="text-lg font-display font-bold text-gold-500 mb-3">
            Forum Guidelines
          </h3>
          <ul className="space-y-2 text-parchment-300 font-serif text-sm">
            <li className="flex items-start gap-2">
              <span className="text-gold-600 mt-1">•</span>
              <span>Be respectful to all commanders and moderators</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-600 mt-1">•</span>
              <span>Stay on topic and post in the appropriate category</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-600 mt-1">•</span>
              <span>No spam, advertising, or duplicate posts</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-gold-600 mt-1">•</span>
              <span>Use descriptive titles to help others find your topic</span>
            </li>
          </ul>
        </div>
      </div>
  );
}
