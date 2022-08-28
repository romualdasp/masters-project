import React, { useState } from 'react'

import { FaBars, FaTimes } from "react-icons/fa";

export default function SideMenu() {
  const [shown, setShown] = useState(false);

  const showSidebar = () => setShown(!shown);

  return (
    <>
      <div className='sidemenu-open' onClick={showSidebar}>
        <FaBars />
      </div>

      <nav className={shown ? 'sidemenu active' : 'sidemenu'}>
        <ul className='nav-menu-items' onClick={showSidebar}>
          <li className='sidemenu-close'>
          <FaTimes />
          </li>
          <li>Nav1</li>
          <li>Nav2</li>
          <li>Nav3</li>
          <li>Nav4</li>
          <li>Nav5</li>
        </ul>
      </nav>

    </>
  )
}
