import { useLocation } from "react-router-dom";
import { useEffect } from "react";

interface NotFoundProps {
  currentAge: string;
  currentEmpcount: number;
  currentEmpnames: string[];
}

const NotFound = ({ currentAge, currentEmpcount, currentEmpnames }: NotFoundProps) => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <p className="text-xl text-gray-600 mb-4">Current age: {currentAge}</p>
        <p className="text-xl text-gray-600 mb-4">Current employee count: {currentEmpcount}</p>
        <p className="text-xl text-gray-600 mb-4">Current employee names: {currentEmpnames.length > 0 ? currentEmpnames.join(", ") : "No employees found"}</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
  );
};

export default NotFound;
