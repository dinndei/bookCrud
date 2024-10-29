import logo from './logo.svg';
import './App.css';
import { useEffect, useState } from 'react';

function App() {

  const [bookArr, setBookArr] = useState([]);
  const [editedBook, setEditedBook] = useState(null);
  const [addName, setAddName] = useState("");
  const [addAuthor, setAddAuthor] = useState("");

  //קבלת מערך הספרים
  const getBooks = async () => {
    try {
      let res = await fetch("http://localhost:5000/");
      let data = await res.json();
      console.log("Books data:", data);
      data=data.filter(item=>item!=null);
      setBookArr(data||[]);
    }
    catch (err) {
      console.log("error getting books:" + err);
    }
  }
  // בעת טעינה-טעינת מערך הספרים
  useEffect(() => {
    getBooks();
  }, [])
 

  //עריכת ספר
  const editBook = async () => {
    if (!editedBook) return;
    console.log("edit book",editedBook);
    let id = editedBook.id;
    console.log("iddddd",id);
    try {
      let res = await fetch(`http://localhost:5000/${id}`,
        {
          method: 'PUT',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify(editedBook)
        }
      );
      if (res.ok) {
        setBookArr(prevBooks =>
          prevBooks.map(item => item.id == id ? editedBook : item))
        setEditedBook(null);
      }
    }
    catch (err) {
      console.error("error updating:" + err);
    }

  }

  //הוספת ספר
  const addBook = async () => {
    try {
      let res = await fetch(`http://localhost:5000/`,
        {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({
            "name": addName,
            "author": addAuthor
          })
        }
      );
      if (res.ok) {
        await getBooks();
        setAddName("");
        setAddAuthor("");
      }
    }
    catch (err) {
      console.error("error updating:" + err);
    }

  }

  //מחיקת ספר
  const deleteBook = async (id) => {
    try {
      let res = await fetch(`http://localhost:5000/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setBookArr(bookArr.filter(item => item.id != id))
        if (editedBook.id==id) {
          setEditedBook(null);
        }
      }
    }
    catch (err) {
      console.error("error deleting:" + err);
    }

  }


  return (
    <>
      <h2 className='title'>book list</h2>
      {editedBook?
        <>
          <input type='text' className='input' placeholder='name' value={editedBook.name||""} onChange={(e) => setEditedBook({ ...editedBook, name: e.target.value })} />
          <input type='text' className='input' placeholder='author' value={editedBook.author||""} onChange={(e) => setEditedBook({ ...editedBook, author: e.target.value })} />
          <button className='btn' onClick={editBook}>edit book</button>
        </>
        :
        <>
          <input type='text' className='input' placeholder='name' value={addName} onChange={(e) => { setAddName(e.target.value) }} />
          <input type='text' className='input' placeholder='author' value={addAuthor} onChange={(e) => { setAddAuthor(e.target.value) }} />
          <button className='btn' onClick={addBook}>add book</button>
        </>
      }
      <ul className='list'>
        {Array.isArray(bookArr)&&bookArr!=[]&&bookArr.map((item, index) => {
          return <li key={index} className='list-item'>
            <div>{item.id} </div>
            <div>{item.name}</div>
            <div>{item.author}</div>
            <button type='button' className='btn' onClick={() => { setEditedBook(item) }} >edit</button>

            <button type='button' className='btn' onClick={() => { deleteBook(item.id) }}>delete</button>
          </li>
        })}
      </ul>
    </>
  );
}

export default App;
