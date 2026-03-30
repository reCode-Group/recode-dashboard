// Chakra imports
import { Box, Flex, Spacer, Text } from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';

const TariffCard = ({
	backgroundImage,
	title,
	tariffName,
	validUntil,
	tokenBalance,
	monthlyCost,
}) => {
	const validUntilData = validUntil ?? { name: '', data: '' };
	const tokenBalanceData = tokenBalance ?? { name: '', code: '' };
	const monthlyCostData = monthlyCost ?? { name: '', code: '' };

	return (
		<Card
			backgroundImage={backgroundImage}
			backgroundRepeat="no-repeat"
			background="cover"
			bgPosition="10%"
			h="100%"
			p="16px"
		>
			<CardBody h="100%" w="100%">
				<Flex direction="column" color="white" h="100%" p="0px 10px 10px 10px" w="100%">
					<Flex justify="space-between" align="center">
						<Text fontSize="md" letterSpacing={0.5} fontWeight="bold">
							{title}
						</Text>
						<Flex align="center">
							<Box
								style={{
									borderRadius: '50%',
									width: '16px',
									height: '16px',
								}}
								m="10px"
								bgColor="#48BB78"
							></Box>
							Активен
						</Flex>
					</Flex>
					<Spacer />
					<Flex direction="column">
						<Box>
							<Text fontSize="28px" letterSpacing="1px" fontWeight="medium">
								{tariffName}
							</Text>
						</Box>
						<Flex mt="14px" justify="space-between">
							<Flex direction="column" me="34px">
								<Text fontSize="xs">{validUntilData.name}</Text>
								<Text fontSize="sm" fontWeight="medium">
									{validUntilData.data}
								</Text>
							</Flex>
							<Flex direction="column" me="34px">
								<Text fontSize="xs">{tokenBalanceData.name}</Text>
								<Text fontSize="sm" fontWeight="medium">
									{tokenBalanceData.code}
								</Text>
							</Flex>
							<Flex direction="column">
								<Text fontSize="xs">{monthlyCostData.name}</Text>
								<Text fontSize="sm" fontWeight="medium">
									{monthlyCostData.code}
								</Text>
							</Flex>
						</Flex>
					</Flex>
				</Flex>
			</CardBody>
		</Card>
	);
};

export default TariffCard;
