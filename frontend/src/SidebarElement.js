import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SidebarElement.css';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import { hasPermission } from './features/permissions';

function SidebarElement({ text, link, icon, permission }) {
  const location = useLocation();
  const user = useSelector(selectUser);

    var classNames = 'sidebarElement';
    if(location.pathname.startsWith(link)) {
        classNames += ' active';
    }

    if (!hasPermission(user.permissions, permission)) {
      return;
    }

    return (
      <Link to={link} className={classNames}>
        <FontAwesomeIcon icon={icon} />
        {text}
      </Link>
    );
}

export default SidebarElement;