import { createContext, useContext, useEffect, useState } from "react";
import Cookies from "js-cookie";
import { loginWithEmail, currentAdmin } from "@/functions/auth";

const AuthContext = createContext<any>({});
const auth = "";

export const useAuth = () => useContext(AuthContext);

export const AuthContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("access_token");
    // const unsubscribe = onAuthStateChanged(auth, (user) => {
    //   if (user) {
    //     setCurrentUser({
    //       uid: user.uid,
    //       email: user.email,
    //       displayName: user.displayName,
    //     })
    //   } else {
    //     setCurrentUser(null)
    //   }
    //   setLoading(false)
    // })
    currentAdmin(token).then((res) => {
      // console.log('RES ADMIN', res.data)
      if (res) {
        setCurrentUser({
          uid: res.data._id,
          email: res.data.email,
          displayName: res.data.displayName,
        });
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
  }, []);

  async function signup(email: string, password: string, name: string) {
    try {
      const user = false;

      if (user) {
        // Update profile

        setCurrentUser({
          user,
        });

        console.log("Signup successful:", user);
      } else {
        console.error("Signup error: User is null");
      }
    } catch (error) {
      console.error("Signup error:", error);
    }
  }

  const login = (email: string, password: string) => {
    return loginWithEmail(auth, email, password);
  };

  const logout = async () => {
    setCurrentUser(null);
    // await signOut(auth)
  };

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout }}>
      {loading ? null : children}
    </AuthContext.Provider>
  );
};
