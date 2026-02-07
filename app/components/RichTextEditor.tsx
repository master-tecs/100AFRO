"use client";

import React, { useCallback, useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  Quote,
  Heading1,
  Heading2,
  Heading3,
  Link as LinkIcon,
  Image as ImageIcon,
  Youtube,
  Undo,
  Redo,
} from "lucide-react";
import { extractYouTubeVideoId, generateYouTubeEmbed } from "@/lib/youtube-utils";

interface RichTextEditorProps {
  content: string;
  onChange: (html: string) => void;
  placeholder?: string;
  editable?: boolean;
}

// Custom YouTube extension
const YouTubeExtension = {
  name: "youtube",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      videoId: {
        default: null,
      },
      src: {
        default: null,
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "div[class='youtube-embed-wrapper']",
        getAttrs: (node: any) => {
          const iframe = node.querySelector("iframe");
          if (iframe) {
            const src = iframe.getAttribute("src");
            const videoIdMatch = src?.match(/embed\/([a-zA-Z0-9_-]{11})/);
            if (videoIdMatch) {
              return {
                videoId: videoIdMatch[1],
                src: src,
              };
            }
          }
          return null;
        },
      },
    ];
  },

  renderHTML({ HTMLAttributes }: any) {
    return [
      "div",
      { class: "youtube-embed-wrapper" },
      [
        "div",
        {
          class: "youtube-embed-container",
          style:
            "position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%;",
        },
        [
          "iframe",
          {
            src: HTMLAttributes.src || `https://www.youtube.com/embed/${HTMLAttributes.videoId}`,
            width: "560",
            height: "315",
            frameborder: "0",
            allow:
              "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture",
            allowfullscreen: "true",
            style:
              "position: absolute; top: 0; left: 0; width: 100%; height: 100%;",
            loading: "lazy",
          },
        ],
      ],
    ];
  },
};

export default function RichTextEditor({
  content,
  onChange,
  placeholder = "Start writing your article...",
  editable = true,
}: RichTextEditorProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");

  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Image.configure({
        inline: true,
        allowBase64: false,
        HTMLAttributes: {
          class: "max-w-full h-auto rounded-lg",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-afro-primary hover:underline",
        },
      }),
      Placeholder.configure({
        placeholder,
      }),
      YouTubeExtension as any,
    ],
    content,
    editable,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class:
          "prose prose-invert max-w-none focus:outline-none min-h-[400px] px-4 py-6",
      },
    },
  });

  const handleImageUpload = useCallback(
    async (file: File) => {
      if (!editor) return;

      setUploadingImage(true);
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("folder", "100afro/blog");

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error("Upload failed");
        }

        const data = await response.json();
        editor.chain().focus().setImage({ src: data.url }).run();
        setShowImageModal(false);
        setImageUrl("");
      } catch (error) {
        console.error("Error uploading image:", error);
        alert("Failed to upload image. Please try again.");
      } finally {
        setUploadingImage(false);
      }
    },
    [editor]
  );

  const handleImageUrl = useCallback(() => {
    if (!editor || !imageUrl.trim()) return;

    editor.chain().focus().setImage({ src: imageUrl.trim() }).run();
    setShowImageModal(false);
    setImageUrl("");
  }, [editor, imageUrl]);

  const handleYoutubeEmbed = useCallback(() => {
    if (!editor || !youtubeUrl.trim()) return;

    const { videoId, isValid } = extractYouTubeVideoId(youtubeUrl.trim());
    if (!isValid) {
      alert("Invalid YouTube URL. Please enter a valid YouTube video URL.");
      return;
    }

    const embedHtml = generateYouTubeEmbed(videoId);
    editor.chain().focus().insertContent(embedHtml).run();
    setShowYoutubeModal(false);
    setYoutubeUrl("");
  }, [editor, youtubeUrl]);

  if (!editor) {
    return null;
  }

  return (
    <div className="bg-gray-950 border border-gray-800 rounded-xl overflow-hidden">
      {/* Toolbar */}
      {editable && (
        <div className="border-b border-gray-800 p-3 flex flex-wrap items-center gap-2 bg-gray-900">
          {/* Text Formatting */}
          <div className="flex items-center gap-1 border-r border-gray-800 pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              disabled={!editor.can().chain().focus().toggleBold().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("bold")
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              type="button"
              title="Bold"
            >
              <Bold size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              disabled={!editor.can().chain().focus().toggleItalic().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("italic")
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              type="button"
              title="Italic"
            >
              <Italic size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleStrike().run()}
              disabled={!editor.can().chain().focus().toggleStrike().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("strike")
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              type="button"
              title="Strikethrough"
            >
              <Strikethrough size={18} />
            </button>
          </div>

          {/* Headings */}
          <div className="flex items-center gap-1 border-r border-gray-800 pr-2">
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 1 }).run()
              }
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("heading", { level: 1 })
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              type="button"
              title="Heading 1"
            >
              <Heading1 size={18} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 2 }).run()
              }
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("heading", { level: 2 })
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              type="button"
              title="Heading 2"
            >
              <Heading2 size={18} />
            </button>
            <button
              onClick={() =>
                editor.chain().focus().toggleHeading({ level: 3 }).run()
              }
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("heading", { level: 3 })
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              type="button"
              title="Heading 3"
            >
              <Heading3 size={18} />
            </button>
          </div>

          {/* Lists */}
          <div className="flex items-center gap-1 border-r border-gray-800 pr-2">
            <button
              onClick={() => editor.chain().focus().toggleBulletList().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("bulletList")
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              type="button"
              title="Bullet List"
            >
              <List size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleOrderedList().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("orderedList")
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              type="button"
              title="Numbered List"
            >
              <ListOrdered size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().toggleBlockquote().run()}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("blockquote")
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              type="button"
              title="Quote"
            >
              <Quote size={18} />
            </button>
          </div>

          {/* Media */}
          <div className="flex items-center gap-1 border-r border-gray-800 pr-2">
            <button
              onClick={() => setShowImageModal(true)}
              className="p-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800"
              type="button"
              title="Insert Image"
            >
              <ImageIcon size={18} />
            </button>
            <button
              onClick={() => setShowYoutubeModal(true)}
              className="p-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800"
              type="button"
              title="Insert YouTube Video"
            >
              <Youtube size={18} />
            </button>
            <button
              onClick={() => {
                const url = window.prompt("Enter URL:");
                if (url) {
                  editor.chain().focus().setLink({ href: url }).run();
                }
              }}
              className={`p-2 rounded-lg transition-colors ${
                editor.isActive("link")
                  ? "bg-afro-primary text-black"
                  : "text-gray-400 hover:text-white hover:bg-gray-800"
              }`}
              type="button"
              title="Insert Link"
            >
              <LinkIcon size={18} />
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex items-center gap-1">
            <button
              onClick={() => editor.chain().focus().undo().run()}
              disabled={!editor.can().chain().focus().undo().run()}
              className="p-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              type="button"
              title="Undo"
            >
              <Undo size={18} />
            </button>
            <button
              onClick={() => editor.chain().focus().redo().run()}
              disabled={!editor.can().chain().focus().redo().run()}
              className="p-2 rounded-lg transition-colors text-gray-400 hover:text-white hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed"
              type="button"
              title="Redo"
            >
              <Redo size={18} />
            </button>
          </div>
        </div>
      )}

      {/* Editor Content */}
      <div className="min-h-[400px] max-h-[600px] overflow-y-auto">
        <EditorContent editor={editor} />
      </div>

      {/* Image Insert Modal */}
      {showImageModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-white font-bold text-lg mb-4">Insert Image</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Upload Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      handleImageUpload(file);
                    }
                  }}
                  disabled={uploadingImage}
                  className="w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-afro-primary file:text-black hover:file:bg-white"
                />
              </div>
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-gray-900 text-gray-500">OR</span>
                </div>
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Image URL
                </label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-afro-primary"
                />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowImageModal(false);
                  setImageUrl("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 font-bold text-sm"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleImageUrl}
                disabled={!imageUrl.trim()}
                className="px-4 py-2 rounded-lg bg-afro-primary text-black hover:bg-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Embed Modal */}
      {showYoutubeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-white font-bold text-lg mb-4">
              Insert YouTube Video
            </h3>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                YouTube URL
              </label>
              <input
                type="url"
                value={youtubeUrl}
                onChange={(e) => setYoutubeUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full bg-gray-950 border border-gray-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-afro-primary"
              />
              <p className="text-xs text-gray-500 mt-2">
                Supports youtube.com/watch?v=, youtu.be/, and embed URLs
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setShowYoutubeModal(false);
                  setYoutubeUrl("");
                }}
                className="px-4 py-2 rounded-lg bg-gray-800 text-gray-300 hover:bg-gray-700 font-bold text-sm"
                type="button"
              >
                Cancel
              </button>
              <button
                onClick={handleYoutubeEmbed}
                disabled={!youtubeUrl.trim()}
                className="px-4 py-2 rounded-lg bg-afro-primary text-black hover:bg-white font-bold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
              >
                Insert
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
