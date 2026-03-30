// Chakra imports
import { Box, Flex, Image, Text, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import CardHeader from 'components/Card/CardHeader.js';
// Assets
import mirLogo from 'assets/img/payment-methods/mir.png';
import sbpLogo from 'assets/img/payment-methods/sbp.png';
import statementLogo from 'assets/img/payment-methods/statement.png';
import tbankLogo from 'assets/img/payment-methods/tbank.png';

const methods = [
	{
		key: 'sbp',
		title: 'Система быстрых платежей (СБП)',
		icon: sbpLogo,
		iconW: '56px',
		iconH: '33px',
	},
	{
		key: 'card',
		title: 'Банковская карта',
		icon: mirLogo,
		iconW: '47px',
		iconH: '14px',
	},
	{
		key: 'tbank',
		title: 'Через Т-Банк',
		icon: tbankLogo,
		iconW: '69px',
		iconH: '25px',
	},
	{
		key: 'statement',
		title: 'Выписка счета',
		icon: statementLogo,
		iconW: '24px',
		iconH: '22px',
	},
];

const PaymentMethod = ({ title = 'Способ оплаты' }) => {
	const textColor = useColorModeValue('gray.700', 'white');
	const mutedColor = useColorModeValue('gray.400', 'gray.400');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.200');
	const cardBg = useColorModeValue('white', 'gray.700');
	const iconBg = useColorModeValue('transparent', 'gray.500');

	return (
		<Card p="1.5rem" bg={cardBg}>
			<CardHeader pb="8px">
				<Text fontSize="lg" color={textColor} fontWeight="bold">
					{title}
				</Text>
			</CardHeader>
			<CardBody pt="8px">
				<Flex wrap="wrap" gap="14px">
					{methods.map((method) => (
						<Flex
							key={method.key}
							align="center"
							gap="10px"
							minH="64px"
							px="20px"
							py="12px"
							border="1px solid"
							borderColor={borderColor}
							borderRadius="15px"
							flex="0 0 auto"
							cursor="pointer"
						>
							<Flex
								w={method.iconW + '4px'}
								h="90%"
								flexShrink={0}
								align="center"
								bg={iconBg}
								borderRadius="8px"
								px="6px"
							>
								<Image
									src={method.icon}
									alt={method.title}
									w={method.iconW}
									h={method.iconH}
									objectFit="contain"
								/>
							</Flex>
							<Text
								color={mutedColor}
								fontSize="md"
								fontWeight="medium"
								lineHeight="1.4"
								whiteSpace="nowrap"
							>
								{method.title}
							</Text>
						</Flex>
					))}
				</Flex>
				<Box h="2px" />
			</CardBody>
		</Card>
	);
};

export default PaymentMethod;
