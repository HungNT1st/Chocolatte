'use client'

import clsx from "clsx";
import { FieldValues, FieldErrors, UseFormRegister } from "react-hook-form";
interface InputProps {
    label: string;
    id: string;
    name: string;
    register: UseFormRegister<FieldValues>;
    errors: FieldErrors;
    required?: boolean;
    type?: string;
    disabled?: boolean;
}

const Input = () => {
    return (
        <div>
            this is an input;
        </div>
    )
}

export default Input;