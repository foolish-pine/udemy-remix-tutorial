import fs from "fs/promises";

export type Note = {
  id: string;
  title: string;
  content: string;
};

export async function getStoredNotes() {
  const rawFileContent = await fs.readFile("notes.json", { encoding: "utf-8" });
  const data = JSON.parse(rawFileContent);
  const storedNotes = (data.notes ?? []) as Note[];
  return storedNotes;
}

export function storeNotes(notes: Note[]) {
  return fs.writeFile("notes.json", JSON.stringify({ notes: notes || [] }));
}
