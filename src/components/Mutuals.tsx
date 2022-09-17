import { Button, Box, HStack } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

interface Mutual {
  id: string;
  name: string;
  username: string;
}

interface Props {
  userId: string;
  targetId: string;
}

export const Mutuals = ({ userId, targetId }: Props) => {
  const [loading, setLoading] = useState(false);
  const [mutuals, setMutuals] = useState<any[]>([]);
  const { data: session } = useSession();

  useEffect(() => {
    if (!userId) return;
    if (!targetId) return;
    if (!loading) return;
    const fetchMutuals = async (userId: string, targetId: string) => {
      fetch(`/api/mutuals/${userId}/${targetId}`, {
        method: 'GET',
        headers: {
          'x-access-token': session?.access_token,
        } as any,
      })
        .then((res) => res.json())
        .then(({ mutuals }) => {
          setMutuals(mutuals)
        });
    }

    fetchMutuals(userId, targetId);
    setLoading(false);
  }, [loading, session?.access_token, targetId, userId]);

  return (
    <HStack
      w={'100%'}
      justifyContent={'center'}
    >
      <Button
        colorScheme={'red'}
        onClick={async () => {
          setLoading(true);
        }}
      >
        List Mutuals {Number(mutuals.length)}
      </Button>
      {!!mutuals.length && mutuals.map(({ id, name, username }:Mutual) => {
        return (
          <Box
            bg={'gray.100'}
            key={id}>
            {name}, {username}
          </Box>
        );
      })}
    </HStack>
  );
}
