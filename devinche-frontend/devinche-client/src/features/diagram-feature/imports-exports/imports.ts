/**
 * Imports diagram from JSON
 * @param e input change event
 * @returns null
 */
export const importDiagramFromJSON = async (e: React.ChangeEvent<HTMLInputElement>): Promise<string> => {
  const file = e.target.files?.[0];
  if (!file) return "";
  const text = await file.text();
  e.target.value = "";
  return text;
};


/**
 * Imports diagram from RDF
 * @param e input change event
 * @returns null
 */
export const importDiagramFromRdf = async (e: React.ChangeEvent<HTMLInputElement>): Promise<string> => {
  const file = e.target.files?.[0];
  if (!file) return "";

  if (
    file.size > 10 * 1024 * 1024 ||
    !file.name.toLowerCase().endsWith(".ttl")
  ) {
    e.target.value = "";
    console.error("Invalid file");
    return "";
  }

  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/import/rdf`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Import failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return JSON.stringify(result);
};

/**
 * Imports diagram from XML
 * @param e input change event
 * @returns null
 */
export const importDiagramFromXml = async (e: React.ChangeEvent<HTMLInputElement>): Promise<string> => {
  const file = e.target.files?.[0];
  if (!file) return "";

  if (
    file.size > 10 * 1024 * 1024 ||
    !file.name.toLowerCase().endsWith(".xml")
  ) {
    e.target.value = "";
    console.error("File too big");
    return "";
  }

  const formData = new FormData();
  formData.append("file", file);
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/import/xml`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Import failed: ${response.status} ${errorText}`);
  }

  const result = await response.json();
  return JSON.stringify(result);
};
