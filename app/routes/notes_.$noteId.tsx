import { LinksFunction, LoaderFunctionArgs } from "@remix-run/node";
import { Link, MetaFunction, useLoaderData } from "@remix-run/react";
import { getStoredNotes } from "~/data/notes";

import styles from "~/styles/note-details.css?url";

export const meta: MetaFunction<typeof loader> = ({ data }) => [
  {
    title: data?.title,
    description: "Manage your notes with ease.",
  },
];

export const links: LinksFunction = () => [
  {
    rel: "stylesheet",
    href: styles,
  },
];

export async function loader({ params: { noteId } }: LoaderFunctionArgs) {
  const notes = await getStoredNotes();
  const selectedNote = notes.find((note) => note.id === noteId);

  if (!selectedNote) {
    throw Response.json(
      { message: `Could not find note for if ${noteId}` },
      {
        status: 404,
      }
    );
  }

  return selectedNote;
}

function NoteDetails() {
  const note = useLoaderData<typeof loader>();

  return (
    <main id="note-details">
      <header>
        <nav>
          <Link to="/notes">Back to all Notes</Link>
        </nav>
        <h1>{note!.title}</h1>
      </header>
      <p id="note-details-content">{note!.content}</p>
    </main>
  );
}

export default NoteDetails;
