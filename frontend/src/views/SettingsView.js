import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import './SettingsView.css';
import PermissionEntry from './PermissionEntry';
import axios from 'axios';
import ApplicationEntry from './ApplicationEntry';
import AddApplicationPopup from './AddApplicationPopup';
import Popup from './Popup';
import { hasPermission } from '../features/permissions';
import { useSelector } from 'react-redux';
import { selectUser } from '../features/userSlice';

function SettingsView() {
  const pathname = useLocation().pathname;
  const user = useSelector(selectUser);
  const [entries, setEntries] = useState([]);
  const [popup, setPopup] = useState(null);

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
    } else if (pathname.startsWith("/settings/apps")) {
      axios.get("/api/system/getApps")
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
        { hasPermission(user.permissions, "admin.users") ? (
          <>
            <Link to={"/settings/users"} className={(pathname.startsWith("/settings/users") ? "active" : null)}>Benutzerberechtigungen</Link>
            <Link to={"/settings/groups"} className={(pathname.startsWith("/settings/groups") ? "active" : null)}>Gruppenberechtigungen</Link>
          </>
        ) : null}
        { hasPermission(user.permissions, "admin.applications") ? (
          <Link to={"/settings/apps"} className={(pathname.startsWith("/settings/apps") ? "active" : null)}>Externe Anwendungen</Link>
        ) : null}
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
        {pathname.startsWith("/settings/apps") ? (
          <>
            {entries.map((entry) => {
              return (
                <ApplicationEntry id={entry.id} name={entry.name} permissions={entry.permissions} onDelete={() => {
                  axios.get("/api/system/getApps")
                    .then((response) => {
                      setEntries(response.data);
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }} />
              )
            })}
            <button onClick={() => setPopup(<AddApplicationPopup onFinish={() => {
              axios.get("/api/system/getApps")
                .then((response) => {
                  setEntries(response.data);
                })
                .catch((err) => {
                  console.log(err);
                });
              setPopup(null);
              }}/>)}>Anwendung hinzufügen</button>
          </>
        ) : null}
      </div>
      {
        popup ? (
          <Popup content={popup} onClose={() => setPopup(null)}/>
        ) : null
      }
    </div>
  );
}

export default SettingsView;