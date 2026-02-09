const handleDownloadJson = (json: string | null) => {
  if (!json) return;

  try {
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "diagram.json";
    a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    console.error("Problem exporting diagram JSON: ", e);
  }
};

export default handleDownloadJson;