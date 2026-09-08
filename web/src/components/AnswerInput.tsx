import { useEffect, useRef } from "react";

type AnswerInputProps = {
    id: string;
    label: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: () => void;
    onReset: () => void;
    placeholder?: string;
    disabled?: boolean;
    invalid?: boolean;
    errorId?: string;
    errorMessage?: string
};

export const AnswerInput = ({
    id,
    label,
    value,
    onChange,
    onSubmit,
    onReset,
    placeholder,
    invalid,
    disabled,
    errorId,
    errorMessage
}: AnswerInputProps) => {
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const input = inputRef.current;
        if (!input) return;
        
        // attaching a non passive listener to dom element
        const handleWheel = (e: WheelEvent) => {
            e.preventDefault();
        };

        input.addEventListener("wheel", handleWheel, {passive: false});

        // cleaning up
        return () => {
            input.removeEventListener("wheel", handleWheel);
        }
    }, [])

    return (
        <div className="flex flex-col items-center gap-3 w-full max-w-xs mx-auto">
            <label
                htmlFor={id}
                className="answer-field__label"
            >
                {label}
            </label>

            <div className="relative w-full">
                <input
                    ref={inputRef}
                    id={id}
                    type="number"
                    inputMode="numeric"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") onSubmit();
                        if (e.key === "Escape") onReset();
                    }}
                    onReset={onReset}
                    placeholder={placeholder}
                    disabled={disabled}
                    aria-invalid={invalid}
                    aria-describedby={invalid ? `${errorId}` : undefined}
                    className={`answer-field__input` + (invalid ? " border-[var(--danger)]" : "")}
                />
            </div>

            {invalid && errorMessage ? (
                <p id={errorId} role="alert" className="text-[var(--danger)] text-sm font-bold animate-bounce">
                    {errorMessage}
                </p>
            ) : null}
        </div>
    );
};
