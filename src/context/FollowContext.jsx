import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const FollowContext = createContext();

export function FollowProvider({ children }) {
  const [followers, setFollowers] = useState(null);
  const [following, setFollowing] = useState(null);

  const refreshFollowStats = async () => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user?.id) return;

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/follow/stats/${user.id}`
      );

      setFollowers(response.data.followers);
      setFollowing(response.data.following);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    refreshFollowStats();
  }, []);

  return (
    <FollowContext.Provider
      value={{
        followers,
        following,
        refreshFollowStats,
      }}
    >
      {children}
    </FollowContext.Provider>
  );
}

export function useFollow() {
  return useContext(FollowContext);
}