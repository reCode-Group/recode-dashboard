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
	Tooltip,
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
	const hasTitleTooltip = title != null && title !== '';
	const hasAmountTooltip = amount != null && amount !== '';

	return (
		<Card h={{ base: '108px', md: '104px', xl: '100px' }} p={{ base: '16px', md: '18px' }} {...rest}>
			<CardBody alignItems="stretch" h="100%">
				<Flex flexDirection="row" align="stretch" justify="space-between" gap="14px" w="100%" minW="0">
					<Stat
						flex="1"
						minW="0"
						me="0"
						display="flex"
						flexDirection="column"
						justifyContent="center"
					>
						<Flex minH="18px" mb="4px" align="center" minW="0">
							<Tooltip label={title} hasArrow openDelay={250} placement="top" isDisabled={!hasTitleTooltip}>
								<StatLabel
									fontSize={{ base: 'xs', sm: 'sm' }}
									lineHeight="1.25"
									color="gray.400"
									fontWeight="bold"
									noOfLines={1}
									m="0"
								>
									{title}
								</StatLabel>
							</Tooltip>
						</Flex>
						<Flex align="center" gap={{ base: '6px', sm: '10px' }} wrap="wrap" minW="0">
							<Tooltip label={amount} hasArrow openDelay={250} placement="top" isDisabled={!hasAmountTooltip}>
								<StatNumber
									fontSize={{ base: 'md', sm: 'lg' }}
									lineHeight="1.25"
									color={textColor}
									whiteSpace="normal"
									wordBreak="normal"
									overflowWrap="normal"
									noOfLines={1}
									minW="0"
								>
									{amount}
								</StatNumber>
							</Tooltip>
							{isInlineActionEnabled ? (
								<Text
									as="button"
									type="button"
									color={inlineActionColor}
									fontSize={{ base: 'xs', sm: 'sm' }}
									lineHeight="1.25"
									aria-label={inlineActionLabel}
									onClick={onInlineAction}
									_hover={{ opacity: 0.8 }}
									_active={{ opacity: 0.8 }}
								>
									{inlineActionText}
								</Text>
							) : null}
							<StatHelpText
								m="0px"
								color={percentage > 0 ? 'green.400' : 'red.400'}
								fontWeight="bold"
								fontSize={{ base: 'sm', sm: 'md' }}
								lineHeight="1.25"
							>
								{percentage != null ? (percentage > 0 ? `+${percentage}%` : `${percentage}%`) : ''}
							</StatHelpText>
						</Flex>
					</Stat>
					{wideAction && isIconActionEnabled ? (
						<Flex flexShrink={0} align="center" justify="center" h="100%">
							<Button
								leftIcon={actionIcon ? <Icon as={actionIcon} w="14px" h="14px" /> : icon}
								bg={iconRecode}
								color="white"
								border="none"
								borderRadius="12px"
								minW={{ base: '104px', sm: '112px', md: '132px' }}
								h={{ base: '42px', md: '45px' }}
								px={{ base: '14px', md: '18px' }}
								fontSize="sm"
								fontWeight="bold"
								aria-label={iconActionLabel}
								onClick={onIconAction}
								_hover={{ bg: iconRecode }}
								_active={{ bg: iconRecode }}
							>
								{actionText}
							</Button>
						</Flex>
					) : (
						<Flex flexShrink={0} align="center" justify="center" h="100%" w={{ base: '42px', md: '45px' }}>
							<IconBox
								as={isIconActionEnabled ? 'button' : 'box'}
								type={isIconActionEnabled ? 'button' : undefined}
								aria-label={isIconActionEnabled ? iconActionLabel : undefined}
								onClick={isIconActionEnabled ? onIconAction : undefined}
								cursor={isIconActionEnabled ? 'pointer' : 'default'}
								border="none"
								appearance="none"
								h={{ base: '42px', md: '45px' }}
								w={{ base: '42px', md: '45px' }}
								bg={iconRecode}
							>
								{icon}
							</IconBox>
						</Flex>
					)}
				</Flex>
			</CardBody>
		</Card>
	);
};

export default MiniStatistics;
