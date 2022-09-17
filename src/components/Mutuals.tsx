import { Button, Box, HStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";

interface Props {
  userId: string;
  targetId: string;
}

export const Mutuals = ({ userId, targetId }: Props) => {
  const [loading, setLoading] = useState(false);
  const [mutuals, setMutuals] = useState<any[]>([]);

  useEffect(() => {
    if (!userId) return;
    if (!targetId) return;
    if (!loading) return;
    const fetchMutuals = async (userId: string, targetId: string) => {
      fetch(`/api/mutuals/${userId}/${targetId}`)
        .then((res) => res.json())
        .then(({ mutuals }) => {
          setMutuals(mutuals)
        });
    }

    fetchMutuals(userId, targetId);
    setLoading(false);
  }, [loading, targetId, userId]);

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
      {!!mutuals.length && mutuals.map((mutual, key) => {
        return (
          <Box
            bg={'gray.100'}
            key={key}>
            {mutual}
          </Box>
        );
      })}
    </HStack>
  );
}
