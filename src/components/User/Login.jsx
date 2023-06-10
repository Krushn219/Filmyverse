import React, { useContext, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link, useNavigate } from "react-router-dom";
import swal from "sweetalert";
import { query, where, getDocs } from "firebase/firestore";
import { userCollection } from "../../firebase/firebase";
import bcrypt from "bcryptjs";
import { AppState } from "../../App";

const Login = () => {
  const useAppState = useContext(AppState);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const login = async () => {
    setLoading(true);
    try {
      const que = query(userCollection, where("mobile", "==", form.mobile));
      const queryShot = await getDocs(que);

      queryShot.forEach((doc) => {
        const _data = doc.data();

        const isUser = bcrypt.compareSync(form.password, _data.password);

        if (isUser) {
          useAppState.setLogin(true);
          useAppState.setUserName(_data.name);

          swal({
            title: "Login Successfully",
            icon: "success",
            buttons: false,
            timer: 3000,
          });
          navigate("/");
        } else {
          swal({
            title: "Invalid Credentials",
            icon: "error",
            buttons: false,
            timer: 3000,
          });
        }
      });
    } catch (error) {
      swal({
        title: error.message,
        icon: "error",
        buttons: false,
        timer: 3000,
      });
    }
    setLoading(false);
  };
  return (
    <>
      <div className="w-full flex flex-col mt-20 md:mt-52 items-center">
        <h1 className="text-xl font-bold">Login</h1>
        <div class="p-2 w-full md:w-1/2 lg:w-1/4 md:mt-8 md:mb-6">
          <div class="relative">
            <label for="name" class="leading-7 text-sm text-gray-300">
              Mobile
            </label>
            <input
              type={"number"}
              id="name"
              name="name"
              value={form.mobile}
              onChange={(e) => setForm({ ...form, mobile: e.target.value })}
              class="w-full bg-white  rounded border border-gray-300 focus:border-indigo-500  focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <div class="p-2 w-full md:w-1/2 lg:w-1/4 md:mb-4">
          <div class="relative">
            <label for="name" class="leading-7 text-sm text-gray-300">
              Password
            </label>
            <input
              type="text"
              id="name"
              name="password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              class="w-full bg-white  rounded border border-gray-300 focus:border-indigo-500  focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
            />
          </div>
        </div>
        <button
          onClick={login}
          class="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-700 rounded text-lg mt-4 mb-4 transition-all duration-500 cursor-pointer"
        >
          {loading ? <TailSpin height={25} color="white" /> : "Login"}
        </button>
        <div className="mt-2">
          <p>
            Do not have an Account ?
            <Link to={"/signup"}>
              <span className="text-blue-500 ml-1 cursor-pointer">Sign Up</span>
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
