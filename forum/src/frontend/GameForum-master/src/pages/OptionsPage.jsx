import { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ForumLayout } from "../components/layout/ForumLayout";
import FrameCard from "../components/auth/FrameCard";
import { apiRequest } from "../api";
import { AuthContext } from "../auth/AuthContext";
import { Mail, CheckCircle, AlertCircle } from "lucide-react";

export default function OptionsPage() {
  const auth = useContext(AuthContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState(""); // "success" or "error"

  const isAuthenticated =
    !!localStorage.getItem("token") ||
    !!localStorage.getItem("accessToken") ||
    !!localStorage.getItem("jwt");

  if (!isAuthenticated) {
    navigate("/login");
    return null;
  }

  const handleRequestPasswordReset = async () => {
    if (loading) return;

    setLoading(true);
    setMessage("");
    setMessageType("");

    try {
      await apiRequest("/api/auth/request-password-reset", {
        method: "POST",
        token: auth?.token,
      });

      setMessage("Email-ul de resetare a parolei a fost trimis! Verifică inbox-ul tău.");
      setMessageType("success");
    } catch (err) {
      setMessage(err?.message || "Eroare la trimiterea email-ului. Te rugăm să încerci din nou.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ForumLayout>
      <div className="max-w-2xl mx-auto">
        <FrameCard>
          <div className="p-6 space-y-6">
            <div className="border-b border-wood-700 pb-4">
              <h1 className="text-2xl font-display font-bold text-gold-400">
                Opțiuni
              </h1>
              <p className="text-parchment-400 text-sm mt-1">
                Gestionează setările contului tău
              </p>
            </div>

            <div className="space-y-4">
              <div className="border border-wood-700 rounded-sm p-4 bg-wood-900/50">
                <h2 className="text-lg font-display font-bold text-gold-300 mb-2">
                  Resetare parolă
                </h2>
                <p className="text-parchment-400 text-sm mb-4">
                  Dacă dorești să resetezi parola, apasă butonul de mai jos. Vei primi un email cu un link pentru resetarea automată a parolei.
                </p>

                {message && (
                  <div
                    className={`mb-4 p-3 rounded-sm flex items-start gap-2 ${
                      messageType === "success"
                        ? "bg-green-900/30 border border-green-700 text-green-300"
                        : "bg-red-900/30 border border-red-700 text-red-300"
                    }`}
                  >
                    {messageType === "success" ? (
                      <CheckCircle size={20} className="flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertCircle size={20} className="flex-shrink-0 mt-0.5" />
                    )}
                    <p className="text-sm">{message}</p>
                  </div>
                )}

                <button
                  onClick={handleRequestPasswordReset}
                  disabled={loading}
                  className="w-full px-4 py-2 rounded-sm border border-gold-600 bg-gold-700/20 text-gold-300 font-display font-bold text-sm hover:bg-gold-700/30 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-gold-400 border-t-transparent rounded-full animate-spin" />
                      <span>Se trimite...</span>
                    </>
                  ) : (
                    <>
                      <Mail size={18} />
                      <span>Trimite email pentru resetare parolă</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </FrameCard>
      </div>
    </ForumLayout>
  );
}
