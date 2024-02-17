import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import Sidebar from './Sidebar';
import ReadView from './views/ReadView';

function App() {
  return (
    <Router>
      <Sidebar />
      <div className='content'>
        <ReadView />
      </div>
    </Router>
  );
}

export default App;
