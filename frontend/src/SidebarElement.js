import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './SidebarElement.css';

function SidebarElement({ text, link, icon }) {
  const location = useLocation();

    var classNames = 'sidebarElement';
    if(location.pathname === link) {
        classNames += ' active';
    }
  return (
    <Link to={link} className={classNames}>
      <FontAwesomeIcon icon={icon} />
      {text}
    </Link>
  );
}

export default SidebarElement;