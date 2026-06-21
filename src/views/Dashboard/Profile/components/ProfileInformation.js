// Chakra imports
import { Flex, Text, Tooltip, useColorModeValue } from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { Separator } from 'components/Separator/Separator';

function InfoRow({ label, value, textColor }) {
	return (
		<Flex align="center" mb="18px" w="100%" minW="0">
			<Text fontSize="sm" color={textColor} fontWeight="600" me="10px" flexShrink={0}>
				{label}
			</Text>
			<Tooltip label={value} hasArrow placement="top-start" openDelay={250}>
				<Text noOfLines={1} fontSize="md" color="gray.500" fontWeight="400" minW="0" flex="1">
					{value}
				</Text>
			</Tooltip>
		</Flex>
	);
}

const ProfileInformation = ({ title, company, role, name, mobile, email }) => {
	const mainColor = useColorModeValue('gray.700', 'white');
	const textColor = useColorModeValue('gray.500', 'white');

	return (
		<Card p="16px" my={{ sm: '24px', xl: '0px' }}>
			<CardHeader p="12px 5px" mb="12px">
				<Text fontSize="lg" color={mainColor} fontWeight="bold">
					{title}
				</Text>
			</CardHeader>
			<CardBody px="5px">
				<Flex direction="column" w="100%" minW="0">
					<InfoRow label="КОМПАНИЯ:" value={company} textColor={textColor} />
					<InfoRow label="РОЛЬ:" value={role} textColor={textColor} />

					<Separator />

					<Flex my="18px" w="100%" minW="0">
						<InfoRow label="ПОЛНОЕ ИМЯ:" value={name} textColor={textColor} />
					</Flex>

					<InfoRow label="ТЕЛЕФОН:" value={mobile} textColor={textColor} />
					<InfoRow label="ПОЧТА:" value={email} textColor={textColor} />
				</Flex>
			</CardBody>
		</Card>
	);
};

export default ProfileInformation;
