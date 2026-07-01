import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { forgotPassword } from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Mot de passe oublié — OBB Store" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const response = await forgotPassword(email);
      setMessage(response.message || "Un e-mail a été envoyé si ce compte existe.");
      setEmail("");
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Impossible d'envoyer l'email de récupération.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="max-w-md mx-auto px-6 py-24">
        <h1 className="text-3xl font-display mb-2">Mot de passe oublié</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Entrez votre email pour recevoir un lien de réinitialisation de mot de passe.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {message && (
            <p className="text-sm text-success bg-success/10 px-4 py-3 rounded-lg">{message}</p>
          )}
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{error}</p>
          )}
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Email</span>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border-b border-foreground/20 py-3 bg-transparent outline-none focus:border-primary"
              required
            />
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground uppercase tracking-widest text-xs font-bold rounded-lg disabled:opacity-50"
          >
            {loading ? "Envoi…" : "Envoyer le lien"}
          </button>
        </form>
        <div className="mt-8 text-center text-sm text-muted-foreground space-y-2">
          <p>
            <Link to="/login" className="underline hover:text-foreground">
              Retour à la connexion
            </Link>
          </p>
          <p>
            <Link to="/" className="underline hover:text-foreground">
              Retour à la boutique
            </Link>
          </p>
        </div>
      </section>
      <SiteFooter />
    </div>
  );
}
