import { createSignal } from "solid-js";
import { useAuth } from "../context/AuthContext";
import { useNavigate, A } from "@solidjs/router";
import ThemeToggle from "../components/ThemeToggle";
import erpLogoWhite from "../assets/erp-logo-white-512.png";
import erpLogoDark from "../assets/erp-logo-dark-1024.png";

function Register() {
  const [name, setName] = createSignal("");
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [error, setError] = createSignal("");
  const [loading, setLoading] = createSignal(false);

  const auth = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (password().length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres");
      setLoading(false);
      return;
    }

    const result = await auth.register(name(), email(), password());

    if (result.success) {
      navigate("/login");
    } else {
      setError(result.error);
    }

    setLoading(false);
  };

  return (
    <div class="auth-bg">
      <div class="auth-brand">
        <img
          src={erpLogoWhite}
          alt="Nexus ERP"
          class="relative w-20 h-20 mb-6 object-contain"
        />
        <h2 class="relative text-3xl font-bold text-white mb-3">Nexus ERP</h2>
        <p class="relative text-white/60 max-w-xs">
          Gestiona inventario, proveedores y operaciones desde un solo lugar.
        </p>
      </div>

      <div class="auth-form-panel">
        <div class="absolute top-6 right-6">
          <ThemeToggle />
        </div>

        <div class="w-full max-w-sm animate-fade-in-up">
          <div class="flex flex-col items-center text-center mb-8 lg:items-start lg:text-left">
            <img
              src={erpLogoDark}
              alt="Nexus ERP"
              class="w-14 h-14 mb-4 object-contain lg:hidden dark:hidden"
            />
            <img
              src={erpLogoWhite}
              alt="Nexus ERP"
              class="w-14 h-14 mb-4 object-contain lg:hidden hidden dark:block"
            />
            <h1 class="text-3xl font-bold mb-1 text-[#2b2f42] dark:text-white">Crear cuenta</h1>
            <p class="text-muted">Regístrate para empezar</p>
          </div>

          <form onSubmit={handleSubmit} class="space-y-4">
            <div>
              <label class="block text-sm font-medium mb-2">Nombre</label>
              <input
                type="text"
                required
                class="auth-input w-full"
                placeholder="Tu nombre"
                value={name()}
                onInput={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Email</label>
              <input
                type="email"
                required
                class="auth-input w-full"
                placeholder="tu@email.com"
                value={email()}
                onInput={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label class="block text-sm font-medium mb-2">Contraseña</label>
              <input
                type="password"
                required
                class="auth-input w-full"
                placeholder="Mínimo 6 caracteres"
                value={password()}
                onInput={(e) => setPassword(e.target.value)}
              />
            </div>

            {error() && (
              <div class="auth-error">
                <span>{error()}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading()}
              class="auth-btn-primary w-full disabled:opacity-50"
            >
              {loading() ? "Creando cuenta..." : "Crear cuenta"}
            </button>
          </form>

          <div class="mt-6 text-center">
            <p class="text-muted text-sm">
              ¿Ya tienes cuenta?{" "}
              <A href="/login" class="auth-link">
                Inicia sesión
              </A>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;
