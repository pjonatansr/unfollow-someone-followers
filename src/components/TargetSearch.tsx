import { InputGroup, InputLeftElement, Input, InputRightElement, Button, FormControl, FormHelperText, FormLabel } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import Router from 'next/router';
import { useDebouncedCallback } from "use-debounce";
import { TwitterUser } from "@src/types";

interface Props {
  targetUsername: string;
  setTargetData: Dispatch<SetStateAction<TwitterUser>>;
}

export const TargetSearch = (props: Props) => {
  const { targetUsername: username, setTargetData } = props;
  const [targetUsername, setTargetUsername] = useState(username);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    if (!targetUsername) return;
    if (!loading) return;

    fetch(`/api/profile/${targetUsername}`)
      .then((response) => {
        return response.json()
      })
      .then((targetData: TwitterUser) => {
        setTargetData(targetData);
        setLoading(false);
      })
      .catch((error) => {
        console.log({ error })
      })

  }, [loading, targetUsername, setTargetData]);


  useEffect(() => {
    const handleEnter = (e: KeyboardEvent) => {
      if (e.key === 'Enter') {
        setLoading(true);
      }
    }

    window.addEventListener('keydown', handleEnter);
    return () => window.removeEventListener('keydown', handleEnter);
  }, [targetUsername, setLoading]);




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
        placeholder="yourTarget"
        value={targetUsername}
        onChange={(e) => {
          setTargetUsername(e.target.value);
        }}
      />
      <InputRightElement width="4.5rem">
        <Button
          // disabled={isSearching}
          size="xs"
          onClick={() => { setLoading(true) }}
        >
          Search
        </Button>
      </InputRightElement>
    </InputGroup>
  )
};