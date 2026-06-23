import { QuestionIcon } from '@chakra-ui/icons';
import { Button, Flex, Text, useDisclosure } from '@chakra-ui/react';
import SidebarHelpImage from 'assets/img/SidebarHelpImage.png';
import IconBox from 'components/Icons/IconBox';
import CreateSupportTicketModal from 'views/Dashboard/Support/components/CreateSupportTicketModal';

export function SidebarHelp(props) {
	// Pass the computed styles into the `__css` prop
	const { children, ...rest } = props;
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Flex
				borderRadius="15px"
				flexDirection="column"
				bgImage={SidebarHelpImage}
				justifyContent="flex-start"
				alignItems="start"
				boxSize="border-box"
				p="16px"
				h="170px"
				w="100%"
			>
				<IconBox width="35px" h="35px" bg="white" mb="auto">
					<QuestionIcon color="recode.300" h="18px" w="18px" />
				</IconBox>
				<Text fontSize="sm" color="white" fontWeight="bold">
					Нужна помощь?
				</Text>
				<Text fontSize="xs" color="white" mb="10px">
					Можете задать свой вопрос
				</Text>
				<Button
					fontSize="xs"
					fontWeight="semibold"
					w="100%"
					bg="white"
					onClick={onOpen}
					_hover="none"
					_active={{
						bg: 'white',
						transform: 'none',
						borderColor: 'transparent',
					}}
					_focus={{
						boxShadow: 'none',
					}}
					color="black"
				>
					ТЕХПОДДЕРЖКА
				</Button>
			</Flex>
			<CreateSupportTicketModal isOpen={isOpen} onClose={onClose} />
		</>
	);
}
