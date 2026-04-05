'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import TiptapLink from '@tiptap/extension-link'
import Underline from '@tiptap/extension-underline'

export function TiptapRenderer({ content }: { content: Record<string, unknown> | null }) {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Image,
      TiptapLink.configure({ openOnClick: true }),
      Underline,
    ],
    content: content ?? undefined,
    editable: false,
    immediatelyRender: false,
  })

  if (!editor) return null

  return <EditorContent editor={editor} />
}
