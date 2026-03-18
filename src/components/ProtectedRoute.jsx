import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { Navigate } from "react-router-dom";
 
export default function ProtectedRoute({ children }) {
  const [user, setUser] = useState(undefined); // undefined = loading
 
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);
 
  // Loading state
  if (user === undefined) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a3a5c] to-[#2563a8] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="w-12 h-12 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4" />
          <p className="font-semibold">Loading...</p>
        </div>
      </div>
    );
  }
 
  // Not logged in → redirect to login
  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }
 
  // Logged in → show the protected page
  return children;
}