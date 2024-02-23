import React from 'react';
import { faQrcode, faMagnifyingGlass, faGears, faRightFromBracket } from '@fortawesome/free-solid-svg-icons';

import './Sidebar.css';
import SidebarElement from './SidebarElement';

function Sidebar() {
  return (
    <div className='sidebar'>
        <SidebarElement link="/read" text="Ausweis lesen" permission="students.view" icon={faQrcode}/>
        <SidebarElement link="/search" text="Schüler*in suchen" permission="students.search" icon={faMagnifyingGlass}/>
        <SidebarElement link="/settings" text="Einstellungen" permission="admin.users" icon={faGears}/>
        <div className='spacer'></div>
        <SidebarElement link="/auth/logout" text="Abmelden" permission="login" linkOut={true} icon={faRightFromBracket} />
    </div>
  );
}

export default Sidebar;