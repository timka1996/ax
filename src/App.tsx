import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import ContactList from "./components/ContactList";
import ContactDetails from "./components/ContactDetails";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<ContactList />} />
        <Route path="/contact/:id" element={<ContactDetails />} />
      </Routes>
    </Router>
  );
}

export default App;
