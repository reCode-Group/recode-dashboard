import {
	Alert,
	AlertDescription,
	AlertIcon,
	AlertTitle,
	Box,
	Button,
	Flex,
	FormControl,
	FormLabel,
	Grid,
	GridItem,
	Input,
	Link,
	Modal,
	ModalBody,
	ModalCloseButton,
	ModalContent,
	ModalFooter,
	ModalHeader,
	ModalOverlay,
	Select,
	Spinner,
	Text,
	useColorModeValue,
	useDisclosure,
	useToast,
} from '@chakra-ui/react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getCurrentUser } from 'services/auth';
import { createOrganizationBill } from 'services/organization';
import {
	getTokenPackages,
	getUserSubscription,
	initSubscriptionPayment,
} from 'services/subscription';
import { getTBankTerminalKey, mountTBankPaymentForm } from 'services/tbankPayment';
import {
	formatPaymentAmount,
	isNoSubscriptionError,
	normalizeTokenPackages,
} from 'utils/subscription';
import PaymentMethod, {
	AccountFundingSwitcher,
	PAYMENT_METHODS,
} from 'views/Dashboard/Billing/components/PaymentMethod';

const ACCOUNT_TYPES = {
	PERSONAL: 'personal',
	ORGANIZATION: 'organization',
};

const PAYMENT_INTEGRATION_NAME = 'recode-subscription-payment';
const PENDING_PAYMENT_STORAGE_KEY = 'recode.pending-subscription-payment';
const SELECTED_ACCOUNT_STORAGE_KEY = 'recode.billing-pay.account-type';
const SELECTED_TARIFF_STORAGE_KEY = 'recode.billing-pay.tariff-id';
const PENDING_PAYMENT_TTL_MS = 30 * 60 * 1000;
const PAYMENT_SUCCESS_CLOSE_SECONDS = 5;
const RECONCILIATION_DELAYS_MS = [0, 1000, 2000, 3000, 5000, 8000, 13000, 13000];

function wait(ms) {
	return new Promise((resolve) => {
		window.setTimeout(resolve, ms);
	});
}

function readStorageValue(key) {
	try {
		return window.localStorage.getItem(key) || '';
	} catch (error) {
		return '';
	}
}

function saveStorageValue(key, value) {
	try {
		window.localStorage.setItem(key, value);
	} catch (error) {
		// Пользовательские настройки не критичны для оплаты.
	}
}

function readStoredAccountType() {
	const storedAccountType = readStorageValue(SELECTED_ACCOUNT_STORAGE_KEY);
	return storedAccountType === ACCOUNT_TYPES.ORGANIZATION
		? ACCOUNT_TYPES.ORGANIZATION
		: ACCOUNT_TYPES.PERSONAL;
}

function readRequestedAccountType(search) {
	const accountType = new URLSearchParams(search).get('account');
	return accountType === ACCOUNT_TYPES.ORGANIZATION || accountType === ACCOUNT_TYPES.PERSONAL
		? accountType
		: '';
}

function getInitialPaymentMethodId(accountType) {
	return accountType === ACCOUNT_TYPES.ORGANIZATION
		? PAYMENT_METHODS.statement.id
		: PAYMENT_METHODS.tbank.id;
}

function getSubscriptionFingerprint(subscription) {
	return subscription?.created_at ? String(subscription.created_at) : 'none';
}

function readPendingPayment() {
	try {
		const value = JSON.parse(window.sessionStorage.getItem(PENDING_PAYMENT_STORAGE_KEY));
		if (
			!value?.paymentId ||
			!value?.startedAt ||
			Date.now() - value.startedAt > PENDING_PAYMENT_TTL_MS
		) {
			window.sessionStorage.removeItem(PENDING_PAYMENT_STORAGE_KEY);
			return null;
		}

		return value;
	} catch (error) {
		window.sessionStorage.removeItem(PENDING_PAYMENT_STORAGE_KEY);
		return null;
	}
}

function savePendingPayment(payment) {
	window.sessionStorage.setItem(PENDING_PAYMENT_STORAGE_KEY, JSON.stringify(payment));
}

function clearPendingPayment() {
	window.sessionStorage.removeItem(PENDING_PAYMENT_STORAGE_KEY);
}

async function getSubscriptionSnapshot() {
	try {
		return await getUserSubscription();
	} catch (error) {
		if (isNoSubscriptionError(error)) {
			return null;
		}
		throw error;
	}
}

function isActiveOrganizationDirector(user) {
	return (
		user?.has_organization === true &&
		user?.organization_role === 'director' &&
		user?.organization_status === 'active'
	);
}

function isOrganizationEmployee(user) {
	return user?.has_organization === true && user?.organization_role !== 'director';
}

function BillingPay() {
	const location = useLocation();
	const navigate = useNavigate();
	const toast = useToast();
	const paymentModal = useDisclosure();
	const initialAccountType = readRequestedAccountType(location.search) || readStoredAccountType();
	const [tariffs, setTariffs] = useState([]);
	const [tariffId, setTariffId] = useState(() => readStorageValue(SELECTED_TARIFF_STORAGE_KEY));
	const [accountType, setAccountType] = useState(() => initialAccountType);
	const [paymentMethodId, setPaymentMethodId] = useState(() =>
		getInitialPaymentMethodId(initialAccountType)
	);
	const [currentUser, setCurrentUser] = useState(null);
	const [isLoadingUser, setIsLoadingUser] = useState(true);
	const [isLoadingTariffs, setIsLoadingTariffs] = useState(true);
	const [tariffsError, setTariffsError] = useState('');
	const [submitError, setSubmitError] = useState('');
	const [isCreatingBill, setIsCreatingBill] = useState(false);
	const [billResult, setBillResult] = useState(null);
	const [paymentData, setPaymentData] = useState(null);
	const [paymentModalState, setPaymentModalState] = useState('idle');
	const [paymentModalError, setPaymentModalError] = useState('');
	const [paymentSuccessCloseSeconds, setPaymentSuccessCloseSeconds] = useState(
		PAYMENT_SUCCESS_CLOSE_SECONDS
	);
	const [pendingPayment, setPendingPayment] = useState(() => readPendingPayment());
	const [isPaymentConfirmed, setIsPaymentConfirmed] = useState(false);
	const paymentContainerRef = useRef(null);
	const isMountedRef = useRef(true);
	const isPaymentModalOpenRef = useRef(false);
	const reconciliationPromiseRef = useRef(null);
	const paymentFormCleanupRef = useRef(null);
	const isPaymentConfirmedRef = useRef(false);
	const appliedRequestedAccountSearchRef = useRef('');

	const titleColor = useColorModeValue('gray.700', 'white');
	const subtitleColor = useColorModeValue('gray.400', 'gray.300');
	const labelColor = useColorModeValue('gray.700', 'gray.100');
	const inputTextColor = useColorModeValue('gray.500', 'gray.200');
	const inputBg = useColorModeValue('white', 'whiteAlpha.50');
	const readonlyBg = useColorModeValue('gray.200', 'whiteAlpha.400');
	const borderColor = useColorModeValue('gray.200', 'whiteAlpha.300');
	const modalBg = useColorModeValue('white', 'gray.700');
	const tbankTerminalKey = getTBankTerminalKey();
	const requestedTariffId = useMemo(
		() => new URLSearchParams(location.search).get('package') || '',
		[location.search]
	);
	const requestedAccountType = useMemo(
		() => readRequestedAccountType(location.search),
		[location.search]
	);
	const paymentReturnStatus = useMemo(
		() => new URLSearchParams(location.search).get('payment') || '',
		[location.search]
	);
	const canUseOrganizationAccount = isActiveOrganizationDirector(currentUser);
	const shouldShowEmployeeHint = isOrganizationEmployee(currentUser);
	const isOrganizationAccount = accountType === ACCOUNT_TYPES.ORGANIZATION;
	const isStatementMethod = paymentMethodId === PAYMENT_METHODS.statement.id;
	const selectedTariff = useMemo(
		() => tariffs.find((item) => String(item.id) === tariffId) || tariffs[0],
		[tariffs, tariffId]
	);
	const availablePaymentMethods = useMemo(
		() => (isOrganizationAccount ? [PAYMENT_METHODS.statement] : [PAYMENT_METHODS.tbank]),
		[isOrganizationAccount]
	);
	const accountOptions = useMemo(
		() =>
			canUseOrganizationAccount
				? [
						{ id: ACCOUNT_TYPES.PERSONAL, label: 'Личный' },
						{ id: ACCOUNT_TYPES.ORGANIZATION, label: 'Организация' },
				  ]
				: [],
		[canUseOrganizationAccount]
	);
	const submitButtonLabel = isStatementMethod ? 'Выписать счёт' : 'Оплатить';
	const paymentAmount = useMemo(() => formatPaymentAmount(Number(selectedTariff?.price) || 0), [
		selectedTariff?.price,
	]);

	useEffect(() => {
		return () => {
			isMountedRef.current = false;
		};
	}, []);

	useEffect(() => {
		let isMounted = true;

		async function loadCurrentUser() {
			setIsLoadingUser(true);

			try {
				const user = await getCurrentUser();
				if (!isMounted) return;
				setCurrentUser(user);
			} catch (error) {
				if (!isMounted) return;
				setCurrentUser(null);
			} finally {
				if (isMounted) {
					setIsLoadingUser(false);
				}
			}
		}

		loadCurrentUser();

		return () => {
			isMounted = false;
		};
	}, []);

	useEffect(() => {
		isPaymentModalOpenRef.current = paymentModal.isOpen;
	}, [paymentModal.isOpen]);

	useEffect(() => {
		if (!paymentModal.isOpen || paymentModalState !== 'success') {
			setPaymentSuccessCloseSeconds(PAYMENT_SUCCESS_CLOSE_SECONDS);
			return undefined;
		}

		setPaymentSuccessCloseSeconds(PAYMENT_SUCCESS_CLOSE_SECONDS);

		const timerId = window.setInterval(() => {
			setPaymentSuccessCloseSeconds((currentSeconds) => {
				if (currentSeconds <= 1) {
					window.clearInterval(timerId);
					paymentModal.onClose();
					return 0;
				}

				return currentSeconds - 1;
			});
		}, 1000);

		return () => {
			window.clearInterval(timerId);
		};
	}, [paymentModal.isOpen, paymentModal.onClose, paymentModalState]);

	useEffect(() => {
		if (isLoadingUser || canUseOrganizationAccount || accountType !== ACCOUNT_TYPES.ORGANIZATION) {
			return;
		}

		setAccountType(ACCOUNT_TYPES.PERSONAL);
		setPaymentMethodId(PAYMENT_METHODS.tbank.id);
	}, [accountType, canUseOrganizationAccount, isLoadingUser]);

	useEffect(() => {
		if (!requestedAccountType || appliedRequestedAccountSearchRef.current === location.search) {
			return;
		}

		if (isLoadingUser) {
			return;
		}

		if (requestedAccountType === ACCOUNT_TYPES.ORGANIZATION && !canUseOrganizationAccount) {
			return;
		}

		appliedRequestedAccountSearchRef.current = location.search;
		if (requestedAccountType === accountType) {
			return;
		}

		setAccountType(requestedAccountType);
		setPaymentMethodId(getInitialPaymentMethodId(requestedAccountType));
		setSubmitError('');
		setBillResult(null);
	}, [accountType, canUseOrganizationAccount, isLoadingUser, location.search, requestedAccountType]);

	useEffect(() => {
		saveStorageValue(SELECTED_ACCOUNT_STORAGE_KEY, accountType);
	}, [accountType]);

	useEffect(() => {
		if (tariffId) {
			saveStorageValue(SELECTED_TARIFF_STORAGE_KEY, tariffId);
		}
	}, [tariffId]);

	useEffect(() => {
		let isMounted = true;

		async function loadTariffs() {
			setIsLoadingTariffs(true);
			setTariffsError('');

			try {
				const payload = await getTokenPackages();
				if (!isMounted) return;

				const tokenPackages = normalizeTokenPackages(payload);
				setTariffs(tokenPackages);
				setTariffId((currentTariffId) => {
					const storedTariffId = readStorageValue(SELECTED_TARIFF_STORAGE_KEY);
					const nextTariffId = [requestedTariffId, storedTariffId, currentTariffId].find(
						(candidate) =>
							candidate && tokenPackages.some((item) => String(item.id) === String(candidate))
					);

					return nextTariffId
						? String(nextTariffId)
						: tokenPackages[0]
						? String(tokenPackages[0].id)
						: '';
				});
			} catch (error) {
				if (!isMounted) return;

				setTariffs([]);
				setTariffsError(error.message || 'Не удалось загрузить пакеты');
			} finally {
				if (isMounted) {
					setIsLoadingTariffs(false);
				}
			}
		}

		loadTariffs();

		return () => {
			isMounted = false;
		};
	}, [requestedTariffId]);

	const reconcilePayment = useCallback(
		(attempt, { showTimeoutToast = true } = {}) => {
			if (!attempt) {
				return Promise.resolve(false);
			}
			if (reconciliationPromiseRef.current) {
				return reconciliationPromiseRef.current;
			}

			const reconciliation = (async () => {
				for (const delay of RECONCILIATION_DELAYS_MS) {
					if (delay) {
						await wait(delay);
					}
					if (!isMountedRef.current) {
						return false;
					}

					try {
						const subscription = await getSubscriptionSnapshot();
						if (getSubscriptionFingerprint(subscription) !== attempt.subscriptionFingerprint) {
							clearPendingPayment();
							setPendingPayment(null);
							setIsPaymentConfirmed(true);
							isPaymentConfirmedRef.current = true;
							if (paymentFormCleanupRef.current) {
								void paymentFormCleanupRef.current();
								paymentFormCleanupRef.current = null;
							}
							if (isPaymentModalOpenRef.current) {
								setPaymentModalState('success');
							}
							toast({
								id: `payment-success-${attempt.paymentId}`,
								title: 'Оплата подтверждена',
								description: 'Пакет и личный баланс обновлены.',
								status: 'success',
								duration: 6000,
								isClosable: true,
							});
							return true;
						}
					} catch (error) {
						// Временная ошибка сверки не означает, что банк отклонил платёж.
					}
				}

				if (showTimeoutToast && isMountedRef.current) {
					toast({
						id: `payment-processing-${attempt.paymentId}`,
						title: 'Платёж обрабатывается',
						description: 'Подтверждение банка может прийти позже. Баланс обновится автоматически.',
						status: 'info',
						duration: 8000,
						isClosable: true,
					});
				}
				return false;
			})();

			reconciliationPromiseRef.current = reconciliation.finally(() => {
				reconciliationPromiseRef.current = null;
			});
			return reconciliationPromiseRef.current;
		},
		[toast]
	);

	useEffect(() => {
		if (!pendingPayment) {
			return;
		}

		if (paymentReturnStatus === 'fail') {
			clearPendingPayment();
			setPendingPayment(null);
			toast({
				id: `payment-failed-${pendingPayment.paymentId}`,
				title: 'Оплата не завершена',
				description: 'Попробуйте оплатить ещё раз или выберите другой способ.',
				status: 'error',
				duration: 7000,
				isClosable: true,
			});
			return;
		}

		void reconcilePayment(pendingPayment, { showTimeoutToast: paymentReturnStatus === 'success' });
	}, [paymentReturnStatus, pendingPayment, reconcilePayment, toast]);

	useEffect(() => {
		if (!paymentModal.isOpen || !paymentData || !paymentContainerRef.current) {
			return undefined;
		}

		let isCancelled = false;
		let removePaymentForm;
		setPaymentModalState('loading');

		mountTBankPaymentForm({
			container: paymentContainerRef.current,
			paymentUrl: paymentData.paymentUrl,
			integrationName: PAYMENT_INTEGRATION_NAME,
			onLoaded: () => {
				if (!isCancelled) {
					setPaymentModalState('ready');
				}
			},
			onStatusChange: () => {
				void reconcilePayment(paymentData.attempt, { showTimeoutToast: false });
			},
		})
			.then((cleanup) => {
				removePaymentForm = cleanup;
				paymentFormCleanupRef.current = cleanup;
				if (isCancelled || isPaymentConfirmedRef.current) {
					void cleanup();
					paymentFormCleanupRef.current = null;
				}
			})
			.catch((error) => {
				if (!isCancelled) {
					setPaymentModalError(error.message || 'Не удалось открыть форму оплаты');
					setPaymentModalState('error');
				}
			});

		return () => {
			isCancelled = true;
			if (removePaymentForm) {
				void removePaymentForm();
				if (paymentFormCleanupRef.current === removePaymentForm) {
					paymentFormCleanupRef.current = null;
				}
			}
		};
	}, [paymentData, paymentModal.isOpen, reconcilePayment]);

	const resetPaymentState = () => {
		setSubmitError('');
		setBillResult(null);
	};

	const startOnlinePayment = async () => {
		setSubmitError('');
		setBillResult(null);
		setPaymentData(null);
		setIsPaymentConfirmed(false);
		isPaymentConfirmedRef.current = false;
		setPaymentModalError('');
		setPaymentModalState('initializing');
		paymentModal.onOpen();

		try {
			if (!tbankTerminalKey) {
				throw new Error('Онлайн-оплата временно недоступна: не настроен терминал');
			}

			const subscription = await getSubscriptionSnapshot();
			const response = await initSubscriptionPayment(selectedTariff.id);
			if (!response?.payment_url || !response?.payment_id) {
				throw new Error('Банк не вернул ссылку на форму оплаты');
			}

			const attempt = {
				paymentId: String(response.payment_id),
				tokenPackageId: Number(selectedTariff.id),
				tokenPackageName: selectedTariff.name,
				subscriptionFingerprint: getSubscriptionFingerprint(subscription),
				startedAt: Date.now(),
			};
			savePendingPayment(attempt);
			setPendingPayment(attempt);
			setPaymentData({ paymentUrl: response.payment_url, attempt });
		} catch (error) {
			setPaymentModalError(error.message || 'Не удалось начать оплату');
			setPaymentModalState('error');
		}
	};

	const handleCreateBill = async () => {
		setSubmitError('');
		setBillResult(null);
		setIsCreatingBill(true);

		try {
			const response = await createOrganizationBill(selectedTariff.id);
			if (!response?.document_url) {
				throw new Error('Сервис не вернул ссылку на счёт');
			}
			setBillResult(response);
		} catch (error) {
			setSubmitError(error.message || 'Не удалось сформировать счёт');
		} finally {
			setIsCreatingBill(false);
		}
	};

	const handleSubmit = () => {
		if (!selectedTariff) {
			return;
		}
		if (isStatementMethod) {
			void handleCreateBill();
			return;
		}
		void startOnlinePayment();
	};

	const handlePaymentModalClose = () => {
		paymentModal.onClose();
		if (pendingPayment && paymentModalState !== 'success') {
			void reconcilePayment(pendingPayment);
		}
	};

	const handlePaymentMethodChange = (methodId) => {
		setPaymentMethodId(methodId);
		resetPaymentState();
	};

	const handleTariffChange = (event) => {
		setTariffId(event.target.value);
		resetPaymentState();
	};

	const handleAccountTypeChange = (nextAccountType) => {
		if (nextAccountType === ACCOUNT_TYPES.ORGANIZATION && !canUseOrganizationAccount) {
			return;
		}

		setAccountType(nextAccountType);
		setPaymentMethodId(
			nextAccountType === ACCOUNT_TYPES.ORGANIZATION
				? PAYMENT_METHODS.statement.id
				: PAYMENT_METHODS.tbank.id
		);
		resetPaymentState();
	};

	const inputStyles = {
		borderRadius: '15px',
		fontSize: 'sm',
		size: 'lg',
		color: inputTextColor,
		borderColor,
	};

	return (
		<>
			<Flex direction="column" pt={{ base: '120px', md: '75px' }} minH="100vh">
				<Grid templateColumns={{ base: '1fr', xl: '1fr 1.5fr' }} gap="12px" alignItems="start">
					<GridItem>
						<Box w="100%" maxW={{ base: '100%', lg: '500px' }}>
							<Text fontSize="32px" lineHeight="1.3" fontWeight="bold" color={titleColor}>
								Покупка пакета
							</Text>
							<Text
								mt="4px"
								fontSize="14px"
								lineHeight="1.4"
								fontWeight="bold"
								color={subtitleColor}
							>
								Принимаются платежи только из Российской Федерации
							</Text>

							{accountOptions.length > 1 ? (
								<Box mt="18px">
									<AccountFundingSwitcher
										options={accountOptions}
										value={accountType}
										onChange={handleAccountTypeChange}
										title="Куда зачислить токены"
										description="Выберите личный баланс или счёт организации перед выбором пакета"
										variant="compact"
									/>
								</Box>
							) : null}

							<Flex mt="22px" direction="column" gap="16px">
								{tariffsError ? (
									<Alert status="error" borderRadius="12px">
										<AlertIcon />
										{tariffsError}
									</Alert>
								) : null}

								{pendingPayment ? (
									<Alert status="info" borderRadius="12px" alignItems="flex-start">
										<AlertIcon mt="2px" />
										<Box>
											<AlertTitle fontSize="sm">Проверяем предыдущий платёж</AlertTitle>
											<AlertDescription fontSize="sm">
												Пакет токенов зачислится автоматически после подтверждения банка.
											</AlertDescription>
										</Box>
									</Alert>
								) : null}

								{paymentReturnStatus === 'success' && !pendingPayment && !isPaymentConfirmed ? (
									<Alert status="info" borderRadius="12px">
										<AlertIcon />
										Платёж принят банком и ожидает подтверждения. Пакет обновится автоматически.
									</Alert>
								) : null}

								{paymentReturnStatus === 'fail' ? (
									<Alert status="error" borderRadius="12px">
										<AlertIcon />
										Оплата не завершена. Попробуйте ещё раз или выберите другой способ.
									</Alert>
								) : null}

								{submitError ? (
									<Alert status="error" borderRadius="12px">
										<AlertIcon />
										{submitError}
									</Alert>
								) : null}

								{billResult ? (
									<Alert status="success" borderRadius="12px" alignItems="flex-start">
										<AlertIcon mt="2px" />
										<Box>
											<AlertTitle fontSize="sm">Счёт сформирован</AlertTitle>
											<AlertDescription fontSize="sm">
												<Link
													href={billResult.document_url}
													isExternal
													color="blue.500"
													fontWeight="bold"
												>
													Открыть счёт
												</Link>
												. Ссылка также отправлена на почту организации.
											</AlertDescription>
										</Box>
									</Alert>
								) : null}

								{shouldShowEmployeeHint ? (
									<Alert status="info" borderRadius="12px" alignItems="flex-start">
										<AlertIcon mt="2px" />
										<Box>
											<AlertTitle fontSize="sm">Рабочий счёт пополняет директор</AlertTitle>
											<AlertDescription fontSize="sm">
												Вы не можете пополнить счёт сотрудника самостоятельно. Обратитесь к
												руководителю или пополните личный счёт.
											</AlertDescription>
										</Box>
									</Alert>
								) : null}

								<FormControl>
									<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
										Пакет
									</FormLabel>
									<Select
										value={tariffId}
										onChange={handleTariffChange}
										bg={inputBg}
										placeholder={isLoadingTariffs ? 'Загрузка...' : 'Выберите пакет'}
										isDisabled={isLoadingTariffs || tariffs.length === 0}
										{...inputStyles}
									>
										{tariffs.map((tariff) => (
											<option key={tariff.id} value={tariff.id}>
												{tariff.name}
											</option>
										))}
									</Select>
								</FormControl>

								<FormControl>
									<FormLabel ms="4px" fontSize="sm" fontWeight="normal" color={labelColor}>
										Сумма платежа, ₽
									</FormLabel>
									<Input value={paymentAmount} readOnly bg={readonlyBg} {...inputStyles} />
								</FormControl>

								{!isStatementMethod && !tbankTerminalKey ? (
									<Alert status="warning" borderRadius="12px">
										<AlertIcon />
										Онлайн-оплата временно недоступна: терминал не настроен.
									</Alert>
								) : null}

								<Button
									mt="8px"
									h="45px"
									borderRadius="12px"
									bg="#005DE0"
									color="white"
									fontSize="xs"
									fontWeight="medium"
									letterSpacing="0.02em"
									_hover={{ bg: '#0A54BE' }}
									_active={{ bg: '#0A54BE' }}
									isDisabled={
										isLoadingTariffs ||
										isLoadingUser ||
										tariffs.length === 0 ||
										isCreatingBill ||
										(!isStatementMethod && !tbankTerminalKey)
									}
									isLoading={isCreatingBill}
									onClick={handleSubmit}
								>
									{submitButtonLabel}
								</Button>
							</Flex>
						</Box>
					</GridItem>

					<GridItem>
						<PaymentMethod
							title="Способ оплаты"
							titleFontSize="32px"
							showExplanations
							value={paymentMethodId}
							onChange={handlePaymentMethodChange}
							methods={availablePaymentMethods}
							accountType={accountType}
						/>
					</GridItem>
				</Grid>
			</Flex>

			<Modal isOpen={paymentModal.isOpen} onClose={handlePaymentModalClose} isCentered size="3xl">
				<ModalOverlay bg="blackAlpha.600" backdropFilter="blur(4px)" />
				<ModalContent bg={modalBg} borderRadius="20px" overflow="hidden" maxH="94vh">
					<ModalHeader borderBottom="1px solid" borderColor={borderColor}>
						Оплата через Т-Банк
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody p={{ base: '16px', md: '24px' }} overflowY="auto">
						{paymentModalState === 'error' ? (
							<Alert status="error" borderRadius="12px" alignItems="flex-start">
								<AlertIcon mt="2px" />
								<Box>
									<AlertTitle>Не удалось открыть оплату</AlertTitle>
									<AlertDescription>{paymentModalError}</AlertDescription>
								</Box>
							</Alert>
						) : paymentModalState === 'success' ? (
							<Flex
								minH="260px"
								direction="column"
								align="center"
								justify="center"
								textAlign="center"
							>
								<Text fontSize="24px" fontWeight="bold" color="green.400">
									Оплата подтверждена
								</Text>
								<Text mt="8px" color={subtitleColor}>
									Пакет токенов успешно зачислен на счет.
								</Text>
								<Text mt="6px" fontSize="sm" color={subtitleColor}>
									Окно оплаты закроется через {paymentSuccessCloseSeconds} сек.
								</Text>
							</Flex>
						) : (
							<Box position="relative" minH="420px">
								{paymentModalState !== 'ready' ? (
									<Flex
										position="absolute"
										inset="0"
										zIndex="1"
										align="center"
										justify="center"
										direction="column"
										bg={modalBg}
									>
										<Spinner color="#005DE0" size="lg" />
										<Text mt="12px" color={subtitleColor}>
											Загружаем защищённую форму оплаты...
										</Text>
									</Flex>
								) : null}
								<Box ref={paymentContainerRef} minH="420px" />
							</Box>
						)}
					</ModalBody>
					<ModalFooter borderTop="1px solid" borderColor={borderColor} gap="12px">
						{paymentModalState === 'error' ? (
							<Button colorScheme="recode" onClick={() => void startOnlinePayment()}>
								Повторить
							</Button>
						) : null}
						{paymentModalState === 'success' ? (
							<Button
								colorScheme="recode"
								onClick={() => {
									paymentModal.onClose();
									navigate('/lk/tariff');
								}}
							>
								Перейти к пакетам
							</Button>
						) : (
							<Button variant="ghost" onClick={handlePaymentModalClose}>
								Закрыть
							</Button>
						)}
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
}

export default BillingPay;
