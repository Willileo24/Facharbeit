import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import Sidebar from './Sidebar';
import ReadView from './views/ReadView';
import SearchView from './views/SearchView';

function App() {
  return (
    <Router>
      <Sidebar />
      <div className='content'>
        <ReadView />
        <SearchView />
      </div>
    </Router>
  );
}

export default App;
