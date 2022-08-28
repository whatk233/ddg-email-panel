import { Box, Center, Flex } from '@chakra-ui/react'
import Nav from './Nav'

export default function CenterBox({ children, ...props }: { children: React.ReactNode }) {
  return (
    <Box minH="100vh" bg="gray.50" {...props}>
      <Nav />
      <Center minH="80vh">
        <Flex
          h="500px"
          w="600px"
          bgColor="white"
          boxShadow="base"
          rounded="lg"
          color="black"
          p="5rem"
          align="center"
          direction="column"
          justify="center"
        >
          {children}
        </Flex>
      </Center>
    </Box>
  )
}
