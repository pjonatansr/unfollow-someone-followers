import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

export const UserFollowers = () => {
  const { data: session } = useSession();
  const [followers, setFollowers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (session) {
      fetch('/api/followers')
        .then((res) => res.json())
        .then((data) => {
          setFollowers(data);
          setLoading(false);
        })
        .catch((err) => {
          setError(err);
          setLoading(false);
        });
    }
  }
    , [session]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Failed to load</div>;

  return (
    <div>
      <h1>Followers</h1>
      <ul>
        {followers.map((follower: any) => (
          <li key={follower.id}>{follower.name}</li>
        ))}
      </ul>
    </div>
  );
}