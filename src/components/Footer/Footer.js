/*eslint-disable*/
import { Flex, Link, List, ListItem, Text } from '@chakra-ui/react';
import { Link as RouterLink } from 'react-router-dom';

export default function Footer(props) {
	// const linkRecode = useColorModeValue("recode.400", "red.200");=
	return (
		<Flex
			flexDirection={{
				base: 'column',
				xl: 'row',
			}}
			alignItems={{
				base: 'center',
				xl: 'start',
			}}
			justifyContent="space-between"
			px={{ base: '0px', md: '8px' }}
			pb="20px"
			fontSize="sm"
		>
			<Text
				color="gray.400"
				textAlign={{
					base: 'center',
					xl: 'start',
				}}
				mb={{ base: '20px', xl: '0px' }}
			>
				&copy; ООО «Рекод Решения», {1900 + new Date().getYear()}
			</Text>
			<List
				display="flex"
				flexWrap={{ base: 'wrap', md: 'nowrap' }}
				justifyContent="center"
				rowGap="8px"
				columnGap="20px"
			>
				<ListItem>
					<Link as={RouterLink} to="/privacy-policy" color="gray.400" textDecoration="underline">
						Политика конфиденциальности
					</Link>
				</ListItem>
				<ListItem>
					<Link color="gray.400" href="https://recode-group/blog" textDecoration="underline">
						Пользовательское соглашение
					</Link>
				</ListItem>
				<ListItem>
					<Link as={RouterLink} to="/public-offer" color="gray.400" textDecoration="underline">
						Публичная оферта
					</Link>
				</ListItem>
				<ListItem>
					<Link as={RouterLink} to="/contacts" color="gray.400" textDecoration="underline">
						Контакты
					</Link>
				</ListItem>
			</List>
		</Flex>
	);
}
