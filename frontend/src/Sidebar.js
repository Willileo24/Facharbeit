import React from 'react';
import { faQrcode, faMagnifyingGlass, faGears, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import './Sidebar.css';
import SidebarElement from './SidebarElement';

function Sidebar() {
  return (
    <div className='sidebar'>
        <SidebarElement link="/read" text="Ausweis lesen" permissions={["students.view"]} icon={faQrcode}/>
        <SidebarElement link="/search" text="Schüler*in suchen" permissions={["students.search"]} icon={faMagnifyingGlass}/>
        <SidebarElement link="/settings" text="Einstellungen" permissions={["admin.users", "admin.applications"]} icon={faGears}/>
        <div className='spacer'></div>
        <SidebarElement link="/auth/logout" text="Abmelden" permissions={["login"]} linkOut={true} icon={faRightFromBracket} />
    </div>
  );
}

export default Sidebar;