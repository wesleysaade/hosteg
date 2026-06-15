'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import CodeBlockLowlight from '@tiptap/extension-code-block-lowlight'
import { createLowlight, common } from 'lowlight'
import { useEffect } from 'react'
import {
  TextB, TextItalic, TextStrikethrough, Code, Terminal,
  Quotes, ListBullets, ListNumbers, LinkSimple, Image as ImageIcon,
  ArrowCounterClockwise, ArrowClockwise, Minus,
} from '@phosphor-icons/react'

const lowlight = createLowlight(common)

interface Props {
  content: string
  onChange: (html: string) => void
}

function ToolbarButton({
  onClick, active, title, children,
}: {
  onClick: () => void
  active?: boolean
  title?: string
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      title={title}
      className={`px-1.5 py-1 rounded-lg text-xs font-bold transition-colors min-w-[26px] flex items-center justify-center ${
        active
          ? 'bg-[#0EA5E9]/20 text-[#0EA5E9]'
          : 'text-zinc-400 hover:text-white hover:bg-zinc-700'
      }`}
    >
      {children}
    </button>
  )
}

export default function RichEditor({ content, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({ codeBlock: false }),
      Image,
      Link.configure({ openOnClick: false }),
      Placeholder.configure({ placeholder: 'Escreva o conteúdo do artigo...' }),
      CodeBlockLowlight.configure({ lowlight }),
    ],
    content,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: 'prose prose-invert prose-zinc max-w-none min-h-[400px] focus:outline-none p-6 text-zinc-200 prose-headings:text-white prose-a:text-[#0EA5E9] prose-code:text-[#0EA5E9] prose-code:bg-zinc-800 prose-code:rounded prose-pre:bg-zinc-900 prose-pre:border prose-pre:border-zinc-700',
      },
    },
  })

  useEffect(() => {
    if (editor && content !== editor.getHTML()) {
      editor.commands.setContent(content)
    }
  }, [content]) // eslint-disable-line

  function addLink() {
    const url = window.prompt('URL:')
    if (url && editor) editor.chain().focus().setLink({ href: url }).run()
  }

  function addImage() {
    const url = window.prompt('URL da imagem:')
    if (url && editor) editor.chain().focus().setImage({ src: url }).run()
  }

  if (!editor) return null

  return (
    <div className="rounded-2xl border border-zinc-700 bg-zinc-900 overflow-hidden">
      <div className="flex flex-wrap items-center gap-0.5 p-2 border-b border-zinc-700 bg-zinc-800/60">

        {/* Undo / Redo */}
        <ToolbarButton onClick={() => editor.chain().focus().undo().run()} title="Desfazer">
          <ArrowCounterClockwise size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().redo().run()} title="Refazer">
          <ArrowClockwise size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-zinc-700 mx-1" />

        {/* Headings — texto simples para evitar dependência de ícone */}
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          active={editor.isActive('heading', { level: 1 })}
          title="Título H1"
        >H1</ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          active={editor.isActive('heading', { level: 2 })}
          title="Título H2"
        >H2</ToolbarButton>
        <ToolbarButton
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          active={editor.isActive('heading', { level: 3 })}
          title="Título H3"
        >H3</ToolbarButton>

        <div className="w-px h-5 bg-zinc-700 mx-1" />

        {/* Inline */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBold().run()} active={editor.isActive('bold')} title="Negrito">
          <TextB size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleItalic().run()} active={editor.isActive('italic')} title="Itálico">
          <TextItalic size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleStrike().run()} active={editor.isActive('strike')} title="Tachado">
          <TextStrikethrough size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCode().run()} active={editor.isActive('code')} title="Código inline">
          <Code size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-zinc-700 mx-1" />

        {/* Blocks */}
        <ToolbarButton onClick={() => editor.chain().focus().toggleBulletList().run()} active={editor.isActive('bulletList')} title="Lista">
          <ListBullets size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleOrderedList().run()} active={editor.isActive('orderedList')} title="Lista numerada">
          <ListNumbers size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleBlockquote().run()} active={editor.isActive('blockquote')} title="Citação">
          <Quotes size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().toggleCodeBlock().run()} active={editor.isActive('codeBlock')} title="Bloco de código">
          <Terminal size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={() => editor.chain().focus().setHorizontalRule().run()} title="Divisor">
          <Minus size={14} />
        </ToolbarButton>

        <div className="w-px h-5 bg-zinc-700 mx-1" />

        {/* Link + Image */}
        <ToolbarButton onClick={addLink} active={editor.isActive('link')} title="Inserir link">
          <LinkSimple size={14} />
        </ToolbarButton>
        <ToolbarButton onClick={addImage} title="Inserir imagem">
          <ImageIcon size={14} />
        </ToolbarButton>

      </div>
      <EditorContent editor={editor} />
    </div>
  )
}
