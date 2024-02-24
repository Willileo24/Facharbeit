import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './SettingsView.css';
import PermissionEntry from './PermissionEntry';
import axios from 'axios';

function SettingsView() {
  const pathname = useLocation().pathname;
  const [entries, setEntries] = useState([]);

  useEffect(() => {
    if (pathname.startsWith("/settings/users")) {
      axios.get("/api/system/getUsers")
      .then((response) => {
        setEntries(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    } else if (pathname.startsWith("/settings/groups")) {
      axios.get("/api/system/getGroups")
      .then((response) => {
        setEntries(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
    } else {
      setEntries([]);
    }
  }, [pathname]);

  if (!pathname.startsWith("/settings")) {
    return;
  }

  return (
    <div className='settingsView'>
      <div className='header'>
        <Link to={"/settings/users"} className={(pathname.startsWith("/settings/users") ? "active" : null)}>Benutzerberechtigungen</Link>
        <Link to={"/settings/groups"} className={(pathname.startsWith("/settings/groups") ? "active" : null)}>Gruppenberechtigungen</Link>
      </div>
      <div className='permissionList'>
        {pathname.startsWith("/settings/users") ? (
          entries.map((entry) => {
            return (
              <PermissionEntry type="user" id={entry.id} name={entry.displayName} permissions={entry.permissions} />
            )
          })
        ) : null}
        {pathname.startsWith("/settings/groups") ? (
          entries.map((entry) => {
            return (
              <PermissionEntry type="group" id={entry.groupName} name={entry.groupName} permissions={entry.permissions} />
            )
          })
        ) : null}
      </div>
    </div>
  );
}

export default SettingsView;