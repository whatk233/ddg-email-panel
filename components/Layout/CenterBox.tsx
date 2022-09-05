import { Box, Center, Flex, Text } from '@chakra-ui/react'
import { useTranslation } from 'next-i18next'
import Nav from './Nav'

export default function CenterBox({ children, ...props }: { children: React.ReactNode }) {
  const { t } = useTranslation('common')
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
      <Center>
        <Text fontSize="xs" w="600px" align="center" color="blackAlpha.500">
          {t('DDG Email Panel respects your privacy')}
        </Text>
      </Center>
    </Box>
  )
}
