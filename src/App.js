import { 
  createBrowserRouter, 
  RouterProvider, 
  Outlet,
} from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Write from "./pages/Write";
import Home from "./pages/Home";
import Single from "./pages/Single";
import Footer from "./components/Footer";
import CustomNavbar from "./components/Navbar";
import 'bootstrap/dist/css/bootstrap.min.css';
import './style.scss';
import React from "react";

const Layout = ()=>{
  return (
    <>
    <CustomNavbar/>
    <Outlet/>
    <Footer/>
    </>
  )
}

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      { path: "/", element: <Home /> }, 
      { path: "/write", element: <Write />},
      { path: "/post/:id/*", element: <Single />},
    ],
  },
  {
    path: "/register", element: <Register />,
  },
  {
    path: "/login", element: <Login />,
  },
]);

function App() {
  return (
    <div className="app">
      <div className="container">
        <RouterProvider router={router}/>
      </div>
    </div>
  );
}



export default App;
