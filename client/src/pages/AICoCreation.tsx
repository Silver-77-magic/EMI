import { useState } from "react";

export default function AICoCreation() {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generateImage() {
    if (!prompt.trim()) {
      setError("Veuillez entrer une description");
      return;
    }

    setLoading(true);
    setError(null);
    setImageUrl(null);

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/api/generate-image`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ prompt }),
        }
      );

      if (!res.ok) {
        throw new Error("Erreur lors de la génération");
      }

      const data = await res.json();
      setImageUrl(data.imageUrl);
    } catch (err) {
      setError("Impossible de générer l’image");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div style={{ maxWidth: 600, margin: "40px auto", textAlign: "center" }}>
      <h1>🎨 Génération d’image IA</h1>

      <textarea
        placeholder="Ex: Un hoodie noir avec broderie dorée, style luxe"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        rows={4}
        style={{ width: "100%", padding: 10 }}
      />

      <button
        onClick={generateImage}
        disabled={loading}
        style={{
          marginTop: 16,
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        {loading ? "Génération..." : "Générer l’image"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {imageUrl && (
        <div style={{ marginTop: 24 }}>
          <h3>Résultat</h3>
          <img
            src={imageUrl}
            alt="Image générée"
            style={{ maxWidth: "100%", borderRadius: 8 }}
          />
        </div>
      )}
    </div>
  );
}
