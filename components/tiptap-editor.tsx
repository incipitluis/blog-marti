'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'
import Placeholder from '@tiptap/extension-placeholder'
import { useCallback } from 'react'

function ToolbarButton({ active, onClick, children, title }: {
  active?: boolean
  onClick: () => void
  children: React.ReactNode
  title: string
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`rounded px-2 py-1.5 text-sm transition-colors ${
        active
          ? 'bg-accent text-white'
          : 'text-foreground hover:bg-surface-alt'
      }`}
    >
      {children}
    </button>
  )
}

export function TiptapEditor({ content, onChange }: {
  content?: Record<string, unknown> | null
  onChange: (json: Record<string, unknown>) => void
}) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Image,
      TiptapLink.configure({
        openOnClick: false,
        HTMLAttributes: { rel: 'noopener noreferrer', target: '_blank' },
      }),
      Underline,
      Placeholder.configure({ placeholder: 'Empieza a escribir...' }),
    ],
    content: content ?? undefined,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      onChange(editor.getJSON() as Record<string, unknown>)
    },
  })

  const addImage = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL de la imagen:')
    if (url) {
      editor.chain().focus().setImage({ src: url }).run()
    }
  }, [editor])

  const addLink = useCallback(() => {
    if (!editor) return
    const url = window.prompt('URL del enlace:')
    if (url) {
      editor.chain().focus().setLink({ href: url }).run()
    }
  }, [editor])

  if (!editor) return null

  return (
    <div className="tiptap-editor rounded-md border border-border bg-surface overflow-hidden">
      <div className="flex flex-wrap gap-1 border-b border-border bg-surface-alt px-3 py-2">
        <ToolbarButton
          active={editor.isActive('bold')}
          onClick={() => editor.chain().focus().toggleBold().run()}
          title="Negrita"
        >
          <strong>B</strong>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('italic')}
          onClick={() => editor.chain().focus().toggleItalic().run()}
          title="Cursiva"
        >
          <em>I</em>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('underline')}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
          title="Subrayado"
        >
          <span className="underline">U</span>
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('strike')}
          onClick={() => editor.chain().focus().toggleStrike().run()}
          title="Tachado"
        >
          <span className="line-through">S</span>
        </ToolbarButton>

        <div className="mx-1 w-px bg-border" />

        <ToolbarButton
          active={editor.isActive('heading', { level: 1 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          title="Título 1"
        >
          H1
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 2 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          title="Título 2"
        >
          H2
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('heading', { level: 3 })}
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          title="Título 3"
        >
          H3
        </ToolbarButton>

        <div className="mx-1 w-px bg-border" />

        <ToolbarButton
          active={editor.isActive('bulletList')}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          title="Lista"
        >
          • Lista
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('orderedList')}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          title="Lista numerada"
        >
          1. Lista
        </ToolbarButton>
        <ToolbarButton
          active={editor.isActive('blockquote')}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          title="Cita"
        >
          &ldquo; Cita
        </ToolbarButton>

        <div className="mx-1 w-px bg-border" />

        <ToolbarButton
          active={editor.isActive('link')}
          onClick={addLink}
          title="Enlace"
        >
          Enlace
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Imagen">
          Imagen
        </ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Separador"
        >
          ―
        </ToolbarButton>
      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
