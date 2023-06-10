import React, { useContext } from "react";
import AddIcon from "@mui/icons-material/Add";
import { Button } from "@mui/material";
import { Link } from "react-router-dom";
import "./header.css";
import { AppState } from "../../App";

const Header = () => {
  const useAppState = useContext(AppState);
  return (
    <>
      <div className="header sticky z-10 top-0 bg-black flex justify-between items-center font-bold text-red-500  p-3 border-b-2 border-gray-500">
        <Link to={"/"}>
          <span className="text-3xl">
            Filmy<span className="text-white">Verse</span>
          </span>
        </Link>
        {useAppState.login ? (
          <Link to={"/addmovie"}>
            <h1 className="test-lg text-white flex items-center">
              <Button>
                <AddIcon className="mr-1" color="secondary" />
                <span className="text-white">Add New</span>
              </Button>
            </h1>
          </Link>
        ) : (
          <Link to={"/login"}>
            <h1 className="test-lg text-white flex items-center bg-green-500 hover:bg-green-700 transition-all duration-500">
              <Button>
                <span className="text-white font-medium capitalize">Login</span>
              </Button>
            </h1>
          </Link>
        )}
      </div>
    </>
  );
};

export default Header;
