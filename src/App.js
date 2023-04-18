import { useState, useEffect } from "react";
import Note from "./components/Note";
import noteService from './services/notes'
import "./index.css"
import Notification from './components/Notification'
import Footer from './components/Footer'

const App = () => {
  const [notes, setNotes] = useState(null);
  const [newNote, setNewNote] = useState("");
  const [showAll, setShowAll] = useState(true);
  const [errorMessage, setErrorMessage] = useState(null)

  // const hook = () => {
  //   axios.get('http://localhost:3001/notes')
  //   .then(response => {
  //     console.log('promise fullfilled')
  //     setNotes(response.data)
  //   })
  // }
  // useEffect(hook,[])

  useEffect(() => {
    noteService
    .getAll()
    .then(initialNotes => {
      setNotes(initialNotes)
    })
  },[])

  if(!notes) {
    return null
  }

  const toggleImportanceOf = (id) => {
    // const url = `http://localhost:3001/notes/${id}`
    const note = notes.find(n => n.id === id)
    const changedNote = { ...note, important: !note.important}

    // axios.put(url, changedNote).then(response => {
    //   setNotes(notes.map(n => n.id !== id ? n : response.data))
    // })

    noteService
    .update(id,changedNote)
    .then(returnedNote => {
      setNotes(notes.map(note => note.id !== id ? note : returnedNote))
    })
    .catch(error => {
      setErrorMessage(
        `Note ${note.content} was already removed from server `
      )
      setTimeout(() => {
        setErrorMessage(null)
      }, 5000);

      setNotes(notes.filter(n => n.id !== id))
    })
  
  }

  const notesToShow = showAll
    ? notes
    : notes.filter((note) => note.important === true);



  const addNote = (event) => {
    event.preventDefault();
    const noteObject = {
      content: newNote,
      important: Math.random() < 0.5,
    }
    // axios
    // .post("http://localhost:3001/notes", noteObject)
    // .then(response => {
    //   setNotes(notes.concat(response.data))
    //   setNewNote('')
    
    // })

    noteService
    .create(noteObject)
    .then(returnedNote => {
      setNotes(notes.concat(returnedNote))
      setNewNote('')
    })
  
  };

  const handleNoteChange = (event) => {
    console.log(event.target.value);
    setNewNote(event.target.value);
  };


  return (
    <div>
      <h1>Notes</h1>
      <Notification message={errorMessage} />
      <div>
        <button onClick={() => setShowAll(!showAll)}>
          {" "}
          show {showAll ? "important" : "all"}{" "}
        </button>
      </div>
      <ul>
        {notesToShow.map((note) => (
          <Note key={note.id} note={note}
          toggleImportance={() => toggleImportanceOf(note.id)}
          />
        ))}
      </ul>
      <form onSubmit={addNote}>
        <input value={newNote} onChange={handleNoteChange} />
        <button type="sumbit">save</button>
      </form>
      <Footer />
    </div>
  );
};

export default App;