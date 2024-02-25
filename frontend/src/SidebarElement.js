import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SidebarElement.css';
import { useSelector } from 'react-redux';
import { selectUser } from './features/userSlice';
import { hasPermission } from './features/permissions';

function SidebarElement({ text, link, icon, permissions, linkOut }) {
  const location = useLocation();
  const user = useSelector(selectUser);

    var classNames = 'sidebarElement';
    if(location.pathname.startsWith(link)) {
        classNames += ' active';
    }

    var hasPerm = false;
    for (var i = 0; i < permissions.length; i++) {
      if (hasPermission(user.permissions, permissions[i])) {
        hasPerm = true;
        break;
      }
    }
    if (!hasPerm) {
      return;
    }

    if (linkOut) {
      return (
        <a href={link} className={classNames}>
          <FontAwesomeIcon icon={icon} />
          {text}
        </a>
      );
    } else {
      return (
        <Link to={link} className={classNames}>
          <FontAwesomeIcon icon={icon} />
          {text}
        </Link>
      );
    }
}

export default SidebarElement;