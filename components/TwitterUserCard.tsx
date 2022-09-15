import { Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';

interface Props {
  reverse?: boolean;
  user?: {
    username?: string;
    profile_image_url?: string;
    name?: string;
    followers_count?: number;
    following_count?: number;
  }
}

export const TwitterUserCard = ({ reverse, user }: Props): JSX.Element => {
  const { username, profile_image_url, name, followers_count, following_count } = user || {};

  return (
    <Flex
      p={1}
      w={'100%'}
      bg={'gray.100'}
      alignItems={'center'}
      justifyContent={'space-between'}
      flexDirection={!!reverse ? 'row-reverse' : 'row'}
    >
      <Image
        src={profile_image_url || '/avatar.webp'}
        alt="logo"
        h={'15vh'}
        borderRadius={'full'}
      />
      <VStack
        alignItems={!!reverse ? 'flex-start' : 'flex-end'}
        pl={1}
        pr={1}
      >
        <Text
          fontWeight={'bold'}
        >
          {name || 'Your Name'}
        </Text>
        <Text
        >
          @{username || 'yourname'}

        </Text>
        <HStack
          spacing={2}
          fontSize={'sm'}
          w={'full'}
        >
          <Text>
            {following_count || 0}  Following
          </Text>
          <Text>
            {followers_count || 0} Followers
          </Text>
        </HStack>
      </VStack>
    </Flex>
  );
}
