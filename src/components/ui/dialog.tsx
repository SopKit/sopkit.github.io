"use client";

/**
 * Dialog — shadcn-compatible compound API backed by the Astryx `Dialog`
 * (native `<dialog>` + showModal: focus trap, Escape, backdrop, inert page).
 *
 *   <Dialog open={open} onOpenChange={setOpen}>
 *     <DialogTrigger asChild><Button>Open</Button></DialogTrigger>
 *     <DialogContent className="sm:max-w-md">
 *       <DialogHeader><DialogTitle>Title</DialogTitle></DialogHeader>
 *       …
 *     </DialogContent>
 *   </Dialog>
 */

import * as React from "react";
import { Dialog as AstryxDialog } from "@astryxdesign/core/Dialog";
import { XIcon } from "lucide-react";

import { cn } from "@/lib/utils";

interface DialogContextValue {
	open: boolean;
	setOpen: (open: boolean) => void;
	titleId: string;
	descriptionId: string;
	hasTitle: boolean;
	hasDescription: boolean;
	registerTitle: () => () => void;
	registerDescription: () => () => void;
}

const DialogContext = React.createContext<DialogContextValue | null>(null);

function useDialogContext(component: string): DialogContextValue {
	const ctx = React.useContext(DialogContext);
	if (!ctx) throw new Error(`<${component}> must be used inside <Dialog>`);
	return ctx;
}

interface DialogProps {
	open?: boolean;
	defaultOpen?: boolean;
	onOpenChange?(open: boolean): void;
	modal?: boolean;
	children?: React.ReactNode;
}

function Dialog({ open: openProp, defaultOpen = false, onOpenChange, children }: DialogProps) {
	const isControlled = openProp !== undefined;
	const [internal, setInternal] = React.useState(defaultOpen);
	const open = isControlled ? openProp : internal;
	const titleId = React.useId();
	const descriptionId = React.useId();
	const [titleCount, setTitleCount] = React.useState(0);
	const [descriptionCount, setDescriptionCount] = React.useState(0);

	const setOpen = React.useCallback(
		(next: boolean) => {
			if (!isControlled) setInternal(next);
			onOpenChange?.(next);
		},
		[isControlled, onOpenChange],
	);

	const registerTitle = React.useCallback(() => {
		setTitleCount((c) => c + 1);
		return () => setTitleCount((c) => c - 1);
	}, []);
	const registerDescription = React.useCallback(() => {
		setDescriptionCount((c) => c + 1);
		return () => setDescriptionCount((c) => c - 1);
	}, []);

	const ctx = React.useMemo<DialogContextValue>(
		() => ({
			open,
			setOpen,
			titleId,
			descriptionId,
			hasTitle: titleCount > 0,
			hasDescription: descriptionCount > 0,
			registerTitle,
			registerDescription,
		}),
		[open, setOpen, titleId, descriptionId, titleCount, descriptionCount, registerTitle, registerDescription],
	);

	return <DialogContext.Provider value={ctx}>{children}</DialogContext.Provider>;
}

type ClickableProps = { onClick?: React.MouseEventHandler<HTMLElement> };

/** Clones the single child (asChild) or renders a button, wiring `onClick` to `action`. */
function Slotted({
	asChild,
	children,
	onClick,
	action,
	slot,
	...props
}: React.ComponentProps<"button"> & { asChild?: boolean; action: () => void; slot: string }) {
	const handle = (event: React.MouseEvent<HTMLElement>) => {
		onClick?.(event as React.MouseEvent<HTMLButtonElement>);
		if (!event.defaultPrevented) action();
	};
	if (asChild && React.isValidElement<ClickableProps>(children)) {
		const childOnClick = children.props.onClick;
		return React.cloneElement(children, {
			...(props as Record<string, unknown>),
			"data-slot": slot,
			onClick: (event: React.MouseEvent<HTMLElement>) => {
				childOnClick?.(event);
				if (!event.defaultPrevented) handle(event);
			},
		} as ClickableProps);
	}
	return (
		<button type="button" data-slot={slot} onClick={handle} {...props}>
			{children}
		</button>
	);
}

function DialogTrigger({ asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
	const { setOpen } = useDialogContext("DialogTrigger");
	return <Slotted slot="dialog-trigger" asChild={asChild} action={() => setOpen(true)} {...props} />;
}

function DialogClose({ asChild, ...props }: React.ComponentProps<"button"> & { asChild?: boolean }) {
	const { setOpen } = useDialogContext("DialogClose");
	return <Slotted slot="dialog-close" asChild={asChild} action={() => setOpen(false)} {...props} />;
}

/** Astryx renders into the top layer itself; kept for API compatibility. */
function DialogPortal({ children }: { children?: React.ReactNode; container?: Element | null; forceMount?: true }) {
	return <>{children}</>;
}

/** Astryx draws the backdrop (`::backdrop`); kept for API compatibility. */
function DialogOverlay(_props: React.ComponentProps<"div">) {
	return null;
}

/* Tailwind max-width classes → Astryx `width` (the dialog clamps to the viewport itself). */
const MAX_WIDTH_PX: Record<string, number> = {
	xs: 320,
	sm: 384,
	md: 448,
	lg: 512,
	xl: 576,
	"2xl": 672,
	"3xl": 768,
	"4xl": 896,
	"5xl": 1024,
	"6xl": 1152,
	"7xl": 1280,
};

/* Classes the Astryx dialog owns (placement, width, surface) are not forwarded. */
const OWNED_CLASS =
	/^(?:[a-z0-9]+:)*(?:max-w-|w-full$|top-|left-|translate-|-?transpace-|fixed$|z-|bg-|backdrop-|border|shadow|rounded|p-|px-|py-|pt-|pb-|pl-|pr-)/;

interface DialogContentProps extends React.ComponentProps<"div"> {
	showCloseButton?: boolean;
	onEscapeKeyDown?: (event: KeyboardEvent) => void;
	onPointerDownOutside?: (event: Event) => void;
	onInteractOutside?: (event: Event) => void;
	onOpenAutoFocus?: (event: Event) => void;
	onCloseAutoFocus?: (event: Event) => void;
	forceMount?: true;
}

function DialogContent({
	className,
	children,
	showCloseButton = true,
	onEscapeKeyDown: _onEscapeKeyDown,
	onPointerDownOutside: _onPointerDownOutside,
	onInteractOutside: _onInteractOutside,
	onOpenAutoFocus: _onOpenAutoFocus,
	onCloseAutoFocus: _onCloseAutoFocus,
	forceMount: _forceMount,
	...props
}: DialogContentProps) {
	const ctx = useDialogContext("DialogContent");
	const tokens = (className ?? "").split(/\s+/).filter(Boolean);

	let width: number = MAX_WIDTH_PX.lg;
	for (const t of tokens) {
		const m = /max-w-(xs|sm|md|lg|xl|[2-7]xl)$/.exec(t);
		if (m) width = MAX_WIDTH_PX[m[1]];
	}
	let top: string | undefined;
	for (const t of tokens) {
		const m = /^(?:[a-z0-9]+:)*top-\[([^\]]+)\]$/.exec(t);
		if (m) top = m[1];
	}
	const hasOwnPadding = tokens.some((t) => /^(?:[a-z0-9]+:)*p[xytblr]?-/.test(t));
	const innerClass = tokens.filter((t) => !OWNED_CLASS.test(t)).join(" ");
	const padClass = tokens.filter((t) => /^(?:[a-z0-9]+:)*p[xytblr]?-/.test(t)).join(" ");

	return (
		<AstryxDialog
			isOpen={ctx.open}
			onOpenChange={(next) => ctx.setOpen(Boolean(next))}
			width={width}
			position={top ? { top } : undefined}
			padding={hasOwnPadding ? 0 : undefined}
			aria-labelledby={ctx.hasTitle ? ctx.titleId : undefined}
			aria-describedby={ctx.hasDescription ? ctx.descriptionId : undefined}
		>
			<div
				data-slot="dialog-content"
				className={cn("relative grid gap-4", padClass, innerClass)}
				{...props}
			>
				{children}
				{showCloseButton && (
					<button
						type="button"
						data-slot="dialog-close"
						onClick={() => ctx.setOpen(false)}
						className="absolute top-0 right-0 inline-flex size-8 items-center justify-center rounded-full text-muted-foreground opacity-70 transition-opacity hover:opacity-100 hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-4"
					>
						<XIcon aria-hidden="true" />
						<span className="sr-only">Close</span>
					</button>
				)}
			</div>
		</AstryxDialog>
	);
}

function DialogHeader({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="dialog-header"
			className={cn("flex flex-col gap-2 text-center sm:text-left pr-8", className)}
			{...props}
		/>
	);
}

function DialogFooter({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			data-slot="dialog-footer"
			className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
			{...props}
		/>
	);
}

function DialogTitle({ className, asChild: _asChild, ...props }: React.ComponentProps<"h2"> & { asChild?: boolean }) {
	const { titleId, registerTitle } = useDialogContext("DialogTitle");
	React.useEffect(registerTitle, [registerTitle]);
	return (
		<h2
			id={titleId}
			data-slot="dialog-title"
			className={cn("text-lg leading-none font-semibold", className)}
			{...props}
		/>
	);
}

function DialogDescription({ className, asChild: _asChild, ...props }: React.ComponentProps<"p"> & { asChild?: boolean }) {
	const { descriptionId, registerDescription } = useDialogContext("DialogDescription");
	React.useEffect(registerDescription, [registerDescription]);
	return (
		<p
			id={descriptionId}
			data-slot="dialog-description"
			className={cn("text-muted-foreground text-sm", className)}
			{...props}
		/>
	);
}

export {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogOverlay,
	DialogPortal,
	DialogTitle,
	DialogTrigger,
};
