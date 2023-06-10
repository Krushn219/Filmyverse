import React, { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { Link } from "react-router-dom";
import {
  getAuth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "firebase/auth";
import app, { userCollection } from "../../firebase/firebase";
import swal from "sweetalert";
import bcrypt from "bcryptjs";
import { addDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const auth = getAuth(app);
const Signup = () => {
  const [form, setForm] = useState({
    name: "",
    mobile: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [OTP, setOTP] = useState("");
  const navigate = useNavigate();

  const generateRecaptha = () => {
    window.recaptchaVerifier = new RecaptchaVerifier(
      "recaptcha-container",
      {
        size: "normal",
        callback: (response) => {
          // reCAPTCHA solved, allow signInWithPhoneNumber.
          // ...
        },
      },
      auth
    );
  };

  const requestOtp = () => {
    setLoading(true);
    generateRecaptha();
    let appVerifier = window.recaptchaVerifier;
    signInWithPhoneNumber(auth, `+91${form.mobile}`, appVerifier)
      .then((confirmationResult) => {
        window.confirmationResult = confirmationResult;
        swal({
          title: "OTP sent",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        setOtpSent(true);
        setLoading(false);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  const verifyOTP = () => {
    try {
      setLoading(true);
      window.confirmationResult.confirm(OTP).then((result) => {
        uploadDta();
        swal({
          title: "OTP Verified, Successfully registered",
          icon: "success",
          buttons: false,
          timer: 3000,
        });
        navigate("/login");
        setLoading(false);
      });
    } catch (error) {
      swal({
        title: error.mrssage,
        icon: "error",
        buttons: false,
        timer: 3000,
      });
    }
  };

  const uploadDta = async () => {
    try {
      var salt = bcrypt.genSaltSync(10);
      var hash = bcrypt.hashSync(form.password, salt);
      await addDoc(userCollection, {
        name: form.name,
        password: hash,
        mobile: form.mobile,
      });
    } catch (error) {
      console.log("error", error.message);
    }
  };

  return (
    <>
      <div className="w-full flex flex-col mt-20 md:mt-52 items-center">
        <h1 className="text-xl font-bold">Sign Up</h1>
        {otpSent ? (
          <>
            <div class="p-2 w-full md:w-1/2 lg:w-1/4">
              <div class="relative">
                <label for="name" class="leading-7 text-sm text-gray-300">
                  OTP
                </label>
                <input
                  type="text"
                  id="name"
                  name="otp"
                  value={OTP}
                  onChange={(e) => setOTP(e.target.value)}
                  class="w-full bg-white  rounded border border-gray-300 focus:border-indigo-500  focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <button
              onClick={verifyOTP}
              class="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-700 rounded text-lg mt-4 mb-4 transition-all duration-500 cursor-pointer"
            >
              {loading ? <TailSpin height={25} color="white" /> : "Confirm OTP"}
            </button>
          </>
        ) : (
          <>
            <div class="p-2 w-full md:w-1/2 lg:w-1/4">
              <div class="relative">
                <label for="name" class="leading-7 text-sm text-gray-300">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  class="w-full bg-white  rounded border border-gray-300 focus:border-indigo-500  focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <div class="p-2 w-full md:w-1/2 lg:w-1/4">
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
            <div class="p-2 w-full md:w-1/2 lg:w-1/4">
              <div class="relative">
                <label for="password" class="leading-7 text-sm text-gray-300">
                  Password
                </label>
                <input
                  type={"password"}
                  id="password"
                  name="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  class="w-full bg-white  rounded border border-gray-300 focus:border-indigo-500  focus:ring-2 focus:ring-indigo-200 text-base outline-none text-gray-700 py-1 px-3 leading-8 transition-colors duration-200 ease-in-out"
                />
              </div>
            </div>
            <button
              onClick={requestOtp}
              class="flex mx-auto text-white bg-red-500 border-0 py-2 px-8 focus:outline-none hover:bg-red-700 rounded text-lg mt-4 mb-4 transition-all duration-500 cursor-pointer"
            >
              {loading ? <TailSpin height={25} color="white" /> : "Request OTP"}
            </button>
          </>
        )}
        <div className="mt-2">
          <p>
            Already have an Account ?
            <Link to={"/login"}>
              <span className="text-blue-500 ml-1 cursor-pointer">Login</span>
            </Link>
          </p>
        </div>
        <div id="recaptcha-container" className="mt-8"></div>
      </div>
    </>
  );
};

export default Signup;
