import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { SiteNav } from "@/components/site-nav";
import { SiteFooter } from "@/components/site-footer";
import { useAuth } from "@/lib/auth-context";
import { ApiError } from "@/lib/api/client";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Connexion — OBB Store Admin" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const { login, isAuthenticated, isStaff } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = window.localStorage.getItem("rememberedAdminEmail");
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    }
  }, []);

  useEffect(() => {
    if (isAuthenticated && isStaff) {
      navigate({ to: "/admin" });
    }
  }, [isAuthenticated, isStaff, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(email, password, rememberMe);
      if (typeof window !== "undefined") {
        if (rememberMe) {
          window.localStorage.setItem("rememberedAdminEmail", email);
        } else {
          window.localStorage.removeItem("rememberedAdminEmail");
        }
      }
      navigate({ to: "/admin" });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "Connexion impossible");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SiteNav />
      <section className="max-w-md mx-auto px-6 py-24">
        <h1 className="text-3xl font-display mb-2">Connexion admin</h1>
        <p className="text-sm text-muted-foreground mb-8">
          Connectez-vous avec votre email ou votre nom d'utilisateur pour accéder au tableau de bord.
        </p>
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-sm text-destructive bg-destructive/10 px-4 py-3 rounded-lg">{error}</p>
          )}
          <label className="block">
            <span className="text-xs uppercase tracking-widest text-muted-foreground">Email / Nom d'utilisateur</span>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border-b border-foreground/20 py-3 bg-transparent outline-none focus:border-primary"
              required
            />
          </label>
          <label className="block">
            <div className="flex items-center justify-between gap-4">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">Mot de passe</span>
              <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>
            <div className="mt-1 flex items-center gap-3 border-b border-foreground/20 py-3">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-transparent outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                className="text-sm text-muted-foreground hover:text-foreground"
              >
                {showPassword ? "Masquer" : "Afficher"}
              </button>
            </div>
          </label>
          <label className="flex items-center gap-3 text-sm text-muted-foreground">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="h-4 w-4 rounded border-foreground/20 text-primary focus:ring-primary"
            />
            Se souvenir de moi
          </label>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-primary text-primary-foreground uppercase tracking-widest text-xs font-bold rounded-lg disabled:opacity-50"
          >
            {loading ? "Connexion…" : "Se connecter"}
          </button>
        </form>
        <p className="mt-8 text-center text-sm text-muted-foreground">
          <Link to="/" className="underline hover:text-foreground">← Retour à la boutique</Link>
        </p>
      </section>
      <SiteFooter />
    </div>
  );
}
