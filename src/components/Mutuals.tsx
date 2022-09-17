import { Button, Box, HStack, Input, Tag, TagCloseButton, TagLabel, Grid, GridItem, Switch, FormControl, FormHelperText, FormLabel, CheckboxGroup, Checkbox, Link, VStack, Stack, Flex } from "@chakra-ui/react";
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
  const [selectedMutuals, setSelectedMutuals] = useState<Record<string, Mutual>>({});
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
    <VStack
      w={'100%'}
    >
      <Button
        colorScheme={'twitter'}
        variant={'outline'}
        onClick={async () => {
          setLoading(true);
        }}
      >
        List Mutuals
      </Button>

      <CheckboxGroup>
        <Flex
          w={'100%'}
          flexWrap={'wrap'}
          gap={2}
          justifyContent={'space-between'}
        >
          {!!mutuals.length && mutuals.map((mutual: Mutual) => {
            const { id, username } = mutual;
            return (
              <Box
                key={id}
              >
                <Flex
                  justifyContent={'flex-start'}
                >
                  <Checkbox
                    key={username + id}
                    defaultChecked
                    colorScheme='twitter'
                    onChange={(e) => {
                      const { checked } = e.target;
                      if (!checked) {
                        setSelectedMutuals({
                          ...selectedMutuals,
                          [id]: mutual
                        })
                      } else {
                        const { [id]: _, ...rest } = selectedMutuals;
                        setSelectedMutuals(rest);
                      }
                    }}
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
                </Flex>
              </Box>
            );
          })}
        </Flex>
      </CheckboxGroup>


    </VStack>
  );
}
