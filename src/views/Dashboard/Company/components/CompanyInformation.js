import {
	Accordion,
	AccordionButton,
	AccordionIcon,
	AccordionItem,
	AccordionPanel,
	Avatar,
	Box,
	Button,
	Flex,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
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

function normalizeDigits(value) {
	return String(value || '').replace(/\D/g, '');
}

function getEntityType({ inn, kpp, ogrn }) {
	const innDigits = normalizeDigits(inn);
	const kppDigits = normalizeDigits(kpp);
	const ogrnDigits = normalizeDigits(ogrn);

	if (innDigits.length === 12 || ogrnDigits.length === 15) {
		return 'ip';
	}
	if (kppDigits.length === 9 || innDigits.length === 10 || ogrnDigits.length === 13) {
		return 'company';
	}
	return 'unknown';
}

const CompanyInformation = ({
	title,
	company,
	fullName,
	responsibleFullName,
	responsibleEmail,
	responsiblePhone,
	responsiblePosition,
	legalAddress,
	inn,
	kpp,
	ogrn,
	okpo,
	email,
	tokensRemain,
	employeesCount,
	onEdit,
}) => {
	const mainColor = useColorModeValue('gray.700', 'white');
	const borderProfileColor = useColorModeValue('gray.100', 'rgba(255, 255, 255, 0.31)');
	const tokensBg = useColorModeValue('gray.50', 'whiteAlpha.100');
	const tokensLabelColor = useColorModeValue('gray.500', 'gray.300');
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
	const entityType = useMemo(() => getEntityType({ inn, kpp, ogrn }), [inn, kpp, ogrn]);
	const isIp = entityType === 'ip';
	const entityTypeLabel =
		entityType === 'ip' ? 'Индивидуальный предприниматель' : entityType === 'company' ? 'Юридическое лицо' : emptyValue;

	return (
		<Card
			p="16px"
			h="100%"
			backdropFilter="saturate(200%) blur(10.5px)"
			boxShadow="0px 2px 5.5px rgba(0, 0, 0, 0.02)"
			border="2px solid"
			borderColor={borderProfileColor}
			bg={glassBg}
		>
			<CardBody px="5px" display="flex" h="100%">
				<Flex
					direction="column"
					justifyContent="space-between"
					align="stretch"
					w="100%"
					h="100%"
					py="8px"
				>
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

					<Flex
						align={{ base: 'flex-start', sm: 'center' }}
						justify="space-between"
						direction={{ base: 'column', sm: 'row' }}
						gap="6px"
						p="16px"
						mb="22px"
						borderRadius="12px"
						border="1px solid"
						borderColor={borderProfileColor}
						bg={tokensBg}
					>
						<Text fontSize="xs" color={tokensLabelColor} fontWeight="bold">
							ОСТАТОК ТОКЕНОВ
						</Text>
						<Text fontSize="2xl" lineHeight="1" color={mainColor} fontWeight="bold">
							{formattedTokens}
						</Text>
					</Flex>

					<CardHeader p="0" mb="10px">
						<Flex align="center" justify="space-between" gap="12px" w="100%">
							<Text fontSize="lg" color={mainColor} fontWeight="bold">
								{title}
							</Text>
							<Button
								size="sm"
								variant="ghost"
								color="gray.500"
								fontWeight="500"
								borderRadius="8px"
								onClick={onEdit}
								_hover={{ bg: 'blackAlpha.50', color: mainColor }}
							>
								Изменить
							</Button>
						</Flex>
					</CardHeader>

					<Separator mb="10px" />

					<Flex direction="column" gap="14px" mb="16px">
						<InfoRow label="ТИП" value={entityTypeLabel} />
						<InfoRow label="ПОЛНОЕ НАИМЕНОВАНИЕ" value={fullName} />
						<InfoRow label={isIp ? 'ИНН ИП' : 'ИНН'} value={inn} />
						{isIp ? null : <InfoRow label="КПП" value={kpp} />}
						<InfoRow label={isIp ? 'ОГРНИП' : 'ОГРН'} value={ogrn} />
						<InfoRow label="ОКПО" value={okpo} />
					</Flex>

					<Separator mb="10px" />

					<Accordion allowToggle>
						<AccordionItem border="0">
							<AccordionButton px="0" py="4px" _hover={{ bg: 'transparent' }}>
								<Box
									as="span"
									flex="1"
									textAlign="left"
									fontSize="sm"
									fontWeight="bold"
									color={mainColor}
								>
									Дополнительно
								</Box>
								<AccordionIcon color={mainColor} />
							</AccordionButton>
							<AccordionPanel px="0" pt="14px" pb="0">
								<Flex direction="column" gap="14px">
									<InfoRow label="ЮРИДИЧЕСКИЙ АДРЕС" value={legalAddress} />
									<InfoRow label="EMAIL КОМПАНИИ" value={email} />
									<InfoRow label="ФИО ОТВЕТСТВЕННОГО" value={responsibleFullName} />
									<InfoRow label="ДОЛЖНОСТЬ ОТВЕТСТВЕННОГО" value={responsiblePosition} />
									<InfoRow label="ТЕЛЕФОН ОТВЕТСТВЕННОГО" value={responsiblePhone} />
									<InfoRow label="EMAIL ОТВЕТСТВЕННОГО" value={responsibleEmail} />
								</Flex>
							</AccordionPanel>
						</AccordionItem>
					</Accordion>
				</Flex>
			</CardBody>
		</Card>
	);
};

export default CompanyInformation;
