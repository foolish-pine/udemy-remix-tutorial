import { ActionFunctionArgs, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, storeNotes } from "~/data/notes";

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export async function loader() {
  const notes = await getStoredNotes();

  return notes;
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
  const notes = useLoaderData<typeof loader>();

  return (
    <main id="content">
      <NewNote />
      <NoteList notes={notes} />
    </main>
  );
}
