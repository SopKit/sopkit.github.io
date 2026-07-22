export default function FooterPartners() {
	return (
		<div className="flex items-center gap-4 text-xs text-muted-foreground/60">
			<span className="font-semibold text-muted-foreground">Sponsors:</span>
			<a
				href="https://campusloop.space/"
				target="_blank"
				rel="noopener noreferrer"
				className="hover:text-primary transition-colors font-medium"
			>
				CampusLoop
			</a>
			<a
				href="http://debo.life/"
				target="_blank"
				rel="noopener noreferrer"
				className="hover:text-primary transition-colors font-medium"
			>
				Debo.life
			</a>
			<a
				href="https://linespedia.com/"
				target="_blank"
				rel="noopener noreferrer"
				className="hover:text-primary transition-colors font-medium"
			>
				Linespedia
			</a>
		</div>
	);
}
