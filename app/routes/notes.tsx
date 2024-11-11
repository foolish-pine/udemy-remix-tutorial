import { ActionFunctionArgs, redirect } from "@remix-run/node";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import { getStoredNotes, storeNotes } from "~/data/notes";

export function links() {
  return [...newNoteLinks()];
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData);
  noteData.id = new Date().toISOString();
  const existingNotes = await getStoredNotes();
  const updatedNotes = [...existingNotes, noteData];

  await storeNotes(updatedNotes);

  return redirect("/notes");
}

export default function NotesPage() {
  return (
    <main id="content">
      <NewNote />
    </main>
  );
}
