
const getCurrentUser = () => {
  if (typeof window !== 'undefined') {
    const storedUser = localStorage.getItem('fintrack_current_user');
    if (storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.warn("Failed to parse stored user:", error);
      }
    }
    

    const newUser = {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: `User ${Math.floor(Math.random() * 1000)}`,
      email: `user-${Date.now()}@fintrack.example`
    };
    

    localStorage.setItem('fintrack_current_user', JSON.stringify(newUser));
    return newUser;
  }
  
  return {
    id: "demo-user",
    name: "Demo User",
    email: "demo@example.com"
  };
};

export const auth = async () => {
  return {
    user: getCurrentUser()
  };
};

export function signIn(userData?: { id?: string; name: string; email: string }) {
  if (typeof window !== 'undefined') {
    const newUser = userData ? {
      ...userData,
      id: userData.id || `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    } : {
      id: `user-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      name: `User ${Math.floor(Math.random() * 1000)}`,
      email: `user-${Date.now()}@fintrack.example`
    };
    
    localStorage.setItem('fintrack_current_user', JSON.stringify(newUser));
  }
  
  return { success: true };
};

export const signOut = async () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('fintrack_current_user');
  }
  
  return { success: true };
};

export const getCurrentUserInfo = () => {
  return getCurrentUser();
};
