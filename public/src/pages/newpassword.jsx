import React from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import crypto from "crypto-js";
import { useNavigate, useLocation } from "react-router-dom";
import { resetpassword } from "../utils/APIRoutes";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useJwt } from "react-jwt";
const im = require("../assets/im.jpg");
const ENCRYPTION_KEY = process.env.REACT_APP_KEY;

function decrypt(data) {
  const bytes = crypto.AES.decrypt(data, process.env.REACT_APP_KEY);
  return bytes.toString(crypto.enc.Utf8);
}

export default function Newpassword() {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search); // Correctly initialize URLSearchParams
  const encryptedId = queryParams.get("data");

  const id = encryptedId ? decrypt(encryptedId) : null;
  const toastOptions = {
    position: "bottom-right",
    autoClose: 4000,
    pauseOnHover: true,
    draggable: true,
    theme: "dark",
  };

  const handleValidation = (event) => {
    const password = event.target.elements.password.value;
    const confirmPassword = event.target.elements.confirmPassword.value;
    if (password !== confirmPassword) {
      toast.error(
        "Password and confirm password should be same.",
        toastOptions
      );
      return false;
    } else if (password.length < 5) {
      toast.error(
        "Password should be equal or greater than 5 characters.",
        toastOptions
      );
      return false;
    }
    return true;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (handleValidation(event)) {
      const password = event.target.elements.password.value;
      const id = decrypt(encryptedId);
      const { data } = await axios.post(resetpassword, {
        id,
        password,
      });

      if (data.status === false) {
        toast.error(data.msg, toastOptions);
      }
      if (data.status === true) {
        toast.success(data.msg, toastOptions);
        navigate("/login");
      }
    }
  };

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-circuit bg-[#242424]">
        <div className=" max-w-md mx-auto bg-[#F8E7D5] rounded-xl shadow-xl border border-gray-300 overflow-hidden md:max-w-2xl">
          <div className="md:grid md:grid-cols-2">
            <div className="md:shrink-0">
              <img
                className="h-48 w-full object-cover md:h-full "
                src={im}
                alt="Basketball Illusion"
              />
            </div>
            <div className="p-8">
              <div className="p-8">
                <h2 className="font-dongpora text-6xl text-[#F1853B]">
                  Reset Password
                </h2>
                <p className="text-lg py-1 text-gray-500">Welcome to LNM-Q</p>
                <form
                  className="space-y-5 mt-5"
                  action=""
                  onSubmit={(event) => handleSubmit(event)}
                >
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Password"
                    name="password"
                  />
                  <input
                    type="password"
                    className="w-full p-3 border border-gray-300 rounded-md"
                    placeholder="Confirm Password"
                    name="confirmPassword"
                  />
                  <button
                    className="w-full p-3 bg-[#1E75D5] text-white rounded-md"
                    type="submit"
                  >
                    Change Password
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
}
