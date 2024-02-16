import React from 'react';
import { faQrcode, faMagnifyingGlass, faGears } from '@fortawesome/free-solid-svg-icons';

import './Sidebar.css';
import SidebarElement from './SidebarElement';

function Sidebar() {
  return (
    <div className='sidebar'>
        <SidebarElement link="/read" text="Ausweis lesen" icon={faQrcode}/>
        <SidebarElement link="/search" text="Schüler*in suchen" icon={faMagnifyingGlass}/>
        <SidebarElement link="/settings" text="Einstellungen" icon={faGears}/>
    </div>
  );
}

export default Sidebar;