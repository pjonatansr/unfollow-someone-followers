import { Button, Box, Tag, TagLabel, CheckboxGroup, Checkbox, Link, VStack, Flex, ButtonGroup } from "@chakra-ui/react";
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
  const [sendBatch, setSendBatch] = useState(false);
  const [mutuals, setMutuals] = useState<Mutual[]>([]);
  const [selectedMutuals, setSelectedMutuals] = useState<Record<string, boolean>>({});
  const { data: session } = useSession();
  function toggleMutuals(mutual: Mutual) {
    const { id } = mutual;

    return (e: any): void => {
      const { checked } = e.target;
      if (!checked) {
        return setSelectedMutuals({
          ...selectedMutuals,
          [id]: true
        });
      }

      const { [id]: _, ...rest } = selectedMutuals;
      setSelectedMutuals(rest);
    };
  };
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

  useEffect(() => {
    console.log({ session, userId, sendBatch })
    if (!session?.access_token) return;
    if (!userId) return;
    if (!sendBatch) return;

    const sendBatchUnfollow = async (userId: string, ids: string[]) => {
      fetch(`/api/unfollow/${userId}/mutuals`, {
        method: 'POST',
        headers: {
          'x-access-token': session?.access_token,
        } as any,
        body: JSON.stringify({ ids })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log({ data });
        })
        .catch((error) => {
          console.error({ error })
          setSendBatch(false)
        });
    }

    const unfollowTargets = mutuals
      .map(({ id }) => id)
      .filter(id => !selectedMutuals[id]);

    console.log({ unfollowTargets });

    sendBatchUnfollow(userId, unfollowTargets);
  }, [sendBatch, session?.access_token, userId, selectedMutuals, mutuals, session]);


  return (
    <VStack
      w={'100%'}
    >
      <ButtonGroup
        variant={'outline'}
        spacing={4}
      >
        <Button
          colorScheme={'twitter'}
          onClick={async () => {
            setLoading(true);
          }}
        >
          Show Mutuals
        </Button>
        <Button
          disabled={!!sendBatch || mutuals.length === Object.keys(selectedMutuals).length}
          colorScheme={'red'}
          onClick={async () => {
            setSendBatch(true);
          }}
        >
          {sendBatch ? 'Wait 15 minutes...' : 'Unfollow Selected'}
        </Button>
      </ButtonGroup>

      <CheckboxGroup>
        <Flex
          p={2}
          gap={2}
          w={'100%'}
          border={'1px'}
          bg={'gray.50'}
          flexWrap={'wrap'}
          borderRadius={'md'}
          borderColor={'gray.200'}
          justifyContent={'center'}
        >
          {!!mutuals.length && mutuals.map((mutual: Mutual) => {
            const { id, username } = mutual;
            return (
              <Box
                w={'8em'}
                key={id}
              >
                <Checkbox
                  defaultChecked
                  key={username + id}
                  colorScheme='twitter'
                  onChange={toggleMutuals(mutual)}
                >
                    <Tag
                      size={'sm'}
                      borderRadius='full'
                      variant='subtle'
                      colorScheme='twitter'
                    >
                      <TagLabel>
                      <Link
                        isExternal
                        href={`https://twitter.com/${username}`}
                        >
                        @{username}
                        </Link>
                      </TagLabel>
                    </Tag>
                </Checkbox>
              </Box>
            );


          })}
        </Flex>
      </CheckboxGroup>


    </VStack>
  );
}
