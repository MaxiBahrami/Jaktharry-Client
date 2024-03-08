import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Container, Button} from 'react-bootstrap';

const Menu = ({cat}) => {
  const [posts,setPosts] = useState([])

  useEffect(()=>{
    const fetchData = async()=>{
      try{
        const res = await axios.get(`/posts/?cat=${cat}`);
        setPosts(res.data)
      }catch(err){
        console.log(err)

      }
    };
    fetchData();
  }, [cat]);

  // const posts = [
  //   {
  //     id:1,
  //     title:"Jägareförbundet i internationellt samarbete för bättre sälförvaltning",
  //     desc: "Svenska Jägareförbundet vill se sälen förvaltas och användas som resurs precis som andra viltstammar. Ett nytt samarbete över gränserna runt...",
  //     img: "https://www.sportmix.com/wp-content/uploads/top-tips-for-hunting-dog-training_Hero-Image-1024x627.jpg"
  //   },
  //   {
  //     id:2,
  //     title:"Nu lättas restriktionerna i Fagersta",
  //     desc: "Svenska Jägareförbundet har tillsammans med Statens veterinärmedicinska anstalt och Jordbruksverket gjort något unikt. Redan efter sex månader lätt...",
  //     img: "https://www.sportmix.com/wp-content/uploads/top-tips-for-hunting-dog-training_Hero-Image-1024x627.jpg"
  //   },
  //   {
  //     id:3,
  //     title:"Därför behöver invasiva arter bekämpas",
  //     desc: "Invasiva främmande arter är ett av de största hoten mot den globala biologiska mångfalden. – Den största orsaken till utdöenden hos djur beror på...",
  //     img: "https://www.sportmix.com/wp-content/uploads/top-tips-for-hunting-dog-training_Hero-Image-1024x627.jpg"
  //   },
  //   {
  //     id:4,
  //     title:"Specialuppdrag som gör skillnad",
  //     desc: "Invasiva arter är ett av de största hoten mot biologisk mångfald.",
  //     img: "https://www.sportmix.com/wp-content/uploads/top-tips-for-hunting-dog-training_Hero-Image-1024x627.jpg"
  //   },
  //   {
  //     id:5,
  //     title:"Viltvårdens lösningar finns på hemmaplan",
  //     desc: "FÖRBUNDSLEDARE. Det ideella engagemanget och den lokala förvaltningen utmanas ständigt, inte minst av myndigheter som sätter nationella mål och...",
  //     img: "https://www.sportmix.com/wp-content/uploads/top-tips-for-hunting-dog-training_Hero-Image-1024x627.jpg"
  //   },
  // ]

  return (
    <Container className='menu'>
      <h1>Andra nyheter som du kan gilla</h1>
      {posts.map(post=>(
        <div className="post" key={post.id}>
          <img src={`../upload/${post?.img}`} alt="" />
          <h2>{post.title}</h2>
          <Button>Läs mer</Button>
        </div>
      ))}
    </Container>
  );
}

export default Menu;
