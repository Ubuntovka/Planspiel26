import { useDiagram } from "../hooks";

const { importFromJson } = useDiagram();

/**
 * Imports diagram from JSON
 * @param e input change event
 * @returns null
 */
export const importDiagramFromJSON: React.ChangeEventHandler<
  HTMLInputElement
> = async (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  try {
    const text = await file.text();
    importFromJson(text);
  } catch (err) {
    console.error("Problem importing diagram JSON: ", err);
  } finally {
    e.target.value = ""; // reset input
  }
};

/**
 * Imports diagram from RDF
 * @param e input change event
 * @returns null
 */
export const importDiagramFromRdf: React.ChangeEventHandler<HTMLInputElement> = async (
  e,
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (
    file.size > 10 * 1024 * 1024 ||
    !file.name.toLowerCase().endsWith(".ttl")
  ) {
    e.target.value = "";
    console.error("Invalid file");
    return;
  }

  const formData = new FormData();
  formData.append("file", file);

  try {
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
    console.log(result);
    importFromJson(JSON.stringify(result));
  } catch (err) {
    console.error("TTL import error:", err);
  } finally {
    e.target.value = "";
  }
};

/**
 * Imports diagram from XML
 * @param e input change event
 * @returns null
 */
export const importDiagramFromXml: React.ChangeEventHandler<HTMLInputElement> = async (
  e,
) => {
  const file = e.target.files?.[0];
  if (!file) return;

  if (
    file.size > 10 * 1024 * 1024 ||
    !file.name.toLowerCase().endsWith(".xml")
  ) {
    e.target.value = "";
    console.error("File too big");
    return;
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
  try {
    importFromJson(JSON.stringify(result));
  } catch (err) {
    console.error("Problem importing diagram XML: ", err);
  } finally {
    e.target.value = "";
  }
};
