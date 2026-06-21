// Chakra Icons
import { SearchIcon } from '@chakra-ui/icons';
// Chakra Imports
import {
	Button,
	Box,
	Flex,
	IconButton,
	Input,
	InputGroup,
	InputLeftElement,
	Text,
	useColorModeValue,
} from '@chakra-ui/react';
// Assets
// Custom Icons
import { ProfileIcon, SettingsIcon } from 'components/Icons/Icons';
// Custom Components
import SidebarResponsive from 'components/Sidebar/SidebarResponsive';
import PropTypes from 'prop-types';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FiArrowRight } from 'react-icons/fi';
import { NavLink, useHistory, useLocation } from 'react-router-dom';
import routes from 'routes.js';
import { clearAuthState } from 'services/session';
import { searchSite } from 'utils/siteSearch';

export default function HeaderLinks(props) {
	const { variant, children, fixed, secondary, onOpen, showOnlyMobileMenu = false, ...rest } = props;
	const history = useHistory();
	const location = useLocation();
	const [searchQuery, setSearchQuery] = useState('');
	const [isSearchOpen, setIsSearchOpen] = useState(false);
	const [isSearchFocused, setIsSearchFocused] = useState(false);
	const [activeResultIndex, setActiveResultIndex] = useState(-1);
	const searchRef = useRef(null);

	// Chakra Color Mode
	let mainRecode = useColorModeValue('recode.300', 'recode.300');
	let inputBg = useColorModeValue('white', 'gray.800');
	let navbarIcon = useColorModeValue('gray.500', 'gray.200');
	let searchIcon = useColorModeValue('gray.700', 'gray.200');
	const dropdownBg = useColorModeValue('white', 'gray.700');
	const dropdownBorder = useColorModeValue('gray.200', 'whiteAlpha.200');
	const dropdownHoverBg = useColorModeValue('gray.50', 'whiteAlpha.100');
	const mutedText = useColorModeValue('gray.500', 'gray.300');
	const dropdownShadow = useColorModeValue(
		'0 14px 40px rgba(15, 23, 42, 0.12)',
		'0 14px 40px rgba(0, 0, 0, 0.28)'
	);
	const scrollbarThumb = useColorModeValue('rgba(160, 174, 192, 0.95)', 'rgba(255, 255, 255, 0.28)');
	const scrollbarTrack = useColorModeValue('rgba(226, 232, 240, 0.8)', 'rgba(255, 255, 255, 0.08)');

	if (secondary) {
		navbarIcon = 'white';
	}
	const settingsRef = React.useRef();
	const searchResults = useMemo(() => searchSite(searchQuery), [searchQuery]);

	useEffect(() => {
		setSearchQuery('');
		setIsSearchOpen(false);
		setIsSearchFocused(false);
		setActiveResultIndex(-1);
	}, [location.pathname, location.search, location.hash]);

	useEffect(() => {
		const handlePointerDown = (event) => {
			if (!searchRef.current?.contains(event.target)) {
				setIsSearchOpen(false);
				setIsSearchFocused(false);
				setActiveResultIndex(-1);
			}
		};

		document.addEventListener('mousedown', handlePointerDown);
		return () => document.removeEventListener('mousedown', handlePointerDown);
	}, []);

	useEffect(() => {
		if (!searchResults.length) {
			setActiveResultIndex(-1);
			return;
		}

		setActiveResultIndex(0);
	}, [searchResults]);

	const openSearchResult = (result) => {
		if (!result) return;

		setSearchQuery('');
		setIsSearchOpen(false);
		setActiveResultIndex(-1);

		if (result.type === 'doc' && result.href) {
			window.open(result.href, '_blank', 'noopener,noreferrer');
			return;
		}

		if (result.route) {
			history.push(result.route);
		}
	};

	const handleSearchKeyDown = (event) => {
		if (!searchQuery.trim()) {
			return;
		}

		if (event.key === 'ArrowDown') {
			event.preventDefault();
			setIsSearchOpen(true);
			setActiveResultIndex((currentIndex) =>
				searchResults.length ? (currentIndex + 1 + searchResults.length) % searchResults.length : -1
			);
			return;
		}

		if (event.key === 'ArrowUp') {
			event.preventDefault();
			setIsSearchOpen(true);
			setActiveResultIndex((currentIndex) =>
				searchResults.length ? (currentIndex - 1 + searchResults.length) % searchResults.length : -1
			);
			return;
		}

		if (event.key === 'Escape') {
			setIsSearchOpen(false);
			setIsSearchFocused(false);
			setActiveResultIndex(-1);
			return;
		}

		if (event.key === 'Enter') {
			event.preventDefault();
			openSearchResult(searchResults[activeResultIndex] || searchResults[0]);
		}
	};

	return (
		<Flex
			pe={{ sm: '0px', md: '16px' }}
			w={{ sm: '100%', md: 'auto' }}
			alignItems="center"
			flexDirection="row"
			justifyContent={showOnlyMobileMenu ? 'flex-end' : 'flex-start'}
		>
			{showOnlyMobileMenu ? (
				<SidebarResponsive
					logoText={props.logoText}
					secondary={props.secondary}
					routes={routes}
					viewerContext={props.viewerContext}
					{...rest}
				/>
			) : null}
			<Box
				ref={searchRef}
				position="relative"
				display={showOnlyMobileMenu ? 'none' : { base: 'none', md: 'block' }}
				w={{
					sm: '50%',
					md: isSearchFocused || isSearchOpen ? '320px' : '200px',
				}}
				maxW={{ sm: '100%', md: '320px' }}
				me={{ sm: 'auto', md: '20px' }}
				transition="width 0.2s ease"
			>
				<InputGroup
					cursor="pointer"
					bg={inputBg}
					borderRadius="15px"
					_focus={{
						borderColor: { mainRecode },
					}}
					_active={{
						borderColor: { mainRecode },
					}}
				>
					<InputLeftElement
						children={
							<IconButton
								bg="inherit"
								borderRadius="inherit"
								_hover="none"
								_active={{
									bg: 'inherit',
									transform: 'none',
									borderColor: 'transparent',
								}}
								_focus={{
									boxShadow: 'none',
								}}
								icon={<SearchIcon color={searchIcon} w="15px" h="15px" />}
							></IconButton>
						}
					/>
					<Input
						fontSize="xs"
						py="11px"
						color="black"
						caretColor="black"
						placeholder="Поиск по сайту..."
						borderRadius="inherit"
						_placeholder={{ color: 'gray.500' }}
						_focus={{ color: 'black', caretColor: 'black' }}
						value={searchQuery}
						onChange={(event) => {
							setSearchQuery(event.target.value);
							setIsSearchOpen(Boolean(event.target.value.trim()));
						}}
						onFocus={() => {
							setIsSearchFocused(true);
							setIsSearchOpen(Boolean(searchQuery.trim()));
						}}
						onBlur={() => setIsSearchFocused(false)}
						onKeyDown={handleSearchKeyDown}
					/>
				</InputGroup>
				{isSearchOpen && searchQuery.trim() ? (
					<Box
						position="absolute"
						top="calc(100% + 8px)"
						left="0"
						right="0"
						p="6px"
						border="1px solid"
						borderColor={dropdownBorder}
						borderRadius="14px"
						bg={dropdownBg}
						boxShadow={dropdownShadow}
						zIndex="20"
						maxH="320px"
						overflowY="auto"
						sx={{
							WebkitOverflowScrolling: 'touch',
							'&::-webkit-scrollbar': {
								width: '8px',
							},
							'&::-webkit-scrollbar-thumb': {
								background: scrollbarThumb,
								borderRadius: '999px',
							},
							'&::-webkit-scrollbar-track': {
								background: scrollbarTrack,
								borderRadius: '999px',
							},
							scrollbarWidth: 'thin',
							scrollbarColor: `${scrollbarThumb} ${scrollbarTrack}`,
						}}
					>
						{searchResults.length ? (
							searchResults.map((result, index) => {
								const isActive = index === activeResultIndex;

								return (
									<Box
										as="button"
										type="button"
										key={result.id}
										display="flex"
										alignItems="center"
										gap="10px"
										w="100%"
										px="10px"
										py="8px"
										borderRadius="10px"
										textAlign="left"
										role="group"
										bg={isActive ? dropdownHoverBg : 'transparent'}
										transition="0.15s ease-in-out"
										_hover={{ bg: dropdownHoverBg }}
										onMouseEnter={() => setActiveResultIndex(index)}
										onMouseDown={(event) => {
											event.preventDefault();
											openSearchResult(result);
										}}
									>
										<Box minW="0" flex="1">
											<Text fontSize="0.92rem" fontWeight="600" color="gray.700" noOfLines={1}>
												{result.title}
											</Text>
											<Text fontSize="0.78rem" color={mutedText} noOfLines={1}>
												{result.sectionLabel} · {result.description}
											</Text>
										</Box>
										<Box
											as={FiArrowRight}
											boxSize="16px"
											color={mutedText}
											flexShrink={0}
											opacity={isActive ? 1 : 0}
											transform={isActive ? 'translateX(0)' : 'translateX(-6px)'}
											transition="all 0.18s ease"
											_groupHover={{ opacity: 1, transform: 'translateX(0)' }}
										/>
									</Box>
								);
							})
						) : (
							<Text px="10px" py="10px" color={mutedText} fontSize="0.85rem">
								Ничего не найдено
							</Text>
						)}
					</Box>
				) : null}
			</Box>
			<SettingsIcon
				display={showOnlyMobileMenu ? 'none' : { base: 'none', md: 'block' }}
				cursor="pointer"
				ms={{ base: '16px', xl: '0px' }}
				me="16px"
				ref={settingsRef}
				onClick={props.onOpen}
				color={navbarIcon}
				w="18px"
				h="18px"
			/>
			<NavLink to="/admin/profile">
				<IconButton
					display={showOnlyMobileMenu ? 'none' : { base: 'none', md: 'inline-flex' }}
					aria-label="Профиль"
					bg="transparent"
					color={navbarIcon}
					variant="ghost"
					me={{ sm: '2px', md: '12px' }}
					_hover={{ bg: 'transparent' }}
					_active={{ bg: 'transparent' }}
					_focus={{ boxShadow: 'none' }}
					icon={<ProfileIcon color={navbarIcon} w="22px" h="22px" me="0px" />}
				/>
			</NavLink>
			<NavLink to="/auth/login-page" onClick={clearAuthState}>
				<Button
					display={{ base: 'none', md: 'inline-flex' }}
					ms="0px"
					px="0px"
					me={{ sm: '2px', md: '16px' }}
					color={navbarIcon}
					variant="transparent-with-icon"
				>
					<Text display={{ sm: 'none', md: 'flex' }}>Выйти</Text>
				</Button>
			</NavLink>
			{!showOnlyMobileMenu ? (
				<SidebarResponsive
					logoText={props.logoText}
					secondary={props.secondary}
					routes={routes}
					viewerContext={props.viewerContext}
					// logo={logo}
					{...rest}
				/>
			) : null}
			{/* <Menu>
        <MenuButton>
          <BellIcon color={navbarIcon} w="18px" h="18px" />
        </MenuButton>
        <MenuList p="16px" borderRadius="18px">
          <Flex flexDirection="column">
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="13 минут назад"
                info="от техподдержки"
                boldInfo="Уведомление"
                aName=""
                aSrc={avatar1}
              />
            </MenuItem>
            <MenuItem borderRadius="8px" mb="10px">
              <ItemContent
                time="2 дня назад"
                info="от техподдержки"
                boldInfo="Уведомление"
                aName="Josh Henry"
                aSrc={avatar2}
              />
            </MenuItem>
            <MenuItem borderRadius="8px">
              <ItemContent
                time="3 дня назад"
                info="Тариф успешно оплачен!"
                boldInfo=""
                aName="Kara"
                aSrc={system_avatar}
              />
            </MenuItem>
          </Flex>
        </MenuList>
      </Menu> */}
		</Flex>
	);
}

HeaderLinks.propTypes = {
	variant: PropTypes.string,
	fixed: PropTypes.bool,
	secondary: PropTypes.bool,
	onOpen: PropTypes.func,
	showOnlyMobileMenu: PropTypes.bool,
};
