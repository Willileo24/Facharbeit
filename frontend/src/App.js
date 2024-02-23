import { BrowserRouter as Router } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';

import './App.css';
import Sidebar from './Sidebar';
import ReadView from './views/ReadView';
import SearchView from './views/SearchView';
import { selectUser, setUser } from './features/userSlice';
import { useEffect } from 'react';
import SettingsView from './views/SettingsView';
import { hasPermission } from './features/permissions';

function App() {
  const user = useSelector(selectUser);
  const dispatch = useDispatch();

  useEffect(() => {
    axios.get('/auth/userInfo')
    .then((response) => {
      if (response.data.userId) {
        dispatch(setUser(response.data));
      } else {
        dispatch(setUser(null));
        window.location = "/auth/login";
        return;
      }
    })
    .catch((err) => {
      console.log(err);
    });
  }, [dispatch]);

  return (
    <Router>
      { user && user.permissions && hasPermission(user.permissions, "login") ? (
        <>
          <Sidebar />
          <div className='content'>
            <ReadView />
            <SearchView />
            <SettingsView />
          </div>
        </>
      ) : null}
    </Router>
  );
}

export default App;
