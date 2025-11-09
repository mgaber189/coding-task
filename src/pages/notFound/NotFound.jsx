import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "antd";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-purple-100 px-4">
      <div className="bg-white shadow-2xl rounded-3xl p-10 text-center max-w-md">
        <h1 className="text-7xl font-extrabold text-gray-800 mb-4 animate-bounce">
          404
        </h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-6">
          Oops! Page Not Found
        </h2>
        <p className="text-gray-500 mb-6">
          The page you are looking for does not exist or has been moved.
        </p>
        <Button
          type="primary"
          size="large"
          onClick={() => navigate("/")}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg px-6 py-3 transition-all"
        >
          Go Back Home
        </Button>
      </div>

      <div className="mt-10">
        <img
          src="https://cdn.dribbble.com/users/285475/screenshots/2083086/dribbble_1.gif"
          alt="Not Found Illustration"
          className="w-80 mx-auto"
        />
      </div>
    </div>
  );
};

export default NotFound;
