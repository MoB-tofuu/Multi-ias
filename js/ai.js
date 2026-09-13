const AIEngine = (() => {
  // V1: simulador local. Aquí conectaremos el primer proveedor de IA.
  async function analyze(prompt, summary) {
    await new Promise(resolve => setTimeout(resolve, 700));

    if (!prompt.trim()) {
      return {
        ok: false,
        message: "Escribe primero qué quieres modificar o revisar."
      };
    }

    if (!summary.count) {
      return {
        ok: false,
        message: "Carga primero el proyecto de Rift Pick."
      };
    }

    const changes = [];
    const text = prompt.toLowerCase();

    if (text.includes("móvil") || text.includes("mobile") || text.includes("responsive")) {
      if (summary.hasCss) {
        changes.push({
          file: "CSS",
          detail: "Revisar estilos responsive y mejorar la experiencia en pantallas pequeñas."
        });
      }
    }

    if (text.includes("error") || text.includes("revisa") || text.includes("bug")) {
      changes.push({
        file: "Proyecto",
        detail: "Analizar HTML, CSS y JavaScript en busca de problemas potenciales."
      });
    }

    if (text.includes("diseño") || text.includes("visual") || text.includes("colores")) {
      if (summary.hasCss) {
        changes.push({
          file: "CSS",
          detail: "Proponer mejoras visuales manteniendo la estructura actual."
        });
      }
    }

    if (!changes.length) {
      changes.push({
        file: "Análisis",
        detail: "Preparar una propuesta basada en la petición del usuario y los archivos disponibles."
      });
    }

    return {
      ok: true,
      message: "Esta es una simulación de la IA. En el siguiente paso conectaremos un proveedor real.",
      changes
    };
  }

  return { analyze };
})();
