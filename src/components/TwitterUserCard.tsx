import { Flex, HStack, Text, VStack } from '@chakra-ui/react';
import { Image } from '@chakra-ui/react';
import { TwitterUser } from '@src/types';

interface Props {
  reverse?: boolean;
  user?: TwitterUser;
}

export const TwitterUserCard = ({ reverse, user }: Props): JSX.Element => {
  const { username, profile_image_url, name, public_metrics } = user || {};
  const { followers_count, following_count } = public_metrics || {};
  if (!user) {
    return <></>;
  }

  return (
    <Flex
      p={1}
      w={'100%'}
      bg={!reverse ? 'gray.100' : 'red.100'}
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
