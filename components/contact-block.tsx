'use client'

import { useState, type FormEvent } from 'react'

export function ContactBlock() {
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setSubmitted(true)
  }

  return (
    <section id="contacto" className="bg-surface-alt">
      <div className="mx-auto max-w-6xl px-6 py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-serif text-3xl font-semibold text-foreground">Contacto</h2>
          <p className="mt-3 text-secondary">
            ¿Tienes alguna consulta o propuesta de colaboración? No dudes en escribirme.
          </p>
        </div>

        {submitted ? (
          <div className="mx-auto mt-10 max-w-lg rounded-lg border border-accent/20 bg-accent/5 p-8 text-center">
            <p className="font-medium text-accent">Mensaje enviado correctamente.</p>
            <p className="mt-2 text-sm text-secondary">Gracias por ponerte en contacto. Responderé lo antes posible.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mx-auto mt-10 flex max-w-lg flex-col gap-4">
            <input
              type="text"
              name="name"
              required
              placeholder="Nombre"
              className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <textarea
              name="message"
              required
              rows={5}
              placeholder="Mensaje"
              className="resize-none rounded-md border border-border bg-surface px-4 py-3 text-sm text-foreground placeholder:text-muted focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <button
              type="submit"
              className="rounded-md bg-accent px-6 py-3 text-sm font-medium text-white transition-colors hover:bg-accent-light"
            >
              Enviar mensaje
            </button>
          </form>
        )}
      </div>
    </section>
  )
}
