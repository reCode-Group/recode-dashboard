// Chakra imports
import {
	Button,
	Flex,
	Icon,
	Stat,
	StatHelpText,
	StatLabel,
	StatNumber,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
// Custom components
import Card from 'components/Card/Card.js';
import CardBody from 'components/Card/CardBody.js';
import IconBox from 'components/Icons/IconBox';

const MiniStatistics = ({
	title,
	amount,
	percentage,
	icon,
	inlineActionText,
	onInlineAction,
	inlineActionLabel = 'statistics inline action',
	enableIconAction = false,
	onIconAction,
	iconActionLabel = 'statistics action',
	wideAction = false,
	actionText = 'Создать',
	actionIcon,
	...rest
}) => {
	const iconRecode = useColorModeValue('recode.300', 'recode.300');
	const textColor = useColorModeValue('gray.700', 'white');
	const inlineActionColor = useColorModeValue('recode.300', 'recode.200');
	const isIconActionEnabled = enableIconAction && typeof onIconAction === 'function';
	const isInlineActionEnabled = Boolean(inlineActionText) && typeof onInlineAction === 'function';

	return (
		<Card minH="83px" {...rest}>
			<CardBody>
				<Flex flexDirection="row" align="center" justify="center" w="100%">
					<Stat me="auto">
						<StatLabel fontSize="sm" color="gray.400" fontWeight="bold" noOfLines={1} pb=".1rem">
							{title}
						</StatLabel>
						<Flex align="center" gap="10px" wrap="wrap">
							<StatNumber fontSize="lg" color={textColor}>
								{amount}
							</StatNumber>
							{isInlineActionEnabled ? (
								<Text
									as="button"
									type="button"
									color={inlineActionColor}
									fontSize="sm"
									aria-label={inlineActionLabel}
									onClick={onInlineAction}
									_hover={{ opacity: 0.8 }}
									_active={{ opacity: 0.8 }}
								>
									{inlineActionText}
								</Text>
							) : null}
							<StatHelpText
								alignSelf="flex-end"
								justifySelf="flex-end"
								m="0px"
								color={percentage > 0 ? 'green.400' : 'red.400'}
								fontWeight="bold"
								ps="3px"
								fontSize="md"
							>
								{percentage != null ? (percentage > 0 ? `+${percentage}%` : `${percentage}%`) : ''}
							</StatHelpText>
						</Flex>
					</Stat>
					{wideAction && isIconActionEnabled ? (
						<Button
							leftIcon={actionIcon ? <Icon as={actionIcon} w="14px" h="14px" /> : icon}
							bg={iconRecode}
							color="white"
							border="none"
							borderRadius="12px"
							minW={{ base: '112px', md: '132px' }}
							h="45px"
							px="18px"
							fontSize="sm"
							fontWeight="bold"
							aria-label={iconActionLabel}
							onClick={onIconAction}
							_hover={{ bg: iconRecode }}
							_active={{ bg: iconRecode }}
						>
							{actionText}
						</Button>
					) : (
						<IconBox
							as={isIconActionEnabled ? 'button' : 'box'}
							type={isIconActionEnabled ? 'button' : undefined}
							aria-label={isIconActionEnabled ? iconActionLabel : undefined}
							onClick={isIconActionEnabled ? onIconAction : undefined}
							cursor={isIconActionEnabled ? 'pointer' : 'default'}
							border="none"
							appearance="none"
							h={'45px'}
							w={'45px'}
							bg={iconRecode}
						>
							{icon}
						</IconBox>
					)}
				</Flex>
			</CardBody>
		</Card>
	);
};

export default MiniStatistics;
