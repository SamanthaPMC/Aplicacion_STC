// authService.ts
import {initializeApp} from 'firebase/app';
import { firebaseConfig } from '../config/firebase/firebaseConfig';
import { get, getDatabase, ref, set, update } from 'firebase/database';

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Exportar servicios necesarios
export const database = getDatabase(app);

export const register = async ( nombreApellido: string, ci: number, telefono: number, email: string ): Promise<string> => {
    try {
      const userRef = ref(database, `users/${ci}`);
  
      const snapshot = await get(userRef);
      if (snapshot.exists()) {
        return "El usuario ya está registrado.";
      }
  
      await set(userRef, {
        nombreApellido,
        email,
        telefono,
      });
  
      return "Usuario registrado exitosamente.";
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      return "Error al registrar usuario.";
    }
  };

  export const modificar = async (
    nombreApellido: string,
    ci: number|string,
    telefono: number|string,
    email: string
  ): Promise<string> => {
    try {
      const userRef = ref(database, `users/${ci}`);
  
      const snapshot = await get(userRef);
      if (!snapshot.exists()) {
        return "El usuario no existe.";
      }
  
      await update(userRef, {
        nombreApellido,
        email,
        telefono,
      });
  
      return "Usuario actualizado exitosamente.";
    } catch (error) {
      console.error("Error al modificar usuario:", error);
      return "Error al modificar usuario.";
    }
  };

  export const verifition = async(ci:number) =>{
    const userRef = ref(database, `users/${ci}`);
    const snapshot = await get(userRef);
    if (snapshot.exists()) {
      return true;
    }else 
        return false;
  }


  export const signInAdmin = async (User: string, Password: string) => {
    try {
      const userRef = ref(database, "Admin");
  
      const snapshot = await get(userRef);
  
      if (snapshot.exists()) {
        const data = snapshot.val();
        if (data.Usuario === User && data.Contraseña === Password) {
          return { success: true, message: "Inicio de sesión exitoso" };
        } else {
          return { success: false, message: "Usuario o contraseña incorrectos" };
        }
      } else {
        return { success: false, message: "No se encontraron datos de administrador" };
      }
    } catch (error) {
      return { success: false, message: "Error al iniciar sesión", error };
    }
  };

  export const signIn = async (ci: number): Promise<string | null> => {
    try {
      const userRef = ref(database, `users/${ci}`);
  
      const snapshot = await get(userRef);
      const userData = snapshot.val();
      console.log("Datos del usuario:", userData);
      return "Inicio de sesión exitoso.";
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      return null;
    }
  };
  