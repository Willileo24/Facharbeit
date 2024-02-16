import { BrowserRouter as Router } from 'react-router-dom';

import './App.css';
import Sidebar from './Sidebar';

function App() {
  return (
    <Router>
      <Sidebar />
    </Router>
  );
}

export default App;
