import { useState, useEffect } from 'react'
import { Auth, API } from 'aws-amplify'
import { listNotes } from '../graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from '../graphql/mutations';
import Layout from '../components/Layout'

interface User {
  username: string;
}

const initialFormState = { name: '', description: '' }

const IndexPage = () => {
  const [user, setUser] = useState<User>(null);

  const [notes, setNotes] = useState([]);
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    Auth.currentAuthenticatedUser()
      .then(user => {
        console.log("User: ", user)
        setUser(user)
      })
      .catch(err => setUser(null))

    fetchNotes();
  }, []);

  async function fetchNotes() {
    const apiData: any = await API.graphql({ query: listNotes });
    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });
    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } } });
  }

  return (
    <Layout title="TakeNotes / AWS">
      <div className="flex flex-col justify-center w-full mt-[64px] h-screen">
        <div className="flex flex-col justify-center max-w-3/5">
          <div className="text-center text-5xl font-bold">
            👋 Hey {user == null ? 'Next.JS' : user.username} !
          </div>
          <form
            className="flex flex-col items-center mx-28 mt-4 rounded-md cursor-pointer"
            onSubmit={async (e) => {
              e.preventDefault();
              await createNote();
            }}
          >
            <input
              className="p-2 h-16 w-full bg-red-600 mb-2 flex-grow flex-shrink rounded-l-md focus:outline-none px-4 text-white"
              type="text"
              onChange={e => setFormData({ ...formData, 'name': e.target.value })}
              placeholder="Note name"
              value={formData.name}
            />
            <input
              className="p-2 h-16 w-full bg-red-600 flex-grow flex-shrink rounded-l-md focus:outline-none px-4 text-white"
              type="text"
              onChange={e => setFormData({ ...formData, 'description': e.target.value })}
              placeholder="Note Description"
              value={formData.description}
            />
            <input className="invisible w-0" type="submit" />
          </form>
          <div className="mb-30">
            {
              notes.map(note => (
                <div key={note.id || note.name}>
                  <h2>{note.name}</h2>
                  <p>{note.description}</p>
                  <button onClick={() => deleteNote(note)}>Delete note</button>
                </div>
              ))
            }
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default IndexPage
