import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import ReactQuill from'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Write = () => {

  const navigate = useNavigate()
  const state = useLocation().state

  const [value, setValue] = useState(state?.desc || "");
  const [title, setTitle] = useState(state?.title || "");
  const [file, setFile] = useState(null);
  const [cat, setCat] = useState(state?.cat || "");
  // const [lokaltOptions, setLokaltOptions] = useState([]);

  const upload = async ()=>{
    try{
      const formData = new FormData();
      formData.append("file", file);
      const res = await axios.post("/upload", formData);
      return res.data
    }catch(err){
      console.log(err);
    }
  }

  const handleClick = async e=>{
    e.preventDefault()
    try {
      const imgUrl = await upload(); // Wait for the result of the upload function
  
      state
        ? await axios.put(`/posts/${state.id}`, {
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
          })
        : await axios.post(`/posts/`, {
            title,
            desc: value,
            cat,
            img: file ? imgUrl : "",
            date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
          });
          // Redirect to the home page or any other page
          navigate("/")
    } catch (err) {
      console.log(err);
    }

  //   const handleCatChange = (e) => {
  //     setCat(e.target.value);
  
  //     // Check if the selected category is "lokalt" and update the options accordingly
  //     if (e.target.value === 'lokalt') {
  //       setLokaltOptions(['Option 1', 'Option 2', 'Option 3']);
  //     } else {
  //       // If the category is not "lokalt", reset the options
  //       setLokaltOptions([]);
  //     }
  // }
}

  return (
    <div className='add'>
      <div className="content">
        <input type="text" value={title} placeholder='Title' onChange={e=>setTitle(e.target.value)}/>
        <div className="editorContainer">
          <ReactQuill className='editor' theme="snow" value={value} onChange={setValue} />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Publicera</h1>
          <span>
            <b>Status: </b> Utkast
          </span>
          <span>
            <b>Synlighet: </b> Allmän
          </span>
          <input style={{display:"none"}} type="file" name="" id="file" onChange={e=>setFile(e.target.files[0])}/>
          <label className='file' htmlFor="file">Ladda upp bild</label>
          <div className="buttons">
            <button>Spara som utkast</button>
            <Button onClick={handleClick} >Publicera</Button>
          </div>
        </div>
        <div className="item">
          <h1>Category</h1>
          <div className="cat">
            <input type="radio" checked={cat === "riks"} name="cat" value="riks" id="riks" onChange={e=>setCat(e.target.value)}/>
            <label htmlFor="riks">Riks</label>
          </div>
          <div className="cat">
            <input type="radio" checked={cat === "lans"} name="cat" value="lans" id="lans" onChange={e=>setCat(e.target.value)}/>
            <label htmlFor="lans">Läns</label>
          </div>
          <div className="cat">
            <input type="radio" checked={cat === "lokalt"} name="cat" value="lokalt" id="lokalt" onChange={e=>setCat(e.target.value)}/>
            <label htmlFor="lokalt">Lokalt</label>
            {cat === 'lokalt' && (
              <div className="cat">
              <p className="">Choose from the following options:</p>
              {/* <ul>
                {lokaltOptions.map((option, index) => (
                <li key={index}>{option}</li>
            ))}
            </ul> */}
          </div>
        )}
          </div>
          <div className="cat">
            <input type="radio" checked={cat === "aktiviteter"} name="cat" value="aktiviteter" id="aktiviteter" onChange={e=>setCat(e.target.value)}/>
            <label htmlFor="aktiviteter">Aktiviteter</label>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Write;
