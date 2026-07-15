import { Button, Flex, Icon, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import { FiAlertCircle } from 'react-icons/fi';

export default function IncompleteRegistrationWarning({ onCompleteRegistration, ...rest }) {
	const textColor = useColorModeValue('#1F2650', 'white');
	const iconColor = useColorModeValue('#E3B800', '#E3B800');

	return (
		<Card borderRadius="15px" {...rest}>
			<CardBody p={{ base: '18px', md: '15px' }}>
				<Flex
					align={{ base: 'flex-start', md: 'center' }}
					direction={{ base: 'column', xl: 'row' }}
					gap={{ base: '16px', md: '18px' }}
					justify="space-between"
				>
					<Flex align={{ base: 'flex-start', md: 'center' }} gap="14px" flex="1" minW="0">
						<Flex
							align="center"
							bg="rgba(255, 221, 30, 0.14)"
							borderRadius="15px"
							justify="center"
							minW="50px"
							h="50px"
							px="10px"
						>
							<Icon as={FiAlertCircle} boxSize="24px" color={iconColor} />
						</Flex>
						<Text
							color={textColor}
							fontSize={{ base: '15px', md: '18px' }}
							fontWeight="500"
							lineHeight={{ base: '1.45', md: '1.4' }}
						>
							Завершите регистрацию, чтобы начать пользоваться сервисом в полном объеме.
						</Text>
					</Flex>
					<Button
						alignSelf={{ base: 'stretch', xl: 'center' }}
						bgGradient="linear(49deg, #313860 2.25%, #151928 79.87%)"
						borderRadius="12px"
						color="white"
						fontSize="10px"
						fontWeight="700"
						h="35px"
						letterSpacing="0.02em"
						px="18px"
						textTransform="uppercase"
						onClick={onCompleteRegistration}
						_hover={{ bgGradient: 'linear(49deg, #313860 2.25%, #151928 79.87%)' }}
						_active={{ bgGradient: 'linear(49deg, #313860 2.25%, #151928 79.87%)' }}
					>
						Завершить регистрацию
					</Button>
				</Flex>
			</CardBody>
		</Card>
	);
}
