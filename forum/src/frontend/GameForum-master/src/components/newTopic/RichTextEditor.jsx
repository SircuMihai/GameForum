import React, { useEffect, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import TextAlign from "@tiptap/extension-text-align";
import Link from "@tiptap/extension-link";
import Image from "@tiptap/extension-image";

import {
  Bold, Italic, Underline as UnderlineIcon,
  List, ListOrdered, Quote, Code,
  AlignLeft, AlignCenter, AlignRight,
  Link as LinkIcon, Unlink,
  Image as ImageIcon, Paperclip
} from "lucide-react";

export function RichTextEditor({
  value,
  onChange,
  error = false,
  // tu implementezi upload-ul și returnezi URL-ul
  uploadImage, // async (file) => "https://....jpg"
  uploadFile,  // async (file) => "https://....pdf"
}) {
  const imgInputRef = useRef(null);
  const fileInputRef = useRef(null);

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Link.configure({ openOnClick: false, autolink: true, linkOnPaste: true }),
      Image.configure({ inline: false, allowBase64: true }),
    ],
    content: value || "",
    onUpdate: ({ editor }) => onChange?.(editor.getHTML()),
    editorProps: {
      attributes: {
        class:
          `ProseMirror min-h-[300px] w-full bg-parchment-200 border-2 text-wood-900 px-4 py-3 rounded-sm ` +
          `font-serif text-lg leading-relaxed focus:outline-none shadow-inner resize-none ` +
          (error ? "border-red-600 focus:border-red-500" : "border-wood-600 focus:border-gold-500"),
        style:
          'background-image: url("https://www.transparenttextures.com/patterns/old-map.png"); background-blend-mode: multiply;',
      },
    },
  });

  // sync dacă resetezi din afară
  useEffect(() => {
    if (!editor) return;
    const current = editor.getHTML();
    if ((value || "") !== current) editor.commands.setContent(value || "", false);
  }, [value, editor]);

  const btn =
    "px-3 py-2 bg-wood-800 text-parchment-200 border border-wood-600 hover:border-gold-500 hover:text-gold-400 transition rounded-sm";
  const btnActive =
    "px-3 py-2 bg-gold-600 text-wood-900 border border-gold-400 transition rounded-sm";

  const setLink = () => {
    if (!editor) return;
    const prev = editor.getAttributes("link").href || "";
    const url = window.prompt("Link URL:", prev);
    if (url === null) return;
    if (url.trim() === "") editor.chain().focus().extendMarkRange("link").unsetLink().run();
    else editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  const handlePickImage = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;

    // dacă nu ai backend încă, poți lăsa base64 (merge, dar greu la DB)
    if (!uploadImage) {
      const reader = new FileReader();
      reader.onload = () => editor.chain().focus().setImage({ src: reader.result }).run();
      reader.readAsDataURL(file);
      return;
    }

    const url = await uploadImage(file);
    if (url) editor.chain().focus().setImage({ src: url }).run();
  };

  const handlePickFile = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !editor) return;

    if (!uploadFile) {
      // fallback: doar nume (fără upload)
      editor.chain().focus().insertContent(`<p><a href="#">${file.name}</a></p>`).run();
      return;
    }

    const url = await uploadFile(file);
    if (url) {
      editor.chain().focus().insertContent(
        `<p><a href="${url}" target="_blank" rel="noopener noreferrer">${file.name}</a></p>`
      ).run();
    }
  };

  if (!editor) return null;

  return (
    <div className="space-y-3">
      {/* toolbar */}
      <div className="flex flex-wrap gap-2">
        <button type="button" className={editor.isActive("bold") ? btnActive : btn} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={18} /></button>
        <button type="button" className={editor.isActive("italic") ? btnActive : btn} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={18} /></button>
        <button type="button" className={editor.isActive("underline") ? btnActive : btn} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={18} /></button>

        <button type="button" className={editor.isActive("bulletList") ? btnActive : btn} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={18} /></button>
        <button type="button" className={editor.isActive("orderedList") ? btnActive : btn} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={18} /></button>
        <button type="button" className={editor.isActive("blockquote") ? btnActive : btn} onClick={() => editor.chain().focus().toggleBlockquote().run()}><Quote size={18} /></button>
        <button type="button" className={editor.isActive("codeBlock") ? btnActive : btn} onClick={() => editor.chain().focus().toggleCodeBlock().run()}><Code size={18} /></button>

        <div className="w-px bg-wood-600 mx-1" />

        <button type="button" className={editor.isActive({ textAlign: "left" }) ? btnActive : btn} onClick={() => editor.chain().focus().setTextAlign("left").run()}><AlignLeft size={18} /></button>
        <button type="button" className={editor.isActive({ textAlign: "center" }) ? btnActive : btn} onClick={() => editor.chain().focus().setTextAlign("center").run()}><AlignCenter size={18} /></button>
        <button type="button" className={editor.isActive({ textAlign: "right" }) ? btnActive : btn} onClick={() => editor.chain().focus().setTextAlign("right").run()}><AlignRight size={18} /></button>

        <div className="w-px bg-wood-600 mx-1" />

        <button type="button" className={editor.isActive("link") ? btnActive : btn} onClick={setLink}><LinkIcon size={18} /></button>
        <button type="button" className={btn} onClick={() => editor.chain().focus().unsetLink().run()} disabled={!editor.isActive("link")}><Unlink size={18} /></button>

        <div className="w-px bg-wood-600 mx-1" />

        <button type="button" className={btn} onClick={() => imgInputRef.current?.click()} title="Add image">
          <ImageIcon size={18} />
        </button>
        <button type="button" className={btn} onClick={() => fileInputRef.current?.click()} title="Attach file">
          <Paperclip size={18} />
        </button>

        <input ref={imgInputRef} type="file" accept="image/*" className="hidden" onChange={handlePickImage} />
        <input ref={fileInputRef} type="file" className="hidden" onChange={handlePickFile} />
      </div>

      {/* editor + colțuri (fără margin hacks) */}
      <div className="relative">
        <EditorContent editor={editor} />

        <div className="pointer-events-none absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 border-wood-500" />
        <div className="pointer-events-none absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 border-wood-500" />
        <div className="pointer-events-none absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 border-wood-500" />
        <div className="pointer-events-none absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 border-wood-500" />
      </div>
    </div>
  );
}
