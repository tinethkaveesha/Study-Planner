export interface NavLink {
	name: string;
	path: string;
}

export interface HeaderProps {
	showMobileMenu: boolean;
	toggleMobileMenu: () => void;
	openAuthModal: () => void;
	toggleNotificationPanel: () => void;
	navLinks: NavLink[];
}

export interface NotificationPanelProps {
	onClose: () => void;
}

export interface AuthModalProps {
	onClose: () => void;
}
