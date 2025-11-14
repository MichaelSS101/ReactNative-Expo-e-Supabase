import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "../lib/supabase";

interface AuthContextProps {
  session: any | null;
  user: any | null;
  loading: boolean;
  signOut: () => Promise<void>;
  setAuth: (session: any) => void;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export function AuthProvider({ children }: AuthProviderProps) {
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  
  const user = session?.user ?? null; 

  useEffect(() => {
    async function loadSession() {
      try {
        const saved = await AsyncStorage.getItem("session");

        if (saved) {
          setSession(JSON.parse(saved));
        }
      } catch (err) {
        console.log("Erro ao carregar sessão:", err);
      }

      setLoading(false);
    }

    loadSession();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_, newSession) => {
        if (newSession) {
          await AsyncStorage.setItem("session", JSON.stringify(newSession));
          setSession(newSession);
        } else {
          await AsyncStorage.removeItem("session");
          setSession(null);
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  async function signOut() {
    await supabase.auth.signOut();
    await AsyncStorage.removeItem("session");
    setSession(null);
  }

  function setAuth(sess: any) {
    setSession(sess);
  }

  return (
    <AuthContext.Provider value={{ session, user, loading, signOut, setAuth }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}