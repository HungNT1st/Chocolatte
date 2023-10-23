'use client';

import {useCallback, useState} from 'react';
import {useForm, FieldValues, SubmitHandler} from 'react-hook-form';
import router, {useRouter} from 'next/router';
import { signIn, useSession } from 'next-auth/react';
import {toast} from 'react-hot-toast';
import axios from 'axios';
type Variant = 'LOGIN' | 'REGISTER';

const Auth = () => {
    const [variant, setVariant] = useState<Variant>('LOGIN');
    const [isLoading, setIsLoading] = useState(false);
    const toggleVariant = useCallback(() => {
        if (variant === 'LOGIN') {
            setVariant('REGISTER');
        } else {
            setVariant('LOGIN');
        }
    }, [variant]);

    const {register, handleSubmit, formState:{errors}} = useForm<FieldValues >({
        defaultValues: {
            username: '',
            email: '',
            password: '',
        },
    });

    const onSubmit: SubmitHandler<FieldValues> = async (data) => {
        setIsLoading(true);
        if (variant === 'LOGIN') {
            signIn('credentials', {
                ...data,
                redirect: false,
            }).then((callback) => {
                if (callback?.error) {
                    toast.error('Dcmm Invalid credentials');
                } 
                if (callback?.ok) {
                    router.push("/conversations");
                }
            }).finally(() => setIsLoading(false));
        }
        if (variant == "REGISTER"){
            axios.post('/api/register', data).then(() => 
                signIn('credentials', {
                    ...data,
                    redirect: false,
                }).then((callback) => {
                    if (callback?.error) {
                        toast.error('Dcmm Invalid credentials');
                    } 
                    if (callback?.ok) {
                        router.push("/conversations");
                    }
                })
            )
            .catch((err) => toast.error(err.message))
            .finally(() => setIsLoading(false));
        }
    }    
    return (
        <div>
            <h1>Auth</h1>
        </div>
    );
}

export default Auth;