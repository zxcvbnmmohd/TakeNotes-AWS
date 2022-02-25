import { useState, useEffect } from 'react'
import { Auth, API, Storage } from 'aws-amplify'
import { listNotes } from '../graphql/queries';
import { createNote as createNoteMutation, deleteNote as deleteNoteMutation } from '../graphql/mutations';
import Layout from '../components/Layout'

interface User {
  username: string;
}

interface Note {
  owner: string;
  name: string;
  description: string;
  image: string;
}

const initialFormState = { owner: '', name: '', description: '', image: '' }

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
    const notesFromAPI = apiData.data.listNotes.items;

    await Promise.all(notesFromAPI.map(async (note: Note) => {
      if (note.image) {
        const image = await Storage.get(note.image);
        console.log(image)
        note.image = image;
      }
      return note;
    }))

    setNotes(apiData.data.listNotes.items);
  }

  async function createNote() {
    if (!formData.name || !formData.description) return;

    if (formData.image) {
      const image = await Storage.get(formData.image);
      console.log(image)
      setFormData({ ...formData, image });
    }
    
    console.log(formData);
    
    await API.graphql({ query: createNoteMutation, variables: { input: formData } });

    setNotes([...notes, formData]);
    setFormData(initialFormState);
  }

  async function deleteNote({ id }) {
    const newNotesArray = notes.filter(note => note.id !== id);
    setNotes(newNotesArray);
    await API.graphql({ query: deleteNoteMutation, variables: { input: { id } } });
  }

  async function onSelectImage(e: any) {
    if (!e.target.files[0]) return
    const file: any = e.target.files[0];
    console.log(file);
    
    setFormData({ ...formData, image: file.name });
    
    await Storage.put(file.name, file);
    fetchNotes();
  }

  return (
    <Layout title="TakeNotes / AWS">
      <div className="flex flex-col justify-center w-full mt-[64px] min-h-screen">
        <div className="flex flex-col justify-center max-w-3/5">
          <div className="text-center text-5xl font-bold">
            👋 Hey {user == null ? 'Next.JS' : user.username}!
          </div>
          <form
            className="flex flex-col items-center mx-28 mt-4 rounded-md cursor-pointer"
            onSubmit={async (e) => {
              e.preventDefault();
              await createNote();
            }}
          >
            <input
              className="form-control block w-full px-3 py-3 text-base
                font-normal text-gray-700 bg-white bg-clip-padding
                border border-solid border-gray-300
                rounded transition ease-in-out m-0
                focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
              type="file"
              id="image"
              onChange={onSelectImage}
            />
            <input
              className="p-2 h-16 w-full bg-red-600 my-2 flex-grow flex-shrink rounded-l-md focus:outline-none px-4 text-white rounded"
              type="text"
              placeholder="Note name"
              onChange={e => setFormData({ ...formData, 'name': e.target.value })}
              value={formData.name}
            />
            <input
              className="p-2 h-16 w-full bg-red-600 flex-grow flex-shrink rounded-l-md focus:outline-none px-4 text-white rounded"
              type="text"
              placeholder="Note Description"
              onChange={e => setFormData({ ...formData, 'description': e.target.value })}
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
                  <button onClick={async () => await deleteNote(note)}>Delete note</button>
                  {
                    note.image && <img src={note.image} style={{ width: 400 }} />
                  }
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
