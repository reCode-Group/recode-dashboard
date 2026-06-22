import { Avatar, Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';
import Card from 'components/Card/Card';
import CardBody from 'components/Card/CardBody';
import CardHeader from 'components/Card/CardHeader';
import { Separator } from 'components/Separator/Separator';
import { useMemo } from 'react';

function InfoRow({ label, value }) {
	const textColor = useColorModeValue('gray.500', 'white');

	return (
		<Text fontSize="sm" color={textColor} fontWeight="medium">
			{label}:{' '}
			<Text as="span" fontSize="sm" color="gray.400" fontWeight="400">
				{value || 'Не указано'}
			</Text>
		</Text>
	);
}

const CompanyInformation = ({
	title,
	company,
	fullName,
	responsibleFullName,
	legalAddress,
	inn,
	kpp,
	ogrn,
	phone,
	email,
	tokensRemain,
	employeesCount,
}) => {
	const mainColor = useColorModeValue('gray.700', 'white');
	const borderProfileColor = useColorModeValue('gray.100', 'rgba(255, 255, 255, 0.31)');
	const glassBg = useColorModeValue(
		'linear-gradient(113.34deg, rgba(255, 255, 255, 0.82) 0%, rgba(255, 255, 255, 0.8) 110.84%)',
		'linear-gradient(113.34deg, rgba(26, 32, 44, 0.82) 0%, rgba(26, 32, 44, 0.8) 110.84%)'
	);

	const avatarFallback = useMemo(() => company?.slice(0, 2) || 'К', [company]);
	const formattedTokens = useMemo(
		() => new Intl.NumberFormat('ru-RU').format(Number(tokensRemain) || 0).replace(/,/g, ' '),
		[tokensRemain]
	);
	const formattedEmployees = useMemo(
		() => new Intl.NumberFormat('ru-RU').format(Number(employeesCount) || 0).replace(/,/g, ' '),
		[employeesCount]
	);

	return (
		<Card
			p="16px"
			backdropFilter="saturate(200%) blur(10.5px)"
			boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
			border="2px solid"
			borderColor={borderProfileColor}
			bg={glassBg}
		>
			<CardBody px="5px" display="flex">
				<Flex direction="column" justifyContent="space-between" align="stretch" w="100%" h="100%">
					<Flex align="center" mb="22px">
						<Box position="relative" me="16px">
							<Avatar
								name={avatarFallback}
								bg="black"
								color="white"
								borderRadius="12px"
								w="80px"
								h="80px"
							/>
						</Box>
						<Flex direction="column" minW="0">
							<Text fontSize="xl" color={mainColor} fontWeight="bold" noOfLines={2}>
								{company || 'Компания'}
							</Text>
							<Text fontSize="sm" color="gray.500" fontWeight="400">
								{email || 'Не указано'}
							</Text>
						</Flex>
					</Flex>

					<CardHeader p="0" mb="10px">
						<Text fontSize="lg" color={mainColor} fontWeight="bold">
							{title}
						</Text>
					</CardHeader>

					<Separator mb="10px" />

					<Flex direction="column" gap="14px" mb="16px">
						<InfoRow label="ПОЛНОЕ НАИМЕНОВАНИЕ" value={fullName} />
						<InfoRow label="ИНН" value={inn} />
						<InfoRow label="КПП" value={kpp} />
						<InfoRow label="ОГРН" value={ogrn} />
					</Flex>

					<Separator mb="10px" />

					<Flex direction="column" gap="14px">
						<InfoRow label="ЮРИДИЧЕСКИЙ АДРЕС" value={legalAddress} />
						<InfoRow label="EMAIL КОМПАНИИ" value={email} />
						<InfoRow label="ФИО ОТВЕТСТВЕННОГО" value={responsibleFullName} />
						<InfoRow label="ТЕЛЕФОН" value={phone} />
					</Flex>
				</Flex>
			</CardBody>
		</Card>
	);
};

export default CompanyInformation;
