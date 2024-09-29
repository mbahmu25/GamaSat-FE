// src/app.jsx
import React from 'react';
import { useState } from 'react';
// import Sidebar from './component/sidebar';
import {Sidebar} from "primereact/sidebar"
import { Calendar } from 'primereact/calendar';
import "primereact/resources/themes/bootstrap4-light-blue/theme.css"

function App() {
  const [active,setActive] = useState(false)
    return (
    <div className="App">
      <Sidebar visible={active} onHide={()=>{setActive(!active)}}>
        <div className='{w-10 h-5 bg-[red]'>
          
        </div>
      </Sidebar>
      <button onClick={()=>{setActive(true)}}>
        <div className={`w-8 h-8 bg-[red] transition duration-300 ease-in-out `}></div>
      </button>
      <div className="ml-64 p-8"> {/* Margin left sama dengan lebar sidebar */}
        <h1 className="text-4xl font-bold">Main Content</h1>
        <p>This is the page content</p>
      </div>
    </div>
  );
}

export default App;
