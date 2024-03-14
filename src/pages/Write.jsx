import axios from 'axios';
import moment from 'moment';
import React, { useState } from 'react';
import { Button } from 'react-bootstrap';
import ReactQuill from'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useLocation, useNavigate } from 'react-router-dom';

const Write = () => {
  const navigate = useNavigate();
  const state = useLocation().state;
  const token = localStorage.getItem('accessToken'); 

  const [value1, setValue1] = useState(state ? state.desc : "");
  const [value2, setValue2] = useState(state ? state.text : "");
  const [title, setTitle] = useState(state ? state.title : "");
  const [imageUrl, setImageUrl] = useState(state ? state.img : "");
  const [cat, setCat] = useState(state ? state.cat : "");

  const handleClick = async e=>{
    e.preventDefault()
    try {
      const apiUrl = process.env.REACT_APP_API_URL;
      const endpoint = state ? `${apiUrl}/api/posts/${state.id}` : `${apiUrl}/api/posts`;

      const postData = {
        title,
        desc: value1,
        text: value2,
        cat,
        img: imageUrl,
      };

      if (!token) {
        console.error('JWT token is missing.'); // Handle missing token
        return;
      }

      const headers = {
        Authorization: `Bearer ${token}`, // Include token in request headers
      };

      if (state) {
        await axios.put(endpoint, postData, { headers }); // Send PUT request with token in headers
      } else {
        const newPostData = {
          ...postData,
          date: moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
        };
        await axios.post(endpoint, newPostData, { headers }); // Send POST request with token in headers
      }

          // Redirect to the home page or any other page
          navigate("/");
    } catch (err) {
      console.log(err);
    }
  }
  return (
    <div className='add'>
      <div className="content">
        <input type="text" value={title} placeholder='Ange titel' onChange={e=>setTitle(e.target.value)}/>
        <hr />
        <div className="editorContainer1">
          <ReactQuill className='editor'  placeholder= "Beskrivning av nyheterna" theme="snow" value={value1} onChange={setValue1} />
        </div>
        <hr />
        <div className="editorContainer2">
          <ReactQuill className='editor' placeholder= "Nyhetsdetaljer" theme="snow" value={value2} onChange={setValue2} />
        </div>
      </div>
      <div className="menu">
        <div className="item">
          <h1>Ange bildlänken</h1>
          <input type="text" value={imageUrl} placeholder='Image URL' onChange={e => setImageUrl(e.target.value)} />
          <hr />
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
            </div>
            <div className="cat">
              <input type="radio" checked={cat === "aktiviteter"} name="cat" value="aktiviteter" id="aktiviteter" onChange={e=>setCat(e.target.value)}/>
              <label htmlFor="aktiviteter">Aktiviteter</label>
            </div>
          </div>
          <div className="item2">
            <Button onClick={handleClick} >Publicera</Button>
          </div>
        </div>  
      </div>
    </div>
  );
}

export default Write;
