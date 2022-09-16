import { Button } from '@chakra-ui/react';
import { signIn, signOut, useSession } from 'next-auth/react';

export const TwitterLogin = () => {
  const { data: session } = useSession();

  type ButtonProps = {
    [index: string]: {
      onClick: () => Promise<undefined>;
      colorScheme: string;
      text: string;
    };
  };

  const buttonProps: ButtonProps = {
    login: {
      onClick: async (): Promise<undefined> => {
        signIn('twitter');
        return;
      },
      colorScheme: 'twitter',
      text: 'Login',
    },
    logout: {
      onClick: () => signOut(),
      colorScheme: 'red',
      text: 'Logout',
    },
  };

  const sessionMode = !!session ? 'logout' : 'login';
  const props = buttonProps[sessionMode];

  return (
    <Button size="sm" {...props} >
      {props.text}
    </Button>
  );
};
