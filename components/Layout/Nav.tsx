import { Flex, Center, Spacer, HStack, IconButton, Image, Text } from '@chakra-ui/react'
import { AiFillGithub } from 'react-icons/ai'

export default function Nav() {
  return (
    <Flex px={5} py={3} h="64px" align="center" shadow="base" bg="white">
      <Flex>
        <Center>
          <Image
            boxSize="32px"
            src="https://duckduckgo.com/assets/common/dax-logo.svg"
            alt="logo"
          />
          <Text pl="12px" fontSize="lg">
            DDG Email Panel
          </Text>
        </Center>
      </Flex>
      <Spacer />
      <Flex>
        <HStack>
          <IconButton colorScheme="gray" aria-label="Github" icon={<AiFillGithub />} />
        </HStack>
      </Flex>
    </Flex>
  )
}
