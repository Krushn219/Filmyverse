import Cards from "./components/Cards/Cards";
import Header from "./components/Header/Header";
import { Routes, Route } from "react-router-dom";
import AddMovie from "./components/AddMovie/AddMovie";
import Detail from "./components/DetailMovie/Detail";
import Login from "./components/User/Login";
import Signup from "./components/User/Signup";
import { createContext, useState } from "react";
// require("dotenv").config();

const AppState = createContext();

function App() {
  const [login, setLogin] = useState(false);
  const [userName, setUserName] = useState("");
  return (
    <AppState.Provider value={{ login, setLogin, userName, setUserName }}>
      <>
        <div className="App relative">
          <Header />
          <Routes>
            <Route exact path="/" element={<Cards />} />
            <Route path="/addMovie" element={<AddMovie />} />
            <Route path="/detail/:id" element={<Detail />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Routes>
        </div>
      </>
    </AppState.Provider>
  );
}

export default App;
export { AppState };
