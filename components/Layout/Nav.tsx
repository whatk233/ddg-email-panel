import { Flex, Center, Spacer, IconButton, Image, Text } from '@chakra-ui/react'
import { AiFillGithub } from 'react-icons/ai'
import SwitchLang from '../SwitchLang'

export default function Nav() {
  return (
    <Flex px={5} py={3} h="64px" align="center" shadow="base" bg="white">
      <Flex>
        <Center>
          <Image boxSize="32px" src="/dax-logo.svg" alt="logo" />
          <Text pl="12px" fontSize="lg">
            DDG Email Panel
          </Text>
        </Center>
      </Flex>
      <Spacer />
      <Flex>
        <IconButton colorScheme="gray" aria-label="Github" icon={<AiFillGithub />} mx="0.5rem" />
        <SwitchLang mx="0.5rem" />
      </Flex>
    </Flex>
  )
}
