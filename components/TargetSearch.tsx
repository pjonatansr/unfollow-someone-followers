import { InputGroup, InputLeftElement, Input, InputRightElement, Button, FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";
import { useState } from "react";
import Router from 'next/router';
import { useDebouncedCallback } from "use-debounce";

interface Props {
  id: string;
}

export const TargetSearch = ({ id }: Props) => {
  const [targetUsername, setTargetUsername] = useState('');
  const debounceDelay = 1000;
  const handleSearch = useDebouncedCallback(({ id: userId, targetUsername }) => {
    Router.push({
      pathname: '/unfollow',
      query: {
        targetUsername: encodeURI(targetUsername),
        id: encodeURI(userId),
      },
    });
  }, debounceDelay);

  return (
    <InputGroup
      verticalAlign={'middle'}
      w={'100%'}
      size="md"
      pl={1}
      pr={1}
    >
      <InputLeftElement fontSize="1.2em">
        @
      </InputLeftElement>
      <Input
        pr="4.5rem"
        placeholder="someTwitterUsername"
        value={targetUsername}
        onChange={(e) => setTargetUsername(e.target.value)}
      />
      <InputRightElement width="4.5rem">
        <Button
          // disabled={isSearching}
          size="xs"
          onClick={() => { handleSearch({ id, targetUsername }) }}
        >
          Search
        </Button>
      </InputRightElement>
    </InputGroup>
  )
};