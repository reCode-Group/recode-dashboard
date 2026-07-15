import { Box, Flex, Text, useColorModeValue } from '@chakra-ui/react';

const CHARACTER_TYPES = [
	{ pattern: /\p{Ll}/u, example: 'строчную букву' },
	{ pattern: /\p{Lu}/u, example: 'заглавную букву' },
	{ pattern: /\p{N}/u, example: 'цифру' },
	{ pattern: /[^\p{L}\p{N}\s]/u, example: 'специальный знак' },
];

function getCharacterWord(count) {
	if (count === 1) {
		return 'символ';
	}
	if (count >= 2 && count <= 4) {
		return 'символа';
	}
	return 'символов';
}

export function getPasswordStrength(password) {
	if (!password) {
		return { isValid: false, level: 0, label: '', hint: '' };
	}

	const missingCharacterTypes = CHARACTER_TYPES.filter(({ pattern }) => !pattern.test(password));
	const characterTypeCount = CHARACTER_TYPES.length - missingCharacterTypes.length;
	const hasMinimumLength = password.length >= 8;
	const isValid = hasMinimumLength && characterTypeCount >= 3;
	const isStrong =
		isValid && ((password.length >= 12 && characterTypeCount >= 3) || characterTypeCount === 4);

	if (isStrong) {
		return {
			isValid: true,
			level: 3,
			label: 'Надёжный',
			hint: 'Пароль хорошо защищён',
		};
	}

	if (isValid) {
		return {
			isValid: true,
			level: 2,
			label: 'Хороший',
			hint: 'Подходит для использования',
		};
	}

	const remainingLength = Math.max(0, 8 - password.length);
	const missingTypeExample = missingCharacterTypes[0]?.example || 'другой символ';

	return {
		isValid: false,
		level: 1,
		label: 'Пока слабый',
		hint: hasMinimumLength
			? `Добавьте, например, ${missingTypeExample}`
			: `Добавьте ещё ${remainingLength} ${getCharacterWord(remainingLength)}`,
	};
}

function PasswordStrength({ password, isActive = false, mb = 0, placement = 'right' }) {
	const trackColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const hintColor = useColorModeValue('gray.600', 'gray.300');
	const popupBg = useColorModeValue('white', 'gray.700');
	const popupBorderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const popupShadow = useColorModeValue(
		'0 16px 32px rgba(15, 23, 42, 0.14)',
		'0 16px 32px rgba(0, 0, 0, 0.38)'
	);
	const strength = getPasswordStrength(password);
	const activeColor =
		strength.level === 3 ? 'green.400' : strength.level === 2 ? 'orange.400' : 'red.400';

	if (!password) {
		return null;
	}

	return (
		<Box
			display={{ base: 'block', lg: isActive ? 'block' : 'none' }}
			position={{ base: 'static', lg: 'absolute' }}
			left={{ lg: placement === 'right' ? 'calc(100% + 14px)' : 'auto' }}
			right={{ lg: placement === 'left' ? 'calc(100% + 14px)' : 'auto' }}
			top={{ lg: '30px' }}
			zIndex={{ lg: 2 }}
			w={{ base: '100%', lg: '250px' }}
			mt={{ base: '8px', lg: 0 }}
			mb={{ base: mb, lg: 0 }}
			p={{ base: 0, lg: '14px' }}
			bg={{ base: 'transparent', lg: popupBg }}
			border={{ base: 'none', lg: '1px solid' }}
			borderColor={{ lg: popupBorderColor }}
			borderRadius={{ lg: '12px' }}
			boxShadow={{ lg: popupShadow }}
			role="status"
			aria-live="polite"
		>
			<Box
				display={{ base: 'none', lg: 'block' }}
				position="absolute"
				left={placement === 'right' ? '-7px' : 'auto'}
				right={placement === 'left' ? '-7px' : 'auto'}
				top="25px"
				w="13px"
				h="13px"
				bg={popupBg}
				borderLeft={placement === 'right' ? '1px solid' : 'none'}
				borderBottom={placement === 'right' ? '1px solid' : 'none'}
				borderTop={placement === 'left' ? '1px solid' : 'none'}
				borderRight={placement === 'left' ? '1px solid' : 'none'}
				borderColor={popupBorderColor}
				transform="rotate(45deg)"
			/>
			<Flex gap="6px" aria-hidden="true">
				{[1, 2, 3].map((segment) => (
					<Box
						key={segment}
						flex="1"
						h="4px"
						borderRadius="full"
						bg={segment <= strength.level ? activeColor : trackColor}
						transition="background-color 0.2s ease"
					/>
				))}
			</Flex>
			<Text mt="5px" fontSize="xs" color={hintColor} lineHeight="1.4">
				<Text as="span" color={activeColor} fontWeight="600">
					{strength.label}.
				</Text>{' '}
				{strength.hint}
			</Text>
		</Box>
	);
}

export default PasswordStrength;
