"use client";

interface ShortcutHintsProps {
    onOpen: () => void;
    isOpen: boolean;
    onClose: () => void;
}

export function ShortcutHints({ onOpen, isOpen, onClose }: ShortcutHintsProps) {
    return (
        <>
            <button
                onClick={onOpen}
                aria-label="Show keyboard shortcuts"
                className="fixed bottom-4 right-4 z-40 h-9 w-9 rounded-full border border-atlas-border bg-atlas-bg-card text-atlas-text-primary text-sm font-bold shadow-lg hover:bg-atlas-bg-tertiary"
            >
                ?
            </button>

            {isOpen ? (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-atlas-bg-primary/80 backdrop-blur-sm">
                    <div className="w-full max-w-sm rounded-xl border border-atlas-border bg-atlas-bg-card shadow-xl">
                        <div className="border-b border-atlas-border px-4 py-3 flex items-center justify-between">
                            <h2 className="text-sm font-sans font-semibold text-atlas-text-primary">
                                Keyboard Shortcuts
                            </h2>
                            <button
                                onClick={onClose}
                                className="px-2 py-1 text-xs font-mono rounded border border-atlas-border text-atlas-text-muted hover:text-atlas-text-primary hover:bg-atlas-bg-tertiary"
                                aria-label="Close shortcut help"
                            >
                                ESC
                            </button>
                        </div>

                        <ul className="text-sm text-atlas-text-secondary py-3">
                            <li className="px-4 py-2 flex items-center justify-between">
                                <span>Focus search</span>
                                <span className="font-mono text-atlas-text-muted">/</span>
                            </li>
                            <li className="px-4 py-2 flex items-center justify-between">
                                <span>Move selection down</span>
                                <span className="font-mono text-atlas-text-muted">J</span>
                            </li>
                            <li className="px-4 py-2 flex items-center justify-between">
                                <span>Move selection up</span>
                                <span className="font-mono text-atlas-text-muted">K</span>
                            </li>
                            <li className="px-4 py-2 flex items-center justify-between">
                                <span>Open selected model</span>
                                <span className="font-mono text-atlas-text-muted">Enter</span>
                            </li>
                            <li className="px-4 py-2 flex items-center justify-between">
                                <span>Clear search / close modal</span>
                                <span className="font-mono text-atlas-text-muted">Esc</span>
                            </li>
                            <li className="px-4 py-2 flex items-center justify-between">
                                <span>Open command palette</span>
                                <span className="font-mono text-atlas-text-muted">⌘K / Ctrl+K</span>
                            </li>
                        </ul>
                    </div>
                </div>
            ) : null}
        </>
    );
}
