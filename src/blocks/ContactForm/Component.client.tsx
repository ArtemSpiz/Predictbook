'use client'
import { useState } from 'react'
import type { Form } from '@/payload-types'
import type { PageBlock } from '@/blocks/types'

type Block = Extract<PageBlock, { blockType: 'contact-form-block' }>

interface FormField {
  blockType: string
  name: string
  label?: string
  required?: boolean
  defaultValue?: string
}

export function ContactFormClient({ block }: { block: Block }) {
  const form = block.form as Form
  const [submitting, setSubmitting] = useState(false)
  const [done, setDone] = useState(false)

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.currentTarget)
    const submissionData = Array.from(formData.entries()).map(([field, value]) => ({
      field,
      value: String(value),
    }))
    const res = await fetch(`${process.env.NEXT_PUBLIC_SERVER_URL}/api/form-submissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ form: form.id, submissionData }),
    })
    setSubmitting(false)
    if (res.ok) setDone(true)
  }

  if (done && form.confirmationMessage) {
    return (
      <div className="prose mx-auto px-6 py-12 max-w-2xl">
        Thanks — we&apos;ll be in touch.
      </div>
    )
  }

  const fields = (form.fields ?? []) as FormField[]

  return (
    <section className="px-6 py-12">
      <div className="max-w-xl mx-auto">
        {block.heading && <h2 className="text-3xl font-bold mb-2">{block.heading}</h2>}
        {block.description && <p className="text-gray-600 mb-6">{block.description}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          {fields.map((f, i) => {
            if (f.blockType === 'text' || f.blockType === 'email') {
              return (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1">{f.label ?? f.name}</label>
                  <input
                    type={f.blockType === 'email' ? 'email' : 'text'}
                    name={f.name}
                    required={f.required}
                    defaultValue={f.defaultValue ?? ''}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
              )
            }
            if (f.blockType === 'textarea') {
              return (
                <div key={i}>
                  <label className="block text-sm font-medium mb-1">{f.label ?? f.name}</label>
                  <textarea
                    name={f.name}
                    required={f.required}
                    className="w-full border rounded px-3 py-2 min-h-[120px]"
                  />
                </div>
              )
            }
            return null
          })}
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-60"
          >
            {submitting ? 'Sending...' : (form.submitButtonLabel ?? 'Submit')}
          </button>
        </form>
      </div>
    </section>
  )
}
