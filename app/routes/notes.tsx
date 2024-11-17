import { ActionFunctionArgs, redirect } from "@remix-run/node";
import {
  isRouteErrorResponse,
  MetaFunction,
  useActionData,
  useLoaderData,
  useRouteError,
} from "@remix-run/react";
import NewNote, { links as newNoteLinks } from "~/components/NewNote";
import NoteList, { links as noteListLinks } from "~/components/NoteList";
import { getStoredNotes, Note, storeNotes } from "~/data/notes";

export const meta: MetaFunction = () => [
  {
    title: "All Notes",
    description: "Manage your notes with ease.",
  },
];

export function links() {
  return [...newNoteLinks(), ...noteListLinks()];
}

export async function loader() {
  const notes = await getStoredNotes();

  if (!notes || notes.length === 0) {
    throw Response.json(
      { message: "Could not find any notes." },
      {
        status: 404,
        statusText: "Not found",
      }
    );
  }

  return notes;
}

export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  const noteData = Object.fromEntries(formData) as Note;

  if ((noteData.title as string).trim().length < 5) {
    return {
      message: "Invalid title - must be at least 5 characters long.",
    };
  }

  noteData.id = new Date().toISOString();
  const existingNotes = await getStoredNotes();
  const updatedNotes = [...existingNotes, noteData];

  await storeNotes(updatedNotes);

  return redirect("/notes");
}

export default function NotesPage() {
  const notes = useLoaderData<typeof loader>();
  const data = useActionData<typeof action>();

  return (
    <main id="content">
      <NewNote message={data ? data.message : ""} />
      <NoteList notes={notes} />
    </main>
  );
}

export function ErrorBoundary() {
  const error = useRouteError();

  if (isRouteErrorResponse(error)) {
    return (
      <main className="error">
        <p>
          {error.status}: {error.statusText}
        </p>
        <p>{error.data.message}</p>
      </main>
    );
  } else if (error instanceof Error) {
    return (
      <main className="error">
        <h1>An error related to your notes occurred!</h1>
        <p>{error.message}</p>
      </main>
    );
  } else {
    return <h1>Unknown Error</h1>;
  }
}
